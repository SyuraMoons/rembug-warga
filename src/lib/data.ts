import "server-only";
import { db } from "@/lib/supabase/server";
import type { IssueSlug } from "@/content/issues";
import { BUDGET_LIMIT, BUDGET_PROJECTS, type BudgetProject } from "@/content/budget";
import type { ProposalStatus } from "@/content/site";

// ---------- Tipe ----------
export type Proposal = {
  id: string;
  issue_slug: IssueSlug;
  title: string;
  body: string;
  kecamatan: string | null;
  author_name: string | null;
  author_group: string;
  status: ProposalStatus;
  official_response: string | null;
  responded_at: string | null;
  is_seed: boolean;
  hidden: boolean;
  created_at: string;
};

export type ProposalWithStats = Proposal & {
  support: number;
  oppose: number;
  pro: number;
  kontra: number;
  netral: number;
};

export type Comment = {
  id: string;
  proposal_id: string;
  stance: "pro" | "kontra" | "netral";
  body: string;
  author_name: string | null;
  author_group: string;
  is_seed: boolean;
  hidden: boolean;
  created_at: string;
};

export type Statement = {
  id: string;
  issue_slug: IssueSlug;
  text: string;
  author_group: string | null;
  is_seed: boolean;
  hidden: boolean;
  created_at: string;
};

export type VoteValue = "setuju" | "tidak" | "ragu";

export type StatementResult = Statement & {
  setuju: number;
  tidak: number;
  ragu: number;
  total: number;
  byGroup: Record<string, { setuju: number; tidak: number; ragu: number }>;
  category: "temu" | "beda" | "terbuka" | "kurang";
};

const PROPOSAL_COLS =
  "id, issue_slug, title, body, kecamatan, author_name, author_group, status, official_response, responded_at, is_seed, hidden, created_at";

function check<T>(res: { data: unknown; error: unknown }): T {
  if (res.error) throw res.error;
  return res.data as T;
}

// ---------- Usulan ----------
export async function getProposals(opts: { issue?: IssueSlug; includeHidden?: boolean } = {}): Promise<
  ProposalWithStats[]
> {
  let q = db().from("proposals").select(PROPOSAL_COLS).order("created_at", { ascending: false });
  if (opts.issue) q = q.eq("issue_slug", opts.issue);
  if (!opts.includeHidden) q = q.eq("hidden", false);
  const [proposals, scores, counts] = await Promise.all([
    q.then(check<Proposal[]>),
    db().from("proposal_scores").select("proposal_id, support, oppose").then(check<{ proposal_id: string; support: number; oppose: number }[]>),
    db().from("comment_counts").select("proposal_id, pro, kontra, netral").then(check<{ proposal_id: string; pro: number; kontra: number; netral: number }[]>),
  ]);
  const scoreMap = new Map(scores.map((s) => [s.proposal_id, s]));
  const countMap = new Map(counts.map((c) => [c.proposal_id, c]));
  return proposals.map((p) => {
    const s = scoreMap.get(p.id);
    const c = countMap.get(p.id);
    return {
      ...p,
      support: Number(s?.support ?? 0),
      oppose: Number(s?.oppose ?? 0),
      pro: Number(c?.pro ?? 0),
      kontra: Number(c?.kontra ?? 0),
      netral: Number(c?.netral ?? 0),
    };
  });
}

export async function getProposal(id: string): Promise<ProposalWithStats | null> {
  const [proposal, score, count] = await Promise.all([
    db().from("proposals").select(PROPOSAL_COLS).eq("id", id).eq("hidden", false).maybeSingle().then(check<Proposal | null>),
    db().from("proposal_scores").select("support, oppose").eq("proposal_id", id).maybeSingle().then(check<{ support: number; oppose: number } | null>),
    db().from("comment_counts").select("pro, kontra, netral").eq("proposal_id", id).maybeSingle().then(check<{ pro: number; kontra: number; netral: number } | null>),
  ]);
  if (!proposal) return null;
  return {
    ...proposal,
    support: Number(score?.support ?? 0),
    oppose: Number(score?.oppose ?? 0),
    pro: Number(count?.pro ?? 0),
    kontra: Number(count?.kontra ?? 0),
    netral: Number(count?.netral ?? 0),
  };
}

export async function getComments(proposalId: string): Promise<Comment[]> {
  return db()
    .from("comments")
    .select("id, proposal_id, stance, body, author_name, author_group, is_seed, hidden, created_at")
    .eq("proposal_id", proposalId)
    .eq("hidden", false)
    .order("created_at", { ascending: true })
    .then(check<Comment[]>);
}

/** Map proposal_id → nilai suara (+1/-1) milik perangkat ini. */
export async function getMyVotes(deviceId: string | null): Promise<Record<string, 1 | -1>> {
  if (!deviceId) return {};
  const rows = await db().from("votes").select("proposal_id, value").eq("device_id", deviceId).then(check<{ proposal_id: string; value: 1 | -1 }[]>);
  return Object.fromEntries(rows.map((r) => [r.proposal_id, r.value]));
}

// ---------- Konsensus ----------
export async function getStatementResults(issue?: IssueSlug): Promise<StatementResult[]> {
  let q = db().from("consensus_statements").select("id, issue_slug, text, author_group, is_seed, hidden, created_at").eq("hidden", false).order("is_seed", { ascending: false }).order("created_at");
  if (issue) q = q.eq("issue_slug", issue);
  const [statements, tally] = await Promise.all([
    q.then(check<Statement[]>),
    db().from("consensus_tally").select("statement_id, author_group, value, n").then(check<{ statement_id: string; author_group: string; value: VoteValue; n: number }[]>),
  ]);
  return statements.map((s) => {
    const rows = tally.filter((t) => t.statement_id === s.id);
    const byGroup: StatementResult["byGroup"] = {};
    const totals = { setuju: 0, tidak: 0, ragu: 0 };
    for (const r of rows) {
      byGroup[r.author_group] ??= { setuju: 0, tidak: 0, ragu: 0 };
      byGroup[r.author_group][r.value] += Number(r.n);
      totals[r.value] += Number(r.n);
    }
    const total = totals.setuju + totals.tidak + totals.ragu;
    return { ...s, ...totals, total, byGroup, category: classifyStatement(totals, byGroup) };
  });
}

export const CONSENSUS_MIN_VOTES = 5;

/**
 * Aturan klasifikasi Rembug Konsensus (dijelaskan juga di halaman Panduan):
 *  - "kurang" : suara < 5
 *  - "temu"   : ≥ 70% setuju ATAU ≥ 70% tidak setuju, dan tidak ada kategori warga
 *               (dengan ≥ 2 suara) yang berbeda arah mayoritasnya
 *  - "beda"   : selisih setuju vs tidak setuju ≤ 20 poin, atau ada kategori warga yang
 *               mayoritasnya berlawanan dengan mayoritas umum
 *  - "terbuka": sisanya (condong ke satu arah tapi belum kuat)
 */
function classifyStatement(
  t: { setuju: number; tidak: number; ragu: number },
  byGroup: StatementResult["byGroup"],
): StatementResult["category"] {
  const total = t.setuju + t.tidak + t.ragu;
  if (total < CONSENSUS_MIN_VOTES) return "kurang";
  const agree = t.setuju / total;
  const disagree = t.tidak / total;
  const overall = t.setuju >= t.tidak ? "setuju" : "tidak";
  const groupConflict = Object.values(byGroup).some((g) => {
    const n = g.setuju + g.tidak + g.ragu;
    if (n < 2 || g.setuju === g.tidak) return false;
    return (g.setuju > g.tidak ? "setuju" : "tidak") !== overall;
  });
  if ((agree >= 0.7 || disagree >= 0.7) && !groupConflict) return "temu";
  if (Math.abs(agree - disagree) <= 0.2 || groupConflict) return "beda";
  return "terbuka";
}

export async function getMyStatementVotes(deviceId: string | null): Promise<Record<string, VoteValue>> {
  if (!deviceId) return {};
  const rows = await db().from("consensus_votes").select("statement_id, value").eq("device_id", deviceId).then(check<{ statement_id: string; value: VoteValue }[]>);
  return Object.fromEntries(rows.map((r) => [r.statement_id, r.value]));
}

// ---------- Anggaran partisipatif ----------
export type BudgetResult = BudgetProject & { votes: number; funded: boolean; rank: number };

export async function getBudgetResults(): Promise<{ ballots: number; projects: BudgetResult[]; fundedTotal: number }> {
  const [tally, ballotCount] = await Promise.all([
    db().from("budget_tally").select("project_id, author_group, n").then(check<{ project_id: string; author_group: string; n: number }[]>),
    db().from("budget_ballots").select("*", { count: "exact", head: true }),
  ]);
  const votes = new Map<string, number>();
  for (const t of tally) votes.set(t.project_id, (votes.get(t.project_id) ?? 0) + Number(t.n));

  // Metode Decide Madrid / Participatory Budgeting klasik: urutkan berdasarkan suara,
  // danai dari atas selama sisa pagu cukup; proyek yang tidak muat dilewati.
  const ranked = BUDGET_PROJECTS.map((p) => ({ ...p, votes: votes.get(p.id) ?? 0 })).sort(
    (a, b) => b.votes - a.votes || a.cost - b.cost,
  );
  let remaining = BUDGET_LIMIT;
  const projects = ranked.map((p, i) => {
    const funded = p.votes > 0 && p.cost <= remaining;
    if (funded) remaining -= p.cost;
    return { ...p, funded, rank: i + 1 };
  });
  return { ballots: ballotCount.count ?? 0, projects, fundedTotal: BUDGET_LIMIT - remaining };
}

export async function getMyBallot(deviceId: string | null): Promise<string[] | null> {
  if (!deviceId) return null;
  const row = await db().from("budget_ballots").select("project_ids").eq("device_id", deviceId).maybeSingle().then(check<{ project_ids: string[] } | null>);
  return row?.project_ids ?? null;
}

// ---------- Statistik & transparansi ----------
export async function getStats() {
  const count = (table: string) => db().from(table).select("*", { count: "exact", head: true });
  const [participants, proposals, comments, votes, consensusVotes, ballots] = await Promise.all([
    count("participants"),
    db().from("proposals").select("*", { count: "exact", head: true }).eq("hidden", false),
    db().from("comments").select("*", { count: "exact", head: true }).eq("hidden", false),
    count("votes"),
    count("consensus_votes"),
    count("budget_ballots"),
  ]);
  return {
    participants: participants.count ?? 0,
    proposals: proposals.count ?? 0,
    comments: comments.count ?? 0,
    votes: votes.count ?? 0,
    consensusVotes: consensusVotes.count ?? 0,
    ballots: ballots.count ?? 0,
  };
}

export async function getParticipationByGroup(): Promise<Record<string, number>> {
  const rows = await db().from("participants").select("author_group").then(check<{ author_group: string }[]>);
  const out: Record<string, number> = {};
  for (const r of rows) out[r.author_group] = (out[r.author_group] ?? 0) + 1;
  return out;
}

export type ModerationEntry = { id: string; target_type: string; action: string; reason: string | null; created_at: string };

export async function getModerationLog(limit = 20): Promise<ModerationEntry[]> {
  return db().from("moderation_log").select("id, target_type, action, reason, created_at").order("created_at", { ascending: false }).limit(limit).then(check<ModerationEntry[]>);
}

export async function getHiddenCounts() {
  const [p, c, s] = await Promise.all([
    db().from("proposals").select("*", { count: "exact", head: true }).eq("hidden", true),
    db().from("comments").select("*", { count: "exact", head: true }).eq("hidden", true),
    db().from("consensus_statements").select("*", { count: "exact", head: true }).eq("hidden", true),
  ]);
  return { proposals: p.count ?? 0, comments: c.count ?? 0, statements: s.count ?? 0 };
}

// ---------- Admin ----------
export type Report = { id: string; target_type: "proposal" | "comment" | "statement"; target_id: string; reason: string | null; created_at: string; preview: string; hidden: boolean };

export async function getOpenReports(): Promise<Report[]> {
  const rows = await db().from("reports").select("id, target_type, target_id, reason, created_at").eq("resolved", false).order("created_at", { ascending: false }).then(check<Omit<Report, "preview" | "hidden">[]>);
  return Promise.all(
    rows.map(async (r) => {
      const table = r.target_type === "proposal" ? "proposals" : r.target_type === "comment" ? "comments" : "consensus_statements";
      const col = r.target_type === "proposal" ? "title" : r.target_type === "comment" ? "body" : "text";
      const target = await db().from(table).select(`${col}, hidden`).eq("id", r.target_id).maybeSingle();
      const data = target.data as Record<string, unknown> | null;
      return { ...r, preview: String(data?.[col] ?? "(konten sudah dihapus)"), hidden: Boolean(data?.hidden) };
    }),
  );
}

export async function getAllComments(limit = 50): Promise<(Comment & { proposal_title: string })[]> {
  const rows = await db().from("comments").select("id, proposal_id, stance, body, author_name, author_group, is_seed, hidden, created_at, proposals(title)").order("created_at", { ascending: false }).limit(limit).then(check<(Comment & { proposals: { title: string } | null })[]>);
  return rows.map(({ proposals, ...c }) => ({ ...c, proposal_title: proposals?.title ?? "" }));
}

export async function getAllStatements(): Promise<Statement[]> {
  return db().from("consensus_statements").select("id, issue_slug, text, author_group, is_seed, hidden, created_at").order("created_at", { ascending: false }).then(check<Statement[]>);
}

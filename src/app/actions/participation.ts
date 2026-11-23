"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { db } from "@/lib/supabase/server";
import { clearProfile, getParticipant, saveParticipant } from "@/lib/participant";
import { containsProfanity, isRateLimited, PROFANITY_MESSAGE } from "@/lib/moderation";
import { CITIZEN_GROUPS, SUPPORT_THRESHOLD, type CitizenGroup } from "@/content/site";
import { ISSUE_SLUGS } from "@/content/issues";
import { BUDGET_LIMIT, BUDGET_PROJECT_BY_ID } from "@/content/budget";

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string } | null;

const NEED_PROFILE = "Isi profil singkat dulu, ya (cukup pilih kelompokmu).";
const RATE_LIMITED = "Terlalu banyak kiriman dalam waktu singkat. Tunggu sebentar lalu coba lagi.";
const GENERIC_ERROR = "Terjadi kesalahan saat menyimpan. Coba lagi.";

const groupValues = CITIZEN_GROUPS.map((g) => g.value) as [string, ...string[]];
const uuid = z.guid();

function firstError(err: z.ZodError): string {
  return err.issues[0]?.message ?? "Data tidak valid.";
}

// ---------- Profil peserta ----------
const profileSchema = z.object({
  name: z.string().trim().max(40, "Nama panggilan maksimal 40 karakter.").optional(),
  group: z.enum(groupValues, { message: "Pilih kategori warga." }),
  consent: z.literal("on", { message: "Centang persetujuan aturan partisipasi & privasi." }),
});

export async function saveProfileAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = profileSchema.safeParse({
    name: formData.get("name") || undefined,
    group: formData.get("group"),
    consent: formData.get("consent"),
  });
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
  if (containsProfanity(parsed.data.name)) return { ok: false, error: PROFANITY_MESSAGE };
  await saveParticipant(parsed.data.name || null, parsed.data.group as CitizenGroup);
  refresh();
  return { ok: true, message: "Profil tersimpan. Selamat ikut rembug!" };
}

export async function resetProfileAction(): Promise<void> {
  await clearProfile();
  refresh();
}

// ---------- Usulan ----------
const proposalSchema = z.object({
  issue: z.enum(ISSUE_SLUGS, { message: "Pilih isu yang sesuai." }),
  title: z.string().trim().min(5, "Judul minimal 5 karakter.").max(120, "Judul maksimal 120 karakter."),
  body: z.string().trim().min(20, "Uraian minimal 20 karakter agar usulanmu jelas.").max(2000, "Uraian maksimal 2000 karakter."),
  kecamatan: z.string().trim().max(60).optional(),
});

export async function submitProposalAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const me = await getParticipant();
  if (!me) return { ok: false, error: NEED_PROFILE };
  const parsed = proposalSchema.safeParse({
    issue: formData.get("issue"),
    title: formData.get("title"),
    body: formData.get("body"),
    kecamatan: formData.get("kecamatan") || undefined,
  });
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
  const { issue, title, body, kecamatan } = parsed.data;
  if (containsProfanity(title, body)) return { ok: false, error: PROFANITY_MESSAGE };
  if (await isRateLimited("proposals", me.deviceId, 3, 10 * 60)) return { ok: false, error: RATE_LIMITED };

  const { data, error } = await db()
    .from("proposals")
    .insert({
      issue_slug: issue,
      title,
      body,
      kecamatan: kecamatan ?? null,
      author_name: me.name,
      author_group: me.group,
      device_id: me.deviceId,
    })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: GENERIC_ERROR };
  redirect(`/usulan/${data.id}?baru=1`);
}

// ---------- Argumen diskusi ----------
const commentSchema = z.object({
  proposalId: uuid,
  stance: z.enum(["pro", "kontra", "netral"], { message: "Pilih: setuju, tidak setuju, atau mau tanya." }),
  body: z.string().trim().min(3, "Argumen terlalu pendek.").max(1000, "Argumen maksimal 1000 karakter."),
});

export async function addCommentAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const me = await getParticipant();
  if (!me) return { ok: false, error: NEED_PROFILE };
  const parsed = commentSchema.safeParse({
    proposalId: formData.get("proposalId"),
    stance: formData.get("stance"),
    body: formData.get("body"),
  });
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
  if (containsProfanity(parsed.data.body)) return { ok: false, error: PROFANITY_MESSAGE };
  if (await isRateLimited("comments", me.deviceId, 5, 60)) return { ok: false, error: RATE_LIMITED };

  const { error } = await db().from("comments").insert({
    proposal_id: parsed.data.proposalId,
    stance: parsed.data.stance,
    body: parsed.data.body,
    author_name: me.name,
    author_group: me.group,
    device_id: me.deviceId,
  });
  if (error) return { ok: false, error: GENERIC_ERROR };
  refresh();
  return { ok: true, message: "Pendapatmu terkirim. Terima kasih!" };
}

// ---------- Voting usulan ----------
/** value 1 = dukung, -1 = tolak. Klik pilihan yang sama lagi = tarik suara. */
export async function castVoteAction(proposalId: string, value: 1 | -1): Promise<ActionResult> {
  const me = await getParticipant();
  if (!me) return { ok: false, error: NEED_PROFILE };
  if (!uuid.safeParse(proposalId).success || (value !== 1 && value !== -1)) return { ok: false, error: "Suara tidak valid." };

  const supabase = db();
  const { data: proposal } = await supabase.from("proposals").select("id, status, hidden").eq("id", proposalId).maybeSingle();
  if (!proposal || proposal.hidden) return { ok: false, error: "Usulan tidak ditemukan." };

  const { data: existing } = await supabase
    .from("votes")
    .select("value")
    .eq("proposal_id", proposalId)
    .eq("device_id", me.deviceId)
    .maybeSingle();

  if (existing?.value === value) {
    const { error } = await supabase.from("votes").delete().eq("proposal_id", proposalId).eq("device_id", me.deviceId);
    if (error) return { ok: false, error: GENERIC_ERROR };
  } else {
    // upsert pada primary key (proposal_id, device_id) → tetap satu suara per perangkat
    const { error } = await supabase
      .from("votes")
      .upsert({ proposal_id: proposalId, device_id: me.deviceId, value, author_group: me.group }, { onConflict: "proposal_id,device_id" });
    if (error) return { ok: false, error: GENERIC_ERROR };
  }

  // Aturan keputusan: usulan yang mencapai ambang dukungan otomatis "Dipertimbangkan".
  if (proposal.status === "diajukan") {
    const { data: score } = await supabase.from("proposal_scores").select("support").eq("proposal_id", proposalId).maybeSingle();
    if (Number(score?.support ?? 0) >= SUPPORT_THRESHOLD) {
      await supabase.from("proposals").update({ status: "dipertimbangkan" }).eq("id", proposalId);
      await supabase.from("moderation_log").insert({
        target_type: "proposal",
        target_id: proposalId,
        action: "status → Dipertimbangkan (otomatis)",
        reason: `Mencapai ${SUPPORT_THRESHOLD} dukungan warga`,
      });
    }
  }
  refresh();
  return { ok: true };
}

// ---------- Rembug Konsensus ----------
export async function voteStatementAction(statementId: string, value: "setuju" | "tidak" | "ragu"): Promise<ActionResult> {
  const me = await getParticipant();
  if (!me) return { ok: false, error: NEED_PROFILE };
  if (!uuid.safeParse(statementId).success || !["setuju", "tidak", "ragu"].includes(value)) {
    return { ok: false, error: "Pilihan tidak valid." };
  }
  const { error } = await db()
    .from("consensus_votes")
    .upsert({ statement_id: statementId, device_id: me.deviceId, value, author_group: me.group }, { onConflict: "statement_id,device_id" });
  if (error) return { ok: false, error: GENERIC_ERROR };
  refresh();
  return { ok: true };
}

const statementSchema = z.object({
  issue: z.enum(ISSUE_SLUGS, { message: "Pilih isu." }),
  text: z.string().trim().min(10, "Pernyataan minimal 10 karakter.").max(200, "Pernyataan maksimal 200 karakter."),
});

export async function addStatementAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const me = await getParticipant();
  if (!me) return { ok: false, error: NEED_PROFILE };
  const parsed = statementSchema.safeParse({ issue: formData.get("issue"), text: formData.get("text") });
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
  if (containsProfanity(parsed.data.text)) return { ok: false, error: PROFANITY_MESSAGE };
  if (await isRateLimited("consensus_statements", me.deviceId, 2, 10 * 60)) return { ok: false, error: RATE_LIMITED };
  const { error } = await db().from("consensus_statements").insert({
    issue_slug: parsed.data.issue,
    text: parsed.data.text,
    author_group: me.group,
    device_id: me.deviceId,
  });
  if (error) return { ok: false, error: GENERIC_ERROR };
  refresh();
  return { ok: true, message: "Pernyataanmu ditambahkan dan kini bisa ditanggapi warga lain." };
}

// ---------- Anggaran partisipatif ----------
export async function submitBallotAction(projectIds: string[]): Promise<ActionResult> {
  const me = await getParticipant();
  if (!me) return { ok: false, error: NEED_PROFILE };
  const unique = [...new Set(projectIds)];
  if (unique.length === 0) return { ok: false, error: "Pilih minimal satu program." };
  if (unique.some((id) => !BUDGET_PROJECT_BY_ID[id])) return { ok: false, error: "Program tidak dikenal." };
  const total = unique.reduce((sum, id) => sum + BUDGET_PROJECT_BY_ID[id].cost, 0);
  if (total > BUDGET_LIMIT) return { ok: false, error: "Pilihanmu lebih dari Rp 10 miliar." };

  const { error } = await db()
    .from("budget_ballots")
    .upsert(
      { device_id: me.deviceId, project_ids: unique, total_cost: total, author_group: me.group, updated_at: new Date().toISOString() },
      { onConflict: "device_id" },
    );
  if (error) return { ok: false, error: GENERIC_ERROR };
  refresh();
  return { ok: true, message: "Pilihanmu tersimpan! Kamu masih bisa mengubahnya." };
}

// ---------- Laporan konten ----------
export async function reportAction(targetType: "proposal" | "comment" | "statement", targetId: string): Promise<ActionResult> {
  const me = await getParticipant();
  if (!me) return { ok: false, error: NEED_PROFILE };
  if (!["proposal", "comment", "statement"].includes(targetType) || !uuid.safeParse(targetId).success) {
    return { ok: false, error: "Laporan tidak valid." };
  }
  if (await isRateLimited("reports", me.deviceId, 10, 10 * 60)) return { ok: false, error: RATE_LIMITED };
  const { error } = await db()
    .from("reports")
    .upsert({ target_type: targetType, target_id: targetId, device_id: me.deviceId }, { onConflict: "target_type,target_id,device_id", ignoreDuplicates: true });
  if (error) return { ok: false, error: GENERIC_ERROR };
  return { ok: true, message: "Terima kasih, laporan diteruskan ke moderator." };
}

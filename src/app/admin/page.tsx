import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import { getAllComments, getAllStatements, getOpenReports, getProposals } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { PROPOSAL_STATUS } from "@/content/site";
import { ISSUE_BY_SLUG } from "@/content/issues";
import { adminLogoutAction, dismissReportAction, setHiddenAction, updateProposalStatusAction } from "@/app/actions/admin";
import { AdminLogin } from "@/components/AdminLogin";
import { Card, Container, IssueBadge, IssueIcon, Section, StatusBadge, buttonStyles, cn } from "@/components/ui";

export const metadata: Metadata = { title: "Moderasi", robots: { index: false } };
export const dynamic = "force-dynamic";

function HideForm({ type, id, hidden }: { type: "proposal" | "comment" | "statement"; id: string; hidden: boolean }) {
  return (
    <form action={setHiddenAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="hidden" value={hidden ? "false" : "true"} />
      {!hidden && (
        <input name="reason" placeholder="Alasan (publik)" maxLength={200} className="w-40 rounded-lg border border-slate-300 px-2 py-1 text-xs" />
      )}
      <button type="submit" className={cn("rounded-lg px-2.5 py-1 text-xs font-bold", hidden ? "bg-slate-100 text-slate-700" : "bg-rose-100 text-rose-700")}>
        {hidden ? "Tampilkan" : "Sembunyikan"}
      </button>
    </form>
  );
}

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return (
      <Container className="py-16">
        <AdminLogin />
      </Container>
    );
  }

  const [reports, proposals, comments, statements] = await Promise.all([
    getOpenReports(),
    getProposals({ includeHidden: true }),
    getAllComments(60),
    getAllStatements(),
  ]);

  return (
    <Container className="py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Panel moderator</h1>
          <p className="text-slate-600">Setiap tindakan di sini tercatat di log moderasi publik (halaman Hasil).</p>
        </div>
        <form action={adminLogoutAction}>
          <button className={buttonStyles.outline}>Keluar</button>
        </form>
      </div>

      <Section title={`Laporan warga (${reports.length})`}>
        {reports.length === 0 ? (
          <p className="text-slate-500">Tidak ada laporan terbuka.</p>
        ) : (
          <ul className="space-y-2">
            {reports.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="min-w-0 text-sm">
                  <span className="font-bold uppercase text-amber-800">{r.target_type}</span> · {formatDate(r.created_at)}
                  <p className="truncate text-slate-800">{r.preview}</p>
                </div>
                <div className="flex items-center gap-2">
                  <HideForm type={r.target_type} id={r.target_id} hidden={r.hidden} />
                  <form action={dismissReportAction}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">Abaikan</button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Usulan: status & tanggapan resmi" description="Usulan berstatus Dipertimbangkan wajib diberi tanggapan (Ditindaklanjuti + rencana aksi, atau Tidak Dilanjutkan + alasan).">
        <div className="space-y-3">
          {proposals.map((p) => (
            <Card key={p.id} className={cn("p-4", p.hidden && "opacity-60", p.status === "dipertimbangkan" && !p.official_response && "border-brand-500")}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <IssueBadge slug={p.issue_slug} />
                  <StatusBadge status={p.status} />
                  {p.hidden && <span className="text-xs font-bold text-rose-700">DISEMBUNYIKAN</span>}
                  <span className="text-xs text-slate-500">
                    {p.support} dukung · {p.oppose} tolak · {p.pro + p.kontra + p.netral} argumen
                  </span>
                </div>
                <HideForm type="proposal" id={p.id} hidden={p.hidden} />
              </div>
              <Link href={`/usulan/${p.id}`} className="mt-1 block font-bold text-slate-900 hover:underline">
                {p.title}
              </Link>
              <form action={updateProposalStatusAction} className="mt-3 grid gap-2 md:grid-cols-[12rem_1fr_auto]">
                <input type="hidden" name="id" value={p.id} />
                <select name="status" defaultValue={p.status} className="rounded-lg border border-slate-300 px-2 py-2 text-sm">
                  {Object.entries(PROPOSAL_STATUS).map(([value, s]) => (
                    <option key={value} value={value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <textarea
                  name="response"
                  defaultValue={p.official_response ?? ""}
                  rows={2}
                  placeholder={`Tanggapan resmi (simulasi) untuk isu ${ISSUE_BY_SLUG[p.issue_slug].shortTitle.toLowerCase()}…`}
                  className="rounded-lg border border-slate-300 px-2 py-2 text-sm"
                />
                <button className={buttonStyles.primary}>Simpan</button>
              </form>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Argumen terbaru">
        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          {comments.map((c) => (
            <li key={c.id} className={cn("flex flex-wrap items-center justify-between gap-3 p-3 text-sm", c.hidden && "opacity-60")}>
              <div className="min-w-0">
                <span className="text-xs font-bold uppercase text-slate-500">{c.stance}</span> · <span className="text-xs text-slate-500">{c.proposal_title}</span>
                <p className="text-slate-800">{c.body}</p>
              </div>
              <HideForm type="comment" id={c.id} hidden={c.hidden} />
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Pernyataan konsensus">
        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          {statements.map((s) => (
            <li key={s.id} className={cn("flex flex-wrap items-center justify-between gap-3 p-3 text-sm", s.hidden && "opacity-60")}>
              <p className="flex min-w-0 items-start gap-1.5 text-slate-800">
                <IssueIcon slug={s.issue_slug} className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /> {s.text} {s.is_seed && <span className="text-xs text-slate-400">(pemantik)</span>}
              </p>
              <HideForm type="statement" id={s.id} hidden={s.hidden} />
            </li>
          ))}
        </ul>
      </Section>
    </Container>
  );
}

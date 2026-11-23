import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, EyeOff, Landmark, Lightbulb, XCircle } from "lucide-react";
import { ISSUES } from "@/content/issues";
import { BUDGET_LIMIT } from "@/content/budget";
import { CITIZEN_GROUPS, GROUP_LABEL, SUPPORT_THRESHOLD } from "@/content/site";
import {
  CONSENSUS_MIN_VOTES,
  getBudgetResults,
  getHiddenCounts,
  getModerationLog,
  getParticipationByGroup,
  getProposals,
  getStatementResults,
  getStats,
  type StatementResult,
} from "@/lib/data";
import { formatDate, formatNumber, formatRupiah, pct } from "@/lib/format";
import { LiveRefresher } from "@/components/LiveRefresher";
import { Bar, Card, Container, EmptyState, Hl, IssueBadge, IssueIcon, NumberCircle, PageHeader, Section, Stat, StatusBadge, cn } from "@/components/ui";

export const metadata: Metadata = { title: "Hasil & Transparansi" };
export const dynamic = "force-dynamic";

export default async function HasilPage() {
  const [stats, byGroup, proposals, budget, statements, hidden, log] = await Promise.all([
    getStats(),
    getParticipationByGroup(),
    getProposals(),
    getBudgetResults(),
    getStatementResults(),
    getHiddenCounts(),
    getModerationLog(15),
  ]);

  const topProposals = [...proposals].sort((a, b) => b.support - a.support || a.oppose - b.oppose).slice(0, 8);
  const responded = proposals.filter((p) => p.official_response).sort((a, b) => (b.responded_at ?? "").localeCompare(a.responded_at ?? ""));
  const maxGroup = Math.max(1, ...Object.values(byGroup));
  const missingGroups = CITIZEN_GROUPS.filter((g) => !byGroup[g.value]);
  const maxBudgetVotes = Math.max(1, ...budget.projects.map((p) => p.votes));
  const fundedByIssue = ISSUES.map((i) => ({
    issue: i,
    total: budget.projects.filter((p) => p.funded && p.issue === i.slug).reduce((s, p) => s + p.cost, 0),
  }));
  const temu = statements.filter((s) => s.category === "temu");
  const beda = statements.filter((s) => s.category === "beda");
  const terbuka = statements.filter((s) => s.category === "terbuka");
  const kurang = statements.filter((s) => s.category === "kurang");

  // ---------- Temuan utama: dihitung langsung dari data (bukan teks statis) ----------
  const coveredGroups = CITIZEN_GROUPS.length - missingGroups.length;
  const topFunded = [...fundedByIssue].sort((a, b) => b.total - a.total)[0];
  const considered = proposals.filter((p) => p.status !== "diajukan");
  const leader = topProposals[0];
  const findings = [
    {
      title: "Keterwakilan",
      body:
        stats.participants === 0 ? (
          <>Belum ada warga yang berpartisipasi.</>
        ) : (
          <>
            <Hl>{coveredGroups} dari {CITIZEN_GROUPS.length}</Hl> kategori warga sudah bersuara
            {missingGroups.length > 0 ? <>; yang belum: {missingGroups.map((g) => g.label).join(", ")}.</> : <>. Semua kelompok terwakili.</>}
          </>
        ),
    },
    {
      title: "Usulan teratas",
      body: leader ? (
        <>
          <Hl>{leader.title}</Hl> memimpin dengan {leader.support} dukungan
          {leader.support >= SUPPORT_THRESHOLD ? " dan sudah melewati ambang." : ` (ambang: ${SUPPORT_THRESHOLD}).`}
        </>
      ) : (
        <>Belum ada usulan.</>
      ),
    },
    {
      title: "Prioritas anggaran",
      body:
        budget.ballots === 0 || !topFunded || topFunded.total === 0 ? (
          <>Belum ada surat suara anggaran.</>
        ) : (
          <>
            Isu <Hl>{topFunded.issue.shortTitle.toLowerCase()}</Hl> mendapat porsi terbesar: {formatRupiah(topFunded.total, true)} (
            {pct(topFunded.total, BUDGET_LIMIT)}% pagu).
          </>
        ),
    },
    {
      title: "Konsensus & tindak lanjut",
      body: (
        <>
          <Hl>{temu.length} titik temu</Hl> dan {beda.length} titik beda. {responded.length} dari {considered.length} usulan yang
          lolos ambang sudah ditanggapi.
        </>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Hasil & transparansi"
        title="Semua suara warga dibuka apa adanya, dari usulan hingga"
        accent="tindak lanjut"
        description="Diperbarui otomatis setiap ada partisipasi baru. Tidak ada suara yang disembunyikan atau diubah."
      >
        <LiveRefresher />
      </PageHeader>

      <Container>
        <div className="grid grid-cols-2 gap-3 py-8 md:grid-cols-3 lg:grid-cols-6">
          <Stat label="Warga unik" value={formatNumber(stats.participants)} hint="per perangkat" />
          <Stat label="Usulan" value={formatNumber(stats.proposals)} />
          <Stat label="Argumen" value={formatNumber(stats.comments)} />
          <Stat label="Suara usulan" value={formatNumber(stats.votes)} />
          <Stat label="Suara konsensus" value={formatNumber(stats.consensusVotes)} />
          <Stat label="Surat suara anggaran" value={formatNumber(stats.ballots)} />
        </div>

        {/* Temuan utama */}
        <section aria-labelledby="temuan" className="rounded-xl border-2 border-dashed border-brand-300 p-5">
          <h2 id="temuan" className="flex items-center gap-2 text-lg font-black text-slate-900">
            <Lightbulb className="h-5 w-5 text-brand-600" aria-hidden /> Temuan utama saat ini
          </h2>
          <ol className="mt-4 grid gap-5 md:grid-cols-2">
            {findings.map((f, i) => (
              <li key={f.title} className="flex gap-3">
                <NumberCircle n={i + 1} size="sm" />
                <p className="text-sm text-slate-700">
                  <strong className="block text-slate-900">{f.title}</strong>
                  {f.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Keterwakilan */}
        <Section
          title="Partisipasi bermakna harus inklusif: siapa saja yang sudah bersuara?"
          description="Kami memantau keterwakilan setiap kategori warga."
        >
          <Card>
            <ul className="space-y-3">
              {CITIZEN_GROUPS.map((g) => (
                <li key={g.value} className="grid grid-cols-[minmax(0,11rem)_1fr_3rem] items-center gap-3 text-sm">
                  <span className="font-semibold text-slate-700">{g.label}</span>
                  <Bar value={byGroup[g.value] ?? 0} max={maxGroup} label={`${g.label}: ${byGroup[g.value] ?? 0} warga`} />
                  <span className="text-right font-bold tabular-nums text-slate-800">{byGroup[g.value] ?? 0}</span>
                </li>
              ))}
            </ul>
            {stats.participants > 0 && missingGroups.length > 0 && (
              <p className="mt-4 rounded-md border-l-4 border-amber-500 bg-amber-50 p-3 text-sm text-amber-900">
                Belum ada partisipasi dari: <strong>{missingGroups.map((g) => g.label).join(", ")}</strong>. Hasil
                belum mewakili semua kelompok. Perlu penjangkauan khusus (luring).
              </p>
            )}
          </Card>
        </Section>

        {/* Usulan */}
        <Section
          id="usulan"
          title="Usulan dengan dukungan terbanyak menjadi kandidat keputusan"
          description={`Ambang pertimbangan: ${SUPPORT_THRESHOLD} dukungan. Batang biru = dukung, merah = tolak.`}
        >
          {topProposals.length ? (
            <ol className="space-y-2">
              {topProposals.map((p, i) => {
                const total = p.support + p.oppose;
                return (
                  <li key={p.id}>
                    <Link href={`/usulan/${p.id}`} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 md:grid-cols-[2rem_1fr_16rem] md:items-center">
                      <span className="text-lg font-bold text-slate-400">#{i + 1}</span>
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2">
                          <IssueBadge slug={p.issue_slug} />
                          <StatusBadge status={p.status} />
                        </span>
                        <span className="mt-1 block truncate font-bold text-slate-900">{p.title}</span>
                      </span>
                      <span>
                        <span className="flex h-3 gap-0.5 overflow-hidden rounded-full bg-slate-100" title={`${p.support} dukung, ${p.oppose} tolak`}>
                          {p.support > 0 && <span className="bg-brand-600" style={{ width: `${pct(p.support, total)}%` }} />}
                          {p.oppose > 0 && <span className="bg-rose-600" style={{ width: `${pct(p.oppose, total)}%` }} />}
                        </span>
                        <span className="mt-1 block text-xs text-slate-600">
                          <strong className="text-slate-800">{p.support}</strong> dukung · <strong className="text-slate-800">{p.oppose}</strong> tolak
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          ) : (
            <EmptyState>Belum ada usulan.</EmptyState>
          )}
        </Section>

        {/* Anggaran */}
        <Section
          id="anggaran"
          title="Warga menentukan program mana yang didanai dari pagu Rp 10 miliar"
          description={`${formatNumber(budget.ballots)} surat suara. Program didanai berurutan dari suara terbanyak sampai pagu ${formatRupiah(BUDGET_LIMIT, true)} habis.`}
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {fundedByIssue.map(({ issue, total }) => (
              <div key={issue.slug} className="rounded-lg border border-slate-200 border-t-4 border-t-brand-600 p-4">
                <p className="flex items-center gap-1.5 text-sm font-bold text-brand-700">
                  <IssueIcon slug={issue.slug} /> {issue.shortTitle}
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{formatRupiah(total, true)}</p>
                <p className="text-xs text-slate-600">{pct(total, BUDGET_LIMIT)}% dari pagu</p>
              </div>
            ))}
          </div>
          <Card className="mt-4">
            <ol className="space-y-3">
              {budget.projects.map((p) => (
                <li key={p.id} className="grid items-center gap-2 text-sm md:grid-cols-[1fr_12rem_7rem]">
                  <div className="min-w-0">
                    <span className="mr-2 font-bold text-slate-400">#{p.rank}</span>
                    <span className="font-bold text-slate-900">{p.title}</span>
                    <span className="ml-2 inline-flex items-center gap-1 text-xs text-slate-500">
                      <IssueIcon slug={p.issue} className="h-3.5 w-3.5" /> {formatRupiah(p.cost, true)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bar value={p.votes} max={maxBudgetVotes} className={p.funded ? "bg-brand-600" : "bg-slate-400"} label={`${p.votes} suara`} />
                    <span className="w-8 text-right font-bold tabular-nums">{p.votes}</span>
                  </div>
                  <span className={cn("inline-flex items-center gap-1 text-xs font-bold", p.funded ? "text-brand-700" : "text-slate-500")}>
                    {p.funded ? <CheckCircle2 className="h-4 w-4" aria-hidden /> : <XCircle className="h-4 w-4" aria-hidden />}
                    {p.funded ? "Terdanai" : "Belum terdanai"}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-4 border-t border-slate-100 pt-3 text-sm text-slate-600">
              Total terdanai: <strong className="text-slate-900">{formatRupiah(budget.fundedTotal, true)}</strong> dari {formatRupiah(BUDGET_LIMIT, true)}
            </p>
          </Card>
        </Section>

        {/* Konsensus */}
        <Section
          id="konsensus"
          title="Peta konsensus: di mana warga sepakat, dan di mana masih berbeda"
          description={`Titik temu: ≥70% suara searah dan tidak ada kategori warga yang berlawanan. Titik beda: suara terbelah (selisih ≤20 poin) atau ada kelompok yang berlawanan. Minimal ${CONSENSUS_MIN_VOTES} suara.`}
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <ConsensusColumn title="Titik temu" tone="solid" items={temu} empty="Belum ada pernyataan yang disepakati luas." />
            <ConsensusColumn title="Titik beda" tone="grey" items={beda} empty="Belum ada perbedaan tajam." showGroups />
            <ConsensusColumn title="Masih terbuka" tone="outline" items={terbuka} empty="-" />
          </div>
          {kurang.length > 0 && (
            <p className="mt-3 text-sm text-slate-500">
              {kurang.length} pernyataan lain belum mencapai {CONSENSUS_MIN_VOTES} suara.{" "}
              <Link href="/diskusi/konsensus" className="font-bold text-brand-800 underline">
                Ikut menanggapi →
              </Link>
            </p>
          )}
        </Section>

        {/* Tindak lanjut */}
        <Section id="tindak-lanjut" title="Usulan yang lolos ambang wajib mendapat tanggapan resmi" description="Tanggapan atas usulan yang dipertimbangkan (disimulasikan oleh tim sebagai pengambil kebijakan).">
          {responded.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {responded.map((p) => (
                <Card key={p.id}>
                  <div className="flex flex-wrap items-center gap-2">
                    <IssueBadge slug={p.issue_slug} />
                    <StatusBadge status={p.status} />
                  </div>
                  <Link href={`/usulan/${p.id}`} className="mt-2 block font-bold text-slate-900 hover:underline">
                    {p.title}
                  </Link>
                  <p className="mt-2 flex gap-2 text-sm text-slate-700">
                    <Landmark className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" aria-hidden />
                    <span className="line-clamp-4">{p.official_response}</span>
                  </p>
                  {p.responded_at && <p className="mt-2 text-xs text-slate-500">{formatDate(p.responded_at)}</p>}
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState>Belum ada usulan yang ditanggapi. Usulan yang mencapai {SUPPORT_THRESHOLD} dukungan wajib ditanggapi.</EmptyState>
          )}
        </Section>

        {/* Moderasi */}
        <Section id="moderasi" title="Moderasi pun terbuka: konten disembunyikan, bukan dihapus"
          description="Jumlah dan alasan setiap tindakan moderasi dicatat di sini."
          takeaway={
            <>
              Hasil ini adalah <Hl>bukti simulasi</Hl> bahwa suara warga bisa dilacak dari usulan, perdebatan, hingga keputusan. Yang
              masih perlu dijaga adalah <Hl>keterwakilan semua kelompok</Hl> dan <Hl>tanggapan resmi yang tepat waktu</Hl> agar
              partisipasi tidak berhenti sebagai simbol.
            </>
          }
        >
          <div className="grid gap-4 md:grid-cols-[18rem_1fr]">
            <Card>
              <p className="flex items-center gap-2 font-bold text-slate-900">
                <EyeOff className="h-5 w-5" aria-hidden /> Disembunyikan
              </p>
              <dl className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between"><dt className="text-slate-600">Usulan</dt><dd className="font-bold">{hidden.proposals}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-600">Argumen</dt><dd className="font-bold">{hidden.comments}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-600">Pernyataan</dt><dd className="font-bold">{hidden.statements}</dd></div>
              </dl>
            </Card>
            <Card>
              <p className="font-bold text-slate-900">Log keputusan & moderasi</p>
              {log.length ? (
                <ul className="mt-3 divide-y divide-slate-100 text-sm">
                  {log.map((l) => (
                    <li key={l.id} className="flex flex-wrap justify-between gap-2 py-2">
                      <span>
                        <strong className="text-slate-800">{l.action}</strong>
                        {l.reason && <span className="text-slate-500"> · {l.reason}</span>}
                      </span>
                      <time className="text-xs text-slate-500" dateTime={l.created_at}>{formatDate(l.created_at)}</time>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-500">Belum ada tindakan moderasi.</p>
              )}
            </Card>
          </div>
        </Section>
      </Container>
    </>
  );
}

function ConsensusColumn({ title, tone, items, empty, showGroups }: { title: string; tone: "solid" | "grey" | "outline"; items: StatementResult[]; empty: string; showGroups?: boolean }) {
  const head = {
    solid: "bg-brand-600 text-white",
    grey: "bg-slate-200 text-slate-900",
    outline: "border-2 border-slate-900 bg-white text-slate-900",
  }[tone];
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <h3 className={cn("rounded-md px-3 py-2 font-black", head)}>
        {title} <span className="font-normal opacity-80">({items.length})</span>
      </h3>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {items.map((s) => (
            <li key={s.id} className="rounded-md bg-white p-3 ring-1 ring-slate-200">
              <p className="flex gap-1.5 text-sm font-semibold text-slate-800">
                <IssueIcon slug={s.issue_slug} className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /> {s.text}
              </p>
              <div className="mt-2 flex h-2.5 gap-0.5 overflow-hidden rounded-full bg-slate-100" title={`${s.setuju} setuju, ${s.tidak} tidak, ${s.ragu} ragu`}>
                {s.setuju > 0 && <span className="bg-brand-600" style={{ width: `${pct(s.setuju, s.total)}%` }} />}
                {s.tidak > 0 && <span className="bg-rose-600" style={{ width: `${pct(s.tidak, s.total)}%` }} />}
                {s.ragu > 0 && <span className="bg-slate-300" style={{ width: `${pct(s.ragu, s.total)}%` }} />}
              </div>
              <p className="mt-1 text-xs text-slate-600">
                {pct(s.setuju, s.total)}% setuju · {pct(s.tidak, s.total)}% tidak · {pct(s.ragu, s.total)}% ragu ({s.total})
              </p>
              {showGroups && (
                <ul className="mt-2 space-y-0.5 border-t border-slate-100 pt-2 text-xs text-slate-600">
                  {Object.entries(s.byGroup).map(([g, v]) => {
                    const n = v.setuju + v.tidak + v.ragu;
                    return (
                      <li key={g} className="flex justify-between gap-2">
                        <span>{GROUP_LABEL[g] ?? g}</span>
                        <span className="tabular-nums">
                          {pct(v.setuju, n)}% setuju · {pct(v.tidak, n)}% tidak
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

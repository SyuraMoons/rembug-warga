import type { Metadata } from "next";
import Link from "next/link";
import { ISSUES, isIssueSlug } from "@/content/issues";
import { getMyStatementVotes, getStatementResults } from "@/lib/data";
import { getDeviceId } from "@/lib/participant";
import { AddStatementForm, StatementCard } from "@/components/Consensus";
import { ButtonLink, Container, EmptyState, IssueIcon, ObjectiveStrip, PageHeader, cn } from "@/components/ui";

export const metadata: Metadata = { title: "Rembug Konsensus" };
export const dynamic = "force-dynamic";

export default async function KonsensusPage({ searchParams }: PageProps<"/diskusi/konsensus">) {
  const sp = await searchParams;
  const issue = typeof sp.isu === "string" && isIssueSlug(sp.isu) ? sp.isu : ISSUES[0].slug;
  const [statements, myVotes] = await Promise.all([getStatementResults(issue), getDeviceId().then(getMyStatementVotes)]);
  const answered = statements.filter((s) => myVotes[s.id]).length;

  return (
    <>
      <PageHeader
        eyebrow="Mekanisme 5 · Rembug Konsensus"
        title="Mencari titik temu yang bisa diterima"
        accent="lintas kelompok"
        description={
          <>
            Tanggapi setiap pernyataan dengan <strong>Setuju</strong>, <strong>Tidak setuju</strong>, atau <strong>Ragu</strong>.
            Tujuannya bukan mencari pemenang, melainkan menemukan <em>titik temu</em> yang bisa diterima lintas kelompok
            warga, serta memetakan <em>titik beda</em> yang masih perlu dirembugkan.
          </>
        }
      />
      <Container className="py-8">
        <ObjectiveStrip
          objective="Menemukan pernyataan kebijakan yang disetujui lintas kelompok warga, bukan hanya oleh mayoritas."
          how="Tanggapi pernyataan dengan Setuju, Tidak setuju, atau Ragu. Hasil baru tampil setelah kamu memilih."
          impact="Titik temu menjadi rekomendasi kebijakan; titik beda menjadi agenda rembug lanjutan."
        />
        <nav aria-label="Pilih isu" className="mt-10 flex flex-wrap gap-2">
          {ISSUES.map((i) => (
            <Link
              key={i.slug}
              href={`/diskusi/konsensus?isu=${i.slug}`}
              aria-current={i.slug === issue ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 font-bold transition",
                i.slug === issue ? "border-brand-700 bg-brand-700 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-brand-300",
              )}
            >
              <IssueIcon slug={i.slug} /> {i.shortTitle}
            </Link>
          ))}
        </nav>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-brand-50 p-4">
          <p className="font-semibold text-brand-900">
            Kamu sudah menanggapi <strong>{answered}</strong> dari {statements.length} pernyataan.
          </p>
          <ButtonLink href="/hasil#konsensus" variant="outline">
            Lihat peta konsensus
          </ButtonLink>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {statements.length ? (
            statements.map((s) => <StatementCard key={s.id} s={s} myVote={myVotes[s.id]} />)
          ) : (
            <EmptyState>Belum ada pernyataan untuk isu ini.</EmptyState>
          )}
        </div>

        <div className="mt-8">
          <AddStatementForm defaultIssue={issue} />
        </div>
      </Container>
    </>
  );
}

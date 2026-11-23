import type { Metadata } from "next";
import Link from "next/link";
import { Coins, ShieldCheck } from "lucide-react";
import { isIssueSlug } from "@/content/issues";
import { SUPPORT_THRESHOLD } from "@/content/site";
import { getMyVotes, getProposals } from "@/lib/data";
import { getDeviceId } from "@/lib/participant";
import { sortProposals } from "@/lib/sort";
import { FilterBar, parseSort } from "@/components/FilterBar";
import { ProposalCard } from "@/components/ProposalCard";
import { Container, EmptyState, ObjectiveStrip, PageHeader, Section } from "@/components/ui";

export const metadata: Metadata = { title: "Voting & Keputusan" };
export const dynamic = "force-dynamic";

export default async function VotingPage({ searchParams }: PageProps<"/voting">) {
  const sp = await searchParams;
  const issue = typeof sp.isu === "string" && isIssueSlug(sp.isu) ? sp.isu : undefined;
  const sort = sp.urut ? parseSort(sp.urut) : "populer";
  const [proposals, myVotes] = await Promise.all([getProposals({ issue }), getDeviceId().then(getMyVotes)]);
  const list = sortProposals(proposals, sort);
  const votedCount = proposals.filter((p) => myVotes[p.id]).length;

  return (
    <>
      <PageHeader
        eyebrow="Mekanisme 3 & 4 · Voting & keputusan"
        title="Keputusan kota ditentukan lewat suara warga yang"
        accent="terbuka"
        description="Dua cara memberi suara: mendukung atau menolak usulan warga, dan menentukan prioritas anggaran kota secara simulasi."
      />
      <Container>
        <div className="pt-8">
          <ObjectiveStrip
            objective="Mengubah dukungan warga menjadi keputusan dan prioritas anggaran yang sah."
            how={`Satu perangkat satu suara per usulan; ${SUPPORT_THRESHOLD} dukungan membuat usulan Dipertimbangkan. Anggaran didanai berurutan dari suara terbanyak.`}
            impact="Prioritas kota mencerminkan pilihan warga, dan setiap hasil bisa diperiksa di halaman Hasil."
          />
        </div>
        <div className="grid gap-4 py-8 md:grid-cols-2">
          <Link href="/voting/anggaran" className="group rounded-lg bg-brand-600 p-6 text-white transition hover:bg-brand-700 hover:shadow-lg">
            <Coins className="h-8 w-8 text-brand-100" aria-hidden />
            <h2 className="mt-3 text-2xl font-bold">Anggaran Partisipatif</h2>
            <p className="mt-1 text-brand-50">Kamu memegang Rp 10 miliar (simulasi). Program mana yang paling layak didanai?</p>
            <span className="mt-3 inline-block font-bold group-hover:underline">Mulai alokasikan →</span>
          </Link>
          <div className="rounded-lg bg-slate-100 p-6">
            <ShieldCheck className="h-8 w-8 text-brand-600" aria-hidden />
            <h2 className="mt-3 text-xl font-bold text-slate-900">Aturan keputusan</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              <li>Satu perangkat = satu suara per usulan. Suara bisa diubah atau ditarik.</li>
              <li>
                Usulan dengan <strong>{SUPPORT_THRESHOLD} dukungan</strong> otomatis berstatus <strong>Dipertimbangkan</strong> dan wajib mendapat tanggapan resmi.
              </li>
              <li>Semua hasil ditampilkan terbuka di halaman Hasil & Transparansi.</li>
            </ul>
          </div>
        </div>

        <Section title="Voting usulan warga" description={`Kamu sudah memberi suara pada ${votedCount} dari ${proposals.length} usulan.`}>
          <FilterBar basePath="/voting" issue={issue} sort={sort} />
          {list.length ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <ProposalCard key={p.id} p={p} myVote={myVotes[p.id]} />
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState>Belum ada usulan.</EmptyState>
            </div>
          )}
        </Section>
      </Container>
    </>
  );
}

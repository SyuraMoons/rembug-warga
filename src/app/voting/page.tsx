import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Coins, Eye, Smartphone, ThumbsUp } from "lucide-react";
import { isIssueSlug } from "@/content/issues";
import { SUPPORT_THRESHOLD } from "@/content/site";
import { getMyVotes, getProposals } from "@/lib/data";
import { getDeviceId } from "@/lib/participant";
import { sortProposals } from "@/lib/sort";
import { FilterBar, parseSort } from "@/components/FilterBar";
import { ProposalCard } from "@/components/ProposalCard";
import { Container, EmptyState, PageHeader, Section, Why } from "@/components/ui";

export const metadata: Metadata = { title: "Voting" };
export const dynamic = "force-dynamic";

const RULES = [
  { icon: Smartphone, text: "1 HP = 1 suara per usulan. Bisa diubah." },
  { icon: ThumbsUp, text: `${SUPPORT_THRESHOLD} dukungan = pemerintah wajib menjawab.` },
  { icon: Eye, text: "Semua hasil terbuka untuk umum." },
];

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
        title="Dukung usulan yang"
        accent="kamu setujui"
        description="Tekan Dukung atau Tolak. Suaramu langsung dihitung."
      />
      <Container>
        <div className="grid gap-4 pt-8 md:grid-cols-[1.1fr_1fr]">
          <Link href="/voting/anggaran" className="group flex items-center gap-4 rounded-xl bg-brand-600 p-6 text-white transition hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15">
              <Coins className="h-7 w-7" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-2xl font-black">Bagi uang kota</span>
              <span className="mt-1 block text-base text-brand-50">Kamu pegang Rp 10 miliar. Pilih program yang paling penting.</span>
            </span>
            <ArrowRight className="ml-auto h-6 w-6 shrink-0 transition group-hover:translate-x-1" aria-hidden />
          </Link>
          <div className="rounded-xl bg-slate-100 p-5">
            <h2 className="text-lg font-bold text-slate-900">Aturannya sederhana</h2>
            <ul className="mt-3 space-y-3">
              {RULES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-base font-semibold text-slate-800">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-600 ring-1 ring-slate-200">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Why mechanism="voting" className="mt-6" />

        <Section title="Usulan warga" description={`Kamu sudah memilih ${votedCount} dari ${proposals.length} usulan.`}>
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

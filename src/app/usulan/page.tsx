import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { isIssueSlug } from "@/content/issues";
import { getMyVotes, getProposals } from "@/lib/data";
import { getDeviceId } from "@/lib/participant";
import { sortProposals } from "@/lib/sort";
import { FilterBar, parseSort } from "@/components/FilterBar";
import { ProposalCard } from "@/components/ProposalCard";
import { ButtonLink, Container, EmptyState, PageHeader, Why } from "@/components/ui";

export const metadata: Metadata = { title: "Usulan Warga" };
export const dynamic = "force-dynamic";

export default async function UsulanPage({ searchParams }: PageProps<"/usulan">) {
  const sp = await searchParams;
  const issue = typeof sp.isu === "string" && isIssueSlug(sp.isu) ? sp.isu : undefined;
  const sort = parseSort(sp.urut);
  const [proposals, myVotes] = await Promise.all([getProposals({ issue }), getDeviceId().then(getMyVotes)]);
  const list = sortProposals(proposals, sort);

  return (
    <>
      <PageHeader
        title="Ide warga untuk"
        accent="kota kita"
        description="Dukung ide yang kamu setujui, atau tulis idemu sendiri."
      >
        <ButtonLink href={issue ? `/usulan/baru?isu=${issue}` : "/usulan/baru"} variant="accent" className="px-5 py-3 text-base">
          <Plus className="h-5 w-5" aria-hidden /> Tulis usulan baru
        </ButtonLink>
      </PageHeader>
      <Container className="py-8">
        <Why mechanism="usulan" />
        <div className="mt-8" />
        <FilterBar basePath="/usulan" issue={issue} sort={sort} />
        <p className="mt-4 text-base text-slate-600">{list.length} usulan</p>
        {list.length ? (
          <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <ProposalCard key={p.id} p={p} myVote={myVotes[p.id]} />
            ))}
          </div>
        ) : (
          <div className="mt-3">
            <EmptyState>Belum ada usulan untuk filter ini.</EmptyState>
          </div>
        )}
      </Container>
    </>
  );
}

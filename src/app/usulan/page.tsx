import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { isIssueSlug } from "@/content/issues";
import { getMyVotes, getProposals } from "@/lib/data";
import { getDeviceId } from "@/lib/participant";
import { sortProposals } from "@/lib/sort";
import { FilterBar, parseSort } from "@/components/FilterBar";
import { ProposalCard } from "@/components/ProposalCard";
import { ButtonLink, Container, EmptyState, ObjectiveStrip, PageHeader } from "@/components/ui";
import { SUPPORT_THRESHOLD } from "@/content/site";

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
        eyebrow="Mekanisme 1 · Usulan warga"
        title="Solusi kota dimulai dari usulan"
        accent="warga sendiri"
        description="Dukung usulan yang menurutmu penting, beri argumen, atau ajukan usulanmu sendiri."
      >
        <ButtonLink href={issue ? `/usulan/baru?isu=${issue}` : "/usulan/baru"} variant="accent" className="px-5 py-3 text-base">
          <Plus className="h-5 w-5" aria-hidden /> Ajukan usulan baru
        </ButtonLink>
      </PageHeader>
      <Container className="py-8">
        <ObjectiveStrip
          objective="Mengubah keluhan menjadi usulan solusi yang konkret dan bisa diperjuangkan bersama."
          how="Warga menulis usulan untuk salah satu isu; warga lain mendukung, menolak, dan memberi argumen."
          impact={`Usulan yang mencapai ${SUPPORT_THRESHOLD} dukungan berstatus Dipertimbangkan dan wajib mendapat tanggapan resmi.`}
        />
        <div className="mt-10" />
        <FilterBar basePath="/usulan" issue={issue} sort={sort} />
        <p className="mt-4 text-sm text-slate-500">{list.length} usulan</p>
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

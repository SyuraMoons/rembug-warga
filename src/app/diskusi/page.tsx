import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Ear, HeartHandshake, MessageSquareText, MessagesSquare, Scale, SearchCheck } from "lucide-react";
import { isIssueSlug } from "@/content/issues";
import { getProposals } from "@/lib/data";
import { sortProposals } from "@/lib/sort";
import { FilterBar, parseSort } from "@/components/FilterBar";
import { ButtonLink, Container, EmptyState, IssueBadge, PageHeader, Section, StatusBadge, Why } from "@/components/ui";

export const metadata: Metadata = { title: "Diskusi" };
export const dynamic = "force-dynamic";

const RULES = [
  { icon: HeartHandshake, title: "Bahas idenya, bukan orangnya" },
  { icon: MessageSquareText, title: "Sertakan alasanmu" },
  { icon: Ear, title: "Baca pendapat yang berbeda" },
  { icon: SearchCheck, title: "Sebut sumber kalau pakai data" },
];

export default async function DiskusiPage({ searchParams }: PageProps<"/diskusi">) {
  const sp = await searchParams;
  const issue = typeof sp.isu === "string" && isIssueSlug(sp.isu) ? sp.isu : undefined;
  const sort = sp.urut ? parseSort(sp.urut) : "diskusi";
  const proposals = sortProposals(await getProposals({ issue }), sort);

  return (
    <>
      <PageHeader
        title="Beri pendapatmu tentang"
        accent="usulan warga"
        description="Setuju atau tidak, sampaikan alasanmu. Dari situ warga mencari jalan tengah."
      />
      <Container>
        <div className="grid gap-4 pt-8 md:grid-cols-2">
          <Link href="#forum" className="group flex items-center gap-4 rounded-xl border-2 border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <MessagesSquare className="h-7 w-7" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-xl font-black text-slate-900">Komentari usulan</span>
              <span className="mt-1 block text-base text-slate-600">Pilih usulan, baca pendapat warga, lalu tulis pendapatmu.</span>
            </span>
          </Link>
          <Link href="/diskusi/konsensus" className="group flex items-center gap-4 rounded-xl bg-brand-600 p-6 text-white transition hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-md">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15">
              <Scale className="h-7 w-7" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-xl font-black">Setuju atau tidak?</span>
              <span className="mt-1 block text-base text-brand-50">Jawab pernyataan singkat, lalu lihat di mana warga sepakat.</span>
            </span>
            <ArrowRight className="ml-auto h-6 w-6 shrink-0 transition group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
        <Why mechanism="diskusi" className="mt-6" />

        <Section title="Aturan berdiskusi">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RULES.map(({ icon: Icon, title }) => (
              <li key={title} className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <span className="text-base font-bold text-slate-900">{title}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="forum" title="Pilih usulan untuk dikomentari">
          <FilterBar basePath="/diskusi" issue={issue} sort={sort} />
          {proposals.length ? (
            <ul className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200 bg-white">
              {proposals.map((p) => {
                const total = p.pro + p.kontra + p.netral;
                return (
                  <li key={p.id}>
                    <Link href={`/usulan/${p.id}#diskusi`} className="flex flex-col gap-3 p-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <IssueBadge slug={p.issue_slug} />
                          <StatusBadge status={p.status} />
                        </div>
                        <p className="mt-1.5 font-bold text-slate-900">{p.title}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3 text-sm">
                        <span className="rounded-md bg-brand-50 px-2.5 py-1 font-bold text-brand-800">{p.pro} setuju</span>
                        <span className="rounded-md bg-rose-50 px-2.5 py-1 font-bold text-rose-700">{p.kontra} tidak</span>
                        <span className="w-28 text-right text-slate-600">{total} komentar →</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-4">
              <EmptyState>Belum ada usulan untuk didiskusikan.</EmptyState>
            </div>
          )}
          <div className="mt-4">
            <ButtonLink href="/usulan/baru" variant="accent">
              Tulis usulan baru
            </ButtonLink>
          </div>
        </Section>
      </Container>
    </>
  );
}

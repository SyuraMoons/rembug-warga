import type { Metadata } from "next";
import Link from "next/link";
import { MessagesSquare, Scale } from "lucide-react";
import { isIssueSlug } from "@/content/issues";
import { getProposals } from "@/lib/data";
import { sortProposals } from "@/lib/sort";
import { FilterBar, parseSort } from "@/components/FilterBar";
import { ButtonLink, Container, EmptyState, IssueBadge, NumberCircle, ObjectiveStrip, PageHeader, Section, StatusBadge } from "@/components/ui";

export const metadata: Metadata = { title: "Diskusi & Deliberasi" };
export const dynamic = "force-dynamic";

const RULES = [
  { title: "Serang gagasan, bukan orang", text: "Kritik boleh tajam, tetapi tetap santun." },
  { title: "Beri alasan", text: "Jelaskan mengapa kamu pro atau kontra, bukan sekadar setuju atau tidak." },
  { title: "Dengarkan sisi lain", text: "Baca argumen yang berseberangan sebelum menulis." },
  { title: "Cek fakta", text: "Sebutkan sumber jika menyampaikan data." },
];

export default async function DiskusiPage({ searchParams }: PageProps<"/diskusi">) {
  const sp = await searchParams;
  const issue = typeof sp.isu === "string" && isIssueSlug(sp.isu) ? sp.isu : undefined;
  const sort = sp.urut ? parseSort(sp.urut) : "diskusi";
  const proposals = sortProposals(await getProposals({ issue }), sort);

  return (
    <>
      <PageHeader
        eyebrow="Mekanisme 2 · Diskusi & deliberasi"
        title="Demokrasi bukan hanya menghitung suara, tetapi juga"
        accent="menimbang alasan"
        description="Di sini warga bertukar argumen pro dan kontra serta mencari titik temu."
      />
      <Container>
        <div className="pt-8">
          <ObjectiveStrip
            objective="Menguji setiap usulan lewat argumen dari dua sisi sebelum diputuskan."
            how="Setiap usulan punya kolom argumen pro dan kontra; Rembug Konsensus memetakan pernyataan yang disetujui lintas kelompok."
            impact="Keputusan lebih matang dan berbasis alasan, dengan titik temu dan titik beda yang terlihat jelas."
          />
        </div>
        <div className="grid gap-4 py-8 md:grid-cols-2">
          <Link href="#forum" className="rounded-lg border border-slate-200 bg-white p-6 transition hover:border-brand-400 hover:shadow-md">
            <MessagesSquare className="h-8 w-8 text-brand-600" aria-hidden />
            <h2 className="mt-3 text-xl font-bold text-slate-900">Forum pro–kontra usulan</h2>
            <p className="mt-1 text-slate-600">Setiap usulan memiliki dua kolom argumen: pendukung dan penentang. Pilih usulan, baca kedua sisi, lalu sampaikan pendapatmu.</p>
          </Link>
          <Link href="/diskusi/konsensus" className="rounded-lg bg-brand-600 p-6 text-white transition hover:bg-brand-700 hover:shadow-md">
            <Scale className="h-8 w-8 text-brand-100" aria-hidden />
            <h2 className="mt-3 text-xl font-bold">Rembug Konsensus</h2>
            <p className="mt-1 text-brand-50">Tanggapi pernyataan dengan Setuju atau Tidak, lalu lihat di mana warga sepakat dan di mana masih berbeda. Terinspirasi vTaiwan & Pol.is.</p>
          </Link>
        </div>

        <Section title="Empat aturan berdebat sehat">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {RULES.map((r, i) => (
              <div key={r.title} className="flex gap-3">
                <NumberCircle n={i + 1} />
                <div>
                  <h3 className="font-bold text-slate-900">{r.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="forum" title="Forum usulan" description="Pilih usulan untuk membaca dan menambahkan argumen.">
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
                        <span className="rounded-md bg-brand-50 px-2.5 py-1 font-bold text-brand-800">{p.pro} pro</span>
                        <span className="rounded-lg bg-rose-50 px-2.5 py-1 font-bold text-rose-700">{p.kontra} kontra</span>
                        <span className="w-24 text-right text-slate-500">{total} argumen →</span>
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
              Ajukan usulan baru
            </ButtonLink>
          </div>
        </Section>
      </Container>
    </>
  );
}

import type { Metadata } from "next";
import { isIssueSlug } from "@/content/issues";
import { ProposalForm } from "@/components/ProposalForm";
import { Container, LabelBar, NumberCircle, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Ajukan Usulan" };

const TIPS = [
  "Fokus pada satu masalah yang spesifik.",
  "Sebutkan siapa yang terdampak dan di mana.",
  "Tawarkan solusi yang realistis.",
  "Gunakan bahasa santun, tanpa menyerang pihak tertentu.",
  "Jangan mencantumkan data pribadi (NIK, nomor HP, alamat rumah).",
];

export default async function UsulanBaruPage({ searchParams }: PageProps<"/usulan/baru">) {
  const sp = await searchParams;
  const issue = typeof sp.isu === "string" && isIssueSlug(sp.isu) ? sp.isu : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Ajukan usulan"
        title="Punya ide untuk kotamu? Tuliskan sebagai"
        accent="usulan"
        description="Punya ide untuk kotamu? Tulis di sini. Usulanmu akan dibahas warga lain dan bisa didukung hingga mendapat tanggapan resmi."
      />
      <Container className="grid gap-8 py-10 lg:grid-cols-[1fr_300px]">
        <ProposalForm defaultIssue={issue} />
        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div>
            <LabelBar as="h2">Tips usulan yang baik</LabelBar>
            <ul className="mt-2 list-disc space-y-1.5 rounded-xl border-2 border-dashed border-brand-300 p-4 pl-8 text-sm text-slate-600">
              {TIPS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg bg-slate-100 p-5 text-sm text-slate-700">
            <h2 className="font-bold text-slate-900">Apa yang terjadi setelahnya?</h2>
            <ol className="mt-3 space-y-3">
              {[
                "Usulan tampil publik dan bisa didiskusikan.",
                "Warga memberi dukungan atau penolakan.",
                "Jika mencapai ambang dukungan, statusnya menjadi Dipertimbangkan.",
                "Tim memberi tanggapan resmi (simulasi) yang tampil di halaman Hasil.",
              ].map((t, i) => (
                <li key={t} className="flex items-start gap-3">
                  <NumberCircle n={i + 1} size="sm" />
                  <span className="pt-1">{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </Container>
    </>
  );
}

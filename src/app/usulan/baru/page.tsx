import type { Metadata } from "next";
import { isIssueSlug } from "@/content/issues";
import { ProposalForm } from "@/components/ProposalForm";
import { Container, LabelBar, NumberCircle, PageHeader } from "@/components/ui";
import { SUPPORT_THRESHOLD } from "@/content/site";

export const metadata: Metadata = { title: "Ajukan Usulan" };

const TIPS = [
  "Satu masalah saja, yang jelas.",
  "Sebut siapa yang terdampak dan di mana.",
  "Tawarkan solusi yang masuk akal.",
  "Pakai bahasa yang santun.",
  "Jangan tulis NIK, nomor HP, atau alamat rumah.",
];

export default async function UsulanBaruPage({ searchParams }: PageProps<"/usulan/baru">) {
  const sp = await searchParams;
  const issue = typeof sp.isu === "string" && isIssueSlug(sp.isu) ? sp.isu : undefined;

  return (
    <>
      <PageHeader
        title="Punya ide untuk kotamu?"
        accent="Tulis di sini."
        description={`Warga lain bisa mendukung idemu. ${SUPPORT_THRESHOLD} 👍 = pemerintah wajib menjawab.`}
      />
      <Container className="grid gap-8 py-10 lg:grid-cols-[1fr_300px]">
        <ProposalForm defaultIssue={issue} />
        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div>
            <LabelBar as="h2">Tips singkat</LabelBar>
            <ul className="mt-2 list-disc space-y-1.5 rounded-xl border-2 border-dashed border-brand-300 p-4 pl-8 text-base text-slate-700">
              {TIPS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg bg-slate-100 p-5 text-base text-slate-700">
            <h2 className="text-base font-bold text-slate-900">Setelah kamu kirim</h2>
            <ol className="mt-3 space-y-3">
              {[
                "Usulanmu langsung tampil untuk semua warga.",
                "Warga lain memberi 👍 atau 👎 dan pendapat.",
                `Kalau sudah ${SUPPORT_THRESHOLD} 👍, pemerintah wajib menimbangnya.`,
                "Jawaban resmi (simulasi) tampil di halaman Hasil.",
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

import type { Metadata } from "next";
import Link from "next/link";
import { ISSUES } from "@/content/issues";
import { SITE } from "@/content/site";
import { Container, Hl, IssueIcon, KeyTakeaway, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Isu Publik" };

/** Pohon masalah (issue tree): satu pertanyaan inti → tiga isu → akar masalah per isu. */
export default function IsuPage() {
  return (
    <>
      <PageHeader
        title="Tiga masalah kota yang"
        accent="kita bahas"
        description="Pilih satu masalah untuk melihat penyebabnya dan ikut memberi ide."
      />

      <Container className="py-12">
        {/* Akar pohon */}
        <div className="mx-auto max-w-2xl rounded-md border-2 border-brand-600 bg-white px-6 py-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Pertanyaan inti</p>
          <p className="mt-1 text-lg font-bold leading-snug text-slate-900">
            Bagaimana warga {SITE.city} ikut memperbaiki layanan dasar kota yang paling mereka rasakan sehari-hari?
          </p>
        </div>

        {/* Konektor ke tiga cabang (desktop) */}
        <div className="relative mx-auto hidden h-10 md:block" aria-hidden>
          <span className="absolute left-1/2 top-0 h-5 w-0.5 -translate-x-1/2 bg-slate-400" />
          <span className="absolute left-[16.66%] right-[16.66%] top-5 h-0.5 bg-slate-400" />
          <span className="absolute left-[16.66%] top-5 h-5 w-0.5 bg-slate-400" />
          <span className="absolute left-1/2 top-5 h-5 w-0.5 -translate-x-1/2 bg-slate-400" />
          <span className="absolute right-[16.66%] top-5 h-5 w-0.5 bg-slate-400" />
        </div>

        <div className="mt-6 grid gap-8 md:mt-0 md:grid-cols-3 md:gap-6">
          {ISSUES.map((issue) => (
            <section key={issue.slug} aria-labelledby={`tree-${issue.slug}`} className="flex flex-col">
              <h2 id={`tree-${issue.slug}`} className="flex items-center justify-center gap-2 rounded-md border-2 border-brand-500 bg-white px-4 py-3 text-center font-bold text-slate-900">
                <IssueIcon slug={issue.slug} className="h-5 w-5 text-brand-600" /> {issue.shortTitle}
              </h2>

              {/* Cabang: garis vertikal di kiri dengan panah ke setiap akar masalah */}
              <ul className="relative ml-4 mt-0 flex-1 space-y-3 border-l-2 border-slate-300 pt-4">
                {issue.painPoints.map((group) => (
                  <li key={group.title} className="relative pl-6">
                    <span className="absolute left-0 top-6 h-0.5 w-5 bg-slate-300" aria-hidden />
                    <span className="absolute left-4 top-[1.3rem] h-0 w-0 border-y-[5px] border-l-[6px] border-y-transparent border-l-slate-400" aria-hidden />
                    <div className="rounded-md border border-brand-300 bg-white p-4">
                      <p className="font-bold text-slate-900">{group.title}</p>
                      <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm text-slate-600">
                        {group.points.map((pt) => (
                          <li key={pt}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
                <li className="relative pl-6">
                  <span className="absolute left-0 top-6 h-0.5 w-5 bg-slate-300" aria-hidden />
                  <span className="absolute left-4 top-[1.3rem] h-0 w-0 border-y-[5px] border-l-[6px] border-y-transparent border-l-slate-400" aria-hidden />
                  <div className="rounded-md bg-slate-100 p-4">
                    <p className="font-bold text-slate-900">Paling terdampak</p>
                    <p className="mt-1 text-sm text-slate-600">{issue.affected.map((a) => a.group).join(", ")}</p>
                  </div>
                </li>
              </ul>

              <Link
                href={`/isu/${issue.slug}`}
                className="ml-4 mt-4 rounded-md bg-brand-600 px-4 py-3.5 text-center text-base font-bold text-white transition hover:bg-brand-700"
              >
                Lihat & ikut: {issue.shortTitle} →
              </Link>
            </section>
          ))}
        </div>

        <KeyTakeaway className="mt-14">
          Ketiga isu berbagi pola yang sama: <Hl>layanan sebenarnya sudah ada</Hl>, tetapi <Hl>jangkauannya belum merata</Hl> dan{" "}
          <Hl>warga jarang dilibatkan</Hl> dalam menentukan perbaikannya. Karena itu solusinya perlu dirembug bersama warga yang
          terdampak, bukan diputuskan sepihak.
        </KeyTakeaway>
      </Container>
    </>
  );
}

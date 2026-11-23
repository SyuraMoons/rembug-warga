import Link from "next/link";
import { ArrowRight, ChevronDown, Coins, EyeOff, HelpCircle, MessagesSquare, Scale, Send, UserX, Vote, type LucideIcon } from "lucide-react";
import { ISSUES } from "@/content/issues";
import { SITE, SUPPORT_THRESHOLD } from "@/content/site";
import { getStats } from "@/lib/data";
import { formatNumber } from "@/lib/format";
import { getSiteUrl } from "@/lib/site-url";
import { BoothQR } from "@/components/BoothQR";
import {
  ButtonLink,
  Callout,
  Chevron,
  Container,
  Hl,
  IssueIcon,
  KeyTakeaway,
  LabelBar,
  NumberCircle,
  Stat,
  Subheading,
  TintBox,
  cn,
} from "@/components/ui";

export const dynamic = "force-dynamic";

/* ---------- Ringkasan eksekutif: Masalah → Peluang → Pertanyaan kunci → Strategi → Dampak ---------- */

const PROBLEMS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: UserX,
    title: "Defisit partisipasi",
    text: "Musrenbang didominasi tokoh dan pengurus. Bagaimana pelajar, lansia, dan penyandang disabilitas bisa ikut bersuara?",
  },
  {
    icon: MessagesSquare,
    title: "Defisit deliberasi",
    text: "Kanal aspirasi bersifat satu arah: warga mengeluh tanpa menimbang argumen. Bagaimana keputusan diambil lewat pertukaran alasan?",
  },
  {
    icon: EyeOff,
    title: "Defisit transparansi",
    text: "Warga tidak tahu apakah aspirasinya dibaca dan ditindaklanjuti. Bagaimana setiap masukan bisa dilacak sampai ada keputusan?",
  },
];

const MECHANISMS: { icon: LucideIcon; title: string; href: string }[] = [
  { icon: Send, title: "Usulan Warga", href: "/usulan/baru" },
  { icon: MessagesSquare, title: "Forum Pro–Kontra", href: "/diskusi" },
  { icon: Vote, title: "Voting Usulan", href: "/voting" },
  { icon: Coins, title: "Anggaran Partisipatif", href: "/voting/anggaran" },
  { icon: Scale, title: "Rembug Konsensus", href: "/diskusi/konsensus" },
];

const STRATEGY_IMPACT = [
  {
    strategy: "Usulan + voting dengan ambang dukungan yang jelas.",
    impact: `Usulan dengan ${SUPPORT_THRESHOLD} dukungan wajib ditanggapi, sehingga suara warga berujung pada keputusan.`,
  },
  {
    strategy: "Forum pro–kontra dan Rembug Konsensus ala vTaiwan.",
    impact: "Keputusan berbasis alasan, dengan peta titik temu dan titik beda antarkelompok warga.",
  },
  {
    strategy: "Anggaran partisipatif dan halaman hasil yang terbuka real-time.",
    impact: "Prioritas anggaran ditentukan warga dan setiap suara serta tindakan moderasi bisa diperiksa publik.",
  },
];

const FLOW = [
  { step: "Usulkan", text: "Warga mengajukan usulan untuk salah satu isu kota." },
  { step: "Rembugkan", text: "Warga lain memberi argumen pro, kontra, atau pertanyaan." },
  { step: "Putuskan", text: "Voting usulan, anggaran partisipatif, dan pemetaan konsensus." },
  { step: "Pantau", text: "Usulan yang lolos ambang wajib ditanggapi dan hasilnya dipublikasikan." },
];

export default async function HomePage() {
  const [stats, siteUrl] = await Promise.all([getStats(), getSiteUrl()]);

  return (
    <>
      {/* Sampul: putih dengan pita judul biru, seperti sampul deck referensi */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(#bfd5fe_1px,transparent_1px)] [background-size:22px_22px]"
          aria-hidden
        />
        <Container className="relative grid items-center gap-10 pb-0 pt-12 sm:pt-16 lg:grid-cols-[1fr_auto]">
          <div className="pb-10">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
              <span className="h-0.5 w-6 bg-brand-600" aria-hidden />
              Digital Citizen Participation Platform for Better Urban Governance
            </p>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              <strong className="text-slate-900">Rembug Warga</strong> adalah ruang musyawarah digital bagi warga {SITE.city}:
              usulkan solusi, rembugkan argumen, putuskan prioritas, dan pantau tindak lanjutnya secara terbuka.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/usulan/baru" variant="accent" className="px-6 py-3 text-base">
                Ikut Rembug Sekarang <ArrowRight className="h-5 w-5" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/isu" variant="outline" className="px-6 py-3 text-base">
                Lihat 3 Isu Publik
              </ButtonLink>
            </div>
          </div>
          <div className="hidden flex-col items-center gap-2 pb-10 lg:flex">
            <BoothQR url={siteUrl} size={150} />
            <span className="text-sm font-bold text-slate-600">Pindai untuk ikut dari HP-mu</span>
          </div>
        </Container>
        <div className="relative bg-brand-600">
          <Container className="py-6 sm:py-8">
            <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">{SITE.slogan}</h1>
          </Container>
        </div>
      </section>

      {/* Metrik kinerja live */}
      <Container className="pt-10">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Warga berpartisipasi" value={formatNumber(stats.participants)} />
          <Stat label="Usulan diajukan" value={formatNumber(stats.proposals)} />
          <Stat label="Argumen deliberasi" value={formatNumber(stats.comments)} />
          <Stat label="Suara diberikan" value={formatNumber(stats.votes + stats.consensusVotes + stats.ballots)} />
        </div>
      </Container>

      {/* Ringkasan eksekutif */}
      <Container className="py-14">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">
          Ringkasan <span className="text-brand-600">Eksekutif</span>
        </h2>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_auto_1fr]">
          <div>
            <Subheading>Masalah</Subheading>
            <ul className="mt-5 space-y-5">
              {PROBLEMS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <p className="text-slate-700">
                    <strong className="text-slate-900">{title}.</strong> {text}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden items-center lg:flex">
            <div className="h-full w-px bg-brand-200" />
            <Chevron className="-ml-3 bg-white" />
          </div>

          <div>
            <Subheading>Peluang: lima mekanisme partisipasi</Subheading>
            <ul className="mt-5 grid grid-cols-2 gap-3">
              {MECHANISMS.map(({ icon: Icon, title, href }, i) => (
                <li key={title} className={cn(i === 0 && "col-span-2")}>
                  <Link
                    href={href}
                    className={cn(
                      "flex h-full items-center justify-between gap-3 rounded-md p-4 font-bold transition",
                      i === 0
                        ? "bg-brand-600 text-white hover:bg-brand-700"
                        : i % 2 === 1
                          ? "bg-slate-100 text-slate-900 hover:bg-brand-50"
                          : "border border-slate-900 bg-white text-slate-900 hover:border-brand-600",
                    )}
                  >
                    {title}
                    <Icon className={cn("h-6 w-6 shrink-0", i === 0 ? "text-brand-100" : "text-brand-600")} aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Callout icon={HelpCircle} className="mt-10 items-center">
          <p className="text-lg font-bold text-slate-900">
            Bagaimana warga {SITE.city} bisa ikut menentukan solusi kota secara bermakna, bukan sekadar simbolis?
          </p>
        </Callout>

        {/* Strategi → Dampak */}
        <div className="mt-8 grid gap-x-4 gap-y-3 md:grid-cols-[8rem_repeat(3,1fr)]">
          <span className="hidden items-center md:flex">
            <span className="w-full rounded-full bg-brand-600 py-2 text-center font-bold text-white">Strategi</span>
          </span>
          {STRATEGY_IMPACT.map((s) => (
            <TintBox key={s.strategy} className="text-sm font-semibold text-slate-800">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-brand-700 md:hidden">Strategi</span>
              {s.strategy}
            </TintBox>
          ))}
          <span className="hidden md:block" />
          {STRATEGY_IMPACT.map((s) => (
            <span key={`c-${s.strategy}`} className="hidden justify-center md:flex">
              <ChevronDown className="h-5 w-5 text-brand-500" aria-hidden />
            </span>
          ))}
          <span className="hidden items-center md:flex">
            <span className="w-full rounded-full bg-brand-600 py-2 text-center font-bold text-white">Dampak</span>
          </span>
          {STRATEGY_IMPACT.map((s) => (
            <TintBox key={`i-${s.strategy}`} className="text-sm">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-brand-700 md:hidden">Dampak</span>
              {s.impact}
            </TintBox>
          ))}
        </div>
      </Container>

      {/* Isu publik */}
      <section className="border-y border-slate-200 bg-slate-50 py-14">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-3xl text-3xl font-black tracking-tight text-slate-900">
              Tiga masalah kota yang paling dekat dengan keseharian <span className="text-brand-600">warga</span>
            </h2>
            <Link href="/isu" className="font-bold text-brand-700 hover:underline">
              Lihat pohon masalah →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {ISSUES.map((issue) => (
              <Link key={issue.slug} href={`/isu/${issue.slug}`} className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:border-brand-400 hover:shadow-lg hover:shadow-brand-600/10">
                <LabelBar as="h3" align="left" className="flex items-center gap-2 rounded-none py-2.5">
                  <IssueIcon slug={issue.slug} className="h-5 w-5" /> {issue.shortTitle}
                </LabelBar>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-lg font-bold leading-snug text-slate-900">{issue.title}</p>
                  <p className="mt-3 flex-1 border-l-2 border-dashed border-brand-300 pl-3 text-sm text-slate-600">{issue.keyQuestion}</p>
                  <span className="mt-4 inline-block font-bold text-brand-700 group-hover:underline">Pelajari & ikut terlibat →</span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Alur keputusan */}
      <Container className="py-14">
        <h2 className="max-w-3xl text-3xl font-black tracking-tight text-slate-900">
          Setiap masukan bergerak dari usulan menjadi <span className="text-brand-600">keputusan</span>
        </h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-4">
          {FLOW.map((f, i) => (
            <li key={f.step} className="relative">
              {i < FLOW.length - 1 && <span className="absolute left-12 right-0 top-[1.35rem] hidden h-0.5 bg-brand-200 md:block" aria-hidden />}
              <NumberCircle n={i + 1} className="relative" />
              <h3 className="mt-3 text-lg font-bold text-slate-900">{f.step}</h3>
              <p className="mt-1 text-sm text-slate-600">{f.text}</p>
            </li>
          ))}
        </ol>

        <KeyTakeaway className="mt-12">
          Rembug Warga menjawab <Hl>tiga defisit demokrasi kota</Hl>: partisipasi, deliberasi, dan transparansi. Caranya
          dengan <Hl>lima mekanisme</Hl> yang saling terhubung, dari usulan hingga <Hl>tanggapan resmi yang wajib</Hl>,
          sehingga suara warga tidak berhenti sebagai keluhan.
        </KeyTakeaway>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/hasil">Lihat hasil & transparansi</ButtonLink>
          <ButtonLink href="/panduan" variant="outline">
            Baca panduan partisipasi
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}

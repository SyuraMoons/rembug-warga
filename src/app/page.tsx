import Link from "next/link";
import { ArrowRight, Coins, Eye, Lightbulb, MessagesSquare, Send, ThumbsUp, Vote, type LucideIcon } from "lucide-react";
import { ISSUES } from "@/content/issues";
import { SITE, SUPPORT_THRESHOLD } from "@/content/site";
import { getStats } from "@/lib/data";
import { formatNumber } from "@/lib/format";
import { getSiteUrl } from "@/lib/site-url";
import { BoothQR } from "@/components/BoothQR";
import { ActionTile, ButtonLink, Container, IssueIcon, LabelBar, Stat } from "@/components/ui";

export const dynamic = "force-dynamic";

/*
 * Beranda untuk warga: langsung ke aksi, sedikit kata.
 * Kerangka akademik (ringkasan eksekutif, defisit, strategi → dampak) ada di /tentang.
 */

const ACTIONS: { href: string; icon: LucideIcon; title: string; text: string }[] = [
  { href: "/usulan/baru", icon: Lightbulb, title: "Usulkan ide", text: "Tulis solusi untuk masalah di sekitarmu." },
  { href: "/voting", icon: ThumbsUp, title: "Dukung usulan", text: "Pilih ide warga yang kamu setujui." },
  { href: "/voting/anggaran", icon: Coins, title: "Bagi uang kota", text: "Kamu pegang Rp 10 miliar. Pakai untuk apa?" },
];

const FLOW: { icon: LucideIcon; step: string; text: string }[] = [
  { icon: Send, step: "Usulkan", text: "Warga menulis ide." },
  { icon: MessagesSquare, step: "Rembugkan", text: "Warga lain memberi pendapat." },
  { icon: Vote, step: "Putuskan", text: "Warga memberi suara." },
  { icon: Eye, step: "Pantau", text: `${SUPPORT_THRESHOLD} 👍 = pemerintah wajib menjawab.` },
];

export default async function HomePage() {
  const [stats, siteUrl] = await Promise.all([getStats(), getSiteUrl()]);

  return (
    <>
      {/* Sampul: satu kalimat + satu tombol besar */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(#bfd5fe_1px,transparent_1px)] [background-size:22px_22px]"
          aria-hidden
        />
        <Container className="relative grid items-center gap-10 pb-0 pt-10 sm:pt-14 lg:grid-cols-[1fr_auto]">
          <div className="pb-10">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-600">{SITE.name} · {SITE.city}</p>
            <p className="mt-4 max-w-2xl text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">
              Usulkan, dukung, dan pantau solusi untuk kotamu.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <ButtonLink href="/coba" variant="accent" className="px-7 py-4 text-lg">
                Coba Sekarang <span className="font-normal opacity-90">(1 menit)</span> <ArrowRight className="h-5 w-5" aria-hidden />
              </ButtonLink>
              <span className="text-base text-slate-600">Tanpa daftar, tanpa NIK.</span>
            </div>
          </div>
          <div className="hidden flex-col items-center gap-2 pb-10 lg:flex">
            <BoothQR url={`${siteUrl}/coba`} size={150} />
            <span className="text-base font-bold text-slate-700">Pindai untuk ikut dari HP-mu</span>
          </div>
        </Container>
        <div className="relative bg-brand-600">
          <Container className="py-6 sm:py-8">
            <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">{SITE.slogan}</h1>
          </Container>
        </div>
      </section>

      {/* Tiga aksi utama */}
      <Container className="pt-12">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Mau ikut apa hari ini?</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {ACTIONS.map((a, i) => (
            <ActionTile key={a.href} {...a} primary={i === 0} />
          ))}
        </div>
      </Container>

      {/* Angka partisipasi live */}
      <Container className="pt-12">
        <h2 className="text-lg font-bold text-slate-700">Yang sudah ikut rembug</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Warga ikut" value={formatNumber(stats.participants)} />
          <Stat label="Usulan" value={formatNumber(stats.proposals)} />
          <Stat label="Komentar" value={formatNumber(stats.comments)} />
          <Stat label="Suara" value={formatNumber(stats.votes + stats.consensusVotes + stats.ballots)} />
        </div>
      </Container>

      {/* Tiga isu */}
      <section className="mt-14 border-y border-slate-200 bg-slate-50 py-12">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Tiga masalah kota yang kita bahas</h2>
            <Link href="/isu" className="text-base font-bold text-brand-700 hover:underline">
              Lihat semua isu →
            </Link>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {ISSUES.map((issue) => (
              <Link
                key={issue.slug}
                href={`/isu/${issue.slug}`}
                className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-lg hover:shadow-brand-600/10"
              >
                <LabelBar as="h3" align="left" className="flex items-center gap-2 rounded-none py-3 text-lg">
                  <IssueIcon slug={issue.slug} className="h-6 w-6" /> {issue.shortTitle}
                </LabelBar>
                <div className="flex flex-1 flex-col p-5">
                  <p className="flex-1 text-lg leading-snug text-slate-800">{issue.tagline}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-base font-bold text-brand-700">
                    Lihat & ikut <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Ke mana suaramu pergi */}
      <Container className="py-12">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Ke mana suaramu pergi?</h2>
        <ol className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {FLOW.map(({ icon: Icon, step, text }, i) => (
            <li key={step} className="relative">
              {i < FLOW.length - 1 && <span className="absolute left-14 right-0 top-7 hidden h-0.5 bg-brand-200 md:block" aria-hidden />}
              <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white">
                <Icon className="h-7 w-7" aria-hidden />
              </span>
              <h3 className="mt-3 text-lg font-bold text-slate-900">
                {i + 1}. {step}
              </h3>
              <p className="mt-0.5 text-base text-slate-600">{text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <ButtonLink href="/hasil" className="px-5 py-3 text-base">
            Lihat hasil sejauh ini
          </ButtonLink>
          <Link href="/tentang" className="text-base font-semibold text-slate-600 underline-offset-4 hover:text-brand-700 hover:underline">
            Untuk juri & dosen: latar belakang, kerangka & refleksi →
          </Link>
        </div>
      </Container>
    </>
  );
}

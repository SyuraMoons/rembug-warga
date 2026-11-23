import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Coins, MessagesSquare, Scale, Send, ThumbsDown, ThumbsUp, Users } from "lucide-react";
import { ISSUE_BY_SLUG, isIssueSlug } from "@/content/issues";
import { getMyVotes, getProposals } from "@/lib/data";
import { getDeviceId } from "@/lib/participant";
import { ProposalCard } from "@/components/ProposalCard";
import {
  ButtonLink,
  Container,
  EmptyState,
  IconRow,
  IssueIcon,
  KeyTakeaway,
  LabelBar,
  NumberCircle,
  Section,
  SidePanel,
  Subheading,
} from "@/components/ui";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/isu/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: isIssueSlug(slug) ? ISSUE_BY_SLUG[slug].title : "Isu" };
}

export default async function IssueDetailPage({ params }: PageProps<"/isu/[slug]">) {
  const { slug } = await params;
  if (!isIssueSlug(slug)) notFound();
  const issue = ISSUE_BY_SLUG[slug];

  const [proposals, myVotes] = await Promise.all([getProposals({ issue: slug }), getDeviceId().then(getMyVotes)]);
  const top = [...proposals].sort((a, b) => b.support - b.oppose - (a.support - a.oppose)).slice(0, 4);

  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <Container className="py-10 sm:py-12">
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
            <IssueIcon slug={issue.slug} className="h-4 w-4" /> Isu publik · {issue.title}
          </p>
          {/* Action title: kesimpulan isu, bukan sekadar nama isu */}
          <h1 className="mt-4 max-w-4xl text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-[2.4rem]">{issue.headline}</h1>
          <div className="mt-6 flex flex-wrap gap-2">
            <ButtonLink href={`/usulan/baru?isu=${issue.slug}`} variant="accent">
              <Send className="h-4 w-4" aria-hidden /> Ajukan usulan
            </ButtonLink>
            <ButtonLink href={`/diskusi/konsensus?isu=${issue.slug}`} variant="outline">
              <Scale className="h-4 w-4" aria-hidden /> Rembug Konsensus
            </ButtonLink>
            <ButtonLink href="/voting/anggaran" variant="outline">
              <Coins className="h-4 w-4" aria-hidden /> Anggaran Partisipatif
            </ButtonLink>
          </div>
        </Container>
      </header>

      <Container>
        {/* Slide strategi: Tujuan/Pertanyaan/Dampak │ Titik masalah │ Alternatif solusi */}
        <Section title="Analisis isu dalam satu halaman">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr_1.3fr]">
            <div className="space-y-5">
              {[
                { label: "Tujuan", body: issue.objective },
                { label: "Pertanyaan kunci", body: issue.keyQuestion },
                { label: "Dampak yang diharapkan", body: issue.expectedImpact },
              ].map((c) => (
                <div key={c.label}>
                  <LabelBar>{c.label}</LabelBar>
                  <p className="mt-2 px-1 text-center text-sm leading-relaxed text-slate-700">{c.body}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border-2 border-dashed border-brand-300 p-4">
              <LabelBar>Titik masalah</LabelBar>
              <div className="mt-4 space-y-5">
                {issue.painPoints.map((g) => (
                  <div key={g.title}>
                    <p className="rounded-sm border border-brand-500 bg-slate-100 px-3 py-1.5 text-center text-sm font-bold text-slate-900">{g.title}</p>
                    <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-slate-700">
                      {g.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {issue.solutions.map((s, i) => (
                <div key={s.title}>
                  <LabelBar>{s.title}</LabelBar>
                  <div className="mt-2 flex items-start gap-3 px-1">
                    <NumberCircle n={String.fromCharCode(65 + i)} size="sm" />
                    <p className="text-sm text-slate-700">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Konteks: uraian + panel fakta */}
        <Section title="Masalahnya nyata, dan layanan yang ada belum menjangkau semua warga">
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-3 leading-relaxed text-slate-700">
              {issue.problem.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <SidePanel title="Fakta & konteks">
              <ul className="space-y-3 text-sm text-slate-700">
                {issue.facts.map((f) => (
                  <li key={f.label} className="border-l-2 border-brand-500 pl-3">
                    {f.label}
                    {f.source && <span className="mt-1 block text-xs text-slate-500">Sumber: {f.source}</span>}
                  </li>
                ))}
              </ul>
            </SidePanel>
          </div>
        </Section>

        <Section title="Siapa yang paling terdampak?">
          <div className="grid gap-6 sm:grid-cols-2">
            {issue.affected.map((a) => (
              <IconRow key={a.group} icon={Users} title={a.group}>
                {a.impact}
              </IconRow>
            ))}
          </div>
        </Section>

        {/* Matriks pertimbangan solusi (setara tabel 7Ps pada referensi) */}
        <Section title="Setiap solusi punya untung-rugi yang perlu ditimbang bersama">
          <div className="hidden grid-cols-[16rem_1fr_1fr] gap-3 pb-2 text-sm font-bold text-slate-500 md:grid">
            <span>Opsi</span>
            <span>Kelebihan</span>
            <span>Kekurangan</span>
          </div>
          <ul className="space-y-3">
            {issue.solutions.map((s, i) => (
              <li key={s.title} className="grid gap-3 md:grid-cols-[16rem_1fr_1fr]">
                <div className="flex items-center gap-3 rounded-md bg-brand-600 p-3 text-white">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white font-black text-brand-700">{String.fromCharCode(65 + i)}</span>
                  <span className="font-bold leading-snug">{s.title}</span>
                </div>
                <p className="flex gap-2 rounded-md bg-brand-50 p-3 text-sm text-slate-800">
                  <ThumbsUp className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" aria-label="Kelebihan" /> {s.pros}
                </p>
                <p className="flex gap-2 rounded-md bg-slate-100 p-3 text-sm text-slate-800">
                  <ThumbsDown className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-label="Kekurangan" /> {s.cons}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Bagaimana kamu bisa terlibat">
          <ol className="grid gap-5 sm:grid-cols-2">
            {issue.involvement.map((item, i) => (
              <li key={item} className="flex items-center gap-4">
                <NumberCircle n={i + 1} />
                <span className="font-semibold text-slate-800">{item}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section>
          <Subheading as="h2">
            <span className="inline-flex items-center gap-2">
              <MessagesSquare className="h-5 w-5 text-brand-600" aria-hidden /> Usulan warga soal {issue.shortTitle.toLowerCase()}
              <span className="font-normal text-slate-500">· {proposals.length} usulan, urut dukungan bersih</span>
            </span>
          </Subheading>
          <div className="mt-5">
            {top.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {top.map((p) => (
                  <ProposalCard key={p.id} p={p} myVote={myVotes[p.id]} />
                ))}
              </div>
            ) : (
              <EmptyState>Belum ada usulan. Jadilah yang pertama!</EmptyState>
            )}
            <div className="mt-4">
              <ButtonLink href={`/usulan?isu=${issue.slug}`} variant="ghost">
                Lihat semua usulan {issue.shortTitle.toLowerCase()} →
              </ButtonLink>
            </div>
          </div>
          <KeyTakeaway className="mt-10">{issue.takeaway}</KeyTakeaway>
        </Section>
      </Container>
    </>
  );
}

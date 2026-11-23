import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, BarChart3, CheckCircle2, Coins, Lightbulb, RotateCcw } from "lucide-react";
import { ISSUES, ISSUE_BY_SLUG, isIssueSlug, type IssueSlug } from "@/content/issues";
import { getMyStatementVotes, getMyVotes, getProposals, getStatementResults } from "@/lib/data";
import { getDeviceId } from "@/lib/participant";
import { StatementCard } from "@/components/Consensus";
import { VoteButtons } from "@/components/participation";
import { ActionTile, Container, IssueIcon, StepDots, ThresholdMeter, buttonStyles, cn } from "@/components/ui";

export const metadata: Metadata = { title: "Coba Sekarang" };
export const dynamic = "force-dynamic";

/*
 * Alur terpandu untuk warga yang belum terbiasa teknologi (dan pengunjung booth):
 * satu layar satu tugas, 4 langkah, tombol besar.
 *   1. Pilih isu → 2. Dukung satu usulan → 3. Setuju atau tidak? → 4. Selesai
 * Langkah disimpan di URL (?isu=…&langkah=…) agar tombol "kembali" di HP tetap bekerja.
 */

const TOTAL_STEPS = 4;

/** Geser ke kiri saat maju, ke kanan saat mundur (lihat globals.css: .nav-forward / .nav-back). */
const SLIDE = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" };

function stepHref(issue: IssueSlug | undefined, step: number, statementId?: string) {
  if (step <= 1 || !issue) return "/coba";
  const q = new URLSearchParams({ isu: issue, langkah: String(step) });
  if (statementId) q.set("s", statementId);
  return `/coba?${q}`;
}

export default async function CobaPage({ searchParams }: PageProps<"/coba">) {
  const sp = await searchParams;
  const issue = typeof sp.isu === "string" && isIssueSlug(sp.isu) ? sp.isu : undefined;
  const requested = Number(sp.langkah);
  const step = issue && requested >= 2 && requested <= TOTAL_STEPS ? requested : 1;

  let content: ReactNode;
  if (step === 1 || !issue) content = <StepPickIssue />;
  else content = await renderStep(step, issue, typeof sp.s === "string" ? sp.s : undefined);

  return (
    <Container className="max-w-3xl py-8 sm:py-12">
      <StepDots current={step} total={TOTAL_STEPS} />
      <ViewTransition key={step} enter={SLIDE} exit={SLIDE} default="none">
        <div className="mt-6">{content}</div>
      </ViewTransition>
    </Container>
  );
}

async function renderStep(step: number, issue: IssueSlug, statementParam?: string) {
  const deviceId = await getDeviceId();
  const [proposals, myVotes, statements, myStatementVotes] = await Promise.all([
    getProposals({ issue }),
    getMyVotes(deviceId),
    getStatementResults(issue),
    getMyStatementVotes(deviceId),
  ]);

  // Tiga usulan dengan dukungan terbanyak, ditampilkan dalam urutan tetap agar kartu
  // tidak berpindah tempat setelah warga memberi suara.
  const top = [...proposals]
    .sort((a, b) => b.support - a.support || a.oppose - b.oppose)
    .slice(0, 3)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
  const supported = proposals.find((p) => myVotes[p.id] === 1) ?? proposals.find((p) => myVotes[p.id]);

  // Pernyataan dipilih SEBELUM warga menjawab, lalu dibawa lewat URL, supaya setelah
  // menjawab kartunya tetap sama (dan hasilnya bisa terlihat), bukan melompat ke pernyataan lain.
  const statement =
    statements.find((s) => s.id === statementParam) ?? statements.find((s) => !myStatementVotes[s.id]) ?? statements[0];

  if (step === 2) {
    const voted = top.some((p) => myVotes[p.id]);
    return (
      <>
        <StepTitle issue={issue} title="Dukung satu usulan yang kamu setujui" hint="Tekan 👍 Dukung atau 👎 Tolak." />
        {top.length ? (
          <ul className="mt-6 space-y-4">
            {top.map((p) => (
              <li key={p.id} className="rounded-xl border-2 border-slate-200 bg-white p-5">
                <h3 className="text-xl font-bold leading-snug text-slate-900">{p.title}</h3>
                <p className="mt-1 line-clamp-2 text-base text-slate-600">{p.body}</p>
                <ThresholdMeter support={p.support} status={p.status} className="mt-4" />
                <div className="mt-4">
                  <VoteButtons proposalId={p.id} support={p.support} oppose={p.oppose} myVote={myVotes[p.id]} size="lg" />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 rounded-xl border-2 border-dashed border-slate-200 p-6 text-center text-base text-slate-600">
            Belum ada usulan untuk isu ini. Lanjut saja.
          </p>
        )}
        <StepNav back={stepHref(issue, 1)} next={stepHref(issue, 3, statement?.id)} done={voted} />
      </>
    );
  }

  if (step === 3) {
    const answered = statement ? Boolean(myStatementVotes[statement.id]) : false;
    return (
      <>
        <StepTitle issue={issue} title="Kamu setuju atau tidak?" hint="Pilih jawabanmu, lalu lihat jawaban warga lain." />
        <div className="mt-6">
          {statement ? (
            <StatementCard s={statement} myVote={myStatementVotes[statement.id]} />
          ) : (
            <p className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center text-base text-slate-600">
              Belum ada pernyataan untuk isu ini. Lanjut saja.
            </p>
          )}
        </div>
        <StepNav back={stepHref(issue, 2)} next={stepHref(issue, 4, statement?.id)} done={answered} nextLabel="Selesai" />
      </>
    );
  }

  // Langkah 4: ringkasan + langkah berikutnya
  const answer = statement ? myStatementVotes[statement.id] : undefined;
  const answerLabel = { setuju: "Setuju 👍", tidak: "Tidak setuju 👎", ragu: "Ragu 🤔" };
  const didSomething = Boolean(supported || answer);

  return (
    <>
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="h-20 w-20 animate-check text-emerald-500" aria-hidden />
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          {didSomething ? "Selesai! Suaramu sudah dihitung." : "Selesai!"}
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          {didSomething ? "Terima kasih sudah ikut rembug 🎉" : "Kamu belum memberi suara. Mau coba lagi?"}
        </p>
      </div>

      <ul className="mt-8 space-y-3">
        <SummaryRow>
          Isu: <strong>{ISSUE_BY_SLUG[issue].shortTitle}</strong>
        </SummaryRow>
        {supported && (
          <SummaryRow>
            {myVotes[supported.id] === 1 ? "Kamu mendukung" : "Kamu menolak"}: <strong>{supported.title}</strong>
            <ThresholdMeter support={supported.support} status={supported.status} className="mt-3" />
          </SummaryRow>
        )}
        {statement && answer && (
          <SummaryRow>
            Kamu menjawab <strong>{answerLabel[answer]}</strong> untuk “{statement.text}”
          </SummaryRow>
        )}
      </ul>

      <h2 className="mt-10 text-xl font-black text-slate-900">Mau lanjut?</h2>
      <div className="mt-4 grid gap-3">
        <ActionTile href="/hasil" icon={BarChart3} title="Lihat hasil" text="Lihat pilihan semua warga." primary />
        <ActionTile href={`/usulan/baru?isu=${issue}`} icon={Lightbulb} title="Tulis usulanmu" text="Punya ide sendiri? Tulis di sini." />
        <ActionTile href="/voting/anggaran" icon={Coins} title="Bagi uang kota" text="Kamu pegang Rp 10 miliar." />
      </div>
      <div className="mt-6 text-center">
        <Link href="/coba" transitionTypes={["nav-back"]} className="inline-flex items-center gap-2 text-base font-bold text-brand-700 hover:underline">
          <RotateCcw className="h-4 w-4" aria-hidden /> Coba lagi dengan isu lain
        </Link>
      </div>
    </>
  );
}

function StepPickIssue() {
  return (
    <>
      <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Masalah mana yang paling kamu rasakan?</h1>
      <p className="mt-2 text-lg text-slate-600">Ketuk salah satu. Hanya butuh sekitar 1 menit.</p>
      <ul className="mt-6 grid gap-3">
        {ISSUES.map((i) => (
          <li key={i.slug}>
            <Link
              href={stepHref(i.slug, 2)}
              transitionTypes={["nav-forward"]}
              className="group flex min-h-24 items-center gap-4 rounded-xl border-2 border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-lg active:scale-[0.98]"
            >
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                <IssueIcon slug={i.slug} className="h-8 w-8" />
              </span>
              <span className="min-w-0">
                <span className="block text-2xl font-black text-slate-900">{i.shortTitle}</span>
                <span className="mt-0.5 block text-base text-slate-600">{i.tagline}</span>
              </span>
              <ArrowRight className="ml-auto h-6 w-6 shrink-0 text-brand-600 transition group-hover:translate-x-1" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function StepTitle({ issue, title, hint }: { issue: IssueSlug; title: string; hint: string }) {
  return (
    <>
      <p className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-800">
        <IssueIcon slug={issue} className="h-4 w-4" /> {ISSUE_BY_SLUG[issue].shortTitle}
      </p>
      <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
      <p className="mt-2 text-lg text-slate-600">{hint}</p>
    </>
  );
}

function StepNav({ back, next, done, nextLabel = "Lanjut" }: { back: string; next: string; done: boolean; nextLabel?: string }) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      <Link href={back} transitionTypes={["nav-back"]} className={cn(buttonStyles.ghost, "min-h-12 px-4 text-base")}>
        <ArrowLeft className="h-5 w-5" aria-hidden /> Kembali
      </Link>
      <Link
        href={next}
        transitionTypes={["nav-forward"]}
        className={cn(done ? buttonStyles.accent : buttonStyles.outline, "min-h-12 px-6 text-lg", done && "animate-rise")}
      >
        {done ? nextLabel : "Lewati"} <ArrowRight className="h-5 w-5" aria-hidden />
      </Link>
    </div>
  );
}

function SummaryRow({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-base text-slate-800">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
      <div className="min-w-0 flex-1">{children}</div>
    </li>
  );
}

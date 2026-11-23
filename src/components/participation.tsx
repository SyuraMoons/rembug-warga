"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { Flag, ThumbsDown, ThumbsUp } from "lucide-react";
import {
  addCommentAction,
  castVoteAction,
  reportAction,
  type ActionResult,
} from "@/app/actions/participation";
import { useParticipant } from "./ParticipantProvider";
import { buttonStyles, cn } from "./ui";
import { submitWithoutReset } from "./useFormSubmit";

// ---------- Tombol Dukung / Tolak ----------
export function VoteButtons({
  proposalId,
  support,
  oppose,
  myVote,
  size = "md",
}: {
  proposalId: string;
  support: number;
  oppose: number;
  myVote?: 1 | -1;
  size?: "md" | "lg";
}) {
  const { requireProfile } = useParticipant();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // Diisi setelah suara berhasil: memicu animasi angka & pesan terima kasih,
  // sehingga warga langsung melihat bahwa suaranya masuk (tanpa perlu membaca penjelasan).
  const [feedback, setFeedback] = useState<string | null>(null);

  function vote(value: 1 | -1) {
    if (!requireProfile()) return;
    setError(null);
    const withdrawing = myVote === value;
    start(async () => {
      const res = await castVoteAction(proposalId, value);
      if (res && !res.ok) {
        setError(res.error);
        setFeedback(null);
      } else {
        setFeedback(withdrawing ? "Suaramu dibatalkan." : value === 1 ? "Terima kasih! Dukunganmu tercatat 👍" : "Suaramu tercatat.");
      }
    });
  }

  const base = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border-2 font-bold transition active:scale-95 disabled:opacity-60",
    size === "lg" ? "flex-1 px-6 py-3 text-lg" : "px-4 py-2 text-base",
  );
  const count = (n: number) => (
    <span key={n} className={cn("inline-block tabular-nums", feedback && "animate-pop")}>
      {n}
    </span>
  );
  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Berikan suaramu">
        <button
          type="button"
          disabled={pending}
          onClick={() => vote(1)}
          aria-pressed={myVote === 1}
          className={cn(base, myVote === 1 ? "border-brand-700 bg-brand-700 text-white" : "border-brand-200 bg-white text-brand-800 hover:bg-brand-50")}
        >
          <ThumbsUp className={size === "lg" ? "h-6 w-6" : "h-5 w-5"} aria-hidden /> Dukung {count(support)}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => vote(-1)}
          aria-pressed={myVote === -1}
          className={cn(base, myVote === -1 ? "border-rose-600 bg-rose-600 text-white" : "border-rose-200 bg-white text-rose-700 hover:bg-rose-50")}
        >
          <ThumbsDown className={size === "lg" ? "h-6 w-6" : "h-5 w-5"} aria-hidden /> Tolak {count(oppose)}
        </button>
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-sm font-semibold text-rose-700">
          {error}
        </p>
      ) : feedback ? (
        <p key={feedback} role="status" className="mt-2 animate-rise text-sm font-bold text-brand-800">
          {feedback} {myVote && <span className="font-normal text-slate-600">Ketuk lagi untuk membatalkan.</span>}
        </p>
      ) : (
        myVote && <p className="mt-2 text-sm text-slate-600">Ketuk pilihanmu lagi untuk membatalkan.</p>
      )}
    </div>
  );
}

// ---------- Tombol Laporkan ----------
export function ReportButton({ type, id }: { type: "proposal" | "comment" | "statement"; id: string }) {
  const { requireProfile } = useParticipant();
  const [pending, start] = useTransition();
  const [result, setResult] = useState<ActionResult>(null);

  if (result?.ok) return <span className="text-xs font-semibold text-slate-500">{result.message}</span>;
  return (
    <span>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!requireProfile()) return;
          start(async () => setResult(await reportAction(type, id)));
        }}
        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-rose-600"
      >
        <Flag className="h-3.5 w-3.5" aria-hidden /> Laporkan
      </button>
      {result && !result.ok && <span className="ml-2 text-xs text-rose-700">{result.error}</span>}
    </span>
  );
}

// ---------- Form argumen pro/kontra ----------
// Nilai di database tetap pro/kontra/netral; warga hanya melihat label sederhana.
const STANCES = [
  { value: "pro", label: "👍 Setuju", className: "has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50" },
  { value: "kontra", label: "👎 Tidak setuju", className: "has-[:checked]:border-rose-500 has-[:checked]:bg-rose-50" },
  { value: "netral", label: "❓ Mau tanya", className: "has-[:checked]:border-slate-500 has-[:checked]:bg-slate-50" },
];

export function CommentForm({ proposalId }: { proposalId: string }) {
  const { participant, requireProfile } = useParticipant();
  const [state, action, pending] = useActionState<ActionResult, FormData>(addCommentAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      onSubmit={submitWithoutReset(action, requireProfile)}
      className="space-y-3 rounded-lg border border-slate-200 border-t-4 border-t-brand-600 bg-white p-5"
    >
      <input type="hidden" name="proposalId" value={proposalId} />
      <h3 className="text-lg font-bold text-slate-900">Tulis pendapatmu</h3>
      <fieldset>
        <legend className="sr-only">Kamu setuju dengan usulan ini?</legend>
        <div className="flex flex-wrap gap-2">
          {STANCES.map((s) => (
            <label key={s.value} className={cn("flex min-h-11 cursor-pointer items-center rounded-xl border-2 border-slate-200 px-4 py-2 text-base font-semibold", s.className)}>
              <input type="radio" name="stance" value={s.value} required className="sr-only" defaultChecked={s.value === "pro"} />
              {s.label}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block">
        <span className="sr-only">Isi pendapat</span>
        <textarea
          name="body"
          required
          minLength={3}
          maxLength={1000}
          rows={3}
          placeholder="Kenapa kamu setuju atau tidak? Bahas idenya, bukan orangnya."
          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-base"
        />
      </label>
      {state && (
        <p key={state.ok ? state.message : state.error} role="status" className={cn("animate-rise text-base font-semibold", state.ok ? "text-brand-700" : "text-rose-700")}>
          {state.ok ? `✓ ${state.message}` : state.error}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          {participant ? `Tampil sebagai ${participant.name ?? "Anonim"}` : "Nanti kamu diminta mengisi profil singkat."}
        </p>
        <button type="submit" disabled={pending} className={cn(buttonStyles.primary, "min-h-11 px-5 text-base")}>
          {pending ? "Mengirim…" : "Kirim pendapat"}
        </button>
      </div>
    </form>
  );
}

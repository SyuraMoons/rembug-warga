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
  size?: "sm" | "md";
}) {
  const { requireProfile } = useParticipant();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function vote(value: 1 | -1) {
    if (!requireProfile()) return;
    setError(null);
    start(async () => {
      const res = await castVoteAction(proposalId, value);
      if (res && !res.ok) setError(res.error);
    });
  }

  const base = cn(
    "inline-flex items-center gap-1.5 rounded-xl border font-bold transition disabled:opacity-60",
    size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2.5",
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
          <ThumbsUp className="h-4 w-4" aria-hidden /> Dukung <span className="tabular-nums">({support})</span>
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => vote(-1)}
          aria-pressed={myVote === -1}
          className={cn(base, myVote === -1 ? "border-rose-600 bg-rose-600 text-white" : "border-rose-200 bg-white text-rose-700 hover:bg-rose-50")}
        >
          <ThumbsDown className="h-4 w-4" aria-hidden /> Tolak <span className="tabular-nums">({oppose})</span>
        </button>
      </div>
      {myVote && <p className="mt-1.5 text-xs text-slate-500">Klik pilihanmu lagi untuk menarik suara.</p>}
      {error && <p role="alert" className="mt-1.5 text-sm font-semibold text-rose-700">{error}</p>}
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
const STANCES = [
  { value: "pro", label: "Pro", className: "has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50" },
  { value: "kontra", label: "Kontra", className: "has-[:checked]:border-rose-500 has-[:checked]:bg-rose-50" },
  { value: "netral", label: "Netral / Pertanyaan", className: "has-[:checked]:border-slate-500 has-[:checked]:bg-slate-50" },
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
      <h3 className="font-bold text-slate-900">Tambahkan argumenmu</h3>
      <fieldset>
        <legend className="sr-only">Posisi argumen</legend>
        <div className="flex flex-wrap gap-2">
          {STANCES.map((s) => (
            <label key={s.value} className={cn("cursor-pointer rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold", s.className)}>
              <input type="radio" name="stance" value={s.value} required className="sr-only" defaultChecked={s.value === "pro"} />
              {s.label}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block">
        <span className="sr-only">Isi argumen</span>
        <textarea
          name="body"
          required
          minLength={3}
          maxLength={1000}
          rows={3}
          placeholder="Sampaikan alasanmu. Fokus pada gagasan, bukan pada orangnya."
          className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
        />
      </label>
      {state && (
        <p role="status" className={cn("text-sm font-semibold", state.ok ? "text-brand-700" : "text-rose-700")}>
          {state.ok ? state.message : state.error}
        </p>
      )}
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          {participant ? `Tampil sebagai ${participant.name ?? "Anonim"}` : "Kamu akan diminta mengisi profil singkat."}
        </p>
        <button type="submit" disabled={pending} className={buttonStyles.primary}>
          {pending ? "Mengirim…" : "Kirim argumen"}
        </button>
      </div>
    </form>
  );
}

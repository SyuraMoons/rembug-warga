"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { addStatementAction, voteStatementAction, type ActionResult } from "@/app/actions/participation";
import { ISSUES, type IssueSlug } from "@/content/issues";
import { useParticipant } from "./ParticipantProvider";
import { ReportButton } from "./participation";
import { buttonStyles, cn } from "./ui";
import { submitWithoutReset } from "./useFormSubmit";

type Choice = "setuju" | "tidak" | "ragu";

const CHOICES: { value: Choice; label: string; on: string; off: string }[] = [
  { value: "setuju", label: "Setuju", on: "bg-brand-700 text-white border-brand-700", off: "border-brand-200 text-brand-800 hover:bg-brand-50" },
  { value: "tidak", label: "Tidak setuju", on: "bg-rose-600 text-white border-rose-600", off: "border-rose-200 text-rose-700 hover:bg-rose-50" },
  { value: "ragu", label: "Ragu / Lewati", on: "bg-slate-600 text-white border-slate-600", off: "border-slate-200 text-slate-600 hover:bg-slate-50" },
];

export type StatementView = {
  id: string;
  text: string;
  is_seed: boolean;
  setuju: number;
  tidak: number;
  ragu: number;
  total: number;
};

export function StatementCard({ s, myVote }: { s: StatementView; myVote?: Choice }) {
  const { requireProfile } = useParticipant();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function vote(value: Choice) {
    if (!requireProfile()) return;
    setError(null);
    start(async () => {
      const res = await voteStatementAction(s.id, value);
      if (res && !res.ok) setError(res.error);
    });
  }

  const pct = (n: number) => (s.total ? Math.round((n / s.total) * 100) : 0);

  return (
    <article className="rounded-lg border border-slate-200 border-l-4 border-l-brand-600 bg-white p-5">
      <p className="text-lg font-bold leading-snug text-slate-900">“{s.text}”</p>
      <p className="mt-1 text-xs text-slate-500">{s.is_seed ? "Pernyataan pemantik dari tim" : "Pernyataan dari warga"}</p>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Tanggapan kamu">
        {CHOICES.map((c) => (
          <button
            key={c.value}
            type="button"
            disabled={pending}
            aria-pressed={myVote === c.value}
            onClick={() => vote(c.value)}
            className={cn("rounded-xl border px-4 py-2 text-sm font-bold transition disabled:opacity-60", myVote === c.value ? c.on : c.off)}
          >
            {c.label}
          </button>
        ))}
      </div>
      {error && <p role="alert" className="mt-2 text-sm font-semibold text-rose-700">{error}</p>}

      {myVote ? (
        <div className="mt-4">
          <div className="flex h-3 gap-0.5 overflow-hidden rounded-full bg-slate-100" role="img" aria-label={`${pct(s.setuju)}% setuju, ${pct(s.tidak)}% tidak setuju, ${pct(s.ragu)}% ragu`}>
            {s.setuju > 0 && <div className="bg-brand-600" style={{ width: `${pct(s.setuju)}%` }} />}
            {s.tidak > 0 && <div className="bg-rose-600" style={{ width: `${pct(s.tidak)}%` }} />}
            {s.ragu > 0 && <div className="bg-slate-300" style={{ width: `${pct(s.ragu)}%` }} />}
          </div>
          <p className="mt-1.5 text-xs text-slate-600">
            <strong className="text-brand-800">{pct(s.setuju)}% setuju</strong> · <strong className="text-rose-700">{pct(s.tidak)}% tidak</strong> · {pct(s.ragu)}% ragu · {s.total} suara
          </p>
        </div>
      ) : (
        <p className="mt-3 text-xs text-slate-500">Hasil sementara tampil setelah kamu memilih, agar pilihanmu tidak terpengaruh suara mayoritas.</p>
      )}
      {!s.is_seed && (
        <div className="mt-3">
          <ReportButton type="statement" id={s.id} />
        </div>
      )}
    </article>
  );
}

export function AddStatementForm({ defaultIssue }: { defaultIssue: IssueSlug }) {
  const { requireProfile } = useParticipant();
  const [state, action, pending] = useActionState<ActionResult, FormData>(addStatementAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} onSubmit={submitWithoutReset(action, requireProfile)} className="space-y-3 rounded-xl border-2 border-dashed border-brand-300 bg-white p-5">
      <h3 className="font-bold text-slate-900">Punya pandangan lain? Tambahkan pernyataan</h3>
      <p className="text-sm text-slate-600">Tulis satu kalimat yang bisa disetujui atau ditolak orang lain. Hindari pertanyaan atau serangan pribadi.</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="sm:w-48">
          <span className="sr-only">Isu</span>
          <select name="issue" defaultValue={defaultIssue} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5">
            {ISSUES.map((i) => (
              <option key={i.slug} value={i.slug}>
                {i.shortTitle}
              </option>
            ))}
          </select>
        </label>
        <label className="flex-1">
          <span className="sr-only">Pernyataan</span>
          <input name="text" required minLength={10} maxLength={200} placeholder="Contoh: Halte harus punya toilet umum." className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5" />
        </label>
        <button type="submit" disabled={pending} className={buttonStyles.primary}>
          {pending ? "Mengirim…" : "Tambah"}
        </button>
      </div>
      {state && (
        <p role="status" className={cn("text-sm font-semibold", state.ok ? "text-brand-700" : "text-rose-700")}>
          {state.ok ? state.message : state.error}
        </p>
      )}
    </form>
  );
}

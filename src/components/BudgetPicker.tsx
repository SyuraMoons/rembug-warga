"use client";

import { useState, useTransition } from "react";
import { Check, CheckCircle2, Plus } from "lucide-react";
import { submitBallotAction, type ActionResult } from "@/app/actions/participation";
import { BUDGET_LIMIT, BUDGET_PROJECTS } from "@/content/budget";
import { ISSUES } from "@/content/issues";
import { formatRupiah } from "@/lib/format";
import { useParticipant } from "./ParticipantProvider";
import { IssueIcon, LabelBar, buttonStyles, cn } from "./ui";

export function BudgetPicker({ initial }: { initial: string[] | null }) {
  const { requireProfile } = useParticipant();
  const [selected, setSelected] = useState<string[]>(initial ?? []);
  const [pending, start] = useTransition();
  const [result, setResult] = useState<ActionResult>(null);

  const total = selected.reduce((sum, id) => sum + (BUDGET_PROJECTS.find((p) => p.id === id)?.cost ?? 0), 0);
  const remaining = BUDGET_LIMIT - total;
  const usedPct = Math.min(100, (total / BUDGET_LIMIT) * 100);
  const dirty = JSON.stringify([...selected].sort()) !== JSON.stringify([...(initial ?? [])].sort());

  function toggle(id: string, cost: number) {
    setResult(null);
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cost <= remaining ? [...cur, id] : cur));
  }

  function submit() {
    if (!requireProfile()) return;
    start(async () => setResult(await submitBallotAction(selected)));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-8">
        {ISSUES.map((issue) => (
          <section key={issue.slug} aria-labelledby={`pb-${issue.slug}`}>
            <LabelBar align="left" className="mb-3 flex items-center gap-2">
              <span id={`pb-${issue.slug}`} className="inline-flex items-center gap-2">
                <IssueIcon slug={issue.slug} className="h-5 w-5" /> {issue.shortTitle}
              </span>
            </LabelBar>
            <div className="grid gap-3 md:grid-cols-3">
              {BUDGET_PROJECTS.filter((p) => p.issue === issue.slug).map((p) => {
                const isOn = selected.includes(p.id);
                const tooExpensive = !isOn && p.cost > remaining;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggle(p.id, p.cost)}
                    disabled={tooExpensive}
                    aria-pressed={isOn}
                    className={cn(
                      "flex flex-col rounded-lg border-2 bg-white p-4 text-left transition",
                      isOn ? "border-brand-600 bg-brand-50" : "border-slate-200 hover:border-brand-300",
                      tooExpensive && "cursor-not-allowed opacity-50",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold leading-snug text-slate-900">{p.title}</span>
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                          isOn ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 text-slate-400",
                        )}
                        aria-hidden
                      >
                        {isOn ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </span>
                    </div>
                    <span className="mt-1.5 text-sm text-slate-600">{p.description}</span>
                    <span className="mt-auto pt-3 text-base font-black text-brand-700">{formatRupiah(p.cost, true)}</span>
                    {tooExpensive && <span className="text-sm font-semibold text-rose-600">Uangnya tidak cukup</span>}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <h3 className="bg-brand-600 px-5 py-2 text-lg font-bold text-white">Uangmu</h3>
          <div className="p-5 pt-4">
          <div className="mt-3 h-4 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuemin={0} aria-valuemax={BUDGET_LIMIT} aria-valuenow={total} aria-label="Uang terpakai">
            <div className={cn("h-full rounded-full transition-all", usedPct > 90 ? "bg-amber-500" : "bg-brand-600")} style={{ width: `${usedPct}%` }} />
          </div>
          <dl className="mt-3 space-y-1 text-base">
            <div className="flex items-baseline justify-between">
              <dt className="text-slate-600">Sisa</dt>
              <dd key={remaining} className={cn("inline-block font-black tabular-nums text-brand-800", dirty && "animate-pop")}>
                <span className="text-2xl">{formatRupiah(remaining, true)}</span>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Terpakai</dt>
              <dd className="font-bold tabular-nums">{formatRupiah(total, true)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Program dipilih</dt>
              <dd className="font-bold tabular-nums">{selected.length}</dd>
            </div>
          </dl>
          <button type="button" onClick={submit} disabled={pending || selected.length === 0 || (!dirty && initial !== null)} className={cn(buttonStyles.accent, "mt-4 min-h-12 w-full text-base")}>
            {pending ? "Menyimpan…" : initial ? (dirty ? "Simpan perubahan" : "Pilihan tersimpan ✓") : "Kirim pilihanku"}
          </button>
          {result && (
            <p role="status" className={cn("mt-3 flex animate-rise items-start gap-2 text-base font-semibold", result.ok ? "text-brand-700" : "text-rose-700")}>
              {result.ok && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 animate-check" aria-hidden />}
              {result.ok ? result.message : result.error}
            </p>
          )}
          <p className="mt-3 text-sm text-slate-600">1 HP = 1 pilihan. Bisa diubah kapan saja.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

"use client";

import { useActionState, useState } from "react";
import { submitProposalAction, type ActionResult } from "@/app/actions/participation";
import { ISSUES, type IssueSlug } from "@/content/issues";
import { KECAMATAN_SURABAYA } from "@/content/site";
import { useParticipant } from "./ParticipantProvider";
import { IssueIcon, buttonStyles, cn } from "./ui";
import { submitWithoutReset } from "./useFormSubmit";

export function ProposalForm({ defaultIssue }: { defaultIssue?: IssueSlug }) {
  const { participant, requireProfile } = useParticipant();
  const [state, action, pending] = useActionState<ActionResult, FormData>(submitProposalAction, null);
  const [body, setBody] = useState("");

  return (
    <form onSubmit={submitWithoutReset(action, requireProfile)} className="space-y-6">
      <fieldset>
        <legend className="text-sm font-bold text-slate-800">1. Isu apa yang ingin kamu usulkan? *</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {ISSUES.map((issue) => (
            <label
              key={issue.slug}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border-2 border-slate-200 bg-white p-4 font-bold has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50",
              )}
            >
              <input type="radio" name="issue" value={issue.slug} required defaultChecked={issue.slug === defaultIssue} className="accent-brand-700" />
              <IssueIcon slug={issue.slug} className="h-6 w-6 text-brand-600" />
              {issue.shortTitle}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="text-sm font-bold text-slate-800">2. Judul usulan *</span>
        <input
          name="title"
          required
          minLength={5}
          maxLength={120}
          placeholder="Contoh: Halte depan SMPN dekat rumah diberi atap dan lampu"
          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5"
        />
      </label>

      <label className="block">
        <span className="text-sm font-bold text-slate-800">3. Uraikan masalah & usulanmu *</span>
        <span className="mt-0.5 block text-xs text-slate-500">
          Apa masalahnya, siapa yang terdampak, dan apa solusi yang kamu usulkan?
        </span>
        <textarea
          name="body"
          required
          minLength={20}
          maxLength={2000}
          rows={6}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5"
        />
        <span className={cn("mt-0.5 block text-right text-xs", body.length > 0 && body.length < 20 ? "text-rose-600" : "text-slate-400")}>
          {body.length}/2000 {body.length > 0 && body.length < 20 && "· minimal 20 karakter"}
        </span>
      </label>

      <label className="block">
        <span className="text-sm font-bold text-slate-800">4. Lokasi (kecamatan, opsional)</span>
        <select name="kecamatan" defaultValue="" className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5">
          <option value="">Tidak spesifik / seluruh kota</option>
          {KECAMATAN_SURABAYA.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
          <option value="Di luar Surabaya">Di luar Surabaya</option>
        </select>
      </label>

      <div className="rounded-lg bg-brand-50 p-4 text-sm text-slate-700">
        Usulanmu akan langsung tampil publik dan bisa didukung serta didiskusikan warga lain. Usulan yang mencapai
        ambang dukungan akan berstatus <strong>Dipertimbangkan</strong> dan wajib mendapat tanggapan.{" "}
        {participant ? (
          <>
            Kamu tampil sebagai <strong>{participant.name ?? "Anonim"}</strong>.
          </>
        ) : (
          "Kamu akan diminta mengisi profil singkat sebelum mengirim."
        )}
      </div>

      {state && !state.ok && (
        <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={cn(buttonStyles.accent, "w-full py-3 text-base sm:w-auto")}>
        {pending ? "Mengirim usulan…" : "Kirim usulan"}
      </button>
    </form>
  );
}

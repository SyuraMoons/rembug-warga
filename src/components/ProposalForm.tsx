"use client";

import { useActionState, useRef, useState } from "react";
import { submitProposalAction, type ActionResult } from "@/app/actions/participation";
import { ISSUES, type IssueSlug } from "@/content/issues";
import { KECAMATAN_SURABAYA, SUPPORT_THRESHOLD } from "@/content/site";
import { useParticipant } from "./ParticipantProvider";
import { IssueIcon, buttonStyles, cn } from "./ui";
import { submitWithoutReset } from "./useFormSubmit";

const STARTERS = ["Masalahnya: ", "Yang terdampak: ", "Usulanku: "];

export function ProposalForm({ defaultIssue }: { defaultIssue?: IssueSlug }) {
  const { participant, requireProfile } = useParticipant();
  const [state, action, pending] = useActionState<ActionResult, FormData>(submitProposalAction, null);
  const [body, setBody] = useState("");
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Kalimat pembuka yang bisa diketuk, agar warga tidak bingung harus menulis apa.
  function addStarter(text: string) {
    setBody((b) => (b.trim() ? `${b.trimEnd()}\n${text}` : text));
    requestAnimationFrame(() => {
      const el = bodyRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    });
  }

  return (
    <form onSubmit={submitWithoutReset(action, requireProfile)} className="space-y-6">
      <fieldset>
        <legend className="text-base font-bold text-slate-800">1. Soal apa? *</legend>
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
        <span className="text-base font-bold text-slate-800">2. Judul singkat *</span>
        <input
          name="title"
          required
          minLength={5}
          maxLength={120}
          placeholder="Contoh: Halte depan SMPN dekat rumah diberi atap dan lampu"
          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base"
        />
      </label>

      <div>
        <label htmlFor="proposal-body" className="block text-base font-bold text-slate-800">
          3. Ceritakan idemu *
        </label>
        <p className="mt-0.5 text-sm text-slate-600">Bingung mulai dari mana? Ketuk salah satu:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {STARTERS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => addStarter(t)}
              className="min-h-10 rounded-full border-2 border-brand-200 bg-white px-4 py-1.5 text-sm font-bold text-brand-800 transition hover:bg-brand-50 active:scale-95"
            >
              + {t.replace(/:\s*$/, "")}
            </button>
          ))}
        </div>
        <textarea
          id="proposal-body"
          ref={bodyRef}
          name="body"
          required
          minLength={20}
          maxLength={2000}
          rows={6}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base"
        />
        <span className={cn("mt-0.5 block text-right text-sm", body.length > 0 && body.length < 20 ? "text-rose-600" : "text-slate-500")}>
          {body.length}/2000 {body.length > 0 && body.length < 20 && "· minimal 20 huruf"}
        </span>
      </div>

      <label className="block">
        <span className="text-base font-bold text-slate-800">4. Di kecamatan mana? (boleh dilewati)</span>
        <select name="kecamatan" defaultValue="" className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base">
          <option value="">Tidak spesifik / seluruh kota</option>
          {KECAMATAN_SURABAYA.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
          <option value="Di luar Surabaya">Di luar Surabaya</option>
        </select>
      </label>

      <p className="rounded-lg bg-brand-50 p-4 text-base text-slate-700">
        Usulanmu langsung tampil untuk semua warga. {SUPPORT_THRESHOLD} dukungan = pemerintah wajib menjawab.{" "}
        {participant ? (
          <>
            Kamu tampil sebagai <strong>{participant.name ?? "Anonim"}</strong>.
          </>
        ) : (
          "Nanti kamu diminta mengisi profil singkat."
        )}
      </p>

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

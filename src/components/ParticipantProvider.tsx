"use client";

import { createContext, useActionState, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { saveProfileAction, type ActionResult } from "@/app/actions/participation";
import { CITIZEN_GROUPS } from "@/content/site";
import { buttonStyles, cn } from "./ui";
import { submitWithoutReset } from "./useFormSubmit";

const GROUP_EMOJI: Record<string, string> = {
  pelajar: "🎓",
  pekerja: "💼",
  rumah_tangga: "🏠",
  lansia: "👵",
  disabilitas: "♿",
  lainnya: "🙂",
};

export type ClientParticipant = { name: string | null; group: string } | null;

type Ctx = {
  participant: ClientParticipant;
  /** Kembalikan true jika profil sudah ada; jika belum, buka dialog profil. */
  requireProfile: () => boolean;
  openProfile: () => void;
};

const ParticipantContext = createContext<Ctx>({ participant: null, requireProfile: () => false, openProfile: () => {} });

export function useParticipant() {
  return useContext(ParticipantContext);
}

export function ParticipantProvider({ participant, children }: { participant: ClientParticipant; children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openProfile = useCallback(() => dialogRef.current?.showModal(), []);
  const requireProfile = useCallback(() => {
    if (participant) return true;
    dialogRef.current?.showModal();
    return false;
  }, [participant]);

  return (
    <ParticipantContext.Provider value={{ participant, requireProfile, openProfile }}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="profil-title"
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl p-0 shadow-2xl"
      >
        <ProfileForm participant={participant} onDone={() => dialogRef.current?.close()} />
      </dialog>
    </ParticipantContext.Provider>
  );
}

export function ProfileForm({ participant, onDone }: { participant: ClientParticipant; onDone?: () => void }) {
  const [state, action, pending] = useActionState<ActionResult, FormData>(saveProfileAction, null);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  // Hanya bereaksi saat hasil action BERUBAH (bukan setiap render), supaya dialog
  // tidak langsung tertutup ketika dibuka lagi untuk mengubah profil.
  useEffect(() => {
    if (state?.ok) onDoneRef.current?.();
  }, [state]);

  return (
    <form onSubmit={submitWithoutReset(action)} className="space-y-4 p-6">
      <div>
        <h2 id="profil-title" className="text-xl font-bold text-slate-900">
          Kenalan dulu, yuk 👋
        </h2>
        <p className="mt-1 text-base text-slate-600">Tanpa login. Cukup pilih kamu termasuk kelompok mana.</p>
      </div>

      <label className="block">
        <span className="text-base font-bold text-slate-800">Nama panggilan (boleh kosong)</span>
        <input
          name="name"
          defaultValue={participant?.name ?? ""}
          maxLength={40}
          placeholder="Kosongkan kalau mau anonim"
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 text-base"
        />
      </label>

      <fieldset>
        <legend className="text-base font-bold text-slate-800">Kamu termasuk kelompok mana? *</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {CITIZEN_GROUPS.map((g) => (
            <label
              key={g.value}
              className="flex min-h-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-slate-200 px-2 py-2.5 text-center text-sm font-bold leading-tight text-slate-800 transition has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-brand-600"
            >
              <input type="radio" name="group" value={g.value} defaultChecked={participant?.group === g.value} required className="sr-only" />
              <span className="text-2xl" aria-hidden>
                {GROUP_EMOJI[g.value]}
              </span>
              {g.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-3 text-base text-slate-700">
        <input type="checkbox" name="consent" required className="mt-0.5 h-5 w-5 shrink-0 accent-brand-700" />
        <span>
          Saya setuju dengan{" "}
          <Link href="/panduan#aturan" className="font-bold text-brand-800 underline" target="_blank">
            aturan & privasi
          </Link>{" "}
          (simulasi akademik).
        </span>
      </label>

      {state && !state.ok && (
        <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">
          {state.error}
        </p>
      )}

      <div className="flex gap-2">
        <button type="submit" disabled={pending} className={cn(buttonStyles.primary, "min-h-12 flex-1 text-base")}>
          {pending ? "Menyimpan…" : "Simpan & lanjut"}
        </button>
        {onDone && (
          <button type="button" onClick={onDone} className={cn(buttonStyles.ghost, "min-h-12 text-base")}>
            Nanti saja
          </button>
        )}
      </div>
    </form>
  );
}

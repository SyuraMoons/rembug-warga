"use client";

import { createContext, useActionState, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { saveProfileAction, type ActionResult } from "@/app/actions/participation";
import { CITIZEN_GROUPS } from "@/content/site";
import { buttonStyles } from "./ui";
import { submitWithoutReset } from "./useFormSubmit";

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
        <p className="mt-1 text-sm text-slate-600">
          Tanpa login dan tanpa data sensitif. Kategori warga dipakai untuk melihat apakah semua kelompok ikut
          terwakili dalam keputusan.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-bold text-slate-800">Nama panggilan (opsional)</span>
        <input
          name="name"
          defaultValue={participant?.name ?? ""}
          maxLength={40}
          placeholder="Boleh dikosongkan agar anonim"
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5"
        />
      </label>

      <fieldset>
        <legend className="text-sm font-bold text-slate-800">Kategori warga *</legend>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {CITIZEN_GROUPS.map((g) => (
            <label key={g.value} className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50">
              <input type="radio" name="group" value={g.value} defaultChecked={participant?.group === g.value} required className="accent-brand-700" />
              {g.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex items-start gap-2 text-sm text-slate-700">
        <input type="checkbox" name="consent" required className="mt-1 accent-brand-700" />
        <span>
          Saya menyetujui{" "}
          <Link href="/panduan#aturan" className="font-bold text-brand-800 underline" target="_blank">
            aturan partisipasi & kebijakan privasi
          </Link>
          , dan memahami bahwa ini adalah simulasi akademik.
        </span>
      </label>

      {state && !state.ok && (
        <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">
          {state.error}
        </p>
      )}

      <div className="flex gap-2">
        <button type="submit" disabled={pending} className={buttonStyles.primary}>
          {pending ? "Menyimpan…" : "Simpan & ikut rembug"}
        </button>
        {onDone && (
          <button type="button" onClick={onDone} className={buttonStyles.ghost}>
            Nanti saja
          </button>
        )}
      </div>
    </form>
  );
}

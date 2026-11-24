"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { deleteContentAction } from "@/app/actions/admin";

function ConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-bold text-white disabled:opacity-60">
      {pending ? "Menghapus…" : "Ya, hapus permanen"}
    </button>
  );
}

/** Tombol hapus dua langkah: klik pertama membuka konfirmasi, tidak ada dialog browser. */
export function DeleteButton({ type, id, note }: { type: "proposal" | "comment" | "statement"; id: string; note?: string }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className="rounded-lg px-2.5 py-1 text-xs font-bold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50">
        Hapus
      </button>
    );
  }

  return (
    <form action={deleteContentAction} className="flex flex-wrap items-center gap-2 rounded-lg bg-rose-50 p-2 ring-1 ring-rose-200">
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="id" value={id} />
      <span className="text-xs font-semibold text-rose-800">Tidak bisa dibatalkan.{note ? ` ${note}` : ""}</span>
      <input name="reason" placeholder="Alasan (publik)" maxLength={200} className="w-40 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs" />
      <ConfirmButton />
      <button type="button" onClick={() => setConfirming(false)} className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
        Batal
      </button>
    </form>
  );
}

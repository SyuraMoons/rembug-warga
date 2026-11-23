"use client";

import { useActionState } from "react";
import { adminLoginAction } from "@/app/actions/admin";
import type { ActionResult } from "@/app/actions/participation";
import { buttonStyles } from "./ui";
import { submitWithoutReset } from "./useFormSubmit";

export function AdminLogin() {
  const [state, action, pending] = useActionState<ActionResult, FormData>(adminLoginAction, null);
  return (
    <form onSubmit={submitWithoutReset(action)} className="mx-auto max-w-sm space-y-3 rounded-xl border border-slate-200 bg-white p-6">
      <h1 className="text-xl font-bold text-slate-900">Masuk moderator</h1>
      <label className="block">
        <span className="text-sm font-bold text-slate-700">Kode akses</span>
        <input type="password" name="passcode" required autoComplete="current-password" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5" />
      </label>
      {state && !state.ok && <p role="alert" className="text-sm font-semibold text-rose-700">{state.error}</p>}
      <button type="submit" disabled={pending} className={buttonStyles.primary}>
        {pending ? "Memeriksa…" : "Masuk"}
      </button>
    </form>
  );
}

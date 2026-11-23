"use client";

import { useSyncExternalStore } from "react";

const SIZES = ["base", "lg", "xl"] as const;

function read() {
  if (typeof document === "undefined") return "base|normal";
  const el = document.documentElement;
  return `${el.dataset.fs ?? "base"}|${el.dataset.contrast ?? "normal"}`;
}

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function apply(key: "fs" | "contrast", value: string) {
  document.documentElement.dataset[key] = value;
  try {
    localStorage.setItem(`rw-${key}`, value);
  } catch {}
  listeners.forEach((l) => l());
}

/** Script inline di <head> agar preferensi diterapkan sebelum halaman tampil (tanpa kedip). */
export const A11Y_INIT_SCRIPT = `try{var d=document.documentElement;d.dataset.fs=localStorage.getItem('rw-fs')||'base';d.dataset.contrast=localStorage.getItem('rw-contrast')||'normal'}catch(e){}`;

export function A11yControls() {
  const state = useSyncExternalStore(subscribe, read, () => "base|normal");
  const [fs, contrast] = state.split("|");
  const idx = SIZES.indexOf(fs as (typeof SIZES)[number]);

  const btn = "rounded px-2 py-0.5 font-bold hover:bg-brand-100 disabled:opacity-40";
  return (
    <div className="flex shrink-0 items-center gap-1" role="group" aria-label="Pengaturan aksesibilitas">
      <button type="button" className={btn} aria-label="Perkecil teks" disabled={idx <= 0} onClick={() => apply("fs", SIZES[Math.max(0, idx - 1)])}>
        A−
      </button>
      <button type="button" className={btn} aria-label="Perbesar teks" disabled={idx >= SIZES.length - 1} onClick={() => apply("fs", SIZES[Math.min(SIZES.length - 1, idx + 1)])}>
        A+
      </button>
      <button
        type="button"
        className={btn}
        aria-pressed={contrast === "high"}
        onClick={() => apply("contrast", contrast === "high" ? "normal" : "high")}
      >
        {contrast === "high" ? "◐ Kontras normal" : "◐ Kontras tinggi"}
      </button>
    </div>
  );
}

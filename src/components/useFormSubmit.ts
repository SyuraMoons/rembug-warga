"use client";

import { startTransition, type FormEvent } from "react";

/**
 * React 19 otomatis mengosongkan form setelah action selesai — termasuk saat
 * validasi gagal, sehingga teks yang sudah diketik warga hilang. Helper ini
 * mengirim form secara manual (tanpa reset otomatis); reset dilakukan sendiri
 * hanya ketika berhasil.
 */
export function submitWithoutReset(action: (fd: FormData) => void, guard?: () => boolean) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (guard && !guard()) return;
    const fd = new FormData(e.currentTarget);
    startTransition(() => action(fd));
  };
}

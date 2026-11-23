const TZ = "Asia/Jakarta";

export function formatRupiah(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_000_000_000) {
      const m = value / 1_000_000_000;
      return `Rp ${m.toLocaleString("id-ID", { maximumFractionDigits: 1 })} M`;
    }
    if (value >= 1_000_000) {
      return `Rp ${(value / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 0 })} jt`;
    }
  }
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

export function formatNumber(value: number): string {
  return value.toLocaleString("id-ID");
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: TZ }).format(
    new Date(iso),
  );
}

export function timeAgo(iso: string, now = Date.now()): string {
  const diff = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} hari lalu`;
  return formatDate(iso);
}

export function pct(part: number, total: number): number {
  return total === 0 ? 0 : Math.round((part / total) * 100);
}

/** Logo Rembug Warga: dua gelembung percakapan yang membentuk atap rumah/balai warga. */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Logo Rembug Warga">
      <rect width="48" height="48" rx="12" fill="#2554eb" />
      {/* atap */}
      <path d="M8 22 24 9l16 13" fill="none" stroke="#bfd5fe" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* gelembung kiri */}
      <path d="M11 25h13a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-7l-4 3.5V37h-2a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3Z" fill="#ffffff" />
      {/* gelembung kanan */}
      <path d="M37 21H25a3 3 0 0 0-3 3v1h2a5 5 0 0 1 5 5v2h1l4 3.5V32h3a3 3 0 0 0 3-3v-5a3 3 0 0 0-3-3Z" fill="#bfd5fe" />
      <circle cx="14.5" cy="31" r="1.4" fill="#2554eb" />
      <circle cx="18.5" cy="31" r="1.4" fill="#2554eb" />
      <circle cx="22.5" cy="31" r="1.4" fill="#2554eb" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="leading-tight">
        <span className="block text-lg font-black tracking-tight text-slate-900">Rembug Warga</span>
        <span className="block text-[11px] font-medium text-slate-500">Simulasi partisipasi warga</span>
      </span>
    </span>
  );
}

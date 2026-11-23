import Link from "next/link";
import { LogoMark } from "./Logo";
import { NAV } from "./nav";
import { SITE } from "@/content/site";

export function Footer() {
  return (
    <footer className="mt-16 border-t-4 border-brand-600 bg-slate-50 text-slate-600">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="text-lg font-black text-slate-900">{SITE.name}</span>
          </div>
          <p className="mt-3 text-sm">{SITE.slogan}</p>
        </div>
        <nav aria-label="Navigasi footer">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="font-semibold text-slate-700 hover:text-brand-700 hover:underline">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-2 text-sm">
          <p>
            <strong className="text-slate-900">Simulasi akademik</strong> · {SITE.course}.
          </p>
          <p>Bukan kanal resmi Pemerintah Kota Surabaya. Semua data adalah data simulasi.</p>
        </div>
      </div>
      {/* Baris tanda tangan seperti kaki slide referensi: "NAMA AKSEN | …" */}
      <div className="border-t border-slate-200">
        <p className="mx-auto max-w-6xl px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-6">
          Rembug <span className="text-brand-600">Warga</span> <span className="mx-1 text-slate-300">|</span> Demokrasi Digital 2026
        </p>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Sparkles, UserRound, X } from "lucide-react";
import { Logo } from "./Logo";
import { A11yControls } from "./A11yControls";
import { useParticipant } from "./ParticipantProvider";
import { GROUP_LABEL } from "@/content/site";
import { cn } from "./ui";
import { NAV } from "./nav";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { participant, openProfile } = useParticipant();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="border-b border-brand-100 bg-brand-50 text-brand-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-1.5 text-xs sm:px-6">
          <p className="truncate">
            <strong>Simulasi akademik</strong> · bukan kanal resmi pemerintah
          </p>
          <A11yControls />
        </div>
      </div>
      <nav aria-label="Navigasi utama" className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" aria-label="Rembug Warga, ke beranda" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "relative px-3 py-2 text-sm font-bold transition after:absolute after:inset-x-3 after:-bottom-[13px] after:h-[3px] after:rounded-full",
                  isActive(item.href) ? "text-brand-700 after:bg-brand-600" : "text-slate-600 after:bg-transparent hover:text-brand-700",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {pathname !== "/coba" && (
            <Link
              href="/coba"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-brand-600 px-4 py-1.5 text-sm font-bold text-white shadow-sm shadow-brand-600/30 transition hover:bg-brand-700 active:scale-95"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              Coba<span className="hidden sm:inline"> Sekarang</span>
            </Link>
          )}
          <button
            type="button"
            onClick={openProfile}
            className="hidden items-center gap-1.5 rounded-full border border-brand-200 px-3 py-1.5 text-xs font-bold text-brand-800 hover:bg-brand-50 sm:flex"
          >
            <UserRound className="h-4 w-4" aria-hidden />
            {participant ? (
              <span className="max-w-36 truncate">
                {participant.name ?? "Anonim"} · {GROUP_LABEL[participant.group]?.split(" /")[0]}
              </span>
            ) : (
              "Isi profil"
            )}
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-slate-200 bg-white lg:hidden">
          <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-1 px-4 py-3">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 font-semibold",
                    isActive(item.href) ? "bg-brand-50 text-brand-800" : "text-slate-700",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="col-span-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openProfile();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 font-semibold text-slate-700"
              >
                <UserRound className="h-5 w-5" aria-hidden />
                {participant ? `Profil: ${participant.name ?? "Anonim"} · ${GROUP_LABEL[participant.group]}` : "Isi profil peserta"}
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

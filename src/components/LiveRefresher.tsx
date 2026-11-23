"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { browserDb } from "@/lib/supabase/browser";

const TABLES = ["proposals", "comments", "votes", "consensus_votes", "budget_ballots", "consensus_statements"];

/**
 * Membuat halaman Hasil "live": berlangganan Supabase Realtime dan me-refresh
 * data server saat ada partisipasi baru. Ada juga polling cadangan tiap 15 detik
 * bila koneksi realtime terputus (mis. Wi-Fi pameran tidak stabil).
 */
export function LiveRefresher({ pollMs = 15000 }: { pollMs?: number }) {
  const router = useRouter();
  const [live, setLive] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const refresh = () => {
      if (timer.current) return; // debounce: gabungkan banyak perubahan beruntun
      timer.current = setTimeout(() => {
        timer.current = null;
        router.refresh();
      }, 800);
    };

    const supabase = browserDb();
    const channel = supabase?.channel("hasil-live");
    if (supabase && channel) {
      for (const table of TABLES) {
        channel.on("postgres_changes", { event: "*", schema: "public", table }, refresh);
      }
      channel.subscribe((status) => setLive(status === "SUBSCRIBED"));
    }
    const poll = setInterval(() => router.refresh(), pollMs);

    return () => {
      clearInterval(poll);
      if (timer.current) clearTimeout(timer.current);
      if (supabase && channel) supabase.removeChannel(channel);
    };
  }, [router, pollMs]);

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700">
      <span className={`h-2.5 w-2.5 rounded-full ${live ? "animate-pulse bg-emerald-500" : "bg-amber-400"}`} aria-hidden />
      {live ? "Live: diperbarui otomatis" : "Diperbarui berkala"}
    </span>
  );
}

import "server-only";
import { db } from "@/lib/supabase/server";

/**
 * Filter kata kasar sederhana (Indonesia + Jawa Suroboyoan).
 * Dicocokkan per kata utuh setelah normalisasi, supaya kata seperti
 * "cocok" atau "pantai" tidak ikut terblokir.
 */
const BLOCKED_WORDS = [
  "anjing", "anjeng", "anjir", "bangsat", "bajingan", "brengsek", "kontol", "memek", "ngentot", "entot",
  "goblok", "goblog", "tolol", "idiot", "babi", "asu", "jancok", "jancuk", "jancik", "dancok", "cok", "cuk",
  "jembut", "taek", "tai", "kampret", "pepek", "pukimak", "keparat", "sialan", "bego", "bodoh", "matamu",
  "ndasmu", "celeng", "kirik", "lonte", "pelacur", "perek", "fuck", "shit", "bitch",
];

const LEET: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", $: "s" };

function normalize(text: string): string[] {
  const lowered = text
    .toLowerCase()
    .replace(/[013457@$]/g, (c) => LEET[c] ?? c)
    .replace(/(.)\1{2,}/g, "$1"); // "anjiiiing" → "anjing"
  return lowered.split(/[^a-z]+/).filter(Boolean);
}

export function containsProfanity(...texts: (string | null | undefined)[]): boolean {
  const blocked = new Set(BLOCKED_WORDS);
  return texts.some((t) => t && normalize(t).some((w) => blocked.has(w) || blocked.has(w.replace(/(.)\1+/g, "$1"))));
}

export const PROFANITY_MESSAGE =
  "Tulisanmu mengandung kata yang melanggar aturan partisipasi. Yuk sampaikan pendapat dengan bahasa yang santun.";

/**
 * Rate limit sederhana berbasis database: maksimal `max` baris per perangkat
 * dalam `windowSeconds` terakhir pada tabel tertentu. Mencegah spam/bot.
 */
export async function isRateLimited(
  table: "proposals" | "comments" | "consensus_statements" | "reports",
  deviceId: string,
  max: number,
  windowSeconds: number,
): Promise<boolean> {
  const since = new Date(Date.now() - windowSeconds * 1000).toISOString();
  const { count, error } = await db()
    .from(table)
    .select("*", { count: "exact", head: true })
    .eq("device_id", deviceId)
    .gte("created_at", since);
  if (error) throw error;
  return (count ?? 0) >= max;
}

import "server-only";
import { cookies } from "next/headers";
import { CITIZEN_GROUPS, type CitizenGroup } from "@/content/site";

/**
 * Identitas peserta TANPA login:
 *  - rw_did     : UUID acak per perangkat (httpOnly) → dasar "1 perangkat 1 suara"
 *  - rw_profile : nama panggilan (opsional) + kategori warga, disimpan setelah warga
 *                 menyetujui aturan partisipasi.
 * Tidak ada data pribadi sensitif yang dikumpulkan.
 */
const DEVICE_COOKIE = "rw_did";
const PROFILE_COOKIE = "rw_profile";
const ONE_YEAR = 60 * 60 * 24 * 365;

export type Participant = {
  deviceId: string;
  name: string | null;
  group: CitizenGroup;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseProfile(raw: string | undefined): { name: string | null; group: CitizenGroup } | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(decodeURIComponent(raw));
    const group = CITIZEN_GROUPS.find((g) => g.value === data.group)?.value;
    if (!group) return null;
    const name = typeof data.name === "string" && data.name.trim() ? data.name.trim().slice(0, 40) : null;
    return { name, group };
  } catch {
    return null;
  }
}

/** Dipakai di Server Components: siapa peserta saat ini (null jika belum mengisi profil). */
export async function getParticipant(): Promise<Participant | null> {
  const store = await cookies();
  const deviceId = store.get(DEVICE_COOKIE)?.value;
  const profile = parseProfile(store.get(PROFILE_COOKIE)?.value);
  if (!deviceId || !UUID_RE.test(deviceId) || !profile) return null;
  return { deviceId, ...profile };
}

/** Hanya device id (untuk menandai "suara saya"), walau profil belum diisi. */
export async function getDeviceId(): Promise<string | null> {
  const store = await cookies();
  const deviceId = store.get(DEVICE_COOKIE)?.value;
  return deviceId && UUID_RE.test(deviceId) ? deviceId : null;
}

/** Dipakai di Server Actions: simpan profil & buat device id bila belum ada. */
export async function saveParticipant(name: string | null, group: CitizenGroup) {
  const store = await cookies();
  let deviceId = store.get(DEVICE_COOKIE)?.value;
  if (!deviceId || !UUID_RE.test(deviceId)) {
    deviceId = crypto.randomUUID();
  }
  const options = { httpOnly: true, sameSite: "lax" as const, maxAge: ONE_YEAR, path: "/", secure: process.env.NODE_ENV === "production" };
  store.set(DEVICE_COOKIE, deviceId, options);
  store.set(PROFILE_COOKIE, encodeURIComponent(JSON.stringify({ name, group })), options);
}

export async function clearProfile() {
  const store = await cookies();
  store.delete(PROFILE_COOKIE);
}

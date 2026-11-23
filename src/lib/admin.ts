import "server-only";
import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "node:crypto";

const ADMIN_COOKIE = "rw_admin";

function expectedToken(): string | null {
  const pass = process.env.ADMIN_PASSCODE;
  if (!pass) return null;
  return createHash("sha256").update(`rembug-warga:${pass}`).digest("hex");
}

export function checkPasscode(input: string): boolean {
  const pass = process.env.ADMIN_PASSCODE;
  if (!pass) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(pass);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdmin(): Promise<boolean> {
  const token = expectedToken();
  if (!token) return false;
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === token;
}

export async function setAdminSession(on: boolean) {
  const store = await cookies();
  const token = expectedToken();
  if (on && token) {
    store.set(ADMIN_COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 12, secure: process.env.NODE_ENV === "production" });
  } else {
    store.delete(ADMIN_COOKIE);
  }
}

"use server";

import { z } from "zod";
import { refresh } from "next/cache";
import { db } from "@/lib/supabase/server";
import { checkPasscode, isAdmin, setAdminSession } from "@/lib/admin";
import { PROPOSAL_STATUS } from "@/content/site";
import type { ActionResult } from "./participation";

const TABLE = { proposal: "proposals", comment: "comments", statement: "consensus_statements" } as const;
const LABEL = { proposal: "Usulan", comment: "Argumen", statement: "Pernyataan konsensus" } as const;

async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Tidak berwenang.");
}

export async function adminLoginAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const pass = String(formData.get("passcode") ?? "");
  if (!process.env.ADMIN_PASSCODE) return { ok: false, error: "ADMIN_PASSCODE belum diatur di environment." };
  if (!checkPasscode(pass)) return { ok: false, error: "Kode akses salah." };
  await setAdminSession(true);
  refresh();
  return { ok: true };
}

export async function adminLogoutAction(): Promise<void> {
  await setAdminSession(false);
  refresh();
}

const hideSchema = z.object({
  type: z.enum(["proposal", "comment", "statement"]),
  id: z.guid(),
  hidden: z.enum(["true", "false"]),
  reason: z.string().trim().max(200).optional(),
});

export async function setHiddenAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = hideSchema.parse({
    type: formData.get("type"),
    id: formData.get("id"),
    hidden: formData.get("hidden"),
    reason: formData.get("reason") || undefined,
  });
  const hidden = parsed.hidden === "true";
  const supabase = db();
  const { error } = await supabase.from(TABLE[parsed.type]).update({ hidden }).eq("id", parsed.id);
  if (error) throw error;
  await supabase.from("moderation_log").insert({
    target_type: parsed.type,
    target_id: parsed.id,
    action: `${LABEL[parsed.type]} ${hidden ? "disembunyikan" : "ditampilkan kembali"}`,
    reason: parsed.reason ?? (hidden ? "Melanggar aturan partisipasi" : null),
  });
  // Laporan atas konten ini dianggap selesai.
  await supabase.from("reports").update({ resolved: true }).eq("target_id", parsed.id);
  refresh();
}

export async function dismissReportAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = z.guid().parse(formData.get("id"));
  await db().from("reports").update({ resolved: true }).eq("id", id);
  refresh();
}

const statusSchema = z.object({
  id: z.guid(),
  status: z.enum(Object.keys(PROPOSAL_STATUS) as [keyof typeof PROPOSAL_STATUS, ...(keyof typeof PROPOSAL_STATUS)[]]),
  response: z.string().trim().max(2000).optional(),
});

export async function updateProposalStatusAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = statusSchema.parse({
    id: formData.get("id"),
    status: formData.get("status"),
    response: formData.get("response") || undefined,
  });
  const supabase = db();
  const { data: before } = await supabase.from("proposals").select("status, official_response").eq("id", parsed.id).single();
  const update: Record<string, unknown> = { status: parsed.status };
  if (parsed.response !== undefined && parsed.response !== before?.official_response) {
    update.official_response = parsed.response;
    update.responded_at = new Date().toISOString();
  }
  const { error } = await supabase.from("proposals").update(update).eq("id", parsed.id);
  if (error) throw error;
  if (before?.status !== parsed.status) {
    await supabase.from("moderation_log").insert({
      target_type: "proposal",
      target_id: parsed.id,
      action: `status → ${PROPOSAL_STATUS[parsed.status].label}`,
      reason: parsed.response ? "Disertai tanggapan resmi" : null,
    });
  }
  refresh();
}

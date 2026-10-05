"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { audit, requireAdmin } from "@/lib/admin/session";
import { isUuid } from "@/lib/admin/query";

const openingSchema = z.object({
  title: z.string().trim().min(3).max(160),
  department: z.string().trim().max(120).optional().default(""),
  employment_type: z.string().trim().min(2).max(60),
  location: z.string().trim().min(2).max(200),
  description: z.string().trim().max(8000).optional().default(""),
  requirements: z.string().trim().max(8000).optional().default(""),
  status: z.enum(["open", "closed"]),
  sort_order: z.coerce.number().int().min(0).max(10000).default(100),
});

export async function saveOpening(form: FormData) {
  const admin = await requireAdmin("openings");
  const id = String(form.get("id") ?? "");
  const parsed = openingSchema.safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success)
    redirect(`/admin/openings/${isUuid(id) ? id : "new"}/?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  const row = { ...parsed.data, department: parsed.data.department || null, updated_at: new Date().toISOString() };
  const db = supabaseAdmin().from("job_openings");
  const { data, error } = isUuid(id)
    ? await db.update(row).eq("id", id).select("id").single()
    : await db.insert(row).select("id").single();
  if (error || !data)
    redirect(`/admin/openings/${isUuid(id) ? id : "new"}/?error=${encodeURIComponent("Could not save.")}`);
  await audit(admin, isUuid(id) ? "update" : "create", "opening", data.id, { title: row.title, status: row.status });
  redirect(`/admin/openings/?saved=1`);
}

export async function setOpeningStatus(form: FormData) {
  const admin = await requireAdmin("openings");
  const id = String(form.get("id") ?? "");
  const status = form.get("status") === "open" ? "open" : "closed";
  if (isUuid(id)) {
    await supabaseAdmin().from("job_openings").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    await audit(admin, status === "open" ? "reopen" : "close", "opening", id);
  }
  redirect("/admin/openings/?saved=1");
}

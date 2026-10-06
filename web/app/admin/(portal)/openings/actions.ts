"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { audit, requireAdmin } from "@/lib/admin/session";
import { isUuid } from "@/lib/admin/query";

const text = (max: number) => z.string().trim().max(max).optional().default("");

const openingSchema = z.object({
  title: z.string().trim().min(3, "Give the job a title.").max(160),
  overview: text(1500),
  department: text(120),
  employment_type: z.string().trim().min(2).max(60),
  location: z.string().trim().min(2, "Add the location.").max(200),
  experience: text(60),
  description: text(8000),
  responsibilities: text(8000),
  requirements: text(8000),
  skills: text(2000),
  status: z.enum(["open", "closed"]),
  sort_order: z.coerce.number().int().min(0).max(10000).default(100),
});

/** The careers pages read openings on every visit; this also refreshes the sitemap. */
function refresh(id?: string) {
  revalidatePath("/careers/current-openings/");
  if (id) revalidatePath(`/careers/current-openings/${id}/`);
  revalidatePath("/sitemap.xml");
}

export async function saveOpening(form: FormData) {
  const admin = await requireAdmin("openings");
  const id = String(form.get("id") ?? "");
  const parsed = openingSchema.safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success)
    redirect(`/admin/openings/${isUuid(id) ? id : "new"}/?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  const row: Record<string, unknown> = {
    ...parsed.data,
    department: parsed.data.department || null,
    updated_at: new Date().toISOString(),
  };
  // "Post again" puts the opening back at "0 days" ago, as on Keka.
  if (!isUuid(id) || form.get("repost") === "on") row.posted_at = new Date().toISOString();
  const db = supabaseAdmin().from("job_openings");
  const { data, error } = isUuid(id)
    ? await db.update(row).eq("id", id).select("id").single()
    : await db.insert(row).select("id").single();
  if (error || !data)
    redirect(`/admin/openings/${isUuid(id) ? id : "new"}/?error=${encodeURIComponent("Could not save.")}`);
  await audit(admin, isUuid(id) ? "update" : "create", "opening", data.id, { title: row.title, status: row.status });
  refresh(data.id);
  redirect(`/admin/openings/?saved=1`);
}

export async function setOpeningStatus(form: FormData) {
  const admin = await requireAdmin("openings");
  const id = String(form.get("id") ?? "");
  const status = form.get("status") === "open" ? "open" : "closed";
  if (isUuid(id)) {
    await supabaseAdmin().from("job_openings").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    await audit(admin, status === "open" ? "reopen" : "close", "opening", id);
    refresh(id);
  }
  redirect("/admin/openings/?saved=1");
}

/** Deletes an opening for good. Applications already received keep the role's title. */
export async function deleteOpening(form: FormData) {
  const admin = await requireAdmin("openings");
  const id = String(form.get("id") ?? "");
  if (isUuid(id)) {
    await supabaseAdmin().from("job_openings").delete().eq("id", id);
    await audit(admin, "delete", "opening", id);
    refresh(id);
  }
  redirect("/admin/openings/?saved=1");
}

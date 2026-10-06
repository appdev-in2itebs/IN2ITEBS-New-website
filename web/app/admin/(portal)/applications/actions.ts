"use server";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { audit, requireAdmin } from "@/lib/admin/session";
import { APPLICATION_STATUSES } from "@/lib/admin/permissions";
import { isUuid } from "@/lib/admin/query";
import { eraseApplication, erasedText } from "@/lib/admin/erase";

export async function updateApplication(form: FormData) {
  const admin = await requireAdmin("applications");
  const id = String(form.get("id") ?? "");
  if (!isUuid(id)) redirect("/admin/applications/");
  const status = String(form.get("status") ?? "");
  const update = {
    status: APPLICATION_STATUSES.includes(status as never) ? status : "new",
    notes:
      String(form.get("notes") ?? "")
        .trim()
        .slice(0, 5000) || null,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabaseAdmin().from("job_applications").update(update).eq("id", id);
  if (!error) await audit(admin, "update", "application", id, { status: update.status });
  redirect(`/admin/applications/${id}/?${error ? "error=1" : "saved=1"}`);
}

/** Deletes the application, its CV file and its chat for good (see lib/admin/erase.ts). */
export async function deleteApplication(form: FormData) {
  const admin = await requireAdmin("applications");
  const id = String(form.get("id") ?? "");
  if (!isUuid(id)) redirect("/admin/applications/");
  const erased = await eraseApplication(id);
  await audit(admin, "delete", "application", id, erased);
  redirect(`/admin/applications/?deleted=${encodeURIComponent(erasedText(erased))}`);
}

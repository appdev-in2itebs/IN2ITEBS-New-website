"use server";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { audit, requireAdmin } from "@/lib/admin/session";
import { LEAD_STATUSES } from "@/lib/admin/permissions";
import { isUuid } from "@/lib/admin/query";

export async function updateLead(form: FormData) {
  const admin = await requireAdmin("leads");
  const id = String(form.get("id") ?? "");
  if (!isUuid(id)) redirect("/admin/leads/");
  const status = String(form.get("status") ?? "");
  const update = {
    status: LEAD_STATUSES.includes(status as never) ? status : "new",
    assigned_to:
      String(form.get("assigned_to") ?? "")
        .trim()
        .slice(0, 120) || null,
    notes:
      String(form.get("notes") ?? "")
        .trim()
        .slice(0, 5000) || null,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabaseAdmin().from("leads").update(update).eq("id", id);
  if (!error) await audit(admin, "update", "lead", id, { status: update.status, assigned_to: update.assigned_to });
  redirect(`/admin/leads/${id}/?${error ? "error=1" : "saved=1"}`);
}

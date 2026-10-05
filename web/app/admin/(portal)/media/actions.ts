"use server";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { audit, requireAdmin } from "@/lib/admin/session";
import { isUuid } from "@/lib/admin/query";

export async function updateAlt(form: FormData) {
  const admin = await requireAdmin("media");
  const id = String(form.get("id") ?? "");
  const alt = String(form.get("alt") ?? "")
    .trim()
    .slice(0, 200);
  if (isUuid(id)) {
    await supabaseAdmin().from("media").update({ alt }).eq("id", id);
    await audit(admin, "update", "media", id, { alt });
  }
  redirect("/admin/media/?saved=alt");
}

/** Deletes an image, unless a page or the content still uses it (then says where). */
export async function deleteMedia(form: FormData) {
  const admin = await requireAdmin("media");
  const id = String(form.get("id") ?? "");
  if (!isUuid(id)) redirect("/admin/media/");
  const db = supabaseAdmin();
  const { data: item } = await db.from("media").select("id, path, url").eq("id", id).maybeSingle();
  if (!item) redirect("/admin/media/");
  const [{ data: entries }, { data: heroes }] = await Promise.all([
    db.from("cms_entries").select("collection, key, data"),
    db.from("page_heroes").select("path, image_key"),
  ]);
  const uses = [
    ...(entries ?? []).filter((e) => JSON.stringify(e.data).includes(item.url)).map((e) => `${e.collection} ${e.key}`),
    ...(heroes ?? []).filter((h) => h.image_key === item.url).map((h) => `hero ${h.path}`),
  ];
  if (uses.length)
    redirect(
      `/admin/media/?error=${encodeURIComponent(`Still used by: ${uses.slice(0, 5).join(", ")}. Choose another picture there first.`)}`,
    );
  await db.storage.from("media").remove([item.path]);
  await db.from("media").delete().eq("id", id);
  await audit(admin, "delete", "media", id, { path: item.path });
  redirect("/admin/media/?saved=deleted");
}

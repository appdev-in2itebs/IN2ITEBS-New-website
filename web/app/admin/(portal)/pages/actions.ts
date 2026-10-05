"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/session";
import { saveHeroEntry } from "@/lib/cms/save";
import { editablePaths } from "./paths";

/** Saves a page hero edit and refreshes that page, so it is live within seconds. */
export async function saveHero(form: FormData) {
  const admin = await requireAdmin("pages");
  const path = String(form.get("path") ?? "");
  if (!(await editablePaths()).includes(path)) redirect("/admin/pages/");
  const saved = await saveHeroEntry(admin, path, {
    title: form.get("title"),
    intro: form.get("intro"),
    picture: form.get("image_key"),
  });
  redirect(`/admin/pages/edit/?path=${encodeURIComponent(path)}&${saved.ok ? "saved=1" : "error=1"}`);
}

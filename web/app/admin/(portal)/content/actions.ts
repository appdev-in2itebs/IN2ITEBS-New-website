"use server";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin/session";
import { CONTENT_TYPES, isContentType, type ContentType } from "@/lib/cms/registry";
import { clearHeroPicture, recordContent, refreshContent, saveContentEntry } from "@/lib/cms/save";
import { insights } from "@/content/insights";
import { isUuid } from "@/lib/admin/query";

const refresh = refreshContent;
const record = recordContent;

const editorUrl = (type: ContentType, key: string, flag: string) =>
  CONTENT_TYPES[type].shape === "list"
    ? `/admin/content/${type}/?${flag}`
    : `/admin/content/${type}/${encodeURIComponent(key)}/?${flag}`;

function target(form: FormData) {
  const type = String(form.get("type") ?? "");
  const key = String(form.get("key") ?? "");
  if (!isContentType(type) || !key || key.length > 120) redirect("/admin/content/");
  return { type, key, collection: CONTENT_TYPES[type].collection };
}

export async function saveContent(form: FormData) {
  const admin = await requireAdmin("content");
  const { type, key } = target(form);
  let raw: unknown;
  try {
    raw = JSON.parse(String(form.get("data") ?? "{}"));
  } catch {
    redirect(editorUrl(type, key, "error=" + encodeURIComponent("The form could not be read. Please try again.")));
  }
  const saved = await saveContentEntry(admin, type, key, raw);
  if (!saved.ok) redirect(editorUrl(type, key, "error=" + encodeURIComponent(saved.error)));
  redirect(editorUrl(type, saved.key, "saved=1"));
}

/** Back to the text the website ships with: the edit is removed (and kept in the history). */
export async function resetContent(form: FormData) {
  const admin = await requireAdmin("content");
  const { type, key, collection } = target(form);
  await supabaseAdmin().from("cms_entries").delete().eq("collection", collection).eq("key", key);
  await record(admin, collection, key, "reset", null);
  refresh(type, key);
  redirect(
    type === "news" && !insights.some((a) => a.slug === key)
      ? "/admin/content/news/?saved=1"
      : editorUrl(type, key, "reset=1"),
  );
}

/** Removes an article from the site. One the site shipped with is hidden (and can be brought back). */
export async function deleteArticle(form: FormData) {
  const admin = await requireAdmin("content");
  const { key } = target(form);
  const db = supabaseAdmin().from("cms_entries");
  if (insights.some((a) => a.slug === key))
    await db.upsert({
      collection: "article",
      key,
      data: {},
      deleted: true,
      updated_at: new Date().toISOString(),
      updated_by: admin.email,
    });
  else await db.delete().eq("collection", "article").eq("key", key);
  await record(admin, "article", key, "delete", null);
  refresh("news", key);
  redirect("/admin/content/news/?saved=1");
}

/** Puts an earlier saved version back live. */
export async function restoreVersion(form: FormData) {
  const admin = await requireAdmin("content");
  const { type, key, collection } = target(form);
  const id = String(form.get("version") ?? "");
  if (!isUuid(id)) redirect(editorUrl(type, key, ""));
  const { data: v } = await supabaseAdmin()
    .from("cms_history")
    .select("collection, key, data")
    .eq("id", id)
    .maybeSingle();
  if (!v || v.collection !== collection || v.key !== key) redirect(editorUrl(type, key, ""));
  const db = supabaseAdmin().from("cms_entries");
  if (v.data === null) await db.delete().eq("collection", collection).eq("key", key);
  else
    await db.upsert({
      collection,
      key,
      data: v.data,
      deleted: false,
      updated_at: new Date().toISOString(),
      updated_by: admin.email,
    });
  await record(admin, collection, key, "restore", v.data);
  refresh(type, key);
  redirect(editorUrl(type, key, "restored=1"));
}

/** Removes the picture chosen in Page heroes for this page, so its own Hero picture shows again. */
export async function showOwnPicture(form: FormData) {
  const admin = await requireAdmin("content");
  const { type, key } = target(form);
  if (CONTENT_TYPES[type].shape !== "pages") redirect(editorUrl(type, key, ""));
  await clearHeroPicture(admin, `/${type}/${key}/`);
  redirect(editorUrl(type, key, "saved=1"));
}

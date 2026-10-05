import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { audit, type AdminUser } from "@/lib/admin/session";
import { insights } from "@/content/insights";
import { CONTENT_TYPES, pathsToRefresh, type ContentType } from "./registry";
import { toStored } from "./admin-content";
import { validPicture } from "./media";

/**
 * Saving website content, shared by the form editors (/admin/content) and the visual editor
 * (/admin/site). Each save is live at once: the pages it appears on are re-rendered on demand, and
 * every version is kept in cms_history. Server-only; callers check the admin's role first.
 */

export type Saved = { ok: true; key: string } | { ok: false; error: string };

/** Re-render the pages an edit appears on, so it is live within seconds. */
export function refreshContent(type: ContentType, key: string) {
  for (const { path, type: kind } of pathsToRefresh(type, key)) {
    revalidatePath(path, kind);
    if (path.length > 1 && path.endsWith("/")) revalidatePath(path.slice(0, -1), kind);
  }
}

export async function recordContent(admin: AdminUser, collection: string, key: string, action: string, data: unknown) {
  await supabaseAdmin().from("cms_history").insert({ collection, key, action, data, by_email: admin.email });
  await audit(admin, action, `content:${collection}`, key);
}

export async function saveContentEntry(admin: AdminUser, type: ContentType, key: string, raw: unknown): Promise<Saved> {
  const collection = CONTENT_TYPES[type].collection;
  const stored = toStored(type, key, raw);
  if ("error" in stored) return { ok: false, error: stored.error };
  if (type === "news" && key === "new") {
    const { data: clash } = await supabaseAdmin()
      .from("cms_entries")
      .select("key")
      .eq("collection", "article")
      .eq("key", stored.key)
      .maybeSingle();
    if (clash || insights.some((a) => a.slug === stored.key))
      return { ok: false, error: "An article with this title already exists. Change the title." };
  }
  const before = await supabaseAdmin()
    .from("cms_entries")
    .select("data")
    .eq("collection", collection)
    .eq("key", stored.key)
    .maybeSingle();
  const { error } = await supabaseAdmin().from("cms_entries").upsert({
    collection,
    key: stored.key,
    data: stored.data,
    deleted: false,
    updated_at: new Date().toISOString(),
    updated_by: admin.email,
  });
  if (error) return { ok: false, error: "Could not save. Please try again." };
  await recordContent(admin, collection, stored.key, "save", stored.data);
  // A page's picture can also be set in Page heroes, which takes priority on the page. The latest
  // choice wins: picking a different picture here clears the Page heroes one.
  const pagePath = PAGE_PATHS[type]?.(stored.key);
  const picked = (stored.data as Record<string, unknown>)?.heroImage;
  const was = (before.data?.data as Record<string, unknown> | undefined)?.heroImage;
  if (pagePath && picked !== was) await clearHeroPicture(admin, pagePath);
  refreshContent(type, stored.key);
  return { ok: true, key: stored.key };
}

const SITE_IMAGE = /^\/[\w\-./%]+\.(png|jpe?g|webp|avif|svg)$/i;

export type HeroValue = { title?: unknown; intro?: unknown; picture?: unknown };

/** A page hero's title, intro and picture; all three empty removes the edit (the page's own hero returns). */
export async function saveHeroEntry(admin: AdminUser, path: string, value: HeroValue): Promise<Saved> {
  const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const picture = text(value.picture, 500);
  const row = {
    path,
    title: text(value.title, 160) || null,
    intro: text(value.intro, 600) || null,
    image_key: picture && (validPicture(picture) || SITE_IMAGE.test(picture)) ? picture : null,
    updated_at: new Date().toISOString(),
    updated_by: admin.email,
  };
  const db = supabaseAdmin().from("page_heroes");
  const { error } = row.title || row.intro || row.image_key ? await db.upsert(row) : await db.delete().eq("path", path);
  if (error) return { ok: false, error: "Could not save the page hero. Please try again." };
  await audit(admin, "update", "page_hero", path, { title: row.title, image_key: row.image_key });
  revalidatePath(path);
  return { ok: true, key: path };
}

const PAGE_PATHS: Partial<Record<ContentType, (key: string) => string>> = {
  services: (k) => `/services/${k}/`,
  industries: (k) => `/industries/${k}/`,
  partners: (k) => `/partners/${k}/`,
};

/** Removes a Page heroes picture (keeping its title and intro), so the page's own picture shows. */
export async function clearHeroPicture(admin: AdminUser, path: string) {
  const db = supabaseAdmin().from("page_heroes");
  const { data } = await db.select("title, intro, image_key").eq("path", path).maybeSingle();
  if (!data?.image_key) return;
  if (data.title || data.intro)
    await supabaseAdmin()
      .from("page_heroes")
      .update({ image_key: null, updated_at: new Date().toISOString(), updated_by: admin.email })
      .eq("path", path);
  else await supabaseAdmin().from("page_heroes").delete().eq("path", path);
  await audit(admin, "clear-picture", "page_hero", path, { replaced: data.image_key });
  revalidatePath(path);
}

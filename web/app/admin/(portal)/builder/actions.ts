"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { audit, requireAdmin, type AdminUser } from "@/lib/admin/session";
import { pictureOk } from "@/lib/cms/admin-content";
import { isUuid } from "@/lib/admin/query";
import {
  HOME_KEY,
  blockProblem,
  newBlock,
  sanitizeBlocks,
  slugProblem,
  slugify,
  type BuiltPage,
  type PageDoc,
} from "@/lib/builder/blocks";
import { PAGE_COLLECTION, getPageRow, listPages, redirectedPaths } from "@/lib/builder/store";
import { takenPaths } from "../pages/paths";
import { pictureOptions } from "@/lib/cms/picture-options";
import type { PictureOption } from "@/components/admin/content-form";

/**
 * The page builder's saves. Save keeps a draft only; Publish copies the draft to the live copy that
 * visitors see; Unpublish removes the live copy. Every save is kept in cms_history.
 */

export type SaveResult = { ok: true; savedAt: string; live: boolean } | { ok: false; error: string };

const isKey = (key: string) => key === HOME_KEY || isUuid(key);

async function record(admin: AdminUser, key: string, action: string, data: unknown) {
  await supabaseAdmin()
    .from("cms_history")
    .insert({ collection: PAGE_COLLECTION, key, action, data, by_email: admin.email });
  await audit(admin, action, "builder", key);
}

async function write(admin: AdminUser, key: string, data: BuiltPage) {
  return supabaseAdmin().from("cms_entries").upsert({
    collection: PAGE_COLLECTION,
    key,
    data,
    deleted: false,
    updated_at: new Date().toISOString(),
    updated_by: admin.email,
  });
}

/** Re-render what a publish changed: the homepage is cached; builder pages render per request. */
function refresh(key: string) {
  if (key === HOME_KEY) revalidatePath("/");
  revalidatePath("/sitemap.xml");
}

/** An address no other page (on the site, or in the builder) already uses. */
async function addressProblem(slug: string, key: string, ownLive?: string): Promise<string | null> {
  const taken = await takenPaths();
  if (ownLive) taken.delete(`/${ownLive}/`);
  for (const p of redirectedPaths()) taken.add(p);
  const problem = slugProblem(slug, taken);
  if (problem) return problem;
  const clash = (await listPages()).find(
    (r) => r.key !== key && (r.data.draft.slug === slug || r.data.live?.slug === slug),
  );
  return clash ? `Another builder page ("${clash.data.draft.title}") already uses /${slug}/.` : null;
}

/** The posted page, cleaned: known blocks and fields only, and an address that is free. */
async function clean(key: string, input: unknown, current: BuiltPage | null): Promise<PageDoc | string> {
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const home = key === HOME_KEY;
  const blocks = sanitizeBlocks(raw.blocks, pictureOk, home);
  const title = typeof raw.title === "string" ? raw.title.trim().slice(0, 120) : "";
  const description = typeof raw.description === "string" ? raw.description.trim().slice(0, 200) : "";
  if (home) return { title: "Homepage", slug: "", blocks };
  if (!title) return "Give the page a title (Page settings).";
  const slug = slugify(typeof raw.slug === "string" ? raw.slug : "");
  const problem = await addressProblem(slug, key, current?.live?.slug);
  if (problem) return problem;
  return { title, slug, description, blocks };
}

export async function savePage(key: string, input: unknown): Promise<SaveResult> {
  const admin = await requireAdmin("builder");
  if (!isKey(key)) return { ok: false, error: "Unknown page." };
  const current = (await getPageRow(key))?.data ?? null;
  const draft = await clean(key, input, current);
  if (typeof draft === "string") return { ok: false, error: draft };
  const data: BuiltPage = { draft, live: current?.live ?? null, publishedAt: current?.publishedAt ?? null };
  const { error } = await write(admin, key, data);
  if (error) return { ok: false, error: "Could not save. Please try again." };
  await record(admin, key, "save", data);
  return { ok: true, savedAt: new Date().toISOString(), live: Boolean(data.live) };
}

export async function publishPage(key: string, input: unknown): Promise<SaveResult> {
  const admin = await requireAdmin("builder");
  if (!isKey(key)) return { ok: false, error: "Unknown page." };
  const current = (await getPageRow(key))?.data ?? null;
  const draft = await clean(key, input, current);
  if (typeof draft === "string") return { ok: false, error: draft };
  const missing = blockProblem(draft.blocks);
  if (missing) return { ok: false, error: missing };
  if (!draft.blocks.length) return { ok: false, error: "Add at least one block before publishing." };
  const publishedAt = new Date().toISOString();
  const data: BuiltPage = { draft, live: draft, publishedAt };
  const { error } = await write(admin, key, data);
  if (error) return { ok: false, error: "Could not publish. Please try again." };
  await record(admin, key, "publish", data);
  refresh(key);
  return { ok: true, savedAt: publishedAt, live: true };
}

/** Takes the page off the website; the draft stays in the builder. The homepage goes back to its shipped layout. */
export async function unpublishPage(key: string): Promise<SaveResult> {
  const admin = await requireAdmin("builder");
  const row = isKey(key) ? await getPageRow(key) : null;
  if (!row) return { ok: false, error: "Unknown page." };
  const data: BuiltPage = { ...row.data, live: null, publishedAt: null };
  const { error } = await write(admin, key, data);
  if (error) return { ok: false, error: "Could not unpublish. Please try again." };
  await record(admin, key, "unpublish", data);
  refresh(key);
  return { ok: true, savedAt: new Date().toISOString(), live: false };
}

/** An earlier saved version's page, to load into the editor (it is saved only when the editor saves). */
export async function loadVersion(key: string, id: string): Promise<PageDoc | null> {
  await requireAdmin("builder");
  if (!isKey(key) || !isUuid(id)) return null;
  const { data } = await supabaseAdmin().from("cms_history").select("collection, key, data").eq("id", id).maybeSingle();
  if (!data || data.collection !== PAGE_COLLECTION || data.key !== key) return null;
  return (data.data as BuiltPage | null)?.draft ?? null;
}

// ------------------------------------------------------------------ forms on the list page

export async function createPage(form: FormData) {
  const admin = await requireAdmin("builder");
  const title = String(form.get("title") ?? "")
    .trim()
    .slice(0, 120);
  const slug = slugify(String(form.get("slug") ?? "") || title);
  const template = String(form.get("template") ?? "landing");
  if (!title) redirect("/admin/builder/?error=" + encodeURIComponent("Give the page a title."));
  const key = randomUUID();
  const problem = await addressProblem(slug, key);
  if (problem) redirect("/admin/builder/?error=" + encodeURIComponent(problem));
  const hero = newBlock("hero");
  hero.props.title = title;
  const blocks =
    template === "blank"
      ? [hero]
      : template === "service"
        ? [hero, newBlock("text"), newBlock("cards"), newBlock("stats"), newBlock("faq"), newBlock("cta")]
        : [hero, newBlock("imageText"), newBlock("cards"), newBlock("quote"), newBlock("contact")];
  const data: BuiltPage = { draft: { title, slug, description: "", blocks }, live: null, publishedAt: null };
  const { error } = await write(admin, key, data);
  if (error) redirect("/admin/builder/?error=" + encodeURIComponent("Could not create the page. Please try again."));
  await record(admin, key, "create", data);
  redirect(`/admin/builder/${key}/`);
}

export async function duplicatePage(form: FormData) {
  const admin = await requireAdmin("builder");
  const row = await getPageRow(String(form.get("key") ?? ""));
  if (!row || row.key === HOME_KEY) redirect("/admin/builder/");
  const key = randomUUID();
  const taken = new Set((await listPages()).flatMap((r) => [r.data.draft.slug, r.data.live?.slug]));
  let slug = `${row.data.draft.slug}-copy`;
  for (let n = 2; taken.has(slug); n++) slug = `${row.data.draft.slug}-copy-${n}`;
  const data: BuiltPage = {
    draft: { ...row.data.draft, title: `${row.data.draft.title} (copy)`, slug },
    live: null,
    publishedAt: null,
  };
  await write(admin, key, data);
  await record(admin, key, "create", data);
  redirect(`/admin/builder/${key}/`);
}

export async function deletePage(form: FormData) {
  const admin = await requireAdmin("builder");
  const key = String(form.get("key") ?? "");
  if (!isUuid(key)) redirect("/admin/builder/");
  await supabaseAdmin().from("cms_entries").delete().eq("collection", PAGE_COLLECTION).eq("key", key);
  await record(admin, key, "delete", null);
  refresh(key);
  redirect("/admin/builder/?deleted=1");
}

/** The picture choices again, after an upload in the media library. */
export async function refreshPictures(): Promise<PictureOption[]> {
  await requireAdmin("builder");
  return pictureOptions();
}

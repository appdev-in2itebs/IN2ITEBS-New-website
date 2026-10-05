import { cache } from "react";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";
import { redirects } from "@/content/redirects.mjs";
import { HOME_KEY, type Block, type BuiltPage, type PageDoc } from "./blocks";

/**
 * Pages made in the admin's page builder, stored as cms_entries rows in the "page" collection: the
 * row key is a stable id, the data holds the draft the admin edits and the live copy visitors see.
 * The homepage layout is the row with key "home".
 */
export const PAGE_COLLECTION = "page";

export type PageRow = { key: string; data: BuiltPage; updated_at: string; updated_by: string | null };

function asBuilt(data: unknown): BuiltPage | null {
  const d = data as BuiltPage | null;
  return d && typeof d === "object" && d.draft && Array.isArray(d.draft.blocks) ? d : null;
}

/** The live copy of the published page at /<slug>/, or null. One query per render. */
export const getLivePage = cache(async (slug: string): Promise<PageDoc | null> => {
  if (!supabaseConfigured()) return null;
  const { data, error } = await supabaseAdmin()
    .from("cms_entries")
    .select("key, data")
    .eq("collection", PAGE_COLLECTION)
    .eq("data->live->>slug", slug)
    .eq("deleted", false)
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`builder page: ${error.message}`);
  if (!data || data.key === HOME_KEY) return null;
  return asBuilt(data.data)?.live ?? null;
});

/** The homepage layout as published, or null when it was never changed (the shipped order). */
export const getLiveHome = cache(async (): Promise<Block[] | null> => {
  if (!supabaseConfigured()) return null;
  const { data, error } = await supabaseAdmin()
    .from("cms_entries")
    .select("data")
    .eq("collection", PAGE_COLLECTION)
    .eq("key", HOME_KEY)
    .maybeSingle();
  if (error) throw new Error(`home layout: ${error.message}`);
  return asBuilt(data?.data)?.live?.blocks ?? null;
});

/** Every builder page (not the homepage), newest edit first, for the admin list. */
export async function listPages(): Promise<PageRow[]> {
  if (!supabaseConfigured()) return [];
  const { data } = await supabaseAdmin()
    .from("cms_entries")
    .select("key, data, updated_at, updated_by")
    .eq("collection", PAGE_COLLECTION)
    .neq("key", HOME_KEY)
    .eq("deleted", false)
    .order("updated_at", { ascending: false });
  return (data ?? []).flatMap((r) => {
    const built = asBuilt(r.data);
    return built ? [{ ...r, data: built }] : [];
  });
}

export async function getPageRow(key: string): Promise<PageRow | null> {
  if (!supabaseConfigured()) return null;
  const { data } = await supabaseAdmin()
    .from("cms_entries")
    .select("key, data, updated_at, updated_by")
    .eq("collection", PAGE_COLLECTION)
    .eq("key", key)
    .eq("deleted", false)
    .maybeSingle();
  const built = asBuilt(data?.data);
  return data && built ? { ...data, data: built } : null;
}

/** Published builder pages, for the sitemap. */
export async function livePagePaths(): Promise<string[]> {
  if (!supabaseConfigured()) return [];
  const { data, error } = await supabaseAdmin()
    .from("cms_entries")
    .select("key, data")
    .eq("collection", PAGE_COLLECTION)
    .neq("key", HOME_KEY)
    .eq("deleted", false);
  if (error) throw new Error(`builder pages: ${error.message}`);
  return (data ?? []).flatMap((r) => {
    const live = asBuilt(r.data)?.live;
    return live?.slug ? [`/${live.slug}/`] : [];
  });
}

/** Old addresses that redirect elsewhere: a builder page there would never be reached. */
export const redirectedPaths = () =>
  new Set(redirects.map((r: { source: string }) => (r.source.endsWith("/") ? r.source : `${r.source}/`)));

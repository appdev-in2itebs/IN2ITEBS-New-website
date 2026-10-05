import heroImages from "@/content/hero-images.json";
import { servicePages } from "@/content/legacy-services";
import { legacyIndustries } from "@/content/legacy-industries";
import { partnerPages } from "@/content/partner-pages";
import { insights } from "@/content/insights";
import { leadership } from "@/content/leadership";
import { testimonials } from "@/content/testimonials";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";
import { listMedia } from "./media";
import type { PictureOption } from "./picture-groups";

/**
 * Every picture an editor can choose, in four groups: pictures used before on the item being edited
 * (so a replaced picture can always be put back), uploads (newest first), the website's own images
 * (every picture the site ships with) and the hero image library.
 */
export async function pictureOptions(): Promise<PictureOption[]> {
  const media = await listMedia();
  return [
    ...media.map((m) => ({
      value: m.url,
      label: m.alt || m.url.split("/").pop() || "image",
      src: m.url,
      group: "upload" as const,
    })),
    ...siteImages(),
    ...Object.entries(heroImages)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, img]) => ({
        value: key,
        label: `${key} — ${img.alt.slice(0, 50)}`,
        src: img.src,
        group: "library" as const,
      })),
  ];
}

const IMAGE = /^\/[\w\-./%]+\.(png|jpe?g|webp|avif|svg)$/i;

/** The pictures shipped in web/content: page photos, partner logos, article covers, portraits. */
export function siteImages(): PictureOption[] {
  const seen = new Map<string, PictureOption>();
  const add = (src: string, where: string) => {
    if (!IMAGE.test(src) || seen.has(src)) return;
    seen.set(src, { value: src, label: `${where} — ${src.split("/").pop()}`, src, group: "site" });
  };
  // Small section icons are left out: they are not pictures anyone would reuse.
  const walk = (v: unknown, where: string, key = "") => {
    if (typeof v === "string") {
      if (!/^icon/i.test(key)) add(v, where);
    } else if (Array.isArray(v)) v.forEach((x) => walk(x, where, key));
    else if (v && typeof v === "object")
      for (const [k, x] of Object.entries(v)) if (!/^icon/i.test(k)) walk(x, where, k);
  };
  for (const p of servicePages) walk(p, p.name);
  for (const p of legacyIndustries) walk(p, p.name);
  for (const p of partnerPages) walk(p, p.name);
  for (const a of insights) walk(a, a.title.slice(0, 40));
  for (const l of leadership) walk(l, l.name);
  for (const t of testimonials) walk(t, t.name);
  return [...seen.values()].sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Pictures this item showed before: every earlier saved value of its picture fields, newest first,
 * and its original picture. For a page hero, the pictures it was set to (from the audit log).
 */
export async function recentPictures(opts: {
  collection?: string;
  key?: string;
  fields?: string[];
  heroPath?: string;
  original?: string | null;
}): Promise<PictureOption[]> {
  const values: string[] = [];
  if (supabaseConfigured()) {
    const db = supabaseAdmin();
    if (opts.collection && opts.key) {
      const { data } = await db
        .from("cms_history")
        .select("data")
        .eq("collection", opts.collection)
        .eq("key", opts.key)
        .order("at", { ascending: false })
        .limit(50);
      for (const row of data ?? [])
        for (const f of opts.fields ?? ["heroImage", "image"]) {
          const v = (row.data as Record<string, unknown> | null)?.[f];
          if (typeof v === "string" && v) values.push(v);
        }
    }
    if (opts.heroPath) {
      const { data } = await db
        .from("admin_audit")
        .select("detail")
        .eq("entity", "page_hero")
        .eq("entity_id", opts.heroPath)
        .order("at", { ascending: false })
        .limit(50);
      for (const row of data ?? []) {
        const v = (row.detail as Record<string, unknown> | null)?.image_key;
        if (typeof v === "string" && v) values.push(v);
      }
    }
  }
  // Uploads are named by their alt text in the media library, not their generated file name.
  const uploads = values.filter((v) => v.startsWith("https://"));
  const names = new Map<string, string>();
  if (uploads.length && supabaseConfigured()) {
    const { data } = await supabaseAdmin().from("media").select("url, alt").in("url", uploads);
    for (const m of data ?? []) if (m.alt) names.set(m.url, `uploaded image "${m.alt}"`);
  }
  const out: PictureOption[] = [];
  if (opts.original) out.push(option(opts.original, "Original picture of this page"));
  for (const v of values)
    if (!out.some((o) => o.value === v)) out.push(option(v, "Used before on this page", names.get(v)));
  return out;
}

function option(value: string, prefix: string, name?: string): PictureOption {
  const lib = (heroImages as Record<string, { src: string; alt: string }>)[value];
  const src = lib?.src ?? value;
  return {
    value,
    label: `${prefix}: ${name ?? (lib ? value : decodeURIComponent(value.split("/").pop() ?? value))}`,
    src,
    group: "recent",
  };
}

/** The picture a service, industry or partner page shows when no picture has been chosen for it. */
export function originalPicture(type: string, key: string): string | null {
  const has = (k: string) => k in heroImages;
  if (type === "services") {
    const p = servicePages.find((x) => x.slug === key);
    if (!p) return null;
    if (has(`services/${key}`)) return `services/${key}`;
    if (p.heroObject && has(p.heroObject)) return p.heroObject;
    return p.image?.src ?? null;
  }
  if (type === "industries") return has(`industries/${key}`) ? `industries/${key}` : null;
  if (type === "partners") {
    if (has(`partners/${key}`)) return `partners/${key}`;
    return partnerPages.find((x) => x.slug === key)?.logo ?? null;
  }
  return null;
}

import { supabaseAdmin } from "@/lib/supabase";
import { servicePages } from "@/content/legacy-services";
import { legacyIndustries } from "@/content/legacy-industries";
import { partnerPages } from "@/content/partner-pages";
import { insights } from "@/content/insights";
import { getCms, type Article } from "./content";
import { CONTENT_TYPES, missingRequired, sanitize, type ContentType } from "./registry";
import { validPicture } from "./media";
import type { Office } from "@/content/types";

/**
 * The admin side of website content: what each editor lists, the form value for one item (what is
 * live now), and turning a submitted form back into what cms_entries stores. Server-only.
 */

export type ListItem = { key: string; label: string; edited: boolean; hidden?: boolean; added?: boolean };

/** A picture the editor may keep or choose: library key, upload, a path on this site, or a bare file name. */
export const pictureOk = (v: string) =>
  validPicture(v) || /^\/[\w\-./]+$/.test(v) || /^[\w\-.]+\.(jpe?g|png|webp|svg)$/i.test(v);

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

export async function listItems(type: ContentType): Promise<ListItem[]> {
  const cms = await getCms();
  const { data: rows } = await supabaseAdmin().from("cms_entries").select("collection, key, deleted");
  const collection = CONTENT_TYPES[type].collection;
  const mine = new Map((rows ?? []).filter((r) => r.collection === collection).map((r) => [r.key, r]));
  if (type === "services") return servicePages.map((p) => ({ key: p.slug, label: p.name, edited: mine.has(p.slug) }));
  if (type === "industries")
    return legacyIndustries.map((p) => ({ key: p.slug, label: p.name, edited: mine.has(p.slug) }));
  if (type === "partners") return partnerPages.map((p) => ({ key: p.slug, label: p.name, edited: mine.has(p.slug) }));
  if (type === "news") {
    const shipped = new Set(insights.map((a) => a.slug));
    const live = cms.articles.map((a) => ({
      key: a.slug,
      label: a.title,
      edited: mine.has(a.slug),
      added: !shipped.has(a.slug),
    }));
    const hidden = insights
      .filter((a) => mine.get(a.slug)?.deleted)
      .map((a) => ({ key: a.slug, label: a.title, edited: true, hidden: true }));
    return [...live, ...hidden];
  }
  return [];
}

/** The form value for one item: what visitors see now (shipped text with any edit laid over). */
export async function formValue(type: ContentType, key: string): Promise<Record<string, unknown> | null> {
  const cms = await getCms();
  const pick = (item: object | undefined) => {
    if (!item) return null;
    const keys = CONTENT_TYPES[type].fields.map((f) => f.key);
    return Object.fromEntries(Object.entries(item).filter(([k]) => keys.includes(k)));
  };
  if (type === "services") return pick(cms.services.find((p) => p.slug === key));
  if (type === "industries") return pick(cms.industries.find((p) => p.slug === key));
  if (type === "partners") return pick(cms.partners.find((p) => p.slug === key));
  if (type === "news") {
    if (key === "new")
      return { title: "", category: "", date: new Date().toISOString().slice(0, 10), excerpt: "", blocks: [] };
    let a: Article | undefined = cms.articles.find((x) => x.slug === key);
    if (!a) {
      // A hidden article: show what it was, so it can be restored.
      const { data } = await supabaseAdmin()
        .from("cms_entries")
        .select("data")
        .eq("collection", "article")
        .eq("key", key)
        .maybeSingle();
      a = (data?.data as Article) ?? insights.find((x) => x.slug === key);
    }
    if (!a) return null;
    return { ...a, author: a.body?.author, authorRole: a.body?.authorRole, blocks: a.body?.blocks ?? [] };
  }
  if (type === "leadership") return { items: cms.leadership };
  if (type === "testimonials") return { items: cms.testimonials };
  if (type === "homeHero")
    return {
      items: cms.homeHero.map(({ cta, secondary, ...s }) => ({
        ...s,
        ctaLabel: cta.label,
        ctaHref: cta.href,
        secondaryLabel: secondary.label,
        secondaryHref: secondary.href,
      })),
    };
  if (type === "offices")
    return { items: cms.offices.map((o) => ({ ...o, mapPosition: o.coords ? o.coords.join(", ") : "" })) };
  return null;
}

/** Turns a submitted form into the stored value; returns an error message for the editor when invalid. */
export function toStored(
  type: ContentType,
  key: string,
  raw: unknown,
): { data: unknown; key: string } | { error: string } {
  const def = CONTENT_TYPES[type];
  const fields = type === "offices" ? officeFields() : def.fields;
  const clean = sanitize(fields, raw, pictureOk);
  const missing = missingRequired(fields, clean);
  if (missing) return { error: missing };

  if (def.shape === "pages") return { data: clean, key };

  if (type === "news") {
    const slug = key === "new" ? slugify(String(clean.title ?? "")) : key;
    if (!slug) return { error: "The title must contain letters or numbers." };
    if (clean.date && !/^\d{4}-\d{2}-\d{2}$/.test(String(clean.date)))
      return { error: "Date must look like 2026-10-05." };
    const { author, authorRole, blocks, ...meta } = clean as Record<string, unknown> & { blocks?: unknown[] };
    const article = {
      slug,
      title: meta.title,
      category: meta.category,
      date: meta.date ?? "",
      excerpt: meta.excerpt,
      image: meta.image,
      body: { author, authorRole, blocks: blocks ?? [] },
    };
    return { data: article, key: slug };
  }

  const items = (clean.items as Record<string, unknown>[]) ?? [];
  if (type === "leadership")
    return {
      key: "list",
      data: items.map((l) => ({ ...l, slug: l.slug || slugify(String(l.name)), photo: l.photo ?? null })),
    };
  if (type === "testimonials")
    return {
      key: "list",
      data: items.map((t) => ({
        ...t,
        slug: t.slug || slugify(String(t.name)),
        photo: t.photo ?? "",
        clientSlug: t.clientSlug ?? "",
      })),
    };
  if (type === "homeHero")
    return {
      key: "list",
      data: items.map((s, i) => ({
        id: String(s.id || `slide-${i + 1}-${slugify(String(s.label))}`),
        frames: /^slide-[1-5]$/.test(String(s.frames)) ? s.frames : `slide-${(i % 5) + 1}`,
        label: s.label,
        heading: Array.isArray(s.heading) && s.heading.length ? s.heading : [String(s.label)],
        body: s.body,
        cta: { label: s.ctaLabel, href: s.ctaHref },
        secondary: { label: s.secondaryLabel, href: s.secondaryHref },
      })),
    };
  if (type === "offices") {
    const out: Office[] = [];
    for (const [i, o] of items.entries()) {
      const [lat, lng] = String(o.mapPosition ?? "")
        .split(",")
        .map((n) => Number(n.trim()));
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180)
        return { error: `office ${i + 1}: Map position must be "latitude, longitude", e.g. 12.97, 77.59.` };
      const { mapPosition, ...rest } = o;
      void mapPosition;
      out.push({
        ...(rest as unknown as Office),
        slug: String(o.slug || slugify(String(o.name))),
        kind: (Array.isArray(o.kind) ? o.kind : ["india-office"]) as Office["kind"],
        coords: [lat, lng],
      });
    }
    return { key: "list", data: out };
  }
  return { error: "Unknown content type." };
}

/** Offices are edited with a "latitude, longitude" box instead of the stored coordinate pair. */
export function officeFields() {
  const list = CONTENT_TYPES.offices.fields[0];
  if (list.kind !== "list") return CONTENT_TYPES.offices.fields;
  return [
    {
      ...list,
      fields: [
        ...list.fields,
        {
          key: "mapPosition",
          label: "Map position (latitude, longitude)",
          kind: "text" as const,
          max: 60,
          required: true,
          hint: "e.g. 12.97, 77.59 (right-click the place in Google Maps to copy it)",
        },
      ],
    },
  ];
}

export async function history(collection: string, key: string) {
  const { data } = await supabaseAdmin()
    .from("cms_history")
    .select("id, action, at, by_email")
    .eq("collection", collection)
    .eq("key", key)
    .order("at", { ascending: false })
    .limit(15);
  return data ?? [];
}

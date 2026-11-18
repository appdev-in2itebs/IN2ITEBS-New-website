import { cache } from "react";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";
import { readOrFallBack } from "@/lib/cms/outage";
import { servicePages, type ServicePage, type ServiceSection } from "@/content/legacy-services";
import { legacyIndustries, type LegacyIndustry, type IndustrySection } from "@/content/legacy-industries";
import { partnerPages, type PartnerPage } from "@/content/partner-pages";
import { insights } from "@/content/insights";
import { insightBodies, type InsightBlock } from "@/content/insight-bodies";
import { leadership } from "@/content/leadership";
import { offices } from "@/content/offices";
import { testimonials } from "@/content/testimonials";
import { homeHeroSlides, type HeroSlide } from "@/content/home-hero";
import { blockedInsightSlugs, blockedOfficeSlugs, clientTestimonialsApproved } from "@/content/compliance";
import type { Insight, Leader, Office, Testimonial } from "@/content/types";

/**
 * The website's content as visitors see it: the text shipped in web/content/*.ts, with every edit
 * saved in /admin (Supabase table cms_entries) laid over it. Pages call getCms() while they render;
 * React's cache() makes that one database round trip per page render, however many components ask.
 *
 * Failure policy. Without Supabase credentials (a laptop, CI) the shipped text is used. With them,
 * the two failure cases are deliberately different — see the note above `getCms()` at the foot of
 * this file before changing either.
 */

export type ArticleBody = { author?: string; authorRole?: string; authorDate?: string; blocks: InsightBlock[] };
export type Article = Insight & { body?: ArticleBody };
export type HeroEdit = { title?: string; intro?: string; imageKey?: string };

/** The fields of a service, industry or partner page an editor may change. Slug and menu name stay. */
export type ServiceEdit = Partial<
  Pick<
    ServicePage,
    "title" | "intro" | "introHeading" | "sections" | "sectionsHeading" | "closing" | "metaTitle" | "metaDescription"
  >
> & { heroImage?: string };
export type IndustryEdit = Partial<
  Pick<LegacyIndustry, "title" | "intro" | "sections" | "sectionsHeading" | "metaDescription">
> & {
  heroImage?: string;
};
export type PartnerEdit = Partial<Pick<PartnerPage, "title" | "intro" | "sections" | "metaDescription" | "logo">> & {
  heroImage?: string;
};

export type Cms = {
  services: (ServicePage & { heroImage?: string })[];
  industries: (LegacyIndustry & { heroImage?: string })[];
  partners: (PartnerPage & { heroImage?: string })[];
  articles: Article[];
  leadership: Leader[];
  offices: Office[];
  testimonials: Testimonial[];
  homeHero: HeroSlide[];
  heroes: Record<string, HeroEdit>;
  /** Which items carry an edit, for the admin's "edited" badges. */
  edited: Set<string>;
};

type Row = { collection: string; key: string; data: unknown; deleted: boolean };

const shipped = (): Cms => ({
  services: servicePages,
  industries: legacyIndustries,
  partners: partnerPages,
  articles: insights
    .filter((i) => !blockedInsightSlugs.has(i.slug))
    .map((i) => ({ ...i, body: insightBodies[i.slug] })),
  leadership,
  offices: offices.filter((office) => !blockedOfficeSlugs.has(office.slug)),
  testimonials: clientTestimonialsApproved ? testimonials : [],
  homeHero: homeHeroSlides,
  heroes: {},
  edited: new Set(),
});

/** Lays the edited fields over the shipped item; only keys the editor actually set are replaced. */
function overlay<T extends object>(base: T, edit: unknown): T {
  if (!edit || typeof edit !== "object") return base;
  const clean = Object.fromEntries(Object.entries(edit).filter(([, v]) => v !== undefined && v !== null));
  return { ...base, ...clean } as T;
}

export function applyEdits(rows: Row[], heroes: Record<string, HeroEdit> = {}): Cms {
  const base = shipped();
  const by = (collection: string) => new Map(rows.filter((r) => r.collection === collection).map((r) => [r.key, r]));
  const services = by("service");
  const industries = by("industry");
  const partners = by("partner");
  const articles = by("article");
  const edited = new Set(rows.map((r) => `${r.collection}/${r.key}`));

  // Articles: shipped ones can be edited or hidden; new ones (not shipped) come first, newest first.
  const shippedSlugs = new Set(base.articles.map((a) => a.slug));
  const added = [...articles.values()]
    .filter((r) => !shippedSlugs.has(r.key) && !r.deleted)
    .map((r) => r.data as Article)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const kept = base.articles
    .filter((a) => !articles.get(a.slug)?.deleted)
    .map((a) => (articles.has(a.slug) ? overlay(a, articles.get(a.slug)!.data) : a));

  const list = <T>(collection: string, fallback: T[]): T[] => {
    const data = by(collection).get("list")?.data;
    return Array.isArray(data) ? (data as T[]) : fallback;
  };

  const result: Cms = {
    services: base.services.map((p) => overlay(p, services.get(p.slug)?.data)),
    industries: base.industries.map((p) => overlay(p, industries.get(p.slug)?.data)),
    partners: base.partners.map((p) => overlay(p, partners.get(p.slug)?.data)),
    articles: [...added, ...kept].filter((article) => !blockedInsightSlugs.has(article.slug)),
    leadership: list("leadership", base.leadership),
    offices: list<Office>("offices", base.offices).filter((office) => !blockedOfficeSlugs.has(office.slug)),
    testimonials: clientTestimonialsApproved ? list("testimonials", base.testimonials) : [],
    homeHero: list("home-hero", base.homeHero),
    heroes,
    edited,
  };
  return result;
}

/** Failure policy — build versus request — is in lib/cms/outage.ts. Read it before changing this. */
export const getCms = cache(async (): Promise<Cms> => {
  if (!supabaseConfigured()) return shipped();
  return readOrFallBack(
    "cms_entries + page_heroes",
    async () => {
      const db = supabaseAdmin();
      const [entries, heroes] = await Promise.all([
        // Builder pages are read on their own (lib/builder/store.ts), not with every page render.
        db.from("cms_entries").select("collection, key, data, deleted").neq("collection", "page"),
        db.from("page_heroes").select("path, title, intro, image_key"),
      ]);
      if (entries.error) throw new Error(`cms_entries: ${entries.error.message}`);
      if (heroes.error) throw new Error(`page_heroes: ${heroes.error.message}`);
      const heroMap: Record<string, HeroEdit> = {};
      for (const h of heroes.data ?? []) {
        const edit: HeroEdit = {};
        if (h.title) edit.title = h.title;
        if (h.intro) edit.intro = h.intro;
        if (h.image_key) edit.imageKey = h.image_key;
        if (Object.keys(edit).length) heroMap[h.path] = edit;
      }
      return applyEdits(entries.data ?? [], heroMap);
    },
    shipped(),
  );
});

export async function getService(slug: string) {
  return (await getCms()).services.find((p) => p.slug === slug);
}
export async function getIndustry(slug: string) {
  return (await getCms()).industries.find((p) => p.slug === slug);
}
export async function getPartner(slug: string) {
  return (await getCms()).partners.find((p) => p.slug === slug);
}
export async function getArticle(slug: string) {
  return (await getCms()).articles.find((a) => a.slug === slug && !a.href);
}

export type { ServiceSection, IndustrySection };

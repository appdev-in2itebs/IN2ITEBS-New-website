"use server";

import { requireAdmin } from "@/lib/admin/session";
import { can } from "@/lib/admin/permissions";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";
import { getCms } from "@/lib/cms/content";
import { formValue, officeFields } from "@/lib/cms/admin-content";
import { CONTENT_TYPES, isContentType, type Field } from "@/lib/cms/registry";
import { saveContentEntry, saveHeroEntry, type Saved } from "@/lib/cms/save";
import { HOME_KEY } from "@/lib/builder/blocks";
import { listPages } from "@/lib/builder/store";
import { editablePaths } from "@/app/admin/(portal)/pages/paths";
import { originalPicture, recentPictures } from "@/lib/cms/picture-options";
import type { PictureOption } from "@/lib/cms/picture-groups";

/**
 * The visual editor's server side: which editable things a page of the website shows (its own
 * content, its hero, the leaders on the homepage, ...) with their fields and current values, and
 * saving one of them. Saves go through the same code as the form editors, so they are live at once.
 */

export type Target =
  | {
      id: string;
      kind: "content" | "hero";
      label: string;
      /** Content type (registry key) for "content"; the page path for "hero". */
      type: string;
      key: string;
      fields: Field[];
      value: Record<string, unknown>;
      /** What the page shows for a field left empty (a page headline falls back to the menu name). */
      fallbacks?: Record<string, string>;
      editorHref?: string;
      /** Pictures this item showed before (and its original), offered first in its picture fields. */
      recent?: PictureOption[];
    }
  | { id: string; kind: "link"; label: string; text: string; href: string; action: string };

const HERO_FIELDS: Field[] = [
  { key: "title", label: "Headline", kind: "text", max: 160, hint: "Empty keeps the page's own headline." },
  { key: "intro", label: "Introduction", kind: "textarea", max: 600, rows: 3 },
  { key: "picture", label: "Picture", kind: "picture" },
];

const SECTION_OF: Record<string, "services" | "industries" | "partners" | "news"> = {
  services: "services",
  industries: "industries",
  partners: "partners",
  insights: "news",
};

/** Everything editable on the page at `path`, most specific first. */
export async function pageTargets(rawPath: string): Promise<Target[]> {
  const admin = await requireAdmin("site");
  const path = normalise(rawPath);
  if (!path) return [];
  const cms = await getCms();
  const out: Target[] = [];
  const contentOk = can(admin.role, "content");

  // The page's own content: a service, industry, partner page or an article.
  const m = path.match(/^\/([a-z-]+)\/([^/]+)\/$/);
  const type = m ? SECTION_OF[m[1]] : undefined;
  if (contentOk && m && type) {
    const key = decodeURIComponent(m[2]);
    const value = await formValue(type, key);
    if (value) {
      const shipped =
        type === "services"
          ? cms.services.find((p) => p.slug === key)?.name
          : type === "industries"
            ? cms.industries.find((p) => p.slug === key)?.name
            : type === "partners"
              ? cms.partners.find((p) => p.slug === key)?.name
              : undefined;
      out.push({
        id: `content:${type}:${key}`,
        kind: "content",
        label: `This page (${CONTENT_TYPES[type].label.replace(/ pages$/, " page").replace(/ & articles$/, "")})`,
        type,
        key,
        fields: [...CONTENT_TYPES[type].fields] as Field[],
        value,
        fallbacks: shipped ? { title: shipped } : undefined,
        editorHref: `/admin/content/${type}/${encodeURIComponent(key)}/`,
        recent: await recentPictures({
          collection: CONTENT_TYPES[type].collection,
          key,
          fields: ["heroImage", "image"],
          original: originalPicture(type, key),
        }),
      });
    }
  }

  // A page made in the page builder: edited there.
  const built = (await listPages()).find((r) => r.data.live && `/${r.data.live.slug}/` === path);
  if (built)
    out.push({
      id: "builder",
      kind: "link",
      label: "Page builder",
      text: "This page was made in the page builder. Open it there to change its blocks and layout.",
      href: `/admin/builder/${built.key}/`,
      action: "Open in the page builder",
    });

  if (path === "/")
    out.push({
      id: "home-layout",
      kind: "link",
      label: "Homepage layout",
      text: "Change the order of the homepage's sections, hide some, or add your own blocks between them.",
      href: `/admin/builder/${HOME_KEY}/`,
      action: "Open the homepage layout",
    });

  // The page hero (title, intro, picture) on every page that has one.
  if (can(admin.role, "pages") && !built && (await editablePaths()).includes(path)) {
    let value: Record<string, unknown> = {};
    if (supabaseConfigured()) {
      const { data } = await supabaseAdmin()
        .from("page_heroes")
        .select("title, intro, image_key")
        .eq("path", path)
        .maybeSingle();
      if (data) value = { title: data.title ?? "", intro: data.intro ?? "", picture: data.image_key ?? "" };
    }
    out.push({
      id: `hero:${path}`,
      kind: "hero",
      label: "Page hero (top of the page)",
      type: "hero",
      key: path,
      fields: HERO_FIELDS,
      value,
      editorHref: `/admin/pages/edit/?path=${encodeURIComponent(path)}`,
      recent: await recentPictures({ heroPath: path }),
    });
  }

  // Shared content that this page shows.
  if (contentOk) {
    const lists: ("homeHero" | "leadership" | "testimonials" | "offices")[] = [];
    if (path === "/") lists.push("homeHero", "leadership", "testimonials", "offices");
    if (path === "/about/" || path === "/about/our-leadership/") lists.push("leadership");
    if (path === "/contact/") lists.push("offices");
    for (const t of lists) {
      const value = await formValue(t, "list");
      if (!value) continue;
      out.push({
        id: `content:${t}:list`,
        kind: "content",
        label: CONTENT_TYPES[t].label,
        type: t,
        key: "list",
        fields: (t === "offices" ? officeFields() : [...CONTENT_TYPES[t].fields]) as Field[],
        value,
        editorHref: `/admin/content/${t}/`,
      });
    }
  }
  return out;
}

/** Saves one target's edited value. The same checks as the form editors apply. */
export async function saveTarget(target: { kind: string; type: string; key: string; value: unknown }): Promise<Saved> {
  if (target.kind === "hero") {
    const admin = await requireAdmin("pages");
    const path = normalise(target.key);
    if (!path || !(await editablePaths()).includes(path))
      return { ok: false, error: "This page has no editable hero." };
    return saveHeroEntry(admin, path, (target.value ?? {}) as Record<string, unknown>);
  }
  if (target.kind === "content") {
    const admin = await requireAdmin("content");
    if (!isContentType(target.type) || !target.key || target.key.length > 120 || target.key === "new")
      return { ok: false, error: "Unknown content." };
    return saveContentEntry(admin, target.type, target.key, target.value);
  }
  return { ok: false, error: "Nothing to save." };
}

/** "/services/x" or "/services/x/?a=b#c" → "/services/x/"; anything outside the public site → null. */
function normalise(path: string): string | null {
  const p = String(path || "/")
    .split(/[?#]/)[0]
    .replace(/\/+$/, "");
  const out = `${p}/`;
  if (!out.startsWith("/") || out.startsWith("//") || /^\/(admin|api|_next)\//.test(out)) return null;
  return out.length > 300 ? null : out;
}

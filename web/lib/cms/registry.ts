/**
 * What the website-content editors can change, as plain data: one entry per content type, listing its
 * fields. The admin's form engine (components/admin/content-form.tsx) renders from these definitions,
 * and the save action (sanitize below) accepts exactly these fields and nothing else.
 */

export type Field =
  | { key: string; label: string; kind: "text"; max?: number; hint?: string; required?: boolean }
  | { key: string; label: string; kind: "textarea"; max?: number; rows?: number; hint?: string; required?: boolean }
  /** Several paragraphs, edited as one box with a blank line between paragraphs. */
  | { key: string; label: string; kind: "paragraphs"; max?: number; hint?: string; required?: boolean }
  /** A list of short lines (bullet points), one per line. */
  | { key: string; label: string; kind: "lines"; max?: number; hint?: string }
  /** A hero-library key, an uploaded image URL, or the item's current image path. */
  | { key: string; label: string; kind: "picture"; hint?: string }
  | { key: string; label: string; kind: "select"; options: { value: string; label: string }[]; hint?: string }
  | {
      key: string;
      label: string;
      kind: "list";
      itemLabel: string;
      /** Field of each item used as its heading in the editor. */
      titleKey: string;
      fields: Field[];
      /** Item keys the editor does not show but must keep (e.g. a section's icon). */
      keep?: string[];
      max?: number;
      hint?: string;
    };

const sectionFields: Field[] = [
  { key: "title", label: "Heading", kind: "text", max: 200, required: true },
  { key: "body", label: "Text", kind: "textarea", max: 4000, rows: 4 },
  { key: "bullets", label: "Bullet points", kind: "lines", max: 400, hint: "One per line." },
];

const seo: Field[] = [
  {
    key: "metaDescription",
    label: "Search engine description",
    kind: "textarea",
    max: 200,
    rows: 2,
    hint: "What Google shows under the title. 70–160 characters.",
  },
];

export const CONTENT_TYPES = {
  services: {
    label: "Service pages",
    collection: "service",
    shape: "pages",
    intro:
      "Every page in the Services menu. Edit the headline, text, sections and picture; the menu name and address stay the same.",
    fields: [
      { key: "title", label: "Page headline", kind: "text", max: 200, hint: "Leave empty to use the menu name." },
      {
        key: "intro",
        label: "Introduction",
        kind: "paragraphs",
        max: 8000,
        required: true,
        hint: "The first paragraph is shown in the hero. Separate paragraphs with a blank line.",
      },
      { key: "introHeading", label: "Introduction heading", kind: "text", max: 200 },
      { key: "heroImage", label: "Hero picture", kind: "picture" },
      { key: "sectionsHeading", label: "Sections heading", kind: "text", max: 200 },
      {
        key: "sections",
        label: "Sections",
        kind: "list",
        itemLabel: "section",
        titleKey: "title",
        fields: [...sectionFields, { key: "href", label: "Link (optional)", kind: "text", max: 300 }],
        keep: ["icon", "iconImage"],
        max: 40,
      },
      { key: "closing", label: "Closing paragraphs", kind: "paragraphs", max: 4000 },
      { key: "metaTitle", label: "Browser tab and search title", kind: "text", max: 120 },
      ...seo,
    ] as Field[],
  },
  industries: {
    label: "Industry pages",
    collection: "industry",
    shape: "pages",
    intro: "The fourteen pages in the Industries menu.",
    fields: [
      { key: "title", label: "Page headline", kind: "text", max: 200, hint: "Leave empty to use the menu name." },
      {
        key: "intro",
        label: "Introduction",
        kind: "paragraphs",
        max: 8000,
        required: true,
        hint: "The first paragraph is shown in the hero. Separate paragraphs with a blank line.",
      },
      { key: "heroImage", label: "Hero picture", kind: "picture" },
      { key: "sectionsHeading", label: "Sections heading", kind: "text", max: 200 },
      {
        key: "sections",
        label: "Sections",
        kind: "list",
        itemLabel: "section",
        titleKey: "title",
        fields: [
          ...sectionFields,
          {
            key: "offerings",
            label: "Offerings",
            kind: "list",
            itemLabel: "offering",
            titleKey: "label",
            fields: [
              { key: "label", label: "Name", kind: "text", max: 200, required: true },
              { key: "body", label: "Text", kind: "textarea", max: 2000, rows: 3 },
            ],
            max: 30,
          },
          { key: "image", label: "Picture", kind: "picture" },
        ],
        max: 40,
      },
      ...seo,
    ] as Field[],
  },
  partners: {
    label: "Partner pages",
    collection: "partner",
    shape: "pages",
    intro: "The ten pages in the Partners menu.",
    fields: [
      { key: "title", label: "Page headline", kind: "text", max: 200, hint: "Leave empty to use the partner's name." },
      {
        key: "intro",
        label: "Introduction",
        kind: "paragraphs",
        max: 8000,
        required: true,
        hint: "The first paragraph is shown in the hero. Separate paragraphs with a blank line.",
      },
      { key: "heroImage", label: "Hero picture", kind: "picture" },
      {
        key: "sections",
        label: "What they offer",
        kind: "list",
        itemLabel: "section",
        titleKey: "title",
        fields: sectionFields,
        max: 30,
      },
      ...seo,
    ] as Field[],
  },
  news: {
    label: "News & articles",
    collection: "article",
    shape: "articles",
    intro: "Articles on /insights/ and the homepage news strip. Add new ones, edit or remove existing ones.",
    fields: [
      { key: "title", label: "Title", kind: "text", max: 220, required: true },
      {
        key: "category",
        label: "Category",
        kind: "text",
        max: 60,
        required: true,
        hint: "e.g. SAP, SuccessFactors, AI",
      },
      { key: "date", label: "Date", kind: "text", max: 10, hint: "YYYY-MM-DD" },
      {
        key: "excerpt",
        label: "Summary",
        kind: "textarea",
        max: 160,
        rows: 3,
        required: true,
        hint: "Shown on the cards. Up to 160 characters.",
      },
      { key: "image", label: "Cover picture", kind: "picture" },
      { key: "author", label: "Author", kind: "text", max: 120 },
      { key: "authorRole", label: "Author's role", kind: "text", max: 160 },
      {
        key: "blocks",
        label: "Article body",
        kind: "list",
        itemLabel: "block",
        titleKey: "text",
        fields: [
          {
            key: "type",
            label: "Type",
            kind: "select",
            options: [
              { value: "paragraph", label: "Paragraph" },
              { value: "heading", label: "Heading" },
              { value: "listItem", label: "Bullet point" },
              { value: "image", label: "Picture" },
              { value: "link", label: "Link button" },
            ],
          },
          { key: "text", label: "Text", kind: "textarea", max: 6000, rows: 4 },
          { key: "src", label: "Picture (for a picture block)", kind: "picture" },
          { key: "href", label: "Link address (for a link block)", kind: "text", max: 300 },
        ],
        keep: ["strong", "alt"],
        max: 200,
      },
    ] as Field[],
  },
  homeHero: {
    label: "Homepage hero",
    collection: "home-hero",
    shape: "list",
    intro: "The big headline slides at the top of the homepage: label, headline, text and the two buttons on each.",
    fields: [
      {
        key: "items",
        label: "Slides",
        kind: "list",
        itemLabel: "slide",
        titleKey: "label",
        max: 5,
        keep: ["id", "frames"],
        hint: "Five slides, each over its own film. Drag to change the order.",
        fields: [
          { key: "label", label: "Small label", kind: "text", max: 80, required: true },
          {
            key: "heading",
            label: "Headline",
            kind: "lines",
            max: 120,
            hint: "One line per row; a second row is shown on its own line.",
          },
          { key: "body", label: "Text", kind: "textarea", max: 400, rows: 3, required: true },
          { key: "ctaLabel", label: "Main button text", kind: "text", max: 40, required: true },
          { key: "ctaHref", label: "Main button link", kind: "text", max: 300, required: true },
          { key: "secondaryLabel", label: "Second button text", kind: "text", max: 40, required: true },
          { key: "secondaryHref", label: "Second button link", kind: "text", max: 300, required: true },
        ],
      },
    ] as Field[],
  },
  leadership: {
    label: "Leadership",
    collection: "leadership",
    shape: "list",
    intro: "The team on the homepage, /about/ and /about/our-leadership/. Order here is the order on the site.",
    fields: [
      {
        key: "items",
        label: "Leaders",
        kind: "list",
        itemLabel: "leader",
        titleKey: "name",
        fields: [
          { key: "name", label: "Name", kind: "text", max: 120, required: true },
          { key: "title", label: "Role", kind: "text", max: 160, required: true },
          { key: "bio", label: "Biography", kind: "textarea", max: 3000, rows: 5 },
          { key: "photo", label: "Photo", kind: "picture" },
          { key: "linkedin", label: "LinkedIn profile", kind: "text", max: 300 },
        ],
        keep: ["slug"],
        max: 40,
      },
    ] as Field[],
  },
  offices: {
    label: "Offices",
    collection: "offices",
    shape: "list",
    intro: "Addresses, emails and phone numbers on the contact page, the office map and the footer.",
    fields: [
      {
        key: "items",
        label: "Offices",
        kind: "list",
        itemLabel: "office",
        titleKey: "name",
        fields: [
          { key: "name", label: "Office name", kind: "text", max: 120, required: true },
          { key: "legalEntity", label: "Legal entity", kind: "text", max: 200, required: true },
          { key: "address", label: "Address", kind: "textarea", max: 400, rows: 2 },
          { key: "city", label: "City", kind: "text", max: 80, required: true },
          { key: "country", label: "Country", kind: "text", max: 80, required: true },
          { key: "email", label: "Email", kind: "text", max: 254 },
          { key: "phone", label: "Phone", kind: "text", max: 40 },
        ],
        keep: ["slug", "kind", "coords"],
        max: 40,
      },
    ] as Field[],
  },
  testimonials: {
    label: "Testimonials",
    collection: "testimonials",
    shape: "list",
    intro: "Client quotes on the homepage.",
    fields: [
      {
        key: "items",
        label: "Testimonials",
        kind: "list",
        itemLabel: "testimonial",
        titleKey: "name",
        fields: [
          { key: "quote", label: "Quote", kind: "textarea", max: 1500, rows: 4, required: true },
          { key: "name", label: "Name", kind: "text", max: 120, required: true },
          { key: "role", label: "Role and company", kind: "text", max: 200 },
          { key: "photo", label: "Photo", kind: "picture" },
        ],
        keep: ["slug", "clientSlug"],
        max: 40,
      },
    ] as Field[],
  },
} as const;

export type ContentType = keyof typeof CONTENT_TYPES;
export const isContentType = (t: string): t is ContentType => t in CONTENT_TYPES;

/** The pages to refresh after an edit, so it is live straight away. */
export function pathsToRefresh(type: ContentType, key: string): { path: string; type?: "layout" | "page" }[] {
  switch (type) {
    case "services":
      return [{ path: `/services/${key}/` }];
    case "industries":
      return [{ path: `/industries/${key}/` }];
    case "partners":
      return [{ path: `/partners/${key}/` }, { path: "/partners/" }];
    case "news":
      return [{ path: `/insights/${key}/` }, { path: "/insights/" }, { path: "/" }, { path: "/sitemap.xml" }];
    case "leadership":
      return [{ path: "/" }, { path: "/about/" }, { path: "/about/our-leadership/" }];
    case "testimonials":
    case "homeHero":
      return [{ path: "/" }];
    case "offices":
      // The footer and the organisation details are on every page.
      return [{ path: "/", type: "layout" }];
  }
}

// ------------------------------------------------------------------ sanitising a submitted form

const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.replace(/\r\n/g, "\n").trim().slice(0, max) : "");

/**
 * Keeps exactly the defined fields, trimmed and capped, so a forged form can add nothing else. A
 * picture must pass `pictureOk` (hero-library key, uploaded image, or a path already on the site).
 */
export function sanitize(
  fields: readonly Field[],
  value: unknown,
  pictureOk: (v: string) => boolean,
): Record<string, unknown> {
  const input = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const v = input[f.key];
    switch (f.kind) {
      case "text":
      case "textarea": {
        const s = str(v, f.max);
        if (s) out[f.key] = s;
        break;
      }
      case "select": {
        const s = str(v, 40);
        if (f.options.some((o) => o.value === s)) out[f.key] = s;
        break;
      }
      case "picture": {
        const s = str(v, 500);
        if (s && pictureOk(s)) out[f.key] = s;
        break;
      }
      case "paragraphs":
      case "lines": {
        const arr = (Array.isArray(v) ? v : []).map((x) => str(x, f.max ?? 4000)).filter(Boolean);
        if (arr.length) out[f.key] = arr.slice(0, 100);
        break;
      }
      case "list": {
        const items = (Array.isArray(v) ? v : []).slice(0, f.max ?? 100).map((item) => {
          const clean = sanitize(f.fields, item, pictureOk);
          for (const k of f.keep ?? []) {
            const kept = (item as Record<string, unknown>)?.[k];
            if (kept !== undefined && kept !== null) clean[k] = kept;
          }
          return clean;
        });
        out[f.key] = items.filter((i) => Object.keys(i).length);
        break;
      }
    }
  }
  return out;
}

/** The first required field left empty, as a message for the editor, or null when complete. */
export function missingRequired(fields: readonly Field[], value: Record<string, unknown>, where = ""): string | null {
  for (const f of fields) {
    const v = value[f.key];
    if ("required" in f && f.required && (v === undefined || (Array.isArray(v) && !v.length)))
      return `${where}${f.label} is required.`;
    if (f.kind === "list" && Array.isArray(v))
      for (const [i, item] of v.entries()) {
        const m = missingRequired(f.fields, item as Record<string, unknown>, `${f.itemLabel} ${i + 1}: `);
        if (m) return m;
      }
  }
  return null;
}

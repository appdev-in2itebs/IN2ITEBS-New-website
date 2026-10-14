import { sanitize, type Field } from "@/lib/cms/registry";

/**
 * The page builder's block library, as plain data: what each block is called, which fields it has
 * and what a new one starts with. The admin's builder renders its settings panel from these field
 * definitions (the same engine as Website content), and the save action keeps exactly these
 * fields and nothing else. Client-safe: no server imports.
 */

export type Block = { id: string; type: BlockType; props: Record<string, unknown> };

/** One page made in the builder. The draft is what the admin edits; `live` is what visitors see. */
export type PageDoc = { title: string; slug: string; description?: string; blocks: Block[] };
export type BuiltPage = { draft: PageDoc; live: PageDoc | null; publishedAt?: string | null };

const tone: Field = {
  key: "tone",
  label: "Background",
  kind: "select",
  options: [
    { value: "canvas", label: "Light" },
    { value: "subtle", label: "Soft grey" },
    { value: "navy", label: "Navy" },
  ],
};
const anchor: Field = {
  key: "anchor",
  label: "Section link name (optional)",
  kind: "text",
  max: 40,
  hint: "Lets a button jump here: name it pricing, and link to #pricing.",
};
const eyebrow: Field = { key: "eyebrow", label: "Small label above the heading", kind: "text", max: 80 };
const heading: Field = { key: "heading", label: "Heading", kind: "text", max: 200 };
const button = (n = ""): Field[] => [
  { key: `button${n}Label`, label: n ? "Second button text" : "Button text", kind: "text", max: 40 },
  {
    key: `button${n}Href`,
    label: n ? "Second button link" : "Button link",
    kind: "text",
    max: 300,
    hint: n ? undefined : "A page on this site (/contact/), a full address (https://…) or #section.",
  },
];

export const BLOCKS = {
  hero: {
    label: "Hero",
    group: "Headers",
    description: "Big headline, introduction, buttons and a picture.",
    fields: [
      eyebrow,
      { key: "title", label: "Headline", kind: "text", max: 160, required: true },
      { key: "intro", label: "Introduction", kind: "textarea", max: 600, rows: 3 },
      { key: "picture", label: "Picture", kind: "picture" },
      ...button(),
      ...button("2"),
      tone,
      anchor,
    ],
    defaults: {
      eyebrow: "New",
      title: "A headline that says what you do",
      intro: "One or two sentences that tell the visitor why this page matters to them.",
      buttonLabel: "Talk to us",
      buttonHref: "/contact/",
      tone: "canvas",
    },
  },
  text: {
    label: "Text",
    group: "Text",
    description: "A heading beside a column of paragraphs.",
    fields: [
      eyebrow,
      { ...heading, required: true },
      { key: "paragraphs", label: "Paragraphs", kind: "paragraphs", max: 4000, hint: "A blank line starts a new one." },
      { key: "linkLabel", label: "Link text", kind: "text", max: 60 },
      { key: "linkHref", label: "Link", kind: "text", max: 300 },
      tone,
      anchor,
    ],
    defaults: {
      eyebrow: "Overview",
      heading: "What this is about",
      paragraphs: ["Write the first paragraph here. It is shown a little larger.", "And the next one here."],
      tone: "canvas",
    },
  },
  richText: {
    label: "Rich text",
    group: "Text",
    description: "Free text with sub-headings, bold, links and bullet lists.",
    fields: [
      heading,
      {
        key: "body",
        label: "Text",
        kind: "textarea",
        max: 20000,
        rows: 12,
        hint: "## Sub-heading · **bold** · *italic* · [link text](/contact/) · - bullet point · blank line = new paragraph",
      },
      {
        key: "width",
        label: "Width",
        kind: "select",
        options: [
          { value: "narrow", label: "Reading width" },
          { value: "wide", label: "Full width" },
        ],
      },
      tone,
      anchor,
    ],
    defaults: {
      heading: "A heading",
      body: "Write here. **Bold**, *italic* and [links](/contact/) work.\n\n## A sub-heading\n\n- A bullet point\n- Another one",
      width: "narrow",
      tone: "canvas",
    },
  },
  imageText: {
    label: "Picture and text",
    group: "Media",
    description: "A picture on one side, text and a button on the other.",
    fields: [
      { key: "picture", label: "Picture", kind: "picture" },
      {
        key: "side",
        label: "Picture side",
        kind: "select",
        options: [
          { value: "left", label: "Left" },
          { value: "right", label: "Right" },
        ],
      },
      eyebrow,
      { ...heading, required: true },
      { key: "paragraphs", label: "Paragraphs", kind: "paragraphs", max: 4000 },
      ...button(),
      tone,
      anchor,
    ],
    defaults: {
      side: "left",
      eyebrow: "Why it matters",
      heading: "A heading beside the picture",
      paragraphs: ["A short paragraph that explains the picture."],
      tone: "canvas",
    },
  },
  cards: {
    label: "Cards",
    group: "Layout",
    description: "Services, benefits or steps as a grid of cards.",
    fields: [
      eyebrow,
      heading,
      { key: "note", label: "Note on the right", kind: "textarea", max: 300, rows: 2 },
      {
        key: "layout",
        label: "Layout",
        kind: "select",
        options: [
          { value: "bento", label: "Mixed sizes (first card navy)" },
          { value: "grid2", label: "2 per row" },
          { value: "grid3", label: "3 per row" },
          { value: "grid4", label: "4 per row" },
        ],
      },
      {
        key: "items",
        label: "Cards",
        kind: "list",
        itemLabel: "card",
        titleKey: "title",
        max: 24,
        fields: [
          { key: "title", label: "Title", kind: "text", max: 160, required: true },
          { key: "body", label: "Text", kind: "textarea", max: 1500, rows: 3 },
          { key: "bullets", label: "Bullet points", kind: "lines", max: 300, hint: "One per line." },
          { key: "picture", label: "Picture (optional)", kind: "picture" },
          { key: "href", label: "Link (optional)", kind: "text", max: 300 },
          { key: "linkLabel", label: "Link text", kind: "text", max: 40 },
        ],
      },
      tone,
      anchor,
    ],
    defaults: {
      eyebrow: "What we offer",
      heading: "Three things we do well",
      layout: "grid3",
      tone: "subtle",
      items: [
        { title: "First", body: "A sentence or two about it." },
        { title: "Second", body: "A sentence or two about it." },
        { title: "Third", body: "A sentence or two about it." },
      ],
    },
  },
  stats: {
    label: "Numbers",
    group: "Layout",
    description: "Key figures that count up as they scroll in.",
    fields: [
      eyebrow,
      heading,
      {
        key: "items",
        label: "Figures",
        kind: "list",
        itemLabel: "figure",
        titleKey: "label",
        max: 8,
        fields: [
          { key: "value", label: "Number", kind: "text", max: 20, required: true, hint: "e.g. 500+, 30, 98%" },
          { key: "label", label: "What it counts", kind: "text", max: 80, required: true },
        ],
      },
      tone,
      anchor,
    ],
    defaults: {
      eyebrow: "In numbers",
      heading: "Proof, not promises",
      tone: "canvas",
      items: [
        { value: "20+", label: "Years in SAP" },
        { value: "500+", label: "Projects delivered" },
        { value: "30+", label: "Countries" },
        { value: "98%", label: "Clients who return" },
      ],
    },
  },
  quote: {
    label: "Quote",
    group: "Text",
    description: "One client quote, large.",
    fields: [
      { key: "quote", label: "Quote", kind: "textarea", max: 800, rows: 4, required: true },
      { key: "name", label: "Name", kind: "text", max: 80 },
      { key: "role", label: "Role and company", kind: "text", max: 120 },
      tone,
      anchor,
    ],
    defaults: {
      quote: "In2IT EBS brought the right people at the right time. The migration ran on plan.",
      name: "Client name",
      role: "CIO, Company",
      tone: "subtle",
    },
  },
  faq: {
    label: "Questions and answers",
    group: "Text",
    description: "An FAQ list that opens one answer at a time.",
    fields: [
      eyebrow,
      heading,
      {
        key: "items",
        label: "Questions",
        kind: "list",
        itemLabel: "question",
        titleKey: "question",
        max: 30,
        fields: [
          { key: "question", label: "Question", kind: "text", max: 200, required: true },
          { key: "answer", label: "Answer", kind: "textarea", max: 2000, rows: 3, required: true },
        ],
      },
      tone,
      anchor,
    ],
    defaults: {
      eyebrow: "FAQ",
      heading: "Common questions",
      tone: "canvas",
      items: [
        { question: "How long does it take?", answer: "It depends on scope. Most projects start within two weeks." },
        { question: "Do you work outside India?", answer: "Yes, across more than 30 countries." },
      ],
    },
  },
  image: {
    label: "Picture",
    group: "Media",
    description: "One picture with an optional caption.",
    fields: [
      { key: "picture", label: "Picture", kind: "picture" },
      { key: "caption", label: "Caption", kind: "text", max: 200 },
      {
        key: "width",
        label: "Width",
        kind: "select",
        options: [
          { value: "contained", label: "Page width" },
          { value: "narrow", label: "Narrow" },
        ],
      },
      tone,
      anchor,
    ],
    defaults: { width: "contained", tone: "canvas" },
  },
  video: {
    label: "YouTube video",
    group: "Media",
    description: "A YouTube video, played on the page.",
    fields: [
      heading,
      {
        key: "url",
        label: "YouTube link",
        kind: "text",
        max: 200,
        required: true,
        hint: "Paste the address from YouTube's Share button.",
      },
      { key: "caption", label: "Caption", kind: "text", max: 200 },
      tone,
      anchor,
    ],
    defaults: { heading: "See it in action", url: "", tone: "canvas" },
  },
  testimonials: {
    label: "Client testimonials",
    group: "Site content",
    description: "The client quotes from Website content → Testimonials.",
    fields: [],
    defaults: {},
  },
  logos: {
    label: "Client logos",
    group: "Site content",
    description: "The moving strip of client logos.",
    fields: [eyebrow, tone],
    defaults: { eyebrow: "Trusted in complex operating environments", tone: "canvas" },
  },
  contact: {
    label: "Enquiry form",
    group: "Site content",
    description: "The contact form. Enquiries arrive in Leads.",
    fields: [eyebrow, heading, { key: "intro", label: "Text", kind: "textarea", max: 600, rows: 3 }, tone, anchor],
    defaults: {
      eyebrow: "Contact",
      heading: "Tell us what you need",
      intro: "We reply within one working day.",
      tone: "subtle",
    },
  },
  cta: {
    label: "Call to action",
    group: "Headers",
    description: "A closing band that asks the visitor to get in touch.",
    fields: [
      eyebrow,
      heading,
      { key: "body", label: "Text", kind: "textarea", max: 400, rows: 3 },
      ...button(),
      {
        key: "style",
        label: "Style",
        kind: "select",
        options: [
          { value: "navy", label: "Navy band" },
          { value: "glass", label: "Light panel" },
        ],
      },
    ],
    defaults: {
      eyebrow: "Let's begin",
      heading: "Talk to us.",
      body: "Tell us where you want to go. We will map the first move with you in one conversation.",
      buttonLabel: "Talk to us",
      buttonHref: "/contact/",
      style: "navy",
    },
  },
  spacer: {
    label: "Space",
    group: "Layout",
    description: "Empty space or a thin line between blocks.",
    fields: [
      {
        key: "size",
        label: "Height",
        kind: "select",
        options: [
          { value: "s", label: "Small" },
          { value: "m", label: "Medium" },
          { value: "l", label: "Large" },
        ],
      },
      {
        key: "line",
        label: "Line",
        kind: "select",
        options: [
          { value: "no", label: "No line" },
          { value: "yes", label: "Thin line" },
        ],
      },
      tone,
    ],
    defaults: { size: "m", line: "no", tone: "canvas" },
  },
  /** Homepage only: one of the homepage's own sections, kept as it is and placed where it is dropped. */
  section: {
    label: "Homepage section",
    group: "Homepage",
    description: "One of the homepage's own sections.",
    fields: [],
    defaults: {},
  },
} as const satisfies Record<
  string,
  { label: string; group: string; description: string; fields: Field[]; defaults: Record<string, unknown> }
>;

export type BlockType = keyof typeof BLOCKS;
export const isBlockType = (t: unknown): t is BlockType => typeof t === "string" && t in BLOCKS;

/** The homepage's own sections, in the order the site ships them. */
export const HOME_SECTIONS = {
  hero: "Hero (video)",
  clients: "Client logos",
  services: "Services",
  metrics: "Ecosystem numbers",
  partners: "Partners",
  team: "Leadership",
  testimonials: "Testimonials",
  youtube: "YouTube videos",
  news: "News and articles",
  map: "Office map",
} as const;
export type HomeSection = keyof typeof HOME_SECTIONS;
export const HOME_KEY = "home";

export const defaultHomeBlocks = (): Block[] =>
  (Object.keys(HOME_SECTIONS) as HomeSection[]).map((s) => ({
    id: `home-${s}`,
    type: "section",
    props: { section: s },
  }));

export function newBlock(type: BlockType): Block {
  return { id: blockId(), type, props: structuredClone(BLOCKS[type].defaults) as Record<string, unknown> };
}

export function blockId() {
  return Math.random().toString(36).slice(2, 10);
}

/** Groups for the library panel, in display order. */
export const BLOCK_GROUPS = ["Headers", "Text", "Media", "Layout", "Site content"] as const;

// ------------------------------------------------------------------ addresses

/** Addresses the builder may never take: the site's own sections and the system paths. */
const RESERVED = new Set([
  "admin",
  "api",
  "_next",
  "heroes",
  "brand",
  "images",
  "fonts",
  "sitemap.xml",
  "robots.txt",
  "favicon.ico",
  "icon.svg",
  "thank-you",
]);

/** Lowercase words joined by hyphens, up to three levels: "offers/sap-health-check". */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .split("/")
    .map((part) =>
      part
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60),
    )
    .filter(Boolean)
    .slice(0, 3)
    .join("/");
}

/** The shape of a page address: lowercase words joined by hyphens, up to three parts separated by /. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*){0,2}$/;

/** True for a string that could be a page address; URLs that cannot be one need no database lookup. */
export function isSlug(value: string) {
  return value.length <= 200 && SLUG_PATTERN.test(value);
}

/** A problem with an address, or null. `taken` holds every address the site already serves. */
export function slugProblem(slug: string, taken: Set<string>): string | null {
  if (!slug) return "Give the page an address.";
  if (!isSlug(slug))
    return "The address may use lowercase letters, numbers and hyphens, with up to three parts separated by /.";
  if (RESERVED.has(slug.split("/")[0])) return `"/${slug}/" is reserved for the website itself.`;
  if (taken.has(`/${slug}/`)) return `The website already has a page at /${slug}/.`;
  return null;
}

// ------------------------------------------------------------------ saving

const MAX_BLOCKS = 60;

/** Keeps known block types and their defined fields only, so a forged save can add nothing else. */
export function sanitizeBlocks(input: unknown, pictureOk: (v: string) => boolean, home = false): Block[] {
  const seen = new Set<string>();
  const out: Block[] = [];
  for (const raw of Array.isArray(input) ? input.slice(0, MAX_BLOCKS) : []) {
    const b = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
    if (!isBlockType(b.type)) continue;
    let id = typeof b.id === "string" && /^[a-z0-9-]{1,40}$/.test(b.id) ? b.id : blockId();
    if (seen.has(id)) id = blockId();
    seen.add(id);
    if (b.type === "section") {
      const section = (b.props as Record<string, unknown> | undefined)?.section;
      if (
        home &&
        typeof section === "string" &&
        section in HOME_SECTIONS &&
        !out.some((x) => x.props.section === section)
      )
        out.push({ id, type: "section", props: { section } });
      continue;
    }
    out.push({ id, type: b.type, props: sanitize(BLOCKS[b.type].fields, b.props, pictureOk) });
  }
  return out;
}

/** The first required field left empty, named so the editor can find it, or null. */
export function blockProblem(blocks: Block[]): string | null {
  for (const [i, b] of blocks.entries()) {
    for (const f of BLOCKS[b.type].fields) {
      const v = b.props[f.key];
      if ("required" in f && f.required && (v === undefined || v === "" || (Array.isArray(v) && !v.length)))
        return `Block ${i + 1} (${BLOCKS[b.type].label}): ${f.label} is required.`;
      if (f.kind === "list" && Array.isArray(v))
        for (const [j, item] of v.entries())
          for (const g of f.fields)
            if ("required" in g && g.required && !(item as Record<string, unknown>)[g.key])
              return `Block ${i + 1} (${BLOCKS[b.type].label}), ${f.itemLabel} ${j + 1}: ${g.label} is required.`;
    }
  }
  return null;
}

/** A link an editor typed, made safe: on-site paths, anchors, web, mail and phone links only. */
export function safeHref(href: unknown): string | null {
  if (typeof href !== "string" || !href.trim()) return null;
  const h = href.trim();
  if (/^(\/(?!\/)|#|https?:\/\/|mailto:|tel:)/i.test(h)) return h;
  return null;
}

/** The video id from any usual YouTube address, or null. */
export function youtubeId(url: unknown): string | null {
  if (typeof url !== "string") return null;
  const m = url.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/,
  );
  return m ? m[1] : null;
}

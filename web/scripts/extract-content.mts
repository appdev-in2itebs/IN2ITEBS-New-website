/**
 * Extract every word the site publishes into one markdown document.
 *
 * Run: npx tsx scripts/extract-content.mts > /path/to/compendium.md
 *
 * ── WHY THIS IMPORTS THE MODULES RATHER THAN PARSING THEM ────────────────────────────────────
 * The content files are not the content. `publicCaseStudies` applies the anonymisation overrides
 * before anything reaches a page, and a document built by reading `caseStudies` would publish
 * fourteen client names that the site deliberately withholds — in a Word file, which travels
 * further than a web page and cannot be unpublished. So this imports what the pages import.
 *
 * ── WHAT IT CANNOT SEE ───────────────────────────────────────────────────────────────────────
 * Pages are served through lib/cms/content.ts, which reads an editor's changes from Supabase and
 * falls back to these files. This script sees the fallback. Where a page has been edited through
 * the admin, the live page differs and this document is the pre-edit text. The preamble says so.
 */

import { legacyIndustries } from "../content/legacy-industries";
import { servicePages, serviceGroups } from "../content/legacy-services";
import { publicCaseStudies } from "../content/case-studies";
import { insightArticles } from "../content/insights";
import { insightBodies } from "../content/insight-bodies";
import { capabilities, STATUS_LABELS, capabilityReviewed, capabilityOwner } from "../content/capability-status";
import { qualifiedPackages, sapPublishedDeliveries, SAP_PROFILE_URL } from "../content/qpps";
import { ATTRIBUTION_LABELS, UNPROVENANCED, CLIENT_FACTS } from "../content/evidence";
import { clients } from "../content/clients";
import { offices } from "../content/offices";
import { site } from "../content/site";

const out: string[] = [];
const w = (s = "") => out.push(s);

/** The converter reads markdown, so prose that is not markdown has to say so. */
const esc = (s: string) =>
  String(s ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/([*_`[\]|#>])/g, "\\$1")
    .replace(/^(\s*)([-+])\s/gm, "$1\\$2 ")
    .replace(/^(\s*)(\d+)\.\s/gm, "$1$2\\. ");

/** One paragraph per line: the converter joins wrapped lines, so wrapping here would merge them. */
const para = (s?: string) => {
  if (!s) return;
  w(esc(s));
  w();
};

const bullets = (items?: string[]) => {
  if (!items?.length) return;
  for (const b of items) w(`- ${esc(b)}`);
  w();
};

const field = (label: string, value?: string | null) => {
  if (!value) return;
  w(`**${label}:** ${esc(value)}`);
  w();
};

const PB = "<!--pagebreak-->";
const pb = () => w(PB);

const rows = (header: string[], body: string[][]) => {
  w(`| ${header.join(" | ")} |`);
  w(`| ${header.map(() => "---").join(" | ")} |`);
  for (const r of body) w(`| ${r.join(" | ")} |`);
  w();
};

// ─────────────────────────────────────────────────────────────────────────────────────────────
// PART 1 · INDUSTRIES
// ─────────────────────────────────────────────────────────────────────────────────────────────
pb();
w("# Part 2 · Industry pages");
w();
para(
  `${legacyIndustries.length} pages. An industry page with no client work behind it is an assertion with a navigation entry; every page here has at least one named engagement evidenced by a purchase order or a signed contract. Five pages that had navigation entries and nothing else were retired.`,
);

for (const ind of legacyIndustries) {
  pb();
  w(`## ${esc(ind.name)}`);
  w();
  w(`\`/industries/${ind.slug}/\``);
  w();
  if (ind.title) {
    w(`> ${esc(ind.title)}`);
    w();
  }
  field("Title tag", ind.metaTitle);
  field("Meta description", ind.metaDescription);

  w("### Overview");
  w();
  for (const p of ind.intro) para(p);

  if (ind.sections?.length) {
    w(`### ${esc(ind.sectionsHeading ?? "Capabilities")}`);
    w();
    for (const s of ind.sections) {
      w(`#### ${esc(s.title)}`);
      w();
      para(s.body);
      bullets(s.bullets);
      if (s.offerings?.length) {
        for (const o of s.offerings) {
          w(`- **${esc(o.label)}**${o.body ? ` — ${esc(o.body)}` : ""}`);
        }
        w();
      }
    }
  }

  w(
    `*Client logos published on this page: ${ind.customers.length ? ind.customers.length : "none — logo consent not confirmed"}.*`,
  );
  w();
}

// ─────────────────────────────────────────────────────────────────────────────────────────────
// PART 2 · SERVICES
// ─────────────────────────────────────────────────────────────────────────────────────────────
pb();
w("# Part 3 · Service pages");
w();
para(
  `${servicePages.length} pages across ${serviceGroups.length} pillars, down from forty-six. URLs are flat — /services/<slug>/ — so the pillar groups the pages in the menu without becoming a path segment, and regrouping a pillar later moves no URL.`,
);
para(
  "A page is published only where there is a named offer of our own or a capability evidenced by a client engagement. SAP describes RISE, GROW and S/4HANA better than we will, and a page that restates a vendor's product is a page the buyer has already read. Oracle, ServiceNow, Microsoft Dynamics and Adobe do not appear: we hold no designation from any of them and we do not implement them.",
);

w("## The three pillars");
w();
rows(
  ["Pillar", "What it covers", "Pages"],
  serviceGroups.map((g) => [esc(g.name), esc(g.blurb), String(g.items.length)]),
);

const sectionBlock = (title: string, items: { title: string; body?: string; bullets?: string[] }[]) => {
  if (!items?.length) return;
  w(`### ${esc(title)}`);
  w();
  for (const s of items) {
    w(`#### ${esc(s.title)}`);
    w();
    para(s.body);
    bullets(s.bullets);
  }
};

for (const svc of servicePages) {
  pb();
  w(`## ${esc(svc.name)}`);
  w();
  w(`\`/services/${svc.slug}/\` · ${esc(svc.group)}`);
  w();
  if (svc.title) {
    w(`> ${esc(svc.title)}`);
    w();
  }
  field("Title tag", svc.metaTitle);
  field("Meta description", svc.metaDescription);

  w(`### ${esc(svc.introHeading ?? "Overview")}`);
  w();
  for (const p of svc.intro) para(p);

  if (svc.diagram) {
    w(`![${esc(svc.diagram.alt)}](diagrams/${svc.diagram.src.replace(/^\/diagrams\//, "").replace(/\.svg$/, "")}.png)`);
    w();
    if (svc.diagram.caption) {
      w(`*${esc(svc.diagram.caption)}*`);
      w();
    }
  }

  sectionBlock(svc.sectionsHeading ?? "What this covers", svc.sections);

  if (svc.extraSections) {
    const x = svc.extraSections;
    w(`### ${esc(x.heading)}`);
    w();
    para(x.intro);
    if (x.diagram) {
      w(`![${esc(x.diagram.alt)}](diagrams/${x.diagram.src.replace(/^\/diagrams\//, "").replace(/\.svg$/, "")}.png)`);
      w();
    }
    for (const s of x.items) {
      w(`#### ${esc(s.title)}`);
      w();
      para(s.body);
      bullets(s.bullets);
    }
    if (x.closing?.length) for (const p of x.closing) para(p);
    if (x.closingDiagram) {
      w(
        `![${esc(x.closingDiagram.alt)}](diagrams/${x.closingDiagram.src.replace(/^\/diagrams\//, "").replace(/\.svg$/, "")}.png)`,
      );
      w();
    }
  }

  if (svc.closing?.length) {
    w("### In closing");
    w();
    for (const p of svc.closing) para(p);
  }

  const extras: string[] = [];
  if (svc.interactive) extras.push(`interactive tool: ${svc.interactive}`);
  if (svc.toolsBand) extras.push("self-service diagnostics band");
  if (svc.qualifiedPackages) extras.push(`SAP-qualified packages band (${svc.qualifiedPackages})`);
  if (extras.length) {
    w(`*Also on this page — ${esc(extras.join("; "))}.*`);
    w();
  }
}

// ─────────────────────────────────────────────────────────────────────────────────────────────
// PART 3 · CASE STUDIES
// ─────────────────────────────────────────────────────────────────────────────────────────────
pb();
w("# Part 4 · Case studies");
w();
para(
  `${publicCaseStudies.length} studies, published exactly as the site publishes them. Client work publishes by sector and region — "a state-owned mining undertaking, eastern India" — because that is the house position, not a holding pattern while consent is chased. Naming a client is the exception that has to be argued for, and it needs two things in this order: the client's written agreement and a decision to depart from the house style for that client.`,
);
para(
  "Anonymising is not renaming. Every field carrying an identifying detail is overridden, not just the name, because pseudo-anonymisation a reader can reverse in one search discloses the client anyway while signalling that we believed we were hiding them. A build check fails if a client name or an identifying token survives into the published copy.",
);

for (const cs of publicCaseStudies) {
  pb();
  w(`## ${esc(cs.client)}`);
  w();
  w(`\`/case-studies/${cs.slug}/\``);
  w();
  rows(
    ["Industry", "SAP path", "Featured solution", "Size", "Region"],
    [[esc(cs.industry), esc(cs.sapPath), esc(cs.featuredSolution), esc(cs.employees), esc(cs.region)]],
  );
  field("Title tag", cs.metaTitle);
  field("Meta description", cs.summary);

  w("### The situation");
  w();
  para(cs.scenario);

  if (cs.solution?.length) {
    w("### What was implemented");
    w();
    bullets(cs.solution);
  }
  if (cs.benefits?.length) {
    w("### Outcomes published");
    w();
    bullets(cs.benefits);
  }
  if (cs.differentiator) {
    w("### Why this engagement went the way it did");
    w();
    para(cs.differentiator);
  }
  para(cs.outcome);

  if (cs.metrics?.length) {
    w("### Figures, and where each one comes from");
    w();
    rows(
      ["Figure", "A number of", "Window", "Measured by", "Excludes"],
      cs.metrics.map((m) => [
        `**${esc(m.value)}**`,
        esc(m.of),
        esc(m.window),
        esc(ATTRIBUTION_LABELS[m.attribution].label),
        esc(m.excludes ?? "—"),
      ]),
    );
  } else {
    w(
      "*No quantified outcome is published on this page. Where the evidence is a purchase-order register, the register proves duration and breadth rather than business outcomes, and the duration is the claim.*",
    );
    w();
  }
}

// ─────────────────────────────────────────────────────────────────────────────────────────────
// PART 4 · THE CAPABILITY REGISTER
// ─────────────────────────────────────────────────────────────────────────────────────────────
pb();
w("# Part 5 · The capability register");
w();
w(`\`/about/where-we-stand/\``);
w();
// Italic, because this sentence is the document talking, not the page. The page's own words are
// reproduced in Part 1; what follows here is the register as a reviewer has to sign it.
w(
  `*Every capability the site claims, and every one it does not, on one page. ${capabilities.length} lines, last checked against delivery evidence on ${capabilityReviewed}. Owner: ${capabilityOwner}. The page itself is reproduced in Part 1.*`,
);
w();

w("## What each status commits us to");
w();
rows(
  ["Status", "Means"],
  Object.values(STATUS_LABELS).map((s) => [`**${esc(s.label)}**`, esc(s.meaning)]),
);

const areas = [...new Set(capabilities.map((c) => c.area))];
for (const area of areas) {
  w(`## ${esc(area)}`);
  w();
  rows(
    ["Capability", "Status", "What a buyer should take from this"],
    capabilities
      .filter((c) => c.area === area)
      .map((c) => [esc(c.capability), `**${esc(STATUS_LABELS[c.status].label)}**`, esc(c.note)]),
  );
}

// ─────────────────────────────────────────────────────────────────────────────────────────────
// PART 5 · SAP-QUALIFIED PACKAGES
// ─────────────────────────────────────────────────────────────────────────────────────────────
pb();
w("# Part 6 · SAP-qualified partner-packaged solutions");
w();
para(
  `${qualifiedPackages.length} packages SAP has qualified and SAP publishes. The band on each practice page links back to SAP's own partner profile, because a claim a buyer can check without asking us is worth more than one they have to take on trust.`,
);
field("SAP partner profile", SAP_PROFILE_URL);

for (const p of qualifiedPackages) {
  pb();
  w(`## ${esc(p.name)}`);
  w();
  w(`*Shorthand: ${esc(p.short)} · carried on the ${esc(p.practice)} practice page*`);
  w();
  field("Who it is for", p.forWhom);
  field("Time to live, where SAP states one", p.live);

  w("### SAP's own summary");
  w();
  para(p.sapSummary);

  w("### What we add, which SAP does not say");
  w();
  para(p.ours);

  if (p.scope?.length) {
    w("### What the package contains");
    w();
    for (const g of p.scope) {
      w(`#### ${esc(g.group)}`);
      w();
      bullets(g.items);
    }
    if (p.scopeSource) {
      w(
        `*Transcribed from ${esc(p.scopeSource)}. Spelling, capitalisation and duplicate rows corrected; nothing added — the scope of a fixed-price package is a commercial commitment.*`,
      );
      w();
    }
  } else {
    w(
      "*SAP's profile publishes this package's summary but no itemised scope, and we hold none anybody has signed off. An invented scope is worse than none.*",
    );
    w();
  }
}

if (sapPublishedDeliveries?.length) {
  w("## Deliveries SAP publishes against this profile");
  w();
  para(
    "SAP's own counts, read from the partner profile. They are not reproduced on the site, because they move without anybody here being told and a stale number on a page about honesty is worse than no number. Recorded here for bid teams, who should cite the live profile directly.",
  );
  rows(
    ["Area", "Deliveries published, India"],
    sapPublishedDeliveries.map((d) => [esc(d.area), String(d.india)]),
  );
}

// ─────────────────────────────────────────────────────────────────────────────────────────────
// PART 6 · INSIGHTS
// ─────────────────────────────────────────────────────────────────────────────────────────────
pb();
w("# Part 7 · Insight articles");
w();
para(
  `${insightArticles.length} articles. Six demo pieces that shipped with the original theme are blocked by slug, so an old CMS row cannot put a stock-tips article back under an SAP partner's brand.`,
);

for (const a of insightArticles) {
  pb();
  w(`## ${esc(a.title)}`);
  w();
  w(`\`/insights/${a.slug}/\` · ${esc(a.category)} · ${esc(a.dateLabel ?? a.date)}`);
  w();
  const body = insightBodies[a.slug];
  if (body?.author) {
    w(`*${esc([body.author, body.authorRole, body.authorDate].filter(Boolean).join(", "))}*`);
    w();
  }
  field("Excerpt", a.excerpt);
  if (!body) {
    w("*No article body in the repository — this entry links out.*");
    w();
    continue;
  }
  for (const b of body.blocks) {
    if (b.type === "heading") {
      w(`### ${esc(b.text)}`);
      w();
    } else if (b.type === "paragraph") {
      para(b.text);
    } else if (b.type === "listItem") {
      w(`- ${esc(b.text)}`);
    } else if (b.type === "link") {
      w(`[${esc(b.text)}](${b.href})`);
      w();
    } else if (b.type === "scope") {
      w(`*The itemised scope of ${esc(b.package)} is expanded here at render time from Part 6.*`);
      w();
    } else if (b.type === "image") {
      w(`![${esc(b.alt ?? "")}](diagrams/insights/${b.src.split("/").pop()})`);
      w();
    }
  }
  w();
}

// ─────────────────────────────────────────────────────────────────────────────────────────────
// PART 7 · CLIENT REFERENCES
// ─────────────────────────────────────────────────────────────────────────────────────────────
pb();
w("# Part 8 · Client references");
w();
para(
  `${clients.length} clients, published by the Managing Director's decision of 12 November 2026: nothing signed prohibits identifying our clients, and showing who you work for is ordinary practice in this industry. If a client ever asks to be removed, remove that client rather than turning the whole wall off — one objection is not a reason to hide everyone.`,
);

const sectors = [...new Set(clients.flatMap((c) => c.sectors))].sort();
for (const s of sectors) {
  const inSector = clients.filter((c) => c.sectors.includes(s));
  w(`## ${esc(s)} — ${inSector.length}`);
  w();
  rows(
    ["Client", "Logo published"],
    inSector.map((c) => [esc(c.name), c.logo ? "yes" : "wordmark"]),
  );
}

// ─────────────────────────────────────────────────────────────────────────────────────────────
// PART 8 · CORPORATE FACTS
// ─────────────────────────────────────────────────────────────────────────────────────────────
pb();
w("# Part 9 · Corporate facts, and what each one rests on");
w();
para(
  'Every figure the site publishes comes from here. The word "certified" is banned sitewide: "500+ people" is provable from payroll, "500+ certified consultants" is a claim a tender can demand a register for.',
);

const s = site as Record<string, unknown>;
if (Array.isArray(s.stats)) {
  w("## The statistics band");
  w();
  rows(
    ["Figure", "Label"],
    (s.stats as { value: string; label: string }[]).map((x) => [`**${esc(x.value)}**`, esc(x.label)]),
  );
}
if (Array.isArray(s.certifications)) {
  w("## Credentials");
  w();
  rows(
    ["Credential", "Valid until"],
    (s.certifications as { name: string; validUntil: string | null }[]).map((c) => [
      esc(c.name),
      c.validUntil ? esc(c.validUntil) : "**not recorded — the build warns on every run**",
    ]),
  );
}

w("## Offices and entities");
w();
rows(
  ["Office", "Legal entity", "City", "Country", "Kind"],
  offices.map((o) => [esc(o.name), esc(o.legalEntity), esc(o.city), esc(o.country), esc(o.kind.join(", "))]),
);

if (CLIENT_FACTS?.length) {
  w("## Figures that describe the client, not our work");
  w();
  para(
    "A different category, because the two fail differently. An unsourced outcome claim inflates our work; an unsourced client-scale figure gets the client's own facts wrong in public, under our name.",
  );
  rows(
    ["Figure", "About"],
    CLIENT_FACTS.map((f) => [`**${esc(f.figure)}**`, esc(f.about)]),
  );
}

if (UNPROVENANCED?.length) {
  w("## Figures still carrying no provenance");
  w();
  para(
    `${UNPROVENANCED.length} inherited figures appear in published prose with no baseline, window or measurer recorded. A build check fails if any new quantified claim reaches a case study without being either a sourced metric or named on this list — which makes this list the only route an unsourced number can take, and taking it means deliberately typing the number into a register called UNPROVENANCED. None may be cleared by inventing the missing part.`,
  );
  rows(
    ["Figure", "Appears in", "What is needed"],
    UNPROVENANCED.map((u) => [`**${esc(u.figure)}**`, esc(u.study), esc(u.needs)]),
  );
}

// ─────────────────────────────────────────────────────────────────────────────────────────────
// PART 9 · THE DIAGRAMS THAT CARRY AN ARGUMENT
// ─────────────────────────────────────────────────────────────────────────────────────────────
pb();
w("# Part 10 · The diagrams that carry an argument");
w();
para(
  "Fourteen diagrams appear inside the service pages above, where they belong. Six more sit on pages this document does not otherwise reproduce — the About pages and the case-study index — and they are the ones that make an argument no competitor can make, because each one draws something most firms would rather not draw. They are reproduced here in full.",
);
para(
  "These six are written in page markup rather than in a content file, so they are the one part of this document assembled by hand rather than read from the data. The alt text below is the alt text the site publishes.",
);

const argued: { file: string; title: string; alt: string; caption?: string; page: string }[] = [
  {
    file: "z1-depth-profile",
    title: "The capability register, drawn",
    page: "/about/where-we-stand/",
    alt: "The capability register drawn as a grid: four areas across, four evidence levels down. SAP has five capabilities in production, Engineering and data three, Run and operations one, and Other platforms none. Five capabilities across the register are drawn as empty outlines because we do not deliver them at all.",
    caption: "The vertical axis is evidence, not volume. The five hollow blocks are the capabilities we do not have.",
  },
  {
    file: "z2-claim-lifecycle",
    title: "What happens to a claim between evidence and expiry",
    page: "/about/where-we-stand/",
    alt: "Four stages left to right — evidence, recorded, published, expires — above the four checks that run on every build: the capability register at ninety days, the corporate facts at two hundred, the house style, and outcome figures. If any one fails, the whole site stays on its previous version.",
    caption:
      "Four checks run on every build of this site. Any one of them failing stops the whole site publishing, not only the line that failed.",
  },
  {
    file: "z3-anatomy-number",
    title: "What a figure has to carry before it goes on the site",
    page: "/case-studies/",
    alt: "Two panels compared. The usual form of an outcome claim: a large percentage with four empty slots — what it is a number of, the period it covers, who did the arithmetic and what is not counted, none of them stated. Ours: 70 to 75 per cent, with all four filled in from a Belgian S/4HANA Public Cloud assessment.",
    caption:
      "A figure on a case study here fills all four slots or it does not appear as a figure. That is a build rule, which is why several of these studies carry no percentage at all.",
  },
  {
    file: "z4-footprint-layers",
    title: "Office, entity, delivery centre — four questions, four answers",
    page: "/about/markets/",
    alt: "Five markets across, four layers down. Staffed delivery centres exist only in India — Bengaluru, Hyderabad, Delhi NCR and Bhubaneswar — and that row is empty for South Africa, Kenya, Singapore and the UAE. All five markets have an office, a legal entity and a stated data residency position.",
    caption:
      "An office is not a delivery centre, and a legal entity is not either. Four separate questions, four different answers.",
  },
  {
    file: "q1-reference-book",
    title: "The client reference book, by sector",
    page: "/case-studies/",
    alt: "The client reference book, by sector — power and utilities, metals and mining, consumer and retail, government and transport, technology and services — with the named engagement behind each entry.",
    caption:
      "Every entry is an engagement evidenced by a purchase order or a signed contract, not a logo somebody had a file for.",
  },
  {
    file: "p2-where-we-are",
    title: "Where we are registered, staffed and delivering",
    page: "/about/credentials/",
    alt: "Where In2IT EBS is registered, staffed and delivering: the Bengaluru headquarters, the four staffed delivery centres in India, the overseas offices and the five legal entities, with the countries each covers.",
  },
];

for (const d of argued) {
  pb();
  w(`## ${esc(d.title)}`);
  w();
  w(`\`${d.page}\``);
  w();
  w(`![${esc(d.alt)}](diagrams/${d.file}.png)`);
  w();
  if (d.caption) {
    w(`*${esc(d.caption)}*`);
    w();
  }
  w(`**Alt text published:** ${esc(d.alt)}`);
  w();
}

process.stdout.write(out.join("\n") + "\n");

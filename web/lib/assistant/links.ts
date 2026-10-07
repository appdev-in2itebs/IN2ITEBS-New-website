import { serviceGroups } from "@/content/legacy-services";
import type { Faq, SiteEntry } from "@/lib/chatbot/engine";
import { searchSite } from "./knowledge";

/**
 * Links in the assistant's answers, made by the server rather than left to the model, so an answer
 * always points to the website's own pages:
 *  - every service, industry, partner or key page named in the answer becomes a link to that page;
 *  - a bare path the model wrote ("[/contact/]") becomes a proper link;
 *  - a question answered without any link gets "Read more" with the best-matching page.
 * Only this website's paths are ever used.
 */

type Page = { title: string; url: string };

const KEY_PAGES: Page[] = [
  { title: "Current Openings", url: "/careers/current-openings/" },
  { title: "current openings", url: "/careers/current-openings/" },
  { title: "contact page", url: "/contact/" },
  { title: "Case Studies", url: "/case-studies/" },
  { title: "case studies", url: "/case-studies/" },
  { title: "Insights", url: "/insights/" },
];

/**
 * The sections of the website that answer the common company questions, by their headings:
 * homepage "Global footprint — Where we are." (#offices) and "The people behind the work — Meet our
 * team." (#team); About "Global footprint" (#footprint) and "Leadership — Led by people who have done
 * it before." (#leadership); and the contact page. The first topic whose question pattern matches wins.
 */
export const SECTIONS: { ask: RegExp; links: Page[] }[] = [
  {
    ask: /\b((about|meet|know) (your|the) team|team members|who is (on|in) (your|the) team|leadership|leaders?|management team|founders?|md|ceo|coo|cro|cto|cfo|managing director|directors?|chairman|who (runs|leads|owns|manages|founded))\b|प्रबंध निदेशक|टीम/i,
    links: [
      { title: "Meet our team", url: "/#team" },
      { title: "Leadership", url: "/about/#leadership" },
    ],
  },
  {
    // "In our clients' words — What people say." (Customer Stories, #testimonials) and the
    // Clients & Case Studies page.
    ask: /\b(testimonials?|reviews?|feedback|(clients?|customers?|clines?)['’]? words|what (do |does |are |is )?(your |the |a |our )?(clients?|customers?|people) (says?|saying|said|thinks?)|(clients?|customers?) (says?|said|thinks?)|customer stories|success stor(y|ies)|case stud(y|ies)|references?|(your|existing|current|major|top|big|some) (clients|customers)|client list|clientele|who (are|were) your (clients|customers)|worked with|past projects?|projects you (have )?done|done (this|it) before|portfolio)\b|ग्राहक|केस स्टडी/i,
    links: [
      { title: "What people say", url: "/about/customer-stories/#testimonials" },
      { title: "Clients & Case Studies", url: "/case-studies/" },
    ],
  },
  {
    // "Offices", "your office", "an office in Dubai"; not a workplace ("an application for our office").
    ask: /\b(footprint|locations?|located|offices|(your|head|main|regional|registered|corporate|nearest) office|office (in|at|near|address(es)?|locations?)|branch(es)?|countr(y|ies)|cit(y|ies)|presen(ce|t)|based (in|out of)|operate (in|from)|worldwide|around the world|where (are|is) (you|your|the|in2it)|address|headquarter(s|ed)?|hq|delivery cent(re|er)s?)\b|कहाँ|ऑफिस|कार्यालय/i,
    links: [
      { title: "Global footprint: Where we are (office map)", url: "/#offices" },
      { title: "Global footprint", url: "/about/#footprint" },
      { title: "Contact and offices", url: "/contact/" },
    ],
  },
  {
    ask: /\b(contact|reach (you|out)|get in touch|email|e-mail|phone|call you|talk to (someone|sales|a person))\b|संपर्क/i,
    links: [{ title: "Contact page", url: "/contact/" }],
  },
];

/** Asking for someone's private details: never unblocked by `aboutLeadership`. */
const PRIVATE_ASK =
  /\b(personal|private|mobile|cell|phone|number|whats ?app|home|house|address|lives?|family|wife|husband|children|kids|salary|income|net worth|age|born|married|religion|caste|email)\b/i;

/**
 * True for a question about the company's own leadership or team ("who is the COO?", "tell me about
 * Abhijit Shukla"): the website shows them, so it is always in scope, whatever the guardrail lists
 * say. A request for anyone's private details is not covered.
 */
export function aboutLeadership(message: string, index: SiteEntry[]): boolean {
  if (PRIVATE_ASK.test(message)) return false;
  if (SECTIONS[0].ask.test(message)) return true;
  const names = index
    .filter((e) => e.url.startsWith("/about/") && e.title !== "Leadership team")
    .flatMap((e) => e.title.split(/\s+/))
    .filter((w) => w.length >= 4);
  return names.some((n) => new RegExp(`\\b${escape(n)}\\b`, "i").test(message));
}

/** Every page that may be linked, by the name an answer would use, longest names first. */
export function linkablePages(index: SiteEntry[]): Page[] {
  const pages: Page[] = [
    ...serviceGroups.map((g) => ({ title: g.name, url: g.href })),
    ...index
      .filter((e) => e.url !== "/contact/")
      .map((e) => ({ title: e.title.replace(/ partnership$/, ""), url: e.url })),
    ...KEY_PAGES,
  ];
  const seen = new Set<string>();
  return pages
    .filter((p) => p.title.length >= 4 && !seen.has(p.title) && seen.add(p.title))
    .sort((a, b) => b.title.length - a.title.length);
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function addLinks(
  text: string,
  opts: { index: SiteEntry[]; faqs: Faq[]; question?: string; maxLinks?: number },
): string {
  const pages = linkablePages(opts.index);
  const byUrl = new Map(pages.map((p) => [p.url, p.title]));
  let out = text;

  // "[/contact/]" or "(/contact/)" left bare → a proper link.
  out = out.replace(
    /(?<!\])\[(\/[a-z0-9\-/]*\/)\](?!\()/gi,
    (_, url: string) => `[${byUrl.get(url) ?? "Read more"}](${url})`,
  );

  // "[here](/path/)" → the page's own name.
  out = out.replace(/\[(?:here|click here|this page|link)\]\((\/[^)\s]*)\)/gi, (m, url: string) => {
    const name = byUrl.get(url) ?? SECTIONS.flatMap((s) => s.links).find((l) => l.url === url)?.title;
    return name ? `[${name}](${url})` : m;
  });

  // A link named after a known page or person but pointing elsewhere goes to the right page
  // ("[Kunwar Krishna Menon](/about/our-leadership/)" → his section on /about/).
  const byTitle = new Map(pages.map((p) => [p.title.toLowerCase(), p.url]));
  out = out.replace(/\[([^\]\n]+)\]\((\/[^)\s]*)\)/g, (m, name: string, url: string) => {
    const right = byTitle.get(name.trim().toLowerCase());
    return right && right !== url ? `[${name}](${right})` : m;
  });

  // "[Name](/path/) (/path/)": the second, bare copy goes.
  out = out.replace(/(\]\((\/[^)\s]*)\))\s*\(\2\)/g, "$1");
  // "Name (/path/)": a bare path in brackets after a name becomes a link on that name, or goes.
  out = out.replace(
    /([A-Z][\w&'’\-]*(?:\s+[\w&'’\-]+){0,5})\s+\((\/[a-z0-9\-/]*\/)\)/g,
    (_m, name: string, url: string) => (/\]$/.test(name) ? name : `[${name}](${url})`),
  );
  const linked = new Set([...out.matchAll(/\]\((\/[^)\s]*)\)/g)].map((m) => m[1]));
  let added = 0;
  const max = opts.maxLinks ?? 8;
  // Text already handled is set aside behind a placeholder, so a shorter name is never linked
  // inside a link or inside a longer name ("Analytics" within "Data Analytics & AI").
  const masks: string[] = [];
  const mask = (s: string) => `\u0000${masks.push(s) - 1}\u0000`;
  out = out.replace(/\[[^\]\n]*\]\([^)\s]*\)/g, mask);
  for (const page of pages) {
    // Whole words; names of two or more words in any case ("digital services").
    const re = new RegExp(`(^|[^\\w/])(${escape(page.title)})(?!\\w)`, page.title.includes(" ") ? "gi" : "g");
    // Several people share one section of a page (/about/#leadership): each name gets its link.
    const key = page.url.includes("#") ? `${page.url} ${page.title}` : page.url;
    out = out.replace(re, (_m, pre: string, name: string) => {
      if (linked.has(key) || added >= max) return pre + mask(name);
      linked.add(key);
      added++;
      return pre + mask(`[${name}](${page.url})`);
    });
  }
  out = out.replace(/\u0000(\d+)\u0000/g, (_m, i: string) => masks[Number(i)]);

  // Questions about where the company is, who runs it or how to reach it: the website sections that
  // show exactly that, added after the answer when the answer has not linked them already.
  const topic = opts.question ? SECTIONS.find((s) => s.ask.test(opts.question!)) : undefined;
  if (topic) {
    const have = new Set([...out.matchAll(/\]\((\/[^)\s]*)\)/g)].map((m) => m[1]));
    const more = topic.links.filter((l) => !have.has(l.url));
    if (more.length) out = `${out.trimEnd()}\n\nSee: ${more.map((l) => `[${l.title}](${l.url})`).join(" · ")}`;
    return out;
  }

  // A question answered with no link at all: point to the best page for it.
  const isQuestion =
    !!opts.question &&
    /\?|^\s*(what|which|how|do|does|can|could|tell|show|where|who|is|are|explain|list)\b/i.test(opts.question);
  if (!/\]\(\//.test(out) && isQuestion) {
    const best = searchSite(opts.index, opts.faqs, opts.question!, 1)[0];
    if (best?.url) out = `${out.trimEnd()}\n\nRead more: [${best.title.replace(/ partnership$/, "")}](${best.url})`;
  }
  return out;
}

/** A spoken answer: links become their words, and bare page addresses and web links go. */
export function withoutAddresses(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s*\[\/[^\]\s]*\]|\s*\(\/[^)\s]*\)|\s*https?:\/\/\S+/gi, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

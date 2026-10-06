/**
 * The website assistant's brain, without an AI model: it recognises a few intents (greeting,
 * thanks, sharing a requirement, careers, offices) and otherwise finds the best answer among the
 * editors' FAQs and the site's own pages by keyword overlap. Pure and synchronous, so it is unit
 * tested directly; the API route supplies the FAQs and openings from Supabase.
 *
 * When an LLM is added later, this stays as the retrieval step: its matches become the passages the
 * model is allowed to answer from.
 */

export type Faq = {
  id?: string;
  question: string;
  answer: string;
  keywords: string[];
  link_url?: string | null;
  link_label?: string | null;
};

export type SiteEntry = {
  title: string;
  summary: string;
  url: string;
  keywords: string[];
  /** More of the page's own text (introduction and section headings), for the AI assistant's answers. */
  detail?: string;
  /** Other names that count as much as the title in a search: a leader's role ("coo", "managing director"). */
  aliases?: string[];
};

export type Opening = { id: string; title: string; location: string; employment_type: string };

export type BotLink = { label: string; url: string };

export type BotReply = {
  text: string;
  links?: BotLink[];
  suggestions?: string[];
  /** The widget switches to its step-by-step details form. */
  action?: "collect-lead";
  openings?: Opening[];
  /** What the engine decided, recorded with the message for review in /admin. */
  intent: string;
};

const STOP = new Set(
  "a an and are as at be by can could do does for from have how i if in is it its me my of on or our please tell the this to us we what when where which who will with would you your about any there".split(
    " ",
  ),
);

/** Lower-case words, without punctuation and filler words. */
export function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9/&+\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

const has = (text: string, words: string[]) => {
  const t = ` ${text.toLowerCase().replace(/[^a-z0-9\s]/g, " ")} `;
  return words.some((w) => t.includes(` ${w} `));
};

const GREETING = ["hi", "hello", "hey", "hii", "good morning", "good afternoon", "good evening", "namaste"];
const THANKS = ["thanks", "thank you", "thx", "great", "ok thanks", "cool"];
const REQUIREMENT = [
  "share my requirement",
  "requirement",
  "requirements",
  "quote",
  "quotation",
  "proposal",
  "pricing",
  "price",
  "cost",
  "talk to sales",
  "contact sales",
  "speak to",
  "talk to",
  "call me",
  "call back",
  "callback",
  "demo",
  "consultation",
  "need help",
  "interested",
  "hire you",
  "engage",
];
const CAREERS = [
  "job",
  "jobs",
  "career",
  "careers",
  "hiring",
  "opening",
  "openings",
  "vacancy",
  "vacancies",
  "apply",
  "fresher",
  "internship",
  "current openings",
];
const OFFICES = [
  "office",
  "offices",
  "office locations",
  "address",
  "location",
  "locations",
  "where are you",
  "located",
];

/** How well an FAQ matches: keywords count double, question words once. */
function faqScore(words: string[], faq: Faq) {
  const keys = new Set(faq.keywords.map((k) => k.toLowerCase()));
  const q = new Set(tokens(faq.question));
  let score = 0;
  const joined = ` ${words.join(" ")} `;
  for (const k of keys) if (k.includes(" ") ? joined.includes(` ${k} `) : words.includes(k)) score += 2;
  for (const w of words) if (q.has(w)) score += 1;
  return score;
}

function siteScore(words: string[], entry: SiteEntry) {
  const title = new Set(tokens(entry.title));
  const keys = new Set(entry.keywords.map((k) => k.toLowerCase()));
  const summary = new Set(tokens(entry.summary));
  let score = 0;
  for (const w of words) {
    if (title.has(w)) score += 2;
    else if (keys.has(w)) score += 1.5;
    else if (summary.has(w)) score += 0.5;
  }
  return score;
}

export function reply(
  message: string,
  knowledge: { faqs: Faq[]; site: SiteEntry[]; openings: Opening[]; quickReplies?: string[]; contactEmail?: string },
): BotReply {
  const text = message.trim();
  const words = tokens(text);
  const quick = knowledge.quickReplies?.length
    ? knowledge.quickReplies
    : ["Our services", "Current openings", "Share my requirement"];
  const email = knowledge.contactEmail || "info@in2itebs.com";

  if (!text) return { intent: "empty", text: "How can I help you today?", suggestions: quick };

  if (has(text, REQUIREMENT))
    return {
      intent: "requirement",
      action: "collect-lead",
      text: "Happy to help. I will take a few details so the right consultant can get back to you, usually within one working day.",
    };

  if (has(text, CAREERS)) {
    const open = knowledge.openings;
    return {
      intent: "careers",
      text: open.length
        ? `We have ${open.length} open ${open.length === 1 ? "role" : "roles"} right now. Pick one to see the details and apply with your CV.`
        : "There are no open roles listed right now, but you can still send us your CV through the careers page.",
      openings: open.slice(0, 8),
      links: [{ label: "All current openings", url: "/careers/current-openings/" }],
      suggestions: ["Our culture", "Share my requirement"],
    };
  }

  if (words.length <= 3 && has(text, GREETING))
    return { intent: "greeting", text: "Hello! What would you like to know about In2IT EBS?", suggestions: quick };

  if (words.length <= 4 && has(text, THANKS))
    return { intent: "thanks", text: "You are welcome. Anything else I can help with?", suggestions: quick };

  // Best FAQ first: an editor wrote it, so it is the most trustworthy answer.
  const rankedFaqs = knowledge.faqs
    .map((faq) => ({ faq, score: faqScore(words, faq) }))
    .filter((r) => r.score >= 2)
    .sort((a, b) => b.score - a.score);
  if (rankedFaqs.length) {
    const best = rankedFaqs[0].faq;
    const links: BotLink[] = best.link_url ? [{ label: best.link_label || "Read more", url: best.link_url }] : [];
    const related = rankedFaqs
      .slice(1, 3)
      .map((r) => r.faq.question)
      .filter((q) => q !== best.question);
    return { intent: "faq", text: best.answer, links, suggestions: related.length ? related : quick.slice(0, 3) };
  }

  if (has(text, OFFICES))
    return {
      intent: "offices",
      text: "Our offices and the right contact for each region are on the contact page.",
      links: [{ label: "Contact and offices", url: "/contact/" }],
      suggestions: ["Share my requirement"],
    };

  // Otherwise point to the pages that cover it.
  const pages = knowledge.site
    .map((entry) => ({ entry, score: siteScore(words, entry) }))
    .filter((r) => r.score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  if (pages.length)
    return {
      intent: "pages",
      text:
        pages.length === 1
          ? `${pages[0].entry.summary || "This page covers it."}`
          : "These pages cover what you asked about:",
      links: pages.map((p) => ({ label: p.entry.title, url: p.entry.url })),
      suggestions: ["Share my requirement", ...quick.slice(0, 2)],
    };

  return {
    intent: "fallback",
    text: `I do not have an answer to that yet. You can share your requirement and our team will reply, or email ${email}.`,
    suggestions: ["Share my requirement", ...quick.slice(0, 2)],
  };
}

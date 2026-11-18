import type { Insight } from "./types";
import { insightBodies } from "./insight-bodies";

/**
 * "News & articles" — the existing site's archive, ported one for one from in2itebs.com/news/
 * (both listing pages, captured 2026-09-17). Every title, date label, blurb, image and running
 * order is the live site's; nothing here is rewritten or invented.
 *
 * `date` is an ISO date only where the article prints one in its author byline. The rest show the
 * day and month the listing shows and no year, because the live site does not state one — so
 * `dateLabel` carries that exact label and `date` stays empty rather than guessing a year.
 *
 * Slugs are the live site's own URL slugs, several of which do not match their headline (the CRM
 * piece lives at /what-you-do-today-improve-your-tomorrows/). They are kept as-is so the old links
 * and content/redirects.mjs keep lining up.
 */
export const insights: Insight[] = [
  {
    slug: "revolutionizing-hr-with-sap-successfactors-a-strategic-approach-to-modern-hcm-solutions",
    title: "The SuccessFactors sequencing decision most HR teams get backwards",
    date: "2026-11-18",
    dateLabel: "18 Nov",
    category: "SuccessFactors",
    excerpt:
      "Programmes are usually sequenced around what hurts most. That is the wrong input, and it is why rollouts stall at module three.",
    image: "/insights/revolutionizing-hr-with-sap-successfactors-a-strategic-approach-to-modern-hcm-solutions.jpg",
  },
  {
    slug: "igniting-organizational-potential-sap-successfactors-ai-innovations-revealed-at-sap-successconnect-las-vegas",
    title: "SuccessFactors AI: what is generally available, and what is still a roadmap",
    date: "2026-11-18",
    dateLabel: "18 Nov",
    category: "AI",
    excerpt:
      "Three capabilities worth understanding, our own position stated narrowly, and the one metric that predicts whether a pilot survives.",
    image:
      "/insights/igniting-organizational-potential-sap-successfactors-ai-innovations-revealed-at-sap-successconnect-las-vegas.jpg",
  },
  {
    // Was an expired event landing page carrying SAP's own campaign strapline, "Quickly and
    // Confidently Adopt Cloud ERP" — SAP's words, used verbatim by several SAP partners. Rewritten
    // 18 November 2026 into an article with an argument of its own. Slug kept for the inbound links.
    slug: "grow-with-sap",
    title: "What GROW with SAP commits to, and three questions to settle first",
    date: "2026-11-18",
    dateLabel: "18 Nov",
    category: "SAP",
    excerpt:
      "The constraint is the point of it, and it is the thing most buyers do not price properly. What the model trades, and how to test the fit.",
    image: "/insights/grow-with-sap.jpg",
  },
  {
    slug: "in2it-ebs-simplify-talent-2",
    title: "In2IT EBS-Simplify Talent",
    date: "",
    dateLabel: "26 Jul",
    category: "SuccessFactors",
    excerpt:
      "SimplifyTalent, an SAP Qualified Partner Package which leverages the global best practices of SAP SuccessFactors software solution portfolio aligning with…",
    image: "/insights/in2it-ebs-simplify-talent-2.jpg",
  },
  {
    slug: "in2it-ebs-simplify-hiring",
    title: "In2IT EBS – Simplify Hiring",
    date: "",
    dateLabel: "26 Jul",
    category: "SuccessFactors",
    excerpt:
      "Simplify Hiring is an SAP Qualified Partner Package which leverages the global best practices of SAP SuccessFactors solution portfolio, aligning with…",
    image: "/insights/in2it-ebs-simplify-hiring.png",
  },
  {
    slug: "how-rise-with-sap-s-4hana-cloud-can-transform-your-business",
    title: "What RISE actually changes, and what it does not",
    date: "2026-11-18",
    dateLabel: "18 Nov",
    category: "SAP",
    excerpt:
      "RISE is sold as a destination. It is closer to a contracting model, and the difference decides how much of your migration it covers.",
    image: "/insights/how-rise-with-sap-s-4hana-cloud-can-transform-your-business.png",
  },
];

/** Guard: every entry that resolves to an article page here must have a body to render. */
for (const entry of insights)
  if (!entry.href && !insightBodies[entry.slug]) throw new Error(`insight "${entry.slug}" has no body`);

/** The entries that are real articles on this site, i.e. everything with a page of its own. */
export const insightArticles = insights.filter((entry) => !entry.href);

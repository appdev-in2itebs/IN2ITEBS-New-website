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
    title: "Revolutionizing HR with SAP SuccessFactors: A Strategic Approach to Modern HCM Solutions",
    date: "",
    dateLabel: "25 Feb",
    category: "SuccessFactors",
    excerpt:
      "In the modern business landscape, effective Human Capital Management (HCM) is essential for driving success. Organizations need to attract, retain, and…",
    image: "/insights/revolutionizing-hr-with-sap-successfactors-a-strategic-approach-to-modern-hcm-solutions.jpg",
  },
  {
    slug: "igniting-organizational-potential-sap-successfactors-ai-innovations-revealed-at-sap-successconnect-las-vegas",
    title:
      "Igniting Organizational Potential: SAP SuccessFactors AI Innovations Revealed at SAP SuccessConnect, Las Vegas",
    date: "",
    dateLabel: "12 Oct",
    category: "AI",
    excerpt:
      "At the annual SuccessConnect event at the Venetian Convention Center in Las Vegas, SAP unveiled how AI now encompasses the entire SAP SuccessFactors Human…",
    image:
      "/insights/igniting-organizational-potential-sap-successfactors-ai-innovations-revealed-at-sap-successconnect-las-vegas.jpg",
  },
  {
    // An event landing page on the live site rather than a written article: a forum title, a
    // strapline and a "Register Now" button. Its "Read more" opens exactly that here, like every
    // other card, so nothing that is not on the live page is shown.
    slug: "grow-with-sap",
    title: "GROW WITH SAP",
    date: "",
    dateLabel: "17 Aug",
    category: "SAP",
    excerpt: "Quickly and Confidently Adopt Cloud ERP",
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
    title: "How Rise with SAP S/4HANA Cloud Can Transform Your Business",
    date: "",
    dateLabel: "17 Jul",
    category: "SAP",
    excerpt:
      "SAP S/4HANA Cloud is a next-generation enterprise resource planning (ERP) software solution that enables businesses to gain real-time insights and analytics…",
    image: "/insights/how-rise-with-sap-s-4hana-cloud-can-transform-your-business.png",
  },
];

/** Guard: every entry that resolves to an article page here must have a body to render. */
for (const entry of insights)
  if (!entry.href && !insightBodies[entry.slug]) throw new Error(`insight "${entry.slug}" has no body`);

/** The entries that are real articles on this site, i.e. everything with a page of its own. */
export const insightArticles = insights.filter((entry) => !entry.href);

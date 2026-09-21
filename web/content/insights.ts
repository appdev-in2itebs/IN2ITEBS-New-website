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
  {
    slug: "coronavirus-lockdown-leads-to-more-gaming-and-e-sports",
    title: "Coronavirus lockdown leads to more gaming and e-Sports",
    date: "",
    dateLabel: "21 Jun",
    category: "Industry",
    excerpt:
      "The esports and gaming part may end up being an unexpected champ as ~45 M or more Chinese are in lockdown to forestall the spread of the coronavirus. The…",
    image: "/insights/coronavirus-lockdown-leads-to-more-gaming-and-e-sports.jpg",
  },
  {
    slug: "future-where-technology-creates-good-jobs",
    title: "Mrs Bectors Food-SAP SuccessFactors Go-Live partnering with In2IT EBS",
    date: "",
    dateLabel: "08 Dec",
    category: "Customer story",
    excerpt:
      "9th May 2022 is a day to remember and celebrate as a MBFSL team as together are taking a LEAP (Leveraging Effectiveness thru Automating Processes) by moving…",
    image: "/insights/future-where-technology-creates-good-jobs.jpg",
  },
  {
    slug: "what-you-do-today-improve-your-tomorrows",
    title: "Top Benefits Of Implementing A CRM For Your Business",
    date: "2022-04-18",
    dateLabel: "08 Dec",
    category: "CRM",
    excerpt:
      "You’ve probably heard about CRMs but do you know what the benefits are for implementing one at your business?",
    image: "/insights/what-you-do-today-improve-your-tomorrows.jpg",
  },
  {
    slug: "attract-and-retain-quality-high-paying-customers",
    title: "How ERP Software Is Able To Identify Business Inefficiencies",
    date: "2022-04-05",
    dateLabel: "08 Dec",
    category: "ERP",
    excerpt:
      "Enterprise Resource Planning (or ERP) software has revolutionised the ways in which companies work in the modern world. Efficiency and speed are now…",
    image: "/insights/attract-and-retain-quality-high-paying-customers.jpg",
  },
  {
    slug: "solutions-for-all-small-and-large-business",
    title: "How To Choose The Best CRM For Your Sales Automation",
    date: "2022-04-07",
    dateLabel: "08 Dec",
    category: "CRM",
    excerpt:
      "Finding ways to automate sales is one of the top priorities of many companies. After all, it’s a solution that can make the business more profitable through…",
    image: "/insights/solutions-for-all-small-and-large-business.jpg",
  },
  {
    slug: "live-stream-from-awwwards-showcasing-trends",
    title: "A Closer Look At Hubspot’s 2022 Hybrid Work Report￼￼",
    date: "2022-03-29",
    dateLabel: "08 Dec",
    category: "Industry",
    excerpt:
      "Hubspot’s 2022 Hybrid Work Report focused on the ways in which the world worked during 2021 as well as what is likely to lie ahead in the future. So, what…",
    image: "/insights/live-stream-from-awwwards-showcasing-trends.jpg",
  },
];

/** Guard: every entry that resolves to an article page here must have a body to render. */
for (const entry of insights)
  if (!entry.href && !insightBodies[entry.slug]) throw new Error(`insight "${entry.slug}" has no body`);

/** The entries that are real articles on this site, i.e. everything with a page of its own. */
export const insightArticles = insights.filter((entry) => !entry.href);

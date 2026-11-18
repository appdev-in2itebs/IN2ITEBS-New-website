/**
 * QUESTIONS THIS SITE ALREADY ANSWERS, WRITTEN AS QUESTIONS.
 *
 * ── WHY ──────────────────────────────────────────────────────────────────────────────────────
 * The headings on this site are statements. "What we have done, what we are building, and what
 * we cannot do" is the best headline on the site and it matches nothing anybody types into
 * anything. A search engine ranks pages; an assistant retrieves *passages*, and it retrieves
 * them best when the passage is shaped like the question it answers.
 *
 * Increasingly the first reader of this site is not a person. For a firm selling eighteen-month
 * SAP programmes to committees, the assistant drafting the buyer's long-list sits upstream of
 * the first conversation, and the questions below are the ones it is actually being asked:
 * *is In2IT EBS a RISE validated partner, how many delivery centres do they really have, what
 * does their "delivered" status mean, which ECC deadline applies to me.*
 *
 * ── THE RULE THAT MAKES THIS SAFE ────────────────────────────────────────────────────────────
 * **No answer here may say anything the page does not already say.**
 *
 * An FAQ block is the easiest place on a website to quietly soften a claim — nobody reviews it,
 * it reads like housekeeping, and six months later it is the only version a machine has read. So
 * every `answer` below is lifted verbatim from shipped copy, every entry names the `source` file
 * it came from, and `tests/metadata.test.ts` fails the build if the text is no longer found
 * there. Edit the page and this file breaks, which is the correct direction for the dependency
 * to run.
 *
 * That gate is the whole reason this file is allowed to exist. An FAQ that has drifted from its
 * page is two different answers to one question, published by a site whose argument is that its
 * claims hold still.
 *
 * ── WHAT DOES NOT BELONG HERE ────────────────────────────────────────────────────────────────
 * Questions we would like to be asked. This is not a place to stage marketing copy as a
 * question; it is a machine-readable index of answers that already exist. If the answer is not
 * on the page, the work is to write the page.
 */

export interface Faq {
  /** The route whose JSON-LD carries this question. */
  route: string;
  /** Phrased the way a buyer asks it, not the way we would title it. */
  question: string;
  /** Verbatim from `source`. See the rule above. */
  answer: string;
  /** Repo-relative path of the file the answer is published from. */
  source: string;
  /**
   * The exact substring of `answer` that must appear in `source`, when the answer joins two
   * sentences or trims a clause. Defaults to the whole answer.
   */
  anchor?: string;
}

export const faqs: Faq[] = [
  // ── The capability register ──────────────────────────────────────────────────────────────
  {
    route: "/about/where-we-stand/",
    question: "Is In2IT EBS a RISE with SAP Validated Partner?",
    answer:
      "We do not hold it. Some Indian public-sector tenders use it as a pre-qualification, and where they do we are not eligible unless we bid with a partner who holds it. We will tell you that at the start of a pursuit rather than at the end.",
    source: "content/capability-status.ts",
  },
  {
    route: "/about/where-we-stand/",
    question: "What does In2IT EBS mean when it says a capability is delivered?",
    answer: "In production at a named client, signed off, with a named person here accountable for it.",
    source: "content/capability-status.ts",
  },
  {
    route: "/about/where-we-stand/",
    question: "What does In2IT EBS not do?",
    answer: "We do not do this. If you need it, we will say so and point you at someone who does.",
    source: "content/capability-status.ts",
  },

  // ── The footprint ────────────────────────────────────────────────────────────────────────
  {
    route: "/about/markets/",
    question: "How many delivery centres does In2IT EBS have, and where are they?",
    answer:
      "A delivery centre is somewhere you can visit. Every city on this page has people in it. An entity without a staffed office is listed as an entity, not as a delivery centre.",
    source: "app/about/markets/page.tsx",
  },
  {
    route: "/about/credentials/",
    question: "Why does In2IT EBS say four delivery centres when other sources say eight?",
    answer:
      "A delivery centre is somewhere staffed that you can visit. That distinction is the reason this page says four and not eight, and it is the same number our submitted bids carry.",
    source: "app/about/credentials/page.tsx",
  },

  // ── Commercials ──────────────────────────────────────────────────────────────────────────
  {
    route: "/services/how-we-price/",
    question: "What counts as a change request on an In2IT EBS project?",
    answer:
      "A change request is work outside what was written down at the point of signature — not work that turned out to be harder than we expected. If we underestimated, that is our risk and we carry it. If you asked for something different, that is a change. We will tell you which it is in writing, with the clause that says so, before any work on it starts.",
    source: "app/services/how-we-price/page.tsx",
  },
  {
    route: "/services/how-we-price/",
    question: "Does an In2IT EBS assessment commit you to the project that follows?",
    answer:
      "Where we propose an assessment first, it is a fixed price with no onward commitment, and you own the output. That includes the version of the output that says do nothing, or that says somebody else is the better fit.",
    source: "app/services/how-we-price/page.tsx",
  },

  // ── The question most of this market is being asked this year ────────────────────────────
  {
    route: "/services/ecc-prism/",
    question: "When does SAP ECC support end — 2027, 2030 or 2033?",
    answer:
      "Most ECC customers believe they are facing a single deadline. They are facing three, they are eligible for only one of them, and almost nobody has checked which.",
    source: "content/legacy-services.ts",
  },
];

/** The entries for one route, in the order they are declared. */
export function faqsFor(route: string): Faq[] {
  return faqs.filter((faq) => faq.route === route);
}

/** Every route that carries FAQ markup — used by the test that checks each one still exists. */
export function faqRoutes(): string[] {
  return [...new Set(faqs.map((faq) => faq.route))];
}

/**
 * WHAT WE GOT WRONG — the public corrections log.
 *
 * ── READ THIS BEFORE YOU ADD AN ENTRY ────────────────────────────────────────────────────────
 * This page exists for one reason: every consultancy in this market claims integrity, and none of
 * them publishes their own errata. A buyer who reads this page has just watched us pay a price
 * for honesty rather than describe it, and every other claim on the site gets more credible as a
 * result. That effect is fragile and it is easy to destroy.
 *
 * THE CURATION RULE, AND IT IS THE WHOLE POINT.
 *
 * 1. AN ENTRY MUST HAVE COST SOMETHING. A correction that made a claim smaller, withdrew a
 *    designation, or admitted a number was wrong belongs here. A typo does not. A broken link
 *    does not. A redesign does not. **A log of typos is worse than no log**, because it reads as
 *    a firm performing humility while conceding nothing, which is a more expensive thing to be
 *    caught doing than simply having been wrong.
 * 2. NOTHING IS EVER DELETED FROM THIS FILE. Entries age out of nothing. If an entry becomes
 *    embarrassing later, that is the entry doing its job. The moment somebody removes one, the
 *    page is no longer a record and everything above it becomes marketing.
 * 3. WRITE WHAT WE PUBLISHED, NOT A SOFTENED VERSION OF IT. `published` is the claim as a visitor
 *    would have read it. If the honest version of that sentence is uncomfortable to type, type it
 *    anyway — a correction that hides what was actually said is not a correction.
 * 4. NO ENTRY MAY BLAME A TOOL, A VENDOR, A PREVIOUS AGENCY OR AN INTERN. We published it.
 *
 * ── WHAT IS DELIBERATELY NOT HERE ────────────────────────────────────────────────────────────
 * Internal mistakes that never reached a visitor. Drafting errors caught in review. Anything from
 * a document that was never published. This is a log of **things people could have read on this
 * site and believed**, not a log of our working.
 *
 * ── BEFORE THIS PAGE GOES LIVE ───────────────────────────────────────────────────────────────
 * Every entry below is drawn from a real commit on the content rebuild branch, cited in `source`.
 * They are accurate to the repository. They have not yet been confirmed by the Managing Director
 * as things In2IT is content to say in public, and that is a commercial decision rather than a
 * factual one. `published: false` on an entry keeps it in the record and off the page.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */

export interface Correction {
  /** ISO date the correction was made, not the date the error was introduced. */
  date: string;
  /** What the correction is about, in a few words. */
  heading: string;
  /** The claim as a visitor would have read it. Quote it; do not soften it. */
  published: string;
  /** What is actually true. */
  correct: string;
  /** What we did about it. */
  action: string;
  /** Where it was published, if it was one place. */
  where?: string;
  /**
   * True when the correction made a claim *smaller* — a withdrawn designation, a reduced count, a
   * capability un-claimed. The page counts these, because a log with none of them is a log of
   * typos and the curation rule above exists to prevent exactly that.
   */
  reduced?: boolean;
  /** The commit this is drawn from, so anyone can check the record against the repository. */
  source: string;
  /** Set false to keep an entry in the record but off the public page. Never delete an entry. */
  published_: boolean;
}

/** The date a person last reviewed this log for completeness. */
export const correctionsReviewed = "2026-11-18";

export const corrections: Correction[] = [
  {
    date: "2026-11-18",
    heading: "We used SAP's product name as the name of our own offer",
    published: "A packaged In2IT offer called “GROW Fast”.",
    correct:
      "GROW is SAP's product. The construction SAP approves for a partner package is <our name> for <SAP product> — and we already held three names SAP had qualified, so we had been inventing a problem as well as a trademark risk.",
    action:
      "Renamed to In2IT Converged Pulse for SAP GROW Fast, which SAP had already reviewed and listed. Five historic URLs redirect to the new one.",
    where: "/services/converged-pulse/",
    reduced: true,
    source: "c33236a",
    published_: true,
  },
  {
    date: "2026-11-18",
    heading: "We published the wrong end date for SAP ECC maintenance",
    published: "That mainstream maintenance for SAP ECC runs to 2035.",
    correct:
      "2033, for customers who take the transition option. The interactive checker on the same page had the right date all along; the prose around it did not.",
    action: "Corrected in the page copy and in the page's search description. The checker was already right.",
    where: "/services/ecc-prism/",
    source: "e20b511",
    published_: true,
  },
  {
    date: "2026-11-18",
    heading: "We treated a copyright status as a trademark clearance",
    published:
      "An internal note recording third-party partner logos as cleared for use because the source file was in the public domain.",
    correct:
      "Public domain is a copyright status. A trademark is a separate right and is not cleared by it. The logos are used nominatively, which is a different and narrower basis.",
    action:
      "The note was rewritten to state the actual basis, so the next person to rely on it relies on the right one.",
    reduced: true,
    source: "e20b511",
    published_: true,
  },
  {
    date: "2026-11-18",
    heading: "The homepage claimed four platforms our own register says we do not hold",
    published:
      "“The enterprise platforms we transform and run end-to-end”, above logos for Oracle, Microsoft Dynamics, ServiceNow and Qlik.",
    correct:
      "Our capability register says we hold no designation from any of those four and do not implement them. The register was right and the homepage was wrong — which is the correct way round for that disagreement to resolve, and the first time we checked which of the two was actually false rather than deleting whichever was easier to delete.",
    action:
      "The sentence changed to “The platforms our clients run. We implement some of these and integrate to others.” The logos stayed, because integrating to a platform is a real thing we do.",
    where: "/",
    reduced: true,
    source: "738a9a9",
    published_: true,
  },
  {
    date: "2026-11-18",
    heading: "Two figures that got less true every year",
    published: "“10+ years of experience” and “14+ industry verticals”.",
    correct:
      "The first ages on its own and had already stopped being the useful number. The second counted verticals nobody here could list on request.",
    action:
      "Both removed. The industry figure is now the number of industry pages we actually publish, which is nine and is checkable in about four seconds. A build gate now fails if nobody re-checks the corporate facts within 200 days.",
    where: "/",
    reduced: true,
    source: "e6a0f95",
    published_: true,
  },
  {
    date: "2026-11-18",
    heading: "Sixteen case studies were invisible to search engines",
    published: "Nothing — which was the problem. Sixteen published case study pages were missing from the sitemap.",
    correct:
      "The sitemap filter treated “anonymised” as “not for publication”. They are different things: a study can be published without naming the client.",
    action:
      "Every published study is now in the sitemap, and a test fails if that filter ever conflates the two again.",
    source: "6dd677d",
    published_: true,
  },
  {
    date: "2026-11-12",
    heading: "We said eight delivery centres. We have four",
    published: "Eight delivery centres, counting Singapore, Dubai, Nairobi and Johannesburg among them.",
    correct:
      "Four: Bengaluru, Hyderabad, Delhi NCR and Bhubaneswar. The other four are offices and legal entities — real, and not delivery centres.",
    action:
      "Corrected everywhere, including the chatbot's index, which was still answering eight after the pages had been fixed. Four is also the number in the Ghana IFMIS proposal already sitting with a client, so a bid in someone's hands and this website now agree.",
    reduced: true,
    source: "71f2f6b, e4d9912",
    published_: true,
  },
  {
    date: "2026-11-12",
    heading: "We claimed an SAP designation we could not evidence",
    published: "SAP PCE Partner, in the footer, on the credentials page and in the partner ecosystem note.",
    correct: "We could not evidence it in SAP's own wording with a date against it.",
    action:
      "Withdrawn from all three places. The credentials page now states on the page that we do not claim it, and why — a competitor can raise a gap either way, and a credentials page that names its own gaps is read as a record rather than a pitch.",
    where: "/about/credentials/",
    reduced: true,
    source: "71f2f6b",
    published_: true,
  },
  {
    date: "2026-11-12",
    heading: "Five wrong facts in one diagram about SAP maintenance",
    published:
      "A maintenance timeline carrying 2035 as the transition deadline, “+2 percentage points” for extended maintenance, a “2 TB minimum system”, a “20% uplift for 2026 sign-ups”, and the wrong announcement date.",
    correct:
      "2033. SAP says “an additional fee” and publishes no percentage. SAP has published no minimum database size. The uplift figure had no source at all. The announcement was 7 October 2026.",
    action:
      "All five removed. The gating conditions now state what SAP states, and the adoption figure is attributed to DSAG with its region and sample size, because it is DACH data and there is no reliable global equivalent.",
    reduced: true,
    source: "8fc1aac",
    published_: true,
  },
];

/** The entries that actually appear on the page. */
export const publicCorrections = corrections.filter((c) => c.published_);

/** Corrections that made a claim smaller. The curation rule above is about keeping this non-zero. */
export const reducedCount = publicCorrections.filter((c) => c.reduced).length;

/**
 * THE TWO THINGS A VISITOR CAN WORK OUT WITHOUT TALKING TO US.
 *
 * ── WHY THIS FILE EXISTS ─────────────────────────────────────────────────────────────────────
 * The Application Estate Review diagnostic and the ECC maintenance checker are the only places on
 * this site where a visitor gets something back before they give us anything. They were built,
 * shipped — and then reachable only by scrolling two-thirds of the way down a service page they
 * had to find first. The audit of November 2026 put it plainly: the strongest conversion assets on
 * the site had no path leading to them.
 *
 * So the entry points live here, once, and `ToolsBand` renders them on the homepage, the services
 * hub and the SAP pillar. One array means the three placements cannot drift, and adding a third
 * tool later is a line here rather than an edit in three files.
 *
 * ── WHAT QUALIFIES ───────────────────────────────────────────────────────────────────────────
 * A tool goes in this list only if it gives a real answer with no form in front of it, and only if
 * the answer would still be the answer if we never spoke to the person. The moment one of these
 * becomes a lead-capture wrapper it comes out of this band, because the band's whole claim is that
 * the thing behind the link is useful on its own.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */

export interface SiteTool {
  /** Short enough to read as a link, specific enough to be worth a click. */
  name: string;
  /** The page the tool sits on, with the anchor that scrolls to it. */
  href: string;
  /** The question the visitor is actually asking. First person, because they are asking it. */
  question: string;
  /** What they get back. No promise of a number we have not computed. */
  answer: string;
  /** How long it honestly takes. Measured, not rounded down. */
  duration: string;
}

export const siteTools: SiteTool[] = [
  {
    name: "ECC maintenance checker",
    href: "/services/ecc-prism/#checker",
    question: "How long is my ECC actually supported?",
    answer:
      "Five questions give you the door you are standing in front of — 2027, 2030 or the transition option — in SAP's own published terms, with the dates and the caveats.",
    duration: "About a minute",
  },
  {
    name: "Application Estate Review diagnostic",
    href: "/services/application-estate-review/#diagnostic",
    question: "How much of my estate can I actually see?",
    answer:
      "Eight questions return a visibility score and the scope of review that fits what you told us. No number is invented: where we cannot know something, it says so.",
    duration: "Two to three minutes",
  },
];

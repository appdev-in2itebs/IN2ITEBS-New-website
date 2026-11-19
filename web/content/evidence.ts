/**
 * OUTCOME METRICS, AND WHERE THEY CAME FROM.
 *
 * ── WHY THIS FILE EXISTS ─────────────────────────────────────────────────────────────────────
 * Every firm in this market publishes outcome percentages on its case studies, and almost none of
 * them publishes where the percentage came from. This was checked rather than assumed, on
 * 18 November 2026, against two direct competitors:
 *
 *   Birlasoft, "30% cost reduction in cloud infrastructure" — a baseline of sorts ("as compared
 *   to original public cloud set up"), no figure behind it, no time window, nobody named as
 *   having measured it, no exclusions.
 *
 *   Hexaware, SAP S/4HANA for a UK utility — four quantified claims (68% bill processing cycle
 *   time, 25% faster rollouts, 20% wastewater supply-chain efficiency, 50% faster onboarding).
 *   No baseline on any of them, no window, no measurer. The same 25% is stated three different
 *   ways on the same page.
 *
 * Our own case studies had exactly the same defect: "Reduced incident resolution time by 40%",
 * "User adoption improved by 40% via extensive training". Of what? Over what period? Measured by
 * whom? The honest answer in this repository was that nobody had written it down.
 *
 * ── WHY IT MATTERS COMMERCIALLY, NOT JUST ETHICALLY ──────────────────────────────────────────
 * Because buying committees already discount vendor arithmetic to zero. The published analysis of
 * why finance and procurement committees reject vendor business cases lists the failure modes as:
 * vendor-authored inputs, best-case assumptions, unsourced baselines, opaque logic, and — the one
 * that actually decides it — **numbers the buyer cannot defend internally as their own analysis**.
 *
 * So an unsourced percentage is not merely unprovable. It is worth *less than no number at all*,
 * because it costs the reader a unit of trust and gives their procurement team something to
 * discount. A figure with its provenance attached is the only kind that survives the room it is
 * taken into.
 *
 * ── THE RULE ─────────────────────────────────────────────────────────────────────────────────
 * This was already the written rule and was enforced nowhere. From the purchase-order review:
 *
 *   "A case study is written from a record, not from another case study."
 *   "This case study publishes without outcome percentages, deliberately. The register proves
 *    duration and breadth rather than business outcomes. Do not add outcome claims to strengthen
 *    it — the duration IS the claim."
 *
 * A number may be published as a metric only when all four of these are recorded: what it is a
 * number OF, the WINDOW it was measured over, WHO measured it, and anything excluded. If one is
 * missing, the number does not get to be a metric. It can stay in the prose, where a reader reads
 * it as a claim rather than as evidence — and `UNPROVENANCED` below names every one of those, so
 * the list is finite, visible, and shrinks.
 *
 * ── WHY ATTRIBUTION IS FOUR VALUES AND NOT A BADGE ───────────────────────────────────────────
 * "Verified" as a single badge is a claim about a claim, and worth as much as the original. These
 * four say who did the arithmetic, which is the question a procurement reviewer actually asks.
 * `client-reported` is not a weak status — a number the client published themselves is often the
 * strongest one available, and it is strongest precisely because we are not the ones asserting it.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */

export type Attribution = "measured-by-us" | "client-reported" | "jointly-verified" | "our-estimate";

export const ATTRIBUTION_LABELS: Record<Attribution, { label: string; meaning: string }> = {
  "measured-by-us": {
    label: "Measured by us",
    meaning: "We took the measurement, from the system, against a baseline recorded before the work started.",
  },
  "client-reported": {
    label: "Reported by the client",
    meaning: "The client's own figure, from their own systems. We are repeating it, not asserting it.",
  },
  "jointly-verified": {
    label: "Agreed with the client",
    meaning: "Measured by us and signed off by the client against the same definition.",
  },
  "our-estimate": {
    label: "Our estimate",
    meaning: "A projection from the assessment, not a measurement of an outcome. Stated as a range.",
  },
};

export interface Metric {
  /** The figure, exactly as it should read. A range is a range: "70–75%", not "~72%". */
  value: string;
  /** What it is a number OF. The denominator, the baseline, the population. Never omit it. */
  of: string;
  /** The period it covers, or the point it was taken at. */
  window: string;
  /** Who did the arithmetic. */
  attribution: Attribution;
  /** Anything the figure deliberately leaves out. Published when it exists. */
  excludes?: string;
}

/**
 * Figures that appear in published case-study prose with no provenance recorded.
 *
 * ── READ BEFORE ADDING A LINE HERE ───────────────────────────────────────────────────────────
 * This is a migration list, not an exemption list. Every entry is a number we inherited and
 * cannot currently source. A build check fails if a quantified claim appears in a case study that
 * is neither a `Metric` nor named here, which means **this file is the only way a new unsourced
 * number can reach the site, and doing it requires deliberately typing the number into a list
 * called UNPROVENANCED.** That friction is the entire mechanism.
 *
 * The right way to clear a line is to ask the delivery lead for the baseline, the window and who
 * measured it, and promote it to a `Metric`. The second-right way is to delete the number from
 * the copy. Leaving it here indefinitely is the wrong way, and the count is published to the
 * build log so that it is awkward to do so.
 *
 * None of these may be promoted to a metric by inventing the missing part. A fabricated baseline
 * is worse than an unsourced number, because it survives scrutiny for exactly one question.
 */
/**
 * Figures that describe the CLIENT, not our work.
 *
 * ── A CATEGORY THE FIRST VERSION OF THIS FILE MISSED ─────────────────────────────────────────
 * The gate caught "reaching 98% of the country's pin codes" and was right to stop on it, and
 * wrong about what it was. That is not an outcome we produced and it is not a number we are
 * unable to source — it is the client describing their own reach, in figures they publish
 * themselves, used here to say who they are before we say what we did for them.
 *
 * It needs a category of its own because the two fail differently. An unsourced outcome claim
 * inflates our work. An unsourced client-scale figure gets the *client's* facts wrong in public,
 * under our name, which is a different and more embarrassing problem — and the one the five
 * mismatched slides in the deck review were an instance of.
 *
 * The rule for this list: the figure must be one the client publishes about themselves, and the
 * study must be describing the client rather than the engagement. If a number drifts from the
 * first sentence into the results, it is an outcome claim and belongs under `Metric`.
 */
export const CLIENT_FACTS: { figure: string; about: string }[] = [
  {
    figure: "98%",
    about:
      "The EdTech client's own published coverage of India's pin codes — their figure, their scale, not our result",
  },
];

export const UNPROVENANCED: { figure: string; study: string; needs: string }[] = [
  {
    figure: "40%",
    study: "incident resolution time",
    needs: "Resolution time against which ticket classes, over which months, measured from the ITSM tool or from ours?",
  },
  {
    figure: "99.9%",
    study: "system availability",
    needs: "Availability of which systems, over which period, and against the contracted SLA or measured separately?",
  },
  {
    figure: "30%",
    study: "workflow acceleration via Fiori",
    needs: "Which workflows, measured how, before and after what dates?",
  },
  {
    figure: "40%",
    study: "user adoption improvement",
    needs: "Adoption measured as what — logins, transactions, licensed users active? Against what starting point?",
  },
  {
    figure: "18%",
    study: "VAHDAM manpower cost reduction",
    needs: "The client's figure or ours? Against which cost base, and over which twelve months?",
  },
];

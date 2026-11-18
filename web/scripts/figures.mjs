import { readFileSync } from "node:fs";

/**
 * THE FIGURE GATE — no quantified claim in a case study without its provenance.
 *
 * ── WHAT IT CHECKS ───────────────────────────────────────────────────────────────────────────
 * Every percentage and every multiplier ("3x") in the published prose of content/case-studies.ts
 * must be one of two things: part of a `Metric` record, which by its type carries what the number
 * is of, the window and who measured it — or an entry in `UNPROVENANCED` in content/evidence.ts,
 * which is the finite, named, shrinking list of figures we inherited and cannot source.
 *
 * Anything else fails the build.
 *
 * ── WHY A GATE AND NOT A GUIDELINE ───────────────────────────────────────────────────────────
 * "A case study is written from a record, not from another case study" was already the rule here.
 * It was written down after a review found five slides where one client's text sat under another
 * client's name — and the review correctly identified the cause as a working method rather than
 * carelessness: building a new case study by copying an old one and editing the parts you
 * remember to edit.
 *
 * A rule written in a document does not change a working method. A build that stops does.
 *
 * ── WHAT IT DELIBERATELY DOES NOT DO ─────────────────────────────────────────────────────────
 * It does not check that a figure is *true*, which no script can. It checks that somebody wrote
 * down where it came from, which is the part that was missing and the part that makes the figure
 * worth anything to a reader who has to defend it in their own procurement meeting.
 *
 * Plain counts are not figures and are not checked: "700 requirements", "130 countries", "12
 * months" are facts about scope with the unit attached, and a percentage is the specific shape
 * that hides its own denominator. That is the thing being gated.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */

/** Percentages and multipliers: the two shapes that imply a comparison without naming its base. */
const FIGURE = /\b\d+(?:[.,–-]\d+)*\s?(?:%|per cent|percent)|\b\d+(?:\.\d+)?x\b/gi;

/** The prose fields a visitor reads. `metrics` is excluded: those figures carry their provenance. */
const PROSE_FIELDS = ["scenario", "summary", "differentiator", "outcome", "benefits", "solution", "client"];

export function figureOffenders(caseStudiesPath = "content/case-studies.ts", evidencePath = "content/evidence.ts") {
  const source = readFileSync(caseStudiesPath, "utf8");
  const evidence = readFileSync(evidencePath, "utf8");

  // Everything inside a `metrics: [ ... ]` block is provenanced by construction. Blank the block
  // rather than deleting it, so the line numbers in an error still point at the real file.
  const withoutMetrics = source.replace(/metrics:\s*\[[\s\S]*?\n {4}\],/g, (b) =>
    "\n".repeat(b.split("\n").length - 1),
  );
  // Comments explain the rule and quote the examples; they are not published copy.
  const prose = withoutMetrics.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

  // Both named lists clear a figure: UNPROVENANCED (inherited, unsourced, to be closed) and
  // CLIENT_FACTS (the client's own published numbers about themselves).
  const allowed = new Set([...evidence.matchAll(/figure:\s*"([^"]+)"/g)].map((m) => m[1]));

  const offenders = [];
  prose.split("\n").forEach((line, i) => {
    // Only lines that are actually published copy, not type definitions or helper code.
    const isProse =
      line.includes('"') && PROSE_FIELDS.some((f) => line.includes(`${f}:`) || line.trim().startsWith('"'));
    if (!isProse) return;
    for (const m of line.match(FIGURE) ?? []) {
      const normalised = m.replace(/\s?(per cent|percent)/i, "%").trim();
      if (!allowed.has(normalised)) {
        offenders.push(`${caseStudiesPath}:${i + 1} "${normalised}" — no Metric and not in UNPROVENANCED`);
      }
    }
  });
  return offenders;
}

/**
 * How many inherited figures still owe a baseline. Printed by the build so the debt stays awkward.
 *
 * Counts UNPROVENANCED only. CLIENT_FACTS entries also clear the gate but are not debt — they are
 * the client's own published numbers, correctly categorised, and nothing about them needs closing.
 * Counting both made the build overstate the backlog by one, which is a small lie of exactly the
 * kind this file exists to stop.
 */
export function unprovenancedCount(evidencePath = "content/evidence.ts") {
  const src = readFileSync(evidencePath, "utf8");
  const block = src.slice(src.indexOf("export const UNPROVENANCED"));
  return [...block.matchAll(/figure:\s*"([^"]+)"/g)].length;
}

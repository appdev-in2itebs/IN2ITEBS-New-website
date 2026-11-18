import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

/**
 * THE DIAGRAM PALETTE GATE.
 *
 * ── WHY THIS EXISTS, AND WHAT IT CAUGHT ──────────────────────────────────────────────────────
 * In November 2026 all 32 diagrams were re-paletted to brand book v2.0, verified by hand, and
 * recorded as clean. **The generator that draws them was never updated.** It still carried the
 * superseded Muted Sand (#C1BC9C instead of #CDC8A5) and a card stroke (#E1E6EE) that existed in
 * neither the book nor the circulated palette.
 *
 * So every diagram built after that sweep came out off-palette and shipped — six of them, found
 * only when a seventh was added and somebody thought to scan the whole folder again. A one-off
 * manual verification records a moment; it does not hold a standard.
 *
 * The same scan also caught an accessibility defect in a brand-new diagram: a muted grey used for
 * "absent" states at 2.54:1 on white, on a site that gates its own contrast. Faded has to come
 * from the dashed outline and the italic, never from the contrast ratio.
 *
 * ── WHAT IT CHECKS AND WHAT IT CANNOT ────────────────────────────────────────────────────────
 * Every fill and stroke in every shipped SVG must be a brand colour. That is a flat assertion and
 * it is the one that regresses, because an off-palette value arrives by inheritance from a stale
 * helper rather than by anybody choosing it.
 *
 * It deliberately does NOT attempt contrast: inferring which text sits on which fill from flat
 * SVG geometry is guesswork, and a test that is sometimes wrong about accessibility is worse than
 * no test. Contrast stays a review step — but every colour that can appear is now one of nine
 * whose pairings have been checked, which is most of the way there.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */

/** Brand book v2.0. Steel Blue is #3F75A3; the book's own Digital & Print page misprints it as
 *  Deep Navy's hex, which is the defect that caused the drift in the first place. */
const PALETTE = new Set([
  "#121E3B", // Deep Navy
  "#FFFFFF", // White
  "#94B8D0", // Light Sky
  "#3F75A3", // Steel Blue
  "#A3CBE6", // Pale Blue
  "#5A6478", // Muted Grey
  "#F7F8FA", // Off-White
  "#CDC8A5", // Muted Sand — v2.0. NOT #C1BC9C, which the circulated email palette carried.
  "#E1E1E1", // Rule
]);

const DIR = path.join(process.cwd(), "public/diagrams");
const svgs = readdirSync(DIR).filter((f) => f.endsWith(".svg"));

test("every diagram is drawn from the brand palette", () => {
  assert.ok(svgs.length > 30, `only ${svgs.length} diagrams found — is the path right?`);
  const offenders: string[] = [];
  for (const file of svgs) {
    const source = readFileSync(path.join(DIR, file), "utf8");
    const used = new Set([...source.matchAll(/(?:fill|stroke)="(#[0-9A-Fa-f]{6})"/g)].map((m) => m[1].toUpperCase()));
    for (const colour of used) if (!PALETTE.has(colour)) offenders.push(`${file}: ${colour}`);
  }
  assert.deepEqual(offenders, []);
});

test("the superseded sand and rule never come back", () => {
  // Named explicitly rather than left to the palette check, because these two are what a stale
  // generator reintroduces, and the error message should say so rather than print a hex code.
  const stale: Record<string, string> = {
    "#C1BC9C": "superseded Muted Sand — brand book v2.0 is #CDC8A5",
    "#E1E6EE": "a card stroke in neither the book nor the circulated palette — use #E1E1E1",
    "#3A4560": "a stray rule in neither source",
  };
  const offenders: string[] = [];
  for (const file of svgs) {
    const source = readFileSync(path.join(DIR, file), "utf8").toUpperCase();
    for (const [hex, why] of Object.entries(stale)) {
      if (source.includes(hex)) offenders.push(`${file}: ${hex} — ${why}`);
    }
  }
  assert.deepEqual(offenders, []);
});

test("every diagram referenced in content exists on disk", () => {
  // A diagram band with a missing src renders an empty alt and nothing else, which is invisible in
  // review and obvious to a visitor.
  const content = readdirSync(path.join(process.cwd(), "content"))
    .filter((f) => f.endsWith(".ts"))
    .map((f) => readFileSync(path.join(process.cwd(), "content", f), "utf8"))
    .join("\n");
  const referenced = new Set([...content.matchAll(/"\/diagrams\/([a-z0-9-]+\.svg)"/g)].map((m) => m[1]));
  assert.ok(referenced.size > 0, "no diagram references found — has the path shape changed?");
  const missing = [...referenced].filter((f) => !svgs.includes(f));
  assert.deepEqual(missing, []);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import {
  imageLicences,
  OUR_OWN_IMAGE_FOLDERS,
  TRADEMARK_IMAGE_FOLDERS,
  APPROVED_PROVIDERS,
} from "../content/image-licences";

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
  // Since 23 November 2026 the pages render the diagrams as live explainers (content/explainers.ts,
  // components/explainers) and no content file points at an SVG; the drawings stay on disk as the
  // record. Any reference that does appear must still exist.
  const missing = [...referenced].filter((f) => !svgs.includes(f));
  assert.deepEqual(missing, []);
  const explainers = readFileSync(path.join(process.cwd(), "content", "explainers.ts"), "utf8");
  for (const key of explainers.matchAll(/^  "([a-z0-9-]+)": \{/gm))
    assert.ok(svgs.includes(`${key[1]}.svg`), `explainer "${key[1]}" is not named after a diagram on disk`);
});

/**
 * NO PHOTOGRAPHY WITHOUT RECORDED PROVENANCE.
 *
 * Until 20 November 2026 this test banned the category outright: the 190-odd inherited
 * photographs came off because their licences could not be established, and the gate stopped any
 * coming back.
 *
 * The Managing Director has since decided that licensed imagery may be used while the company
 * builds its own library over twelve months. So the rule changes shape rather than relaxing. A
 * bitmap that is not demonstrably ours, and is not a third-party mark, needs a line in
 * content/image-licences.ts naming the provider, the licence reference, what it depicts and
 * whether a model generated it.
 *
 * That is a better gate than the ban was. The ban enforced a decision; this enforces the
 * paperwork the decision depends on — and the register is what tells us, in twelve months,
 * exactly which files our own photography has to replace.
 */
test("every photograph on the site has recorded provenance", () => {
  const PHOTO = /\.(jpe?g|webp|avif)$/i;
  const exempt = [...OUR_OWN_IMAGE_FOLDERS, ...TRADEMARK_IMAGE_FOLDERS];
  const registered = new Set(imageLicences.map((l) => l.file.replace(/^\/+/, "")));

  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      const rel = path.relative(process.cwd(), full).replace(/\\/g, "/");
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!PHOTO.test(entry.name)) continue;
      if (exempt.some((a) => rel.startsWith(a))) continue;
      if (registered.has(rel)) continue;
      offenders.push(rel);
    }
  };
  walk(path.join(process.cwd(), "public"));
  assert.deepEqual(
    offenders,
    [],
    "a photograph arrived with no entry in content/image-licences.ts. Add one — provider, licence reference, what it depicts, whether a model made it — or take the file out.",
  );
});

/**
 * THE REGISTER HAS TO BE USABLE, NOT MERELY PRESENT.
 *
 * A provenance register that accepts "paid plan" as a licence reference records nothing. Each
 * field is checked for the thing that makes it worth having.
 *
 * `depicts` carries the rule that matters: no image may depict a place, person, document or
 * credential a reader could take to be ours when it is not. A generic office is decoration and
 * every reader knows it. A generated picture of *our* office, with our logo on the wall, is a
 * depiction — which is what cost us the hero footage, and what engages the deception limb of
 * India's IT Rules rather than the labelling limb.
 */
test("the image register says enough to be checked", () => {
  for (const l of imageLicences) {
    assert.ok(
      APPROVED_PROVIDERS.includes(l.provider),
      `${l.file}: "${l.provider}" is not an approved provider. Adding one is a decision, not a pull request.`,
    );
    assert.ok(
      l.reference.trim().length > 4 && !/^(paid|paid plan|subscription|n\/a|none)$/i.test(l.reference.trim()),
      `${l.file}: "${l.reference}" is not a licence reference anybody could take to the provider and have confirmed.`,
    );
    assert.match(l.acquired, /^\d{4}-\d{2}-\d{2}$/, `${l.file}: acquired date is not an ISO date`);
    assert.ok(
      l.depicts.trim().split(/\s+/).length >= 3,
      `${l.file}: "${l.depicts}" does not say what the picture shows.`,
    );
    assert.ok(
      l.approvedBy.trim().includes(" "),
      `${l.file}: approvedBy is "${l.approvedBy}" — name the person, not the function.`,
    );
    // The hard line. A licence does not make a depiction of us honest.
    assert.doesNotMatch(
      l.depicts,
      /\b(our|In2IT|in2it)\b/i,
      `${l.file} says it depicts "${l.depicts}". A licensed or generated image may not depict us. If it really is ours, it belongs in one of OUR_OWN_IMAGE_FOLDERS instead.`,
    );
  }
});

/**
 * THE SAME RULE, INSIDE THE EXEMPTIONS.
 *
 * The gate above exempts ten folders, each on a claim about what that folder holds. Nobody had
 * checked whether the claims were true.
 *
 * On 19 November 2026, `public/industries` — exempted as "client logos" — was found to hold
 * **twenty-three stock photographs**, 3.3 MB of them: iStock, Pexels, Depositphotos and Pixabay
 * filenames, and four 2,560 px `-scaled` uploads. Same unresolvable-licence problem as the fifteen
 * deleted the day before; they survived only because the folder they sat in was waved through by
 * name. All twenty-three are now deleted.
 *
 * ── WHY THIS IS NOT A FILENAME CHECK ─────────────────────────────────────────────────────────
 * That was the first attempt, and it was abandoned on the evidence. Matching stock-library names
 * caught fifteen of the twenty-three and missed eight — a Pixabay id, a run of digits, four
 * sentence-shaped Dreamstime descriptions. Widening it to digit runs and long hyphenated names
 * then flagged our own WhatsApp event photographs, two genuine government client marks and a
 * background-removed logo. A gate tuned until it stops complaining is a gate nobody trusts.
 *
 * So the rule is a fact instead of a guess: **a bitmap in an exempt folder must be referenced by
 * the site.** All twenty-three stock photographs were unreferenced, because nothing on the site
 * ever showed them — which is the property that actually distinguishes them. An image nobody
 * displays is an image nobody has checked, and that is where an unlicensed picture survives.
 */
test("every bitmap in an exempt folder is one the site actually uses", () => {
  const EXEMPT = [
    "public/events",
    "public/awards",
    "public/logos",
    "public/partners",
    "public/industries",
    "public/brand",
    "public/insights",
    "public/testimonials",
    "public/youtube",
    "public/video",
  ];

  /*
   * THE HOLDING SET — client marks the restructure stranded, not an exemption.
   *
   * `public/industries/` is laid out under the OLD fourteen industry slugs
   * (`heavy-engineering`, `fmcg`, `telecom`…). The nine current slugs renamed every one of them,
   * and `legacy-industry-page.tsx` builds its path as `/industries/<current slug>/<logo>`. So not
   * one of these can resolve, whatever anybody puts in a `customers` array — they are stranded by
   * the rename rather than held back by consent, which is what the November audit recorded.
   *
   * They are kept because they are real client marks and client identity is approved. They are
   * counted because a holding set that never shrinks is a junk drawer: either they get wired to
   * the nine current slugs with an evidenced engagement behind each, or they go.
   */
  const STRANDED_INDUSTRY_MARKS = 116;

  const used = new Set<string>();
  const readAll = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) readAll(full);
      else if (/\.(ts|tsx|mjs)$/.test(entry.name)) used.add(readFileSync(full, "utf8"));
    }
  };
  for (const dir of ["content", "components", "app", "lib"]) readAll(path.join(process.cwd(), dir));
  const haystack = [...used].join("\n");

  const unreferenced: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      const rel = path.relative(process.cwd(), full).replace(/\\/g, "/");
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(jpe?g|webp|avif|png)$/i.test(entry.name)) continue;
      if (haystack.includes(entry.name)) continue;
      // A YouTube still is named for its video id, and the path is built at render time — so the
      // id, not the filename, is what appears in content/youtube.ts. Nowhere else gets this.
      if (rel.startsWith("public/youtube/") && haystack.includes(entry.name.replace(/\.[^.]+$/, ""))) continue;
      unreferenced.push(rel);
    }
  };
  for (const dir of EXEMPT) walk(path.join(process.cwd(), dir));

  const stranded = unreferenced.filter((f) => f.startsWith("public/industries/"));
  const rest = unreferenced.filter((f) => !f.startsWith("public/industries/")).sort();

  assert.equal(
    stranded.length,
    STRANDED_INDUSTRY_MARKS,
    `the stranded client marks under public/industries/ changed from ${STRANDED_INDUSTRY_MARKS} to ${stranded.length}. ` +
      "Wiring them to the nine current slugs is the way this number goes down; adding to it is not.",
  );

  assert.deepEqual(
    rest,
    [
      // Retired with the accreditation page. The credentials now publish as text with an expiry
      // date, which is the thing a buyer can check; a badge is not evidence.
      "public/awards/iso-20000-1.png",
      "public/awards/iso-27001.png",
      "public/awards/iso-9001.jpg",
      // Marks carried for clients the site does not currently publish a reference for.
      "public/logos/deck-clients/mrs-bectors.png",
      "public/logos/deck-clients/p42-Image24.png",
      "public/logos/sap/sap-s4hana.png",
    ].sort(),
    "an unreferenced bitmap appeared in an exempt folder. If it is a client mark, wire it up; if it is a photograph, it does not belong here.",
  );
});

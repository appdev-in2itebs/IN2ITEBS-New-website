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

/**
 * NO PHOTOGRAPHY.
 *
 * The 190-odd stock images came out on 18 November 2026 — unresolvable licensing, and the deeper
 * point that a stock photograph is the visual form of an unfalsifiable adjective on a site that
 * fails its own build over the written kind. See content/hero-images.ts.
 *
 * This is the gate that keeps it that way. Photography will be proposed again, reasonably, by
 * somebody who was not here for the licence problem — and the honest answer then is a decision
 * taken deliberately, not a JPEG that arrives in a pull request and is never mentioned.
 *
 * What is allowed: our own event photography (ours), client and partner logos (a consent and
 * trademark question already decided elsewhere), brand marks, and original SVG diagrams.
 */
test("no photographic asset has come back into the repository", () => {
  const PHOTO = /\.(jpe?g|webp|avif)$/i;
  const ALLOWED = [
    "public/events", // our own people at our own events
    "public/awards", // photographs of our own certificates — the evidence, not a stock image
    "public/logos", // client and partner marks — a separate, live decision
    "public/partners", // the same, as JPEG
    "public/industries", // client logos behind the consent gate
    "public/brand", // our own marks
    "public/insights/body", // article artwork being retired page by page; four icons left
    "public/testimonials", // named individuals, behind the per-person consent gate
    "public/youtube", // thumbnails of our own channel's videos
    "public/video", // our own clip and its poster frame
  ];
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      const rel = path.relative(process.cwd(), full);
      if (ALLOWED.some((a) => rel.startsWith(a))) continue;
      if (entry.isDirectory()) walk(full);
      else if (PHOTO.test(entry.name)) offenders.push(rel);
    }
  };
  walk(path.join(process.cwd(), "public"));
  assert.deepEqual(offenders, []);
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
      // Article artwork from pages whose bodies were rewritten as text — see content/qpps.ts for
      // why a package's scope is no longer a JPEG.
      "public/insights/body/MicrosoftTeams-image-1024x122.png",
      "public/insights/body/Picture2-1024x194.jpg",
      "public/insights/body/hari1-1024x119.jpg",
      "public/insights/how-rise-with-sap-s-4hana-cloud-can-transform-your-business.png",
      "public/insights/in2it-ebs-simplify-hiring.png",
      // Marks carried for clients the site does not currently publish a reference for.
      "public/logos/deck-clients/mrs-bectors.png",
      "public/logos/deck-clients/p42-Image24.png",
      "public/logos/sap/sap-s4hana.png",
    ].sort(),
    "an unreferenced bitmap appeared in an exempt folder. If it is a client mark, wire it up; if it is a photograph, it does not belong here.",
  );
});

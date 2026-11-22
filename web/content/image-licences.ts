/**
 * THE INTERIM IMAGE POLICY — licensed imagery, on a clock.
 *
 * ── THE DECISION THIS FILE IMPLEMENTS ────────────────────────────────────────────────────────
 * On 18 November 2026 all 190-odd inherited photographs came off this site: the licences could
 * not be established, and a stock photograph is the visual form of an unfalsifiable adjective on
 * a site that fails its own build over the written kind.
 *
 * On 20 November 2026 the Managing Director decided that the site needs richer imagery sooner
 * than an internal library can be built, and that **licensed** imagery may be used in the
 * meantime while the company collects its own over twelve months.
 *
 * That is a reasonable call, and it needs a mechanism or it becomes permanent. This file is the
 * mechanism. It does three things:
 *
 *   1. It turns "no photography" into "no photography without recorded provenance". Every bitmap
 *      that is not demonstrably ours needs a line here naming where it came from, what licence
 *      covers it, and what it depicts. A picture with no line fails the build.
 *   2. It records whether each image is AI-generated, because that is the field that decides
 *      whether the India IT Rules definition of synthetically generated information is in play
 *      and whether EU AI Act Article 50 transparency applies.
 *   3. It expires. `INTERIM_POLICY_REVIEW` is a dated gate like the capability register's. The
 *      build warns as it approaches and fails after it, so the twelve-month replacement happens
 *      because the build stops rather than because somebody remembers.
 *
 * ── THE ONE LINE THAT IS NOT NEGOTIABLE ──────────────────────────────────────────────────────
 * `depicts` must be true of the picture, and no image may depict a place, person, document or
 * credential that a reader could reasonably take to be ours when it is not.
 *
 * A generic photograph of an office is decoration, and every reader knows it. A generated image
 * of *our* office, with our logo on the wall, is a depiction — and that is the thing that cost
 * us the hero footage, engages the deception limb of the IT Rules rather than the labelling limb,
 * and would be read in a tender as evidence that our pictures are as approximate as our claims.
 *
 * Decoration is allowed. Depiction of us is not, unless it is actually us.
 */

export type ImageSource =
  /** Licensed from a commercial library, with an invoice and a licence reference. */
  | "licensed-stock"
  /** Generated with a paid AI tool whose terms permit commercial export without a visible mark. */
  | "licensed-generative"
  /** Photographed or drawn by us, or by somebody we paid to make it for us. */
  | "ours"
  /** A third party's trademark, shown under the client-identity decision of 12 November 2026. */
  | "trademark";

export interface ImageLicence {
  /** Path under public/, exactly as the file sits on disk. */
  file: string;
  source: ImageSource;
  /** The library, tool or photographer. "Adobe Stock", "Runway Gen-4.5", "In2IT Marketing". */
  provider: string;
  /**
   * The licence reference — an Adobe Stock asset ID, an order number, a file note. Something a
   * person can take to the provider and have confirmed. "Paid plan" is not a reference.
   */
  reference: string;
  /** ISO date the licence was acquired. */
  acquired: string;
  /**
   * What the picture actually shows, in plain words. This is the field somebody reads in two
   * years when deciding whether it can stay. "An abstract blue gradient" is a good answer.
   * "Office" is not — say whose, or say that it is nobody's.
   */
  depicts: string;
  /**
   * True when the image was produced by a generative model, whatever the licence.
   *
   * Recorded separately from `source` because the licence and the provenance are different
   * questions, and only this one decides whether a transparency obligation can arise.
   */
  aiGenerated: boolean;
  /** Who in the business approved publishing it. A person, not a function. */
  approvedBy: string;
  /** Set when a photograph of our own has replaced it, so the register shows progress. */
  replacedBy?: string;
}

/**
 * Every non-ours bitmap on the site, with its provenance.
 *
 * Empty at the moment the policy was written, which is correct: nothing licensed has been bought
 * yet. The first purchase adds the first line, and `tests/diagrams.test.ts` fails on any file
 * that arrives without one.
 */
export const imageLicences: ImageLicence[] = [];

/**
 * Folders whose contents are ours by definition and need no line above.
 *
 * Shorter than the old allow-list on purpose. `public/industries` and `public/insights/body` were
 * on that list and both turned out to contain things nobody had looked at — twenty-three stock
 * photographs in the first, inherited article artwork in the second. A folder exemption is a
 * statement of belief about a folder; these four are the ones the belief survived.
 */
export const OUR_OWN_IMAGE_FOLDERS = [
  "public/events", // our people at our events
  "public/awards", // our certificates and award plaques
  "public/brand", // our marks
  "public/team", // our colleagues, photographed with their knowledge
  "public/testimonials", // named individuals, behind the per-person consent gate
  "public/youtube", // stills from our own channel
  "public/video", // our own clip and its poster
];

/** Folders holding third-party marks, governed by trademark rather than by a stock licence. */
export const TRADEMARK_IMAGE_FOLDERS = ["public/logos", "public/partners", "public/industries"];

/**
 * The date the interim policy stops being interim.
 *
 * Twelve months from the decision. By then the collection programme in docs/IMAGE_POLICY.md
 * should have produced enough of our own material to replace what is licensed, and this register
 * says precisely which files those are.
 *
 * The build warns from thirty days out and fails the day after. Moving the date without doing the
 * replacement is the same failure the capability register's date has, and the same answer applies:
 * it has to be somebody's deliberate act, in a commit, with their name on it.
 */
export const INTERIM_POLICY_REVIEW = "2027-11-20";

/** Approved providers. Anything else needs a decision before it reaches a pull request. */
export const APPROVED_PROVIDERS = [
  "Adobe Stock", // licence plus scoped IP indemnity — the only option on the table that indemnifies
  "Runway", // clearest written no-watermark policy of the generative tools reviewed
  "Google AI Pro (Veo)", // paid tier permits export without the visible mark; SynthID is retained
  "In2IT Marketing", // our own photography and commissioned illustration
];

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
export const imageLicences: ImageLicence[] = [
  // public/hero: the 26 November 2026 set from docs/In2IT EBS - Image Specification - 60 Hero Figures.docx
  // (abstract instrument objects, no people), generated in Firefly Image 5 and cut out by
  // scripts/spec63-hero.mjs; chosen downloads and selections are in assets/firefly/spec63/_sources/.
  // public/hero/photos: the nine industry pages switched to real-world industry photographs at the
  // owner's request (26 Nov 2026), generated in Firefly Image 5 with generic, non-identifiable
  // workers; sources in assets/firefly/industry-photos/. The abstract industry versions were removed from
  // public/hero; their masters stay in assets/firefly/spec63/.
  {
    file: "public/hero/photos/industries-metals-mining-steel.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-industry-photo-35 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts:
      "A generic steel plant: molten steel pouring from a ladle, one worker in a heat-protective suit seen from behind; generated people, nobody real, no logos or text",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/photos/industries-power-utilities.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-industry-photo-36 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts:
      "A generic high-voltage substation at dusk with transmission towers, two linemen in hard hats seen from behind; generated people, nobody real, no logos or text",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/photos/industries-government-public-sector.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-industry-photo-37 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts:
      "A generic open-plan public administration office, civil servants at desks seen from behind; generated people, nobody real, no logos or text",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/photos/industries-manufacturing.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-industry-photo-38 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts:
      "A generic automated assembly line with robotic arms, a technician in safety glasses seen in side profile at a distance; generated people, nobody real, no logos or text",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/photos/industries-consumer-goods-distribution.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-industry-photo-39 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts:
      "A generic distribution warehouse with racks of unbranded cartons, a forklift and two workers in high-visibility vests seen from behind; generated people, nobody real, no logos or text",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/photos/industries-pharma-healthcare-life-sciences.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-industry-photo-40 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts:
      "A generic pharmaceutical clean-room line of glass vials, two technicians in gowns, masks and visors; generated people, nobody real, no logos or text",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/photos/industries-technology-digital-natives.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-industry-photo-41 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts:
      "A generic data-centre aisle of server racks, an engineer with a laptop seen from behind; generated people, nobody real, no logos or text",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/photos/industries-banking-financial-services.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-industry-photo-42 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts:
      "A generic office floor, a finance team seen from behind at desks with abstract unlabelled charts; generated people, nobody real, no logos or text",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/photos/industries-real-estate-infrastructure.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-industry-photo-43 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts:
      "A generic construction site with a tower crane and concrete frame, two engineers in hard hats seen from behind; generated people, nobody real, no logos or text",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/about-credentials.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-05 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "Concentric navy and blue plates with a notched outer edge, like a seal seen flat on",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/about-markets.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-07 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "A dotted grid on a gently curved navy plane, five points lit and the rest unlit",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/about-our-leadership.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-04 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "Five vertical columns of differing height in navy and blues standing on one common baseline",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/about-partnerships.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-06 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "Two open frames in navy and steel blue interlocking along one shared edge",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/about-where-we-stand.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-08 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "A four-by-four grid of navy and blue blocks, some drawn as empty outlines",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/about-who-we-are.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-03 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "Flat navy and steel-blue plates drawing together into one solid form, a pale plate still arriving",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/careers-current-openings.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-11 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "A navy plate with a row of recessed slots, some of them empty",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/careers-events-celebrations.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-12 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "A scatter of small blue nodes rising from a steel baseline, denser near the bottom",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/careers-hub.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-09 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "An open doorway formed by two offset navy plates, light falling through the gap",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/careers-our-culture.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-10 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "A loose cluster of small navy and blue forms orbiting a common centre at varying distances",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/case-study-agri-commerce-distribution-india.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-50 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "A flow of small navy and blue units passing through a sorting gate and separating into lanes",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/case-study-state-metals-producer-india.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-60 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "A pale blue band of material pouring from a tilted navy vessel into a waiting form",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/case-study-beverage-bottling-group-south-asia-africa.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-59 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "A row of identical navy and steel cylinders standing on a single moving line",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/case-study-global-engineering-consultancy.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-45 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "A set of steel and pale blue drafting arcs swung from one fixed navy point over an open plane",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/case-study-state-power-transmission-north-india.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-56 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts: "One dense navy node with thin blue lines radiating outward in every direction",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/case-study-edtech-unicorn.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-52 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "An ascending series of stepped steel and navy plates",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/case-study-global-it-services-provider.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-46 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "A ring of evenly spaced blue nodes all connected back to one central navy hub",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/case-study-industrial-engineering-manufacturer-india.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-49 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "Two interlocking toothed discs in navy and pale blue, of different diameter, meshed at one point",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/case-study-industrial-turbine-manufacturer-india.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-53 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "Radial navy and blue blades arranged around a central hub",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/case-study-state-mining-undertaking-east-india.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-58 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "A graded stack of plates narrowing as it rises, each layer a different tone of navy and blue",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/case-study-state-power-distribution-south-india.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-48 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts:
      "A branching grid of steel and pale blue lines running from one navy source on the left to many endpoints on the right",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/case-study-state-railway-operator-east-africa.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-54 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts: "Two parallel navy rails running to a vanishing point, pale blue sleepers evenly spaced",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/case-study-b2b-ict-operator-belgium.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-47 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "A mesh of connected navy and blue points with thin signal arcs passing between them",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/case-study-state-power-transmission-south-india.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-55 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts: "A long span of repeating open navy and blue frames receding to the right",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/case-study-direct-to-consumer-wellness-brand-india.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-51 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "A column of stacked rounded forms in navy and blues, diminishing in size toward the top",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/case-study-diversified-manufacturing-group-india.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-57 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "Several distinct navy and blue forms of different shape sharing one common base plate",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/contact-hero.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-14 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "Two long arcs in navy and steel blue approaching from opposite sides and meeting at a single point",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/pages-industries.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-34 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts: "Nine tiles in a three-by-three grid, each a different tone of navy and blue",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/pages-about.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-02 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "Four nested rings seen slightly off-axis, the second from outside in steel blue",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/pages-advisory.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-27 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts: "A navy compass-like dial resting flat on an open plane, one bearing marked with a sand arc",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/pages-case-studies.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-44 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts: "A fanned set of navy and blue plates, each offset slightly from the one beneath",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/pages-homepage.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-01 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts:
      "Three signal traces in navy and steel blue that drift apart and resolve into one steady line, with a thin sand accent",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/pages-insights.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-13 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "A stack of thin navy and blue plates, fanned apart at one side",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/service-application-engineering.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-29 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts: "An articulated navy and steel arm of three segments placing a pale cube onto a stack",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/service-application-estate-review.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-30 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts: "A scattered field of navy and blue blocks on the left resolving into a sorted grid on the right",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/service-applied-ai.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-33 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts: "A lattice of navy and steel nodes with exactly one node lit brighter than the rest",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/service-converged-flow.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-18 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts: "A navy channel narrowing from wide to single file, small forms passing through in order",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/service-converged-momentum.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-19 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts: "A wheel of angled navy and blue slabs mid-rotation, one slab leading the others",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/service-converged-pulse.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-17 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "Concentric navy and blue rings radiating evenly outward from a single bright core",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/service-data-engineering.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-31 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts: "Several navy and steel-blue pipes of different diameters running together",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/service-digital-data-ai.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-28 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts: "A lattice of navy and blue spheres at even spacing, connected by thin lines",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/service-ecc-prism.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-20 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts: "A solid navy beam entering a prism and leaving as four separated blue bands",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/service-enterprise-data-management.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-32 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts: "Three stacked layers in navy, steel and pale blue, each feeding the one above through narrow connectors",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/service-enterprise-platforms.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-15 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "A long navy and steel rail carrying evenly spaced pale blue cubes of equal size",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/service-managed-services.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-24 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts: "Stacked horizontal bands in navy, steel and pale blue of decreasing thickness, the top one widest",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/service-rise-s4hana.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-21 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts: "A tower of stacked navy and blue plates lifting clear of its base, a gap opening beneath",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/service-salesforce.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-25 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts: "A cloud-shaped cluster of small navy and blue cubes, denser at the centre",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/service-sap.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-16 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "One dense navy cube at centre with four lighter satellite cubes held on arms around it",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/service-smart-meter-to-cash.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-23 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts: "A chain of linked navy and blue segments running left to right, each slightly thinner than the last",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/service-successfactors.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-22 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts: "A ring of small identical navy and blue tiles, one lifted out of the ring and turned",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/service-workday.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-26 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts: "A regular grid of pale blue square cells framed in navy, with one cell raised above the plane",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/pages-services.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-61 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts: "Three horizontal navy and blue bands of equal weight, each carrying a different count of small cubes",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/about-credentials-awards.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-63 (Firefly Upscaler 4x)",
    acquired: "2026-11-26",
    depicts: "A shallow stack of navy-framed plates seen at a slight angle, one standing proud",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/hero/services-how-we-price.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-image5-2026-11-26-spec63-62 (local 4x enlargement; Firefly Upscaler pending)",
    acquired: "2026-11-26",
    depicts: "A balance beam at rest on a navy base, equal pale blue cubes on both pans",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
];

/**
 * Folders whose contents are ours by definition and need no line above.
 *
 * Shorter than the old allow-list on purpose. `public/industries` and `public/insights/body` were
 * on that list and both turned out to contain things nobody had looked at — twenty-three stock
 * photographs in the first, inherited article artwork in the second. A folder exemption is a
 * statement of belief about a folder; these four are the ones the belief survived.
 */
export const OUR_OWN_IMAGE_FOLDERS = [
  "public/heroes", // generated from assets/hero-images by npm run heroes
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
  "Adobe Firefly", // approved by Rudra Shatapathy for one month (24 Nov 2026)
  "Adobe Stock", // licence plus scoped IP indemnity — the only option on the table that indemnifies
  "Runway", // clearest written no-watermark policy of the generative tools reviewed
  "Google AI Pro (Veo)", // paid tier permits export without the visible mark; SynthID is retained
  "In2IT Marketing", // our own photography and commissioned illustration
];

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
  // The 25 November 2026 set: one content-specific render per page, generated from
  // docs/FIREFLY_PROMPTS_MASTER.md. People appear only with heads turned to their work and
  // generic features, so nobody is identifiable; screens carry unlabelled charts. The source
  // PNGs are kept outside public/, in assets/hero-images/firefly-final-2026-11-25/.
  {
    file: "public/generated/about-credentials-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-01",
    acquired: "2026-11-25",
    depicts:
      "Five auditors in grey lab coats around a steel inspection bench holding blank crystal award prisms and shield badges",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/about-markets-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-02",
    acquired: "2026-11-25",
    depicts: "Three executives standing around a round console table showing an unlabelled illuminated world map",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/about-our-leadership-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-03",
    acquired: "2026-11-25",
    depicts: "Six executives around a dark boardroom table with an unlabelled illuminated world map set into it",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/about-partnerships-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-04",
    acquired: "2026-11-25",
    depicts:
      "Glass and steel cylinders linked by bridges around a central globe, with four people in suits at the perimeter",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/about-where-we-stand-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-05",
    acquired: "2026-11-25",
    depicts: "Three people in suits at a steel table with a balance scale and stacked glass ledgers",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/about-who-we-are-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-06",
    acquired: "2026-11-25",
    depicts: "Four consultants around a hexagonal console carrying four illuminated glass pillars",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/banking.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-07",
    acquired: "2026-11-25",
    depicts: "Three people in suits beside a steel vault door with floating glass chart panels",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/careers-current-openings-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-08",
    acquired: "2026-11-25",
    depicts: "Two people in suits seen from behind at a desk, facing three wide screens of pyramid and step charts",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/careers-events-celebrations-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-09",
    acquired: "2026-11-25",
    depicts:
      "Seven people in evening wear seen from behind, raising a toast toward a lit crystal podium with gold ribbons",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/careers-hub-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-10",
    acquired: "2026-11-25",
    depicts: "Three engineers at a maple and slate workstation with four monitors showing wireframe diagrams",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/careers-our-culture-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-11",
    acquired: "2026-11-25",
    depicts: "Three colleagues in a curved timber acoustic pod in front of a board of blank coloured task cards",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/case-study-agri-supply-chain-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-12",
    acquired: "2026-11-25",
    depicts: "Three staff in dark workwear beside a conveyor carrying crates of fresh produce through scanners",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/case-study-aluminium-smelter-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-13",
    acquired: "2026-11-25",
    depicts:
      "Four engineers in dark overalls and hard hats along a row of electrolytic reduction pots with copper busbars",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/case-study-beverage-bottling-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-14",
    acquired: "2026-11-25",
    depicts:
      "Three plant staff in hard hats at a stainless steel rotary bottle-filling carousel with plain glass bottles",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/case-study-civil-engineering-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-15",
    acquired: "2026-11-25",
    depicts: "Three engineers in hard hats with a survey transit, a scale bridge model and an unlabelled chart screen",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/case-study-grid-reliability-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-16",
    acquired: "2026-11-25",
    depicts: "Six technicians in dark uniforms around a brushed aluminium telemetry desk with three dial screens",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/case-study-edtech-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-17",
    acquired: "2026-11-25",
    depicts:
      "Three engineers in dark hoodies at a console with floating glass panels of icons and charts beside server racks",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/case-study-global-it-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-18",
    acquired: "2026-11-25",
    depicts: "Three people in suits at a table with an open laptop, a holographic world map and two server racks",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/case-study-hydraulics-robotics-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-19",
    acquired: "2026-11-25",
    depicts: "Three engineers in hard hats inspecting a chrome hydraulic cylinder test rig with a white robotic arm",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/case-study-industrial-turbine-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-20",
    acquired: "2026-11-25",
    depicts: "Three engineers in hard hats around a bladed steam turbine rotor on bearing pedestals",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/case-study-mining-dispatch-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-21",
    acquired: "2026-11-25",
    depicts:
      "A yellow haul truck on a weighbridge with a gatehouse and three staff in high-visibility jackets at a console",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/case-study-power-distribution-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-22",
    acquired: "2026-11-25",
    depicts:
      "Three engineers in yellow hard hats at open electrical distribution panels and a screen of network charts",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/case-study-railway-freight-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-23",
    acquired: "2026-11-25",
    depicts:
      "Five staff in dark uniforms around a dispatch desk with an illuminated track schematic and a model locomotive",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/case-study-telecom-network-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-24",
    acquired: "2026-11-25",
    depicts: "Three engineers between two fibre-patched server racks and a bank of screens showing network diagrams",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/case-study-transmission-ams-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-25",
    acquired: "2026-11-25",
    depicts: "Four engineers in white hard hats at a console in front of curved screens of transmission grid diagrams",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/case-study-wellness-fmcg-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-26",
    acquired: "2026-11-25",
    depicts: "Three staff on a packaging line of plain navy and copper tea canisters with scales and tasting glassware",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/case-study-manufacturing-group-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-27",
    acquired: "2026-11-25",
    depicts: "Five people in suits around an operations table with a model textile loom and steel pipe sections",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/contact-hero-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-28",
    acquired: "2026-11-25",
    depicts: "Five people with headsets at a curved dark slate counter beneath a holographic globe of contact icons",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/energy-and-utilities.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-29",
    acquired: "2026-11-25",
    depicts: "Three engineers in reflective vests at a desk before a model substation with transformers and pylons",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/engineering-constructions-ecno.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-30",
    acquired: "2026-11-25",
    depicts: "Three engineers in hard hats with a survey transit beside a scale model of a multi-span concrete viaduct",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/fmcg.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-31",
    acquired: "2026-11-25",
    depicts: "Two staff at a dispatch console in a tiered conveyor warehouse moving plain cartons onto pallets",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/government.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-32",
    acquired: "2026-11-25",
    depicts: "Three people in suits before a marble podium with holographic screens of maps and charts",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/healthcare-life-science.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-33",
    acquired: "2026-11-25",
    depicts: "Three scientists in cleanroom suits at stainless steel bioreactors and a vial-filling line",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/heavy-engineering.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-34",
    acquired: "2026-11-25",
    depicts: "Three engineers in hard hats at a control panel beside a ladle pouring molten steel into casting moulds",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/industries.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-35",
    acquired: "2026-11-25",
    depicts: "Two people in suits over a ring of nine small platforms holding industry models around a central globe",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/manufacturing.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-36",
    acquired: "2026-11-25",
    depicts: "Two engineers at a production line of yellow six-axis robotic arms assembling gear components",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/pages-about-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-37",
    acquired: "2026-11-25",
    depicts:
      "Five people in suits around an architectural table model of global delivery networks with three screens behind",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/pages-advisory-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-38",
    acquired: "2026-11-25",
    depicts: "Three consultants around a blueprint table with a compass, a globe and milestone blocks",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/pages-case-studies-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-39",
    acquired: "2026-11-25",
    depicts: "Three people in suits beside three ascending steel stages linked by a glowing track",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/pages-homepage-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-40",
    acquired: "2026-11-25",
    depicts: "Four people in suits around a round dark console with floating holographic cloud and data diagrams",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/pages-insights-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-41",
    acquired: "2026-11-25",
    depicts: "Five people in suits around a lit pedestal holding a large crystal prism with floating chart panels",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/service-application-engineering-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-42",
    acquired: "2026-11-25",
    depicts: "Three engineers in dark hoodies at a conveyor pipeline passing glowing cubes through scanning gates",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/service-application-estate-review-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-43",
    acquired: "2026-11-25",
    depicts: "Three people in suits around a four-quadrant diagnostic table of glowing miniature building blocks",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/service-applied-ai-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-44",
    acquired: "2026-11-25",
    depicts: "Four engineers at a workstation around a glowing neural network core panel with a robotic arm",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/service-converged-flow-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-45",
    acquired: "2026-11-25",
    depicts:
      "Four people in dark clothes watching glass conduits carry blue and amber streams through valve checkpoints",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/service-converged-momentum-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-46",
    acquired: "2026-11-25",
    depicts: "Three people at a rail of server blades travelling along maglev tracks toward a cloud platform",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/service-converged-pulse-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-47",
    acquired: "2026-11-25",
    depicts: "Three technicians at a console between glowing blue acrylic monitoring towers",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/service-data-engineering-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-48",
    acquired: "2026-11-25",
    depicts: "Three people around glass filtration columns in bronze, silver and gold tiers feeding chart cubes",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/service-digital-data-ai-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-49",
    acquired: "2026-11-25",
    depicts: "Three people around a glass cylinder holding a glowing brain-shaped neural core with side screens",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/service-ecc-prism-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-50",
    acquired: "2026-11-25",
    depicts:
      "Three people in suits before a legacy machine block passing light through a prism into four output channels",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/service-enterprise-data-management-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-51",
    acquired: "2026-11-25",
    depicts: "Three people in suits before an open titanium vault with master record cylinders inside",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/service-enterprise-platforms-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-52",
    acquired: "2026-11-25",
    depicts: "Three people seen from behind facing a central processing hub linked to four metallic computing nodes",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/service-managed-services-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-53",
    acquired: "2026-11-25",
    depicts: "Three people at an operations desk under a curved wall of four monitoring screens",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/service-rise-s4hana-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-54",
    acquired: "2026-11-25",
    depicts: "Three people seen from behind at a console between two ascending ramps rising to a cloud platform",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/service-salesforce-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-55",
    acquired: "2026-11-25",
    depicts: "Three people around a central glowing core with orbiting curved glass panels of icons and charts",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/service-sap-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-56",
    acquired: "2026-11-25",
    depicts: "Three people in suits around a brushed steel cylindrical core engine with docking data cartridges",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/service-smart-meter-to-cash-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-57",
    acquired: "2026-11-25",
    depicts:
      "Three engineers in hard hats at a cutaway rig of a smart meter, communications gateway and billing cabinet",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/service-successfactors-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-58",
    acquired: "2026-11-25",
    depicts: "Three people around a circular multi-tiered glass platform of figure icons and organisation charts",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/service-workday-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-59",
    acquired: "2026-11-25",
    depicts: "Three people in suits around interlocking glass and aluminium modules with a globe and bar charts",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/telecom.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-60",
    acquired: "2026-11-25",
    depicts: "Three engineers between two server racks of fibre patch cables and a bank of network map screens",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/pages-services-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-61",
    acquired: "2026-11-25",
    depicts:
      "Three consultants in dark suits around an arc of three platforms: a cylindrical core engine, a blueprint table with a compass, and a glowing neural core",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/about-awards-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-62",
    acquired: "2026-11-25",
    depicts:
      "Three people in dark suits at an inspection desk before a wall of blank framed certificates and three crystal awards on glass pedestals",
    aiGenerated: true,
    approvedBy: "Rudra Shatapathy",
  },
  {
    file: "public/generated/services-how-we-price-telemetry.webp",
    source: "licensed-generative",
    provider: "Adobe Firefly",
    reference: "firefly-2026-11-25-final-63",
    acquired: "2026-11-25",
    depicts:
      "Three people seen from behind at a dark table, facing a titanium balance scale weighing glass blocks against steel cubes",
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

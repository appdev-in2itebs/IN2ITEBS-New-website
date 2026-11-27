# Image and video plan for the website — what the policy allows, where we need pictures, and the prompts

Prepared 23 November 2026 from the three policy documents in the 20 November delivery
(`10 - Interim Image Policy`, `10a - Images - the decision behind the policy`,
`In2IT EBS - Interim Image Policy`) and from the rules already built into this branch
(`content/image-licences.ts`, `tests/diagrams.test.ts`, `docs/IMAGE_POLICY.md`).
Local working document for the deployment branch; nothing here is published.

---

## 1 · What the company decided (the policy, in one table)

| Topic | Decision | Source |
| --- | --- | --- |
| Status | Interim policy, decided by the Managing Director on 20 Nov 2026. **Expires 20 Nov 2027.** The build warns 30 days before and fails the day after (`INTERIM_POLICY_REVIEW`). | 10, §4 |
| Why | The site needs richer imagery sooner than an internal library can be built, so **licensed** imagery may be used now while the company collects its own over twelve months. | 10, intro |
| The one rule that is not negotiable | **No image may depict a place, person, document or credential that a reader could reasonably take to be ours when it is not.** Decoration is allowed. Depiction of us is not, unless it is actually us. | 10, §2 |
| Allowed subjects | Abstract textures, gradients, 3D abstract forms, generic cityscapes, hands on keyboards, server rooms that belong to nobody. | 10, §2 |
| Forbidden subjects | Our offices, our delivery centres, our people, our certificates, our clients' premises, **a logo rendered onto anything**, synthetic colleagues, synthetic documents. Whatever the licence says. | 10, §2; 10a |
| Licence rule | The licence must permit **commercial use and export without a visible watermark on the tier we actually pay for**, and we keep the invoice. No stripping, cropping or "removing the sparkle". | 10, §2 |
| Provenance rule | Embedded provenance (SynthID, C2PA) **stays in the file**. Removing it is a separate and worse offence than removing a watermark. | 10, §2 |
| Approved providers, in order | 1. **Adobe Stock** (default; the only one with IP indemnity). 2. **Runway** (only if motion is genuinely needed; paid plans export without a visible mark, C2PA kept). 3. **Google AI Pro / Veo** (paid tier, visible mark off, SynthID kept). 4. **In2IT Marketing** (our own photography or commissioned illustration). | 10, §1; `APPROVED_PROVIDERS` |
| Not approved | Kling, Hailuo, Seedance, Vidu (watermark policy undocumented; provenance answer we cannot give to a PSU or government buyer). Open-source Wan (licence not confirmed). | 10, §1 |
| How a picture gets on the site | Every bitmap that is not ours and not a third-party mark needs a line in `content/image-licences.ts`: file, source, provider, reference the provider can confirm, date acquired, what it depicts (3+ words, never "our" or "In2IT"), whether a model made it, and the **person** who approved it. The build fails without it. | 10, §3 |
| What does not change | The generated route figures (`hero-figure.tsx`) stay on every page hero. Licensed imagery **supplements** a page that genuinely reads thin; it is not a reason to put a picture on every page. The admin picture picker can still override a hero. | 10, §5 |
| Evidence images | Only four certificates (CMMI L3, ISO 9001, ISO/IEC 27001, SAP Gold Partner) and leadership portraits count as evidence. These must be **real** scans and photographs, never generated. | 10a |
| Regulatory framing | India IT Rules (Feb 2026): the labelling duty is on platforms, the prohibition on deceptive or impersonating synthetic content reaches us. EU AI Act Art. 50 (Aug 2026): small but non-zero exposure. The deciding question is **what the picture depicts**, not which subscription removes the mark. | 10a |
| Twelve-month programme | This month: scan the four certificates; one morning of leadership portraits. Monthly: photographs from go-lives and workshops with written consent at capture. Quarterly: move them into `public/events/` and retire licensed files. By Aug 2027: review what is left. | 10, §4 |

### What this means for generating with Higgsfield

Higgsfield is **not on the approved list**. The register in `content/image-licences.ts` rejects any provider that is not Adobe Stock, Runway, Google AI Pro (Veo) or In2IT Marketing, so a Higgsfield file cannot pass the build today. Two honest routes:

1. **Get it approved.** A written decision from the Managing Director adding Higgsfield, after confirming three things in Higgsfield's terms: commercial use is permitted on the plan we pay for; exports on that plan carry no visible watermark; any embedded provenance is left in place. Keep the invoice. Then add `"Higgsfield"` to `APPROVED_PROVIDERS` with a comment naming the decision date.
2. **Generate with an approved tool instead.** The prompts below are provider-neutral and run unchanged in Adobe Firefly (via Adobe Stock, which also indemnifies) or Runway.

Either way, every generated file gets `aiGenerated: true` in the register and a `depicts` line that describes an abstract object, never us.

---

## 2 · The visual language we will ask the tools for

The site is navy, steel blue, light blue and sand, serif headlines, generous white space, and every page hero is a flat generated tile figure. Imagery has to sit beside that without shouting, and it must be obviously decorative (the policy's own word) so nobody mistakes it for a photograph of us.

| Choice | Decision | Why |
| --- | --- | --- |
| Medium | **3D-rendered abstract objects as PNG with transparent background**, one object per idea | Reads as deliberate illustration, not as a fake photo; can be animated in CSS; weighs little |
| Palette | Navy `#121E3B`, steel blue `#3F75A3`, light blue `#94B8D0`, sand `#CDC8A5`, off-white `#F7F8FA`; nothing else | Matches the brand book and the explainers |
| Material | Matte ceramic or frosted glass with soft studio light; no chrome, no neon | Calm, premium, consistent across tools |
| Camera | Isometric or gentle three-quarter view, centred, generous margin | Objects can be placed on a navy or off-white band and overlap edges |
| Subjects | Geometric metaphors only: blocks, rails, prisms, lattices, spheres, stacked layers, flowing ribbons, maps as abstract dots | Decoration under the policy; nothing a reader could take for our office, people, documents or logo |
| Never | Text, logos, flags, faces, hands, screens with readable UI, buildings that could be an office, certificates, badges, awards | All are either depiction of us or an unfalsifiable claim |
| Motion | Prefer **PNG + CSS motion** (float, slow rotate, parallax on scroll, reveal with the explainers' scroll engine). Request **video** only for the homepage hero and the three pillar bands, as 6–8 s seamless loops | Policy: Runway only "if motion is genuinely needed"; CSS motion is free of licence and provenance questions |
| Formats | PNG 2048×2048 with alpha for objects; 2560×1440 for hero scenes; MP4 H.264 1920×1080 for loops (plus a poster PNG) | What the site's `<Image>` and `<video>` components use |
| Weight budget | ≤ 350 KB per object PNG after compression, ≤ 4 MB per loop | The policy's own argument against the 86 MB the stock photos cost |

---

## 3 · Where the site needs imagery, and what kind

"Need" is measured against the policy: a picture goes where a page genuinely reads thin, not everywhere. Priorities: **A** do first, **B** next, **C** nice to have.

| # | Page / section | Today | What to add | Type | Motion | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Homepage hero (`BrandHero`) | Navy band, abstract tile figure, rotating headline | One signature 3D object: four translucent slabs converging into a single prism ("converged intelligence") | PNG 2560×1440 alpha **or** 8 s loop | Loop, or PNG with slow rotation and scroll parallax | A |
| 2 | Homepage "Three claims you can check" (`HomeManifesto`) | Navy band, three text cards | Three small objects: an open register (stacked plates), an hourglass of blocks (claims expire), a prism with a tag (SAP describes our packages) | 3 × PNG 1024² alpha | Float on hover, reveal with scroll | B |
| 3 | Homepage services strip (`HomeServices`) and the three pillar hubs | Tile illustrations | Three pillar objects: Enterprise Platforms = interlocking navy cubes on a rail; Advisory = a compass-like ring of slabs; Digital, Data & AI = a lattice of light-blue spheres with one steel node | 3 × PNG 1536² alpha; optional 6 s loop each | Slow rotate; loop on the hub hero | A |
| 4 | Homepage industry strip and the 9 industry pages | Text tiles | Nine abstract industry objects (see table in §5) | 9 × PNG 1024² alpha | Reveal left to right with the strip; gentle float on the page hero | B |
| 5 | Services: 14 service pages | Generated figure hero | One object per service, only where the page has no explainer band already carrying the idea (ECC PRISM, meter-to-cash, managed services, data management, estate review, application engineering already have animated sections). Remaining 8 get an object | 8 × PNG 1536² alpha | Float, parallax | B |
| 6 | `/services/how-we-price` | Text | A balance of three equal blocks (fixed scope, date, price) | PNG 1536² alpha | Reveal | C |
| 7 | About: who we are | Five value PNGs in `public/about/` (mission, purpose, vision, value, support), older style | Re-render the five as matching 3D objects in the new language | 5 × PNG 1024² alpha | Reveal | B |
| 8 | About: markets | Country matrix explainer | A globe made of dots with five lit points (no borders, no flags) | PNG 1536² alpha | Slow rotation | C |
| 9 | About: credentials and awards | Award plaque photos, four certificates missing | **Real scans only.** No generated imagery here; the policy calls these evidence | Scans | None | A (compliance task, not generation) |
| 10 | About: leadership | Four portraits, others monogram | **Real photographs only**, consent at capture | Photos | None | A (marketing task, not generation) |
| 11 | Careers: culture, events | Our own event photos (54) | Nothing generated. Add one abstract object for "current openings" (a doorway of light-blue slabs) | 1 × PNG | Float | C |
| 12 | Insights: article covers | Few or no covers | Four category covers reused across posts: SAP core, people and payroll, data and AI, delivery and run | 4 × PNG 1600×900 alpha on navy | Parallax on the post hero | B |
| 13 | Case studies: index and detail | Client marks, explainers | One cover object per sector (five sectors), abstract; never a client's product or site | 5 × PNG 1600×900 | Reveal | C |
| 14 | Contact | Form, office list | A ring of five soft pins over a dotted plane | PNG 1536² alpha | Slow float | C |
| 15 | 404 and thank-you | Text | One object: a single block set slightly apart from a row | PNG 1024² alpha | Float | C |

Totals if everything is done: about 44 PNG objects and up to 4 loops. Phase A alone is 1 hero, 3 pillar objects and two non-generation tasks (certificates, portraits).

---

## 4 · Master prompt (paste first, then the subject line from §5)

Use this block as the system or style part of every generation. It encodes the palette, the material, the camera and, most importantly, the policy's exclusions.

```
STYLE — In2IT EBS website object
A single abstract 3D object, centred, floating, rendered as a premium product shot.
Material: matte ceramic and frosted glass. Soft studio light from upper left, gentle
ambient occlusion, one subtle rim light. Colours strictly from this palette: deep navy
#121E3B, steel blue #3F75A3, light blue #94B8D0, warm sand #CDC8A5, off-white #F7F8FA.
Camera: isometric three-quarter view, 35mm equivalent, no perspective distortion.
Background: fully transparent (alpha PNG). No ground shadow beyond a faint soft
contact shadow. Composition leaves 15% margin on every side.
Mood: calm, precise, engineered, quiet confidence. Editorial illustration, not a toy.

NEVER include: text, letters, numbers, logos, brand marks, flags, people, faces,
hands, screens with readable interfaces, office interiors, buildings, certificates,
badges, awards, trophies, coins, currency, charts with values, photographic realism.

Output: 2048 x 2048, PNG, transparent background, sharp edges, no watermark overlay.
```

Negative prompt, for tools that take one:

```
text, watermark text, logo, typography, letters, numbers, person, people, face, hands,
office, building, skyline, desk, laptop screen UI, certificate, badge, award, trophy,
flag, money, neon, chrome, glossy plastic, photorealistic photo, stock photo, blur,
low detail, cropped, extra objects, busy background, gradient background
```

For loops (Runway or Veo), add:

```
MOTION — 8 second seamless loop, 1920x1080, 24 fps. The object rotates slowly
(one sixth of a turn over the loop) with a subtle breathing scale of 2%. Camera
locked. Background: deep navy #121E3B with a faint radial light behind the object.
No cuts, no text, no particles that read as data, no lens flare.
```

---

## 5 · Subject prompts, one per asset

Append each line to the master prompt. File name is what the asset will be saved as under `public/objects/`; the `depicts` text is what goes in the register and must stay true of the picture.

### 5.1 Homepage and pillars (priority A)

| File | Subject prompt (after the master prompt) | `depicts` for the register |
| --- | --- | --- |
| `home-converge.png` | Four thin translucent slabs in navy, steel blue, light blue and sand slide from four directions and meet as one upright prism at the centre; the prism catches the light on one edge. | Four coloured glass slabs meeting as one prism |
| `pillar-enterprise-platforms.png` | A short rail of sand-coloured ceramic with three navy cubes locked onto it in a row, the middle cube half-lifted as if being placed. | Three navy cubes on a sand rail |
| `pillar-advisory.png` | A ring of twelve thin steel-blue slabs arranged like compass points around an empty centre, one slab in sand pointing upward. | A ring of blue slabs with one sand pointer |
| `pillar-digital-data-ai.png` | A loose lattice of light-blue frosted spheres connected by hairline sand rods, with one larger steel-blue sphere at the centre. | A lattice of blue spheres joined by thin rods |
| `home-converge-loop.mp4` | The `home-converge` object, as the MOTION block: the four slabs drift in and settle as the prism, then hold, then loop. | Four coloured glass slabs meeting as one prism, animated |

### 5.2 Three claims (priority B)

| File | Subject prompt | `depicts` |
| --- | --- | --- |
| `claim-register.png` | A stack of eight thin ceramic plates in off-white, the top three lifted and fanned slightly, edges tinted light blue. | A fanned stack of ceramic plates |
| `claim-expiry.png` | An hourglass built from small navy and sand cubes, with the lower chamber a little fuller than the upper. | An hourglass made of small cubes |
| `claim-packages.png` | A frosted glass prism with a thin sand-coloured tag loop around one corner, no writing on the tag. | A glass prism with a blank sand tag |

### 5.3 Industries (priority B) — abstract metaphors, no real plants, vehicles, products or buildings

| File | Industry | Subject prompt | `depicts` |
| --- | --- | --- | --- |
| `industry-banking.png` | Banking and financial services | Three concentric frosted rings in light blue around a solid navy sphere, balanced on a thin sand plinth. | Concentric rings around a navy sphere |
| `industry-consumer.png` | Consumer goods and distribution | A conveyor-like sand ribbon carrying five small ceramic cubes in alternating navy and light blue. | Small cubes along a curved ribbon |
| `industry-government.png` | Government and public sector | Five evenly spaced navy columns of equal height supporting a single thin light-blue slab. | Five columns under one slab |
| `industry-manufacturing.png` | Manufacturing | Two interlocking frosted gears rendered as smooth abstract rings with rounded teeth, one navy, one light blue. | Two interlocking abstract gear rings |
| `industry-metals.png` | Metals, mining and steel | A stack of three thick navy slabs with a sand-coloured wedge pressed between the top two. | Thick slabs with a wedge between them |
| `industry-pharma.png` | Pharma, healthcare and life sciences | A gentle double helix made of small light-blue spheres linked by sand rods, standing upright. | A helix of small spheres and rods |
| `industry-power.png` | Power and utilities | A single steel-blue ribbon arcing between two navy posts, with a light-blue pulse of light midway along it. | A blue ribbon arcing between two posts |
| `industry-real-estate.png` | Real estate and infrastructure | A grid of nine low frosted blocks of varying heights on a sand base, no windows or doors. | A grid of low frosted blocks |
| `industry-technology.png` | Technology and digital natives | A cluster of light-blue spheres orbiting a navy cube on thin invisible paths, one sphere in sand. | Spheres orbiting a navy cube |

### 5.4 Services without an explainer band (priority B)

| File | Service | Subject prompt | `depicts` |
| --- | --- | --- | --- |
| `service-sap.png` | SAP | A large navy cube with one face open, revealing an orderly grid of small light-blue cubes inside. | A navy cube open on one face with small cubes inside |
| `service-converged-pulse.png` | Converged Pulse | A ring of ceramic segments with one segment lit in light blue, like a quiet dial. | A segmented ring with one lit segment |
| `service-converged-flow.png` | Converged Flow | Three sand ribbons braided once and running parallel again. | Three ribbons braided once |
| `service-converged-momentum.png` | Converged Momentum | A navy sphere at the end of a gentle incline of frosted slabs, caught at the top. | A sphere at the top of an incline of slabs |
| `service-rise-s4hana.png` | RISE with SAP | Seven ascending steps of light-blue frosted glass with a navy marker on each step. | Seven ascending glass steps with markers |
| `service-successfactors.png` | SuccessFactors | A ring of twelve frosted pegs around a steel-blue centre disc, no figures. | A ring of pegs around a centre disc |
| `service-salesforce.png` | Salesforce | A funnel of three nested frosted cones in light blue, navy and sand. | Three nested cones |
| `service-workday.png` | Workday | A circular calendar-like dial of 28 small ceramic tiles with four tinted sand. | A dial of small ceramic tiles |
| `service-data-engineering.png` | Data engineering and analytics | Pipes of frosted glass joining three navy tanks of different sizes, no liquid, no labels. | Glass pipes joining three navy vessels |
| `service-applied-ai.png` | Applied AI | A navy sphere with a lattice of light-blue nodes resting on its surface, one node sand. | A sphere with a surface lattice of nodes |
| `pricing-fixed.png` | How we price | A balance beam of sand with three identical navy cubes resting on it, perfectly level. | Three identical cubes on a level beam |

### 5.5 About, insights, case studies, contact (priority B–C)

| File | Place | Subject prompt | `depicts` |
| --- | --- | --- | --- |
| `value-mission.png` | Who we are | A single navy arrow-shaped slab resting on a sand plinth, pointing forward. | A navy arrow slab on a plinth |
| `value-purpose.png` | Who we are | A light-blue sphere held in a shallow sand cradle. | A sphere in a shallow cradle |
| `value-vision.png` | Who we are | A frosted lens disc standing upright with a navy ring. | An upright frosted lens with a ring |
| `value-values.png` | Who we are | Four equal frosted cubes in a tight square, one tinted sand. | Four equal cubes in a square |
| `value-support.png` | Who we are | A navy slab supported from beneath by three light-blue pillars. | A slab on three pillars |
| `markets-globe.png` | Markets | A sphere made only of small off-white dots with five dots lit light blue; no landmasses, no borders. | A dotted sphere with five lit dots |
| `insight-sap-core.png` | Insights cover | A navy cube with light tracing one edge, on a deep navy backdrop. | A navy cube with one lit edge |
| `insight-people.png` | Insights cover | A gentle wave of frosted pegs rising and falling, on navy. | A wave of frosted pegs |
| `insight-data-ai.png` | Insights cover | A constellation of light-blue spheres with hairline links, on navy. | A constellation of linked spheres |
| `insight-delivery.png` | Insights cover | Four frosted steps with a sand marker on the third, on navy. | Four steps with one marker |
| `sector-power.png`, `sector-metals.png`, `sector-consumer.png`, `sector-government.png`, `sector-technology.png` | Case-study covers | Reuse the five matching industry objects on a navy backdrop at 1600×900. | As the industry object |
| `contact-pins.png` | Contact | Five soft frosted pins standing on a plane of off-white dots, in a loose ring. | Five pins on a dotted plane |
| `misc-apart.png` | 404, thank-you | A row of six navy cubes with the fourth lifted and turned slightly. | A row of cubes with one lifted |

---

## 6 · Acceptance check before any file is added

Run this list for every generated file. Any "no" means the file does not go in.

| Check | Pass condition |
| --- | --- |
| Depiction | Nothing in the picture could be taken for an In2IT office, person, document, certificate or client site; no logo of anyone; no text |
| Palette | Only the five brand colours; no neon or chrome |
| Licence | Generated on a **paid** plan of an **approved** provider; invoice filed; plan terms permit commercial use and export without a visible mark |
| Provenance | Embedded C2PA or SynthID left untouched; the file is the tool's export, not re-saved through an editor that strips metadata |
| Register | A line in `content/image-licences.ts` with provider, a reference the provider can confirm (asset ID, generation ID or invoice line), acquisition date, a `depicts` of three or more words without "our" or "In2IT", `aiGenerated: true`, and a named approver |
| Weight | PNG ≤ 350 KB after lossless compression (`oxipng` or `pngquant` at 256 colours keeps the alpha); loops ≤ 4 MB |
| Placement | Only where §3 lists it, with the generated route figure still in place on the hero |

Register line template:

```ts
{
  file: "public/objects/pillar-advisory.png",
  source: "licensed-generative",
  provider: "Runway",                       // or "Adobe Stock"; Higgsfield only after approval
  reference: "gen_01HXYZ…",                 // the generation ID shown in the tool, or the invoice line
  acquired: "2026-11-24",
  depicts: "A ring of blue slabs with one sand pointer",
  aiGenerated: true,
  approvedBy: "Firstname Lastname",
},
```

---

## 7 · How they will be used in the site once approved

- Files live in `public/objects/` (new folder, registered, not exempt).
- A small `ObjectFigure` component places a PNG with CSS motion: slow rotation, float, and reveal through the existing scroll engine (`components/motion/scroll-scene.tsx`), so the objects enter in the same left-to-right rhythm as the explainers.
- The homepage hero can take the loop as a `<video>` with the PNG as its poster; everything else stays PNG.
- Industry and service objects are keyed by slug in content, so adding one later is a content change.
- The generated route figures remain on every page; the objects sit beside the text, not instead of the figure.

Nothing in this section is built yet. It starts after the provider decision in §1.

# Image and video shot list, with prompts

For generating the new website's visuals through Higgsfield (or any approved provider) from Claude Code. Prepared 23 November 2026 from a full scan of the local build (86 pages) and a look at what the live site in2itebs.com uses today.

## 1. Style: what the live site has, what we keep, what changes

**What the live site uses today**

| Where on the live site | What it is | Keep? |
|---|---|---|
| Page heroes (services, pages, about, careers, partners) | 3D rendered object compositions: glossy plastic and brushed-metal objects on round navy plinths, royal blue and white, isometric three-quarter view, white background. No people. | **Yes, this is the style to continue.** |
| Industry heroes (manufacturing, FMCG) | Same 3D render, but with two workers in uniform beside machines | Style yes, people no (see policy below) |
| Homepage hero | Five AI clips of flat-illustrated offices with staff; slide 2 shows the In2IT EBS logo on the wall | **No.** This is the footage the policy describes as a depiction of us, and it was removed from the new build on 18 November 2026. |
| Old stock photographs (92 cut-out business people) | Removed on 18 November 2026, no purchase record | No |

**The policy, applied to this list**

- Decoration is allowed, depiction of us is not. So: objects, equipment, products, environments that belong to nobody. No people presented as our staff, no office with our logo, no certificates, no client premises.
- The industry scenes that currently show workers are redrawn without people. Generic hands or a figure seen from behind would be defensible, but the cleaner answer, and the one that needs no argument in a tender, is no people at all.
- Provider for images: Adobe Stock (Firefly) is the default; Higgsfield needs a written addition to the approved list first. Provider for video: Runway or Google AI Pro (Veo). Kling, Seedance, Hailuo and Vidu are excluded. Inside Higgsfield, that leaves Veo as the only video model consistent with the policy, and only if Higgsfield itself is approved.
- Paid tier, invoice kept, no visible mark on that tier, embedded provenance left in, and a register line (provider, reference, date, description, approver) before any file goes live. The build rejects files without it.

**Visual language for every prompt**

3D rendered icon composition in the style of premium software-company illustration. Materials: glossy soft plastic, frosted glass, brushed steel. Palette: deep navy (#0B1F3A), royal blue (#1F4E9A), sky blue (#9CC3E6), white, with one warm sand/gold accent used sparingly. Objects sit on a round two-tier plinth in navy and white, or float just above it. Isometric three-quarter view, soft studio lighting from the upper left, gentle contact shadows. Pure white background so it can be cut to transparent. No text, no letters, no numbers, no logos, no flags, no people, no faces.

**Master prompt** (prepend to every image prompt)

> 3D rendered illustration, premium enterprise software style, glossy soft-plastic and brushed-steel materials, deep navy and royal blue with sky-blue and white, one small warm sand accent, objects arranged on a round navy-and-white plinth, isometric three-quarter view, soft studio lighting, subtle contact shadows, clean pure white background, centred composition with margin on all sides, high detail, 4k.

**Negative prompt**

> text, letters, numbers, words, logo, watermark, signature, people, person, face, hands, flag, map labels, photo-realistic office, blurry, low detail, cropped, cluttered, dark background.

**Sizes**: icons 1024×1024, objects 1536×1536 (or 1536×1024 for wide hero objects), covers 1600×900. Transparent cut-out is done locally after generation.

## 2. Videos

The new homepage hero has five rotating slides (brand, SAP, applications, platforms, data and AI), as the live site had. Two options:

| Option | Clips | Credits (Veo 3.1 inside Higgsfield, 4 to 5 takes each) |
|---|---|---|
| A. One loop behind all five slides | 1 | about 200 to 300 |
| B. One loop per slide, matching the live site's five-clip pattern | 5 | about 1,000 to 1,500 (needs a top-up or Runway) |

Recommendation: start with option A. Add the other four only if sir wants the slide-by-slide change.

Video style: the same 3D object world as the images, animated. Camera drifts slowly, objects assemble or light up, nothing rotates fast, no cuts, last frame matches the first. 8 s, 1920×1080, 24 fps, no sound. Delivered as MP4 and WebM under 4 MB each, plus a PNG poster.

| # | Where | Prompt |
|---|---|---|
| V1 | Homepage hero, all slides (option A) | 3D rendered enterprise scene, premium software illustration style, deep navy and royal blue with sky-blue and white and one sand accent. On a wide round navy plinth, five glossy modules rise gently into place one after another: a server tower, a cloud block, a ring of connected nodes, a dashboard panel, a small conveyor with product cubes. Thin streams of light connect them as they settle. Slow camera drift from left to right, soft studio lighting, white background, seamless 8-second loop, no text, no people. |
| V2 | Hero slide "SAP" (option B) | Same world. A glossy navy cube with a bright steel core lifts from the plinth and rotates a quarter turn while a cloud block and a bar-chart panel slide in beside it, light flowing between them. Slow drift, seamless loop, no text, no people. |
| V3 | Hero slide "Applications" | Same world. A robotic arm places translucent code-like blocks into a growing structure on the plinth; each block lights sky-blue as it lands. Slow drift, seamless loop. |
| V4 | Hero slide "Platforms" | Same world. Three modules, a ring of badges, a calendar grid and a cloud block, connect to a central navy hub with glowing steel rails. Slow drift, seamless loop. |
| V5 | Hero slide "Data and AI" | Same world. Spheres flow through a frosted-glass prism and sort into ordered lines on the plinth; a lattice above lights node by node. Slow drift, seamless loop. |
| Hub loops (optional) | Enterprise Platforms, Advisory, Digital Data & AI hub heroes | Reuse V2, V4 and V5 respectively; no new generation. |

Register line for each: provider, generation ID, date, "Abstract 3D animation of generic enterprise software modules on a plinth", approver name.

## 3. Images, numbered, with where each goes and its prompt

Each prompt below is appended to the master prompt.

### A. Pillar objects (3, object size). Services index "Three groups, one partner"; hero of each pillar hub; About "At a glance"; video posters.

| # | File | Where | Prompt |
|---|---|---|---|
| A1 | pillar-platforms.png | Enterprise Platforms | Four glossy navy cubes locked together on a brushed-steel rail, one cube lifted slightly with a sky-blue glow underneath, a small cloud block behind. |
| A2 | pillar-advisory.png | Advisory | A ring of eight upright frosted-glass slabs around a navy compass dial, one slab royal blue and pointing outward, a thin gold indicator on the dial. |
| A3 | pillar-digital.png | Digital, Data & AI | A lattice of connected glossy spheres in navy and sky blue above a plinth, three spheres lit white, thin steel rods joining them. |

### B. Industry objects (9). Homepage "Find your sector", Industries page sector cards, each industry page hero, case-study heroes in that sector. B1, B2 and B5 also rendered at 1536 px for the three large panels on the Industries page.

| # | File | Industry | Prompt |
|---|---|---|---|
| B1 | ind-manufacturing.png | Manufacturing | A white six-axis robotic arm over a short conveyor carrying three steel machine parts, a small control panel with a green indicator light, no operator. |
| B2 | ind-power-utilities.png | Power and utilities | A miniature transmission pylon in brushed steel beside a glossy smart meter and a small substation block, sky-blue lines of light running between them. |
| B3 | ind-metals-mining.png | Metals, mining and steel | A stack of dark steel slabs with one polished mirror edge, a small tipping ladle pouring a glowing sand-gold stream, a miniature ore cart. |
| B4 | ind-government.png | Government and public sector | A pale civic building with a row of six equal columns and a dome, a glossy navy document tray and a stamp beside it. |
| B5 | ind-consumer-goods.png | Consumer goods and distribution | Packaged goods on a short conveyor: white bottles with navy caps, a carton, a pouch and a jar, a barcode scanner arm above, a stack of parcels at the end, no people. |
| B6 | ind-pharma.png | Pharma, healthcare and life sciences | Three glass vials with navy caps in a rack, a blister pack, a microscope in white and steel, a small heart-rate line of light. |
| B7 | ind-technology.png | Technology and digital natives | Two glossy server racks with sky-blue status lights, a floating laptop and phone, a cloud block above connected by light. |
| B8 | ind-banking.png | Banking and financial services | A round steel vault door half open, a navy payment card, stacked silver coins and rising glossy ledger bars. |
| B9 | ind-real-estate.png | Real estate and infrastructure | A white tower crane lifting a glass office block onto a plinth beside a short bridge section and a rolled plan. |

### C. Homepage "Services we offer" cards (7, icon size). C1 also on the RISE page hero, C2 on the SuccessFactors page hero.

| # | File | Service | Prompt |
|---|---|---|---|
| C1 | svc-rise.png | RISE with SAP | A navy server tower lifting off its base on a beam of sky-blue light towards a glossy white cloud block, a small upward steel arrow. |
| C2 | svc-successfactors.png | SAP SuccessFactors | A ring of six glossy ID badges (blank, no faces) around a central navy hub, a small calendar tile and a tick mark on the plinth. |
| C3 | svc-sac.png | SAP SAC | Three floating frosted-glass dashboard panels with bar and line shapes (no numbers), a round gauge in front. |
| C4 | svc-grow.png | Grow with SAP | A small royal-blue cube sprouting into a stepped stack of larger cubes, a sand-gold leaf shape at the top. |
| C5 | svc-enterprise-solutions.png | Other Enterprise Solutions | Five modules of different shapes, cube, cylinder, wedge, ring, slab, clicking into one navy frame like a puzzle. |
| C6 | svc-data-ai.png | Data Analytics & AI | Glossy spheres entering a frosted-glass prism and leaving as three sorted lines of white, sky-blue and navy spheres. |
| C7 | svc-adms.png | ADMS | A small white robotic arm placing translucent code-like blocks into a half-built tower, a wrench and a shield beside it. |

### D. Service page heroes without an explainer band (8, object size)

| # | File | Page | Prompt |
|---|---|---|---|
| D1 | svc-sap.png | /services/sap | A large navy glossy cube with a visible brushed-steel core seen through a frosted-glass face, resting on a two-tier plinth, small modules orbiting. |
| D2 | svc-pulse.png | /services/converged-pulse | A line of eight glossy spheres on a steel rail with one bright pulse of sky-blue light travelling along, a calendar tile with a single marked day. |
| D3 | svc-flow.png | /services/converged-flow | A smooth frosted-glass channel from a small field plot to a document tray, one glowing bead moving through it, a tiny tractor and an invoice slab at the ends. |
| D4 | svc-momentum.png | /services/converged-momentum | A wheel of navy slabs caught mid-turn with a slight motion blur on the rim, a glossy profit gauge in front with the needle rising. |
| D5 | svc-salesforce.png | /services/salesforce | A cluster of soft rounded cubes forming a cloud shape on a plinth, a headset and a chat bubble tile beside it. |
| D6 | svc-workday.png | /services/workday | A calendar grid of white tiles with one tile raised and glowing royal blue, a badge and a coin stack beside it. |
| D7 | svc-data-engineering.png | /services/data-engineering-analytics | Three glass pipes carrying sky-blue light joining into one clear block that outputs a neat bar-chart panel. |
| D8 | svc-applied-ai.png | /services/applied-ai | A lattice of nodes with one node glowing white and lit paths running from it to a gauge whose needle has moved. |

### E. Homepage "Three claims you can check" (3, icon size)

| # | File | Prompt |
|---|---|---|
| E1 | claim-register.png | A fanned stack of white register plates with navy edges, the top plate carrying a small tick. |
| E2 | claim-hourglass.png | An hourglass built from small navy and sky-blue cubes, the lower half nearly full. |
| E3 | claim-tag.png | A frosted-glass prism with a blank white tag hanging from it on a thin steel cord. |

### F. Who we are, value row (5, icon size)

| # | File | Value | Prompt |
|---|---|---|---|
| F1 | value-mission.png | Mission | A glossy navy arrow-shaped slab pointing up from a plinth, a small sand-gold target ring at its tip. |
| F2 | value-purpose.png | Purpose | A brushed-steel ring with one glossy white sphere at the centre, lit from above. |
| F3 | value-vision.png | Vision | A lens of frosted glass on a stand with a beam of sky-blue light passing through and spreading. |
| F4 | value-values.png | Values | Three equal glossy cubes, navy, royal blue and white, on one level steel beam. |
| F5 | value-support.png | Support | A white slab held up by two angled navy supports, a small shield tile in front. |

### G. Single objects (7)

| # | File | Where | Prompt |
|---|---|---|---|
| G1 | price-balance.png | How we price, "Fixed scope" | A level steel balance beam holding three identical navy cubes, perfectly balanced. |
| G2 | price-dial.png | How we price, "Managed service" | A round dial of twelve segments, four lit royal blue, a small steel pointer. |
| G3 | markets-globe.png | Markets, beside the matrix | A dotted navy globe on a stand with five points lit white and thin arcs of light joining them, no borders or labels. |
| G4 | contact-pins.png | Contact, above the India offices | Five glossy map pins in navy, royal blue and sand on a dotted white plane, connected by thin steel arcs. |
| G5 | state-cubes.png | 404 and thank-you | A row of five glossy cubes with the middle one lifted and glowing sky blue underneath. |
| G6 | careers-doorway.png | Current openings hero | A doorway of stacked sky-blue frosted slabs with warm light coming through, a small welcome mat tile. |
| G7 | careers-roles.png | Careers "Open roles" | A stack of white plates on a plinth with one plate sliding out, edged in royal blue. |

### H. Covers (9, 1600×900, deep navy background, object lower right, space for a title on the left)

Change the master prompt's background line to: "deep navy background with a soft radial glow, object placed in the lower right third, empty space on the left".

| # | File | Topic | Prompt |
|---|---|---|---|
| H1 | cover-sap-core.png | SAP articles, homepage news | A frosted-glass prism and a navy cube side by side on a thin plinth. |
| H2 | cover-people-payroll.png | SuccessFactors articles | A ring of blank glossy badges around a small calendar tile. |
| H3 | cover-data-ai.png | AI articles | A lattice of connected spheres with three lit white. |
| H4 | cover-delivery-run.png | Delivery and managed-service articles | A steel rail with four navy cubes moving along it, one lit. |
| H5 | cover-energy.png | Case studies: energy and utilities | The B2 pylon and meter composition. |
| H6 | cover-metals.png | Case studies: metals and heavy engineering | The B3 slab and ladle composition. |
| H7 | cover-government.png | Case studies: government and PSUs | The B4 columns and tray composition. |
| H8 | cover-consumer.png | Case studies: FMCG and consumer | The B5 conveyor of goods composition. |
| H9 | cover-technology.png | Case studies: IT and telecom | The B7 server racks and devices composition. |

## 4. Not generated, to be collected

| Item | Where |
|---|---|
| Real portraits of the remaining leaders, consent recorded at capture | About, Our leadership |
| Scans of CMMI Level 3, ISO 9001, ISO/IEC 27001, SAP Gold Partner | Credentials |
| Two or three of our own event photos | Careers, Our culture |

## 5. Totals

| | Count |
|---|---|
| Videos | 1 (option A) or 5 (option B), plus 0 new for hubs |
| Images | 51: 3 pillar, 9 industry, 7 service cards, 8 service heroes, 3 claims, 5 values, 7 single, 9 covers |
| Generations with 4 attempts each | about 204 image generations; 4 to 20 video takes |

Credits on Higgsfield Plus (1,200): images on Nano Banana Pro about 410; video option A on Veo 3.1 about 250; total about 660. Option B exceeds the month and should go to Runway or a top-up.

## 6. How Claude Code runs it

1. Sir confirms the provider (Higgsfield added to the policy, or Adobe and Runway).
2. For each row: generate 4 variants with the master prompt + row prompt + negative prompt, save all four to `web/public/objects/_candidates/<file>-1..4.png` with the generation IDs in a sidecar JSON.
3. Show contact sheets; you pick one per row or ask for a re-roll.
4. Cut the background to transparent, trim, resize to the target size, write WebP + PNG to `web/public/objects/<file>`.
5. Add the register line in `content/image-licences.ts` (provider, reference = generation ID + invoice number, date, depicts text, approvedBy).
6. Place in the page with the scroll motion, run `npm run check` and the screenshot pass, show you the page.

Order: Phase A = V1, A1 to A3, B1, B2, B5 large. Phase B = C, D, remaining B, H1 to H4. Phase C = E, F, G, H5 to H9, and V2 to V5 if chosen.

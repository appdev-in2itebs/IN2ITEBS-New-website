# Site image and video requirements

Scan of the local deployment build at http://127.0.0.1:3117 on 23 November 2026. All 86 pages in the sitemap were crawled section by section (heading, height, text, pictures, video, explainer bands), and eight pages were checked visually in full. This is the page-by-page list of where imagery goes and what it is. File names, prompts and order of work are in `IMAGE_SHOT_LIST.md` and `IMAGE_GENERATION_PLAN.md`.

## What the site has today

| Media | Where |
|---|---|
| Generated tile figure | Every page hero (route figure, stays) |
| Client and partner logos | Homepage strip, Industries "beyond the named verticals", About partnerships |
| Real photos | 4 leader portraits (About), 1 on Our leadership, 5 award plaques (Awards), 54 event photos (Events & celebrations) |
| Video | One office clip behind the homepage partners band |
| Animated explainer bands | 24 bands across 20 pages (services, case studies, credentials, markets, where we stand) |
| Statement bands (dark, word-by-word text) | Homepage "Two things", every service page, Smart Meter to Cash |
| Everything else | Text cards and lists |

Rule applied throughout: 3D abstract objects in brand colours, transparent PNG, animated by the existing scroll engine. One looping video on the homepage hero, three optional on the pillar hubs. Real photographs only for people and certificates. No new imagery on legal pages, job-opening pages, form pages or statement bands.

## Part 1. Videos

| # | Page | Section | Video | Spec | Priority |
|---|---|---|---|---|---|
| V1 | Home | Hero, behind the headline | Four coloured glass slabs drift in from the corners and converge into one prism; slow, seamless, no text | 8 s loop, 1920×1080, MP4 + WebM, PNG poster, reduced-motion fallback to poster | A |
| V2 | /services/enterprise-platforms | Hero | Cubes slide along a rail and lock together | 6 s loop, 1920×1080, poster = pillar PNG A1 | C |
| V3 | /services/advisory | Hero | Ring of slabs turns, one pointer slab lights | 6 s loop, poster = A2 | C |
| V4 | /services/digital-data-ai | Hero | Lattice of spheres connects node by node | 6 s loop, poster = A3 | C |
| Keep | Home | Partners band | Existing office clip is ours; keep it, or swap for V1 for consistency | Existing | - |

No other page needs video. YouTube embeds on the Events page stay.

## Part 2. Images, page by page

### Home (/)

| Section | Now | Needs | Type | Priority |
|---|---|---|---|---|
| Hero | Tile figure | V1 poster frame | PNG 1920×1080 | A |
| Client logo strip | 20 logos | Nothing | - | - |
| "Three claims you can check" | 3 text cards on navy | 3 icons: fanned register plates, hourglass of cubes, prism with blank tag (E1 to E3) | 3D PNG 1024 px | B |
| "Services we offer" | 7 cards with tile figures | One object per card: RISE, SuccessFactors, SAC, GROW, Other enterprise solutions, Data analytics & AI, ADMS (C1 to C7) | 3D PNG 1024 px | B |
| "Find your sector" | 10 text links | 9 industry icons (B1 to B9) | 3D PNG 1024 px | B |
| "Two things you can work out yourself" | Statement band | Nothing (text animation) | - | - |
| Partners band | Office video | Keep | - | - |
| "News & articles" | 18 cards with tile figures | 4 topic covers by category (H1 to H4) | PNG 1600×900 on navy | B |

### Services

| Page | Section | Now | Needs | Type | Priority |
|---|---|---|---|---|---|
| /services | "Three groups, one partner" | 3 list cards, line icons | 3 pillar objects: cubes on a rail, ring of slabs, lattice of spheres (A1 to A3) | 3D PNG 1536 px | A |
| /services/how-we-price | "Fixed scope, or managed service" | 2 long text columns | Level beam with 3 cubes; dial of segments (G1, G2) | 3D PNG 1024 px | C |
| 3 pillar hubs | Hero | Tile figure | Matching pillar object A1 to A3, or loop V2 to V4 | 3D PNG or loop | A |
| 3 pillar hubs | "What we deliver here" | 4 to 5 text cards | Nothing; cards stay text | - | - |
| 6 pages with the "Two things you can work out yourself" band (services index, hubs, SAP) | Statement band | Nothing | - | - |
| /services/sap | Hero | Tile figure | Navy cube with a steel core (D1) | 3D PNG 1536 px | B |
| /services/converged-pulse | Hero | Tile figure | Line of spheres with a travelling pulse (D2) | 3D PNG 1536 px | B |
| /services/converged-flow | Hero | Tile figure | Slabs as a channel, one bead moving through (D3) | 3D PNG 1536 px | B |
| /services/converged-momentum | Hero | Tile figure | Wheel of slabs mid-turn (D4) | 3D PNG 1536 px | B |
| /services/salesforce | Hero | Tile figure | Soft cubes clustered on a plate (D5) | 3D PNG 1536 px | B |
| /services/workday | Hero | Tile figure | Grid of tiles with one raised (D6) | 3D PNG 1536 px | B |
| /services/data-engineering-analytics | Hero and "What we build" | Tile figure, 4 text cards; no explainer on this page | Glass pipes joining into one block (D7) | 3D PNG 1536 px | B |
| /services/applied-ai | Hero | Tile figure | Lattice with one glowing node (D8) | 3D PNG 1536 px | B |
| /services/rise-s4hana | Hero | Tile figure | Reuse C1 | - | B |
| /services/successfactors | Hero | Tile figure | Reuse C2 | - | B |
| ecc-prism, smart-meter-to-cash, managed-services, application-engineering, application-estate-review, enterprise-data-management | Whole page | Already carry 1 to 3 explainer bands | Nothing new | - | - |
| /services/smart-meter-to-cash | "Connect, bill, collect" | Numbered text list | Optional: reuse B2 power icon beside the heading | - | C |

### Industries

| Page | Section | Now | Needs | Type | Priority |
|---|---|---|---|---|---|
| /industries | "Enterprise experience, grounded in the real world" | **Three large empty navy panels** (Manufacturing, Energy & utilities, Consumer products). The most visible gap on the site | B1, B2, B5 rendered large, one per panel | 3D PNG 1536 px, transparent | A |
| /industries | "The sectors where we go deep" | 9 text cards | Industry icons B1 to B9 | 3D PNG 1024 px | B |
| /industries | "Enterprises beyond the named verticals" | Logo marquee | Nothing | - | - |
| 9 industry pages | Hero | Tile figure | Matching industry object B1 to B9 | 3D PNG | B |
| 9 industry pages | "What we deliver here", "Other industries" | Text cards | Nothing | - | - |

### Case studies

| Page | Section | Now | Needs | Type | Priority |
|---|---|---|---|---|---|
| /case-studies | Top | Two explainer bands | Nothing | - | - |
| /case-studies | "Proof, by project" filter and 16 cards | Text cards | 5 sector covers: energy, metals and heavy engineering, government and PSUs, FMCG and consumer, IT and telecom (H5 to H9) | PNG 1600×900 on navy | C |
| 16 case-study pages | Hero | Tile figure in a white frame | Sector cover H5 to H9 by the case's industry | reuse | C |
| 16 case-study pages | "At a glance", "What we delivered" | Text cards | Nothing | - | - |

### Insights

| Page | Section | Now | Needs | Type | Priority |
|---|---|---|---|---|---|
| /insights | "Ideas worth reading" | 6 cards with tile figures | Topic covers H1 to H4 by category (SAP, SuccessFactors, AI) | PNG 1600×900 | B |
| 6 insight articles | Top of article | Heading only, no cover | Topic cover H1 to H4 | PNG 1600×900 | B |

### About

| Page | Section | Now | Needs | Type | Priority |
|---|---|---|---|---|---|
| /about | "At a glance" and "One structure, built to compound" | Numbers, 4 text cards | Pillar objects A1 to A3 reused | reuse | B |
| /about | "Led by people who have done it before" | 4 real portraits | Portraits of the remaining leaders | **Real photographs**, consent recorded | A |
| /about/who-we-are | "Invested in partners and consultants" | Text only, short page | 5 value icons: mission, purpose, vision, values, support (F1 to F5) as a row under the text | 3D PNG 1024 px | B |
| /about/our-leadership | "Led from the front" | 1 portrait | Portraits for every leader listed | **Real photographs** | A |
| /about/credentials | "Appraised, not self-declared", "Three designations" | Text, 2 explainers | Scans of CMMI L3, ISO 9001, ISO/IEC 27001, SAP Gold Partner certificate | **Real scans** with issuer and expiry | A |
| /about/credentials/awards | Award grid | 5 plaque photos present (one without the gold frame) | Nothing to generate; reframe the fifth plaque | - | C |
| /about/credentials/awards | "Accreditation" | STPI and NASSCOM logos | Nothing | - | - |
| /about/partnerships | Platform lists | Text | Nothing; partner logos are a licensing question, not generation | - | - |
| /about/markets | Beside the country matrix | Explainer only | Dotted globe with 5 lit points (G3) | 3D PNG 1536 px | C |
| /about/where-we-stand | Whole page | 2 explainers, capability table | Nothing | - | - |

### Careers

| Page | Section | Now | Needs | Type | Priority |
|---|---|---|---|---|---|
| /careers | "A performance-oriented culture" | 4 text cards | Two or three of our own event photos pulled from the Events page | Own photos | B |
| /careers | "Open roles" | Text | Stack of plates with one sliding out (G7) | 3D PNG 1024 px | C |
| /careers/our-culture | Three text bands | Text | Own event photos between the bands | Own photos | B |
| /careers/current-openings | Hero | Tile figure | Doorway of light-blue slabs (G6) | 3D PNG 1536 px | C |
| /careers/current-openings | Open roles list | 14 role cards | Nothing | - | - |
| /careers/events-celebrations | Galleries | 54 photos | Nothing | - | - |
| 14 job-opening pages | Summary, apply form | Text | Nothing | - | - |

### Contact, utility and legal

| Page | Section | Now | Needs | Type | Priority |
|---|---|---|---|---|---|
| /contact | Beside the form and office cards | Text cards | Five pins on a dotted plane (G4) above the India offices | 3D PNG 1536 px | C |
| 404, thank-you | Top | Text | Row of cubes with one lifted (G5) | 3D PNG 1024 px | C |
| /legal/privacy-notice, privacy-policy, disclaimer | Whole page | Text | Nothing | - | - |

## Totals

| | Count |
|---|---|
| Videos to generate | 4 (1 required, 3 optional hub loops) |
| Distinct 3D PNG objects | 42 (3 pillar, 9 industry, 7 service card, 8 service page, 3 claims, 5 values, 7 single) |
| Covers on navy | 9 (4 insight topics, 5 case-study sectors) |
| Images to generate | 51 |
| Real photographs to collect | Leader portraits, 4 certificate scans, 2 to 3 own event photos |
| Pages that need nothing new | 14 job openings, 3 legal, Events, Awards, Partnerships, Where we stand, and the 6 service pages that already carry explainers |

Phase A (the visitor's first screens): V1, A1 to A3, the three large industry panels on /industries, portraits and certificate scans.

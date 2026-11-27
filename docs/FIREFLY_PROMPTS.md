# Adobe Firefly prompts — approved shot list (51 images, 5 videos)

Sub-branch site only (`deployment`, http://127.0.0.1:3117). Rewritten 24 November 2026 to match the
list Rudra Shatapathy approved for one month (Ajaya Rout to deliver, Elisaya Nayak to list). Item
numbers and names are exactly as in the approved list. Every prompt below was written for the copy
on the page where the image goes, and every slot was checked in the code and measured in the browser
at 1440 px wide.

---

## 1. What the check found

| Finding | Items | What it means |
|---|---|---|
| **No place exists** | 31–35 (Who we are: Mission, Purpose, Vision, Values, Support) | Those cards were removed from the page on purpose (the old Vision text was another company's). Decision 24 Nov: generate all 51 anyway; these five are kept on file until the section returns. |
| **Nothing to attach to** | 46 (Delivery & run cover) | No insight article is in that category today. Generated anyway and kept on file. |
| **Slot must be added to the page first** | 28–30, 36–38, 40, 42, 47–51 | Today these spots are text-only or have no picture box. Adding the box is a small code change I'll make when the images arrive. |
| **Broken right now** | 4–6 on /industries/ | The three Industries panels point to photos (`/stock/*.jpg`) that are not on this branch, so they show nothing. Items 4–6 fix that. |
| **Small icons, not pictures** | 1–3 on /services/ and /about/ | Those spots are 48 px icons. The images fit the three hub heroes; using them on /services/ and /about/ means redesigning the cards. |
| **Name differs** | 3 on /about/ | The third pillar on /about/ is called “Digital Engineering”, not Data & AI. |
| **Card links** | 15, 16 | The homepage “SAP SAC” card links to Data Engineering; “Grow with SAP” links to Converged Pulse. There is no SAC or GROW page. |
| **Diagrams already drawn** | 4, 7, 8, 9 | Unused diagrams exist for Manufacturing, Metals, Government and Pharma. The shot-list review suggested using them instead. Prompts are included anyway. |
| **Rule to watch** | 15 | `hero-figure.tsx` forbids fake charts and invented upward curves. The dashboard prompt keeps bars flat and unlabelled. |

## 2. Crops — what size to generate

Firefly offers 1:1, 4:3, 3:4 and 16:9. Generate at the ratio in the item, then I crop to each spot.

| Spot on the site | Size measured | Generate at | Note |
|---|---|---|---|
| Page hero (services, industries, about, careers, contact) | 600×450 (4:3) | **4:3** | On phones the Contact hero is 3:2, so keep the object central |
| Industries large panel | 718×620 (≈7:6) | 4:3 (item 4) | Crops a little off the sides |
| Industries small panels | 510×304 (5:3) | 4:3 (items 5, 6) | Crops top and bottom, so leave margin |
| Homepage service cards | 279×174 (16:10) | **16:9** (13, 14 at 4:3 because they double as heroes) | |
| Insight cards | 399×249 (16:10) | **16:9** | |
| Homepage news cards | 263×148 (16:9) | 16:9 | |
| Homepage claim cards | navy cells | 4:3, **navy background** | |
| 404 and Thank-you | full-width navy band | 16:9, **navy background** | |
| Case-study cards | new | 16:9, top-down view | |
| Homepage hero video | full screen behind white text | 16:9, **navy background**, object on the right | |

Every image prompt asks for wide empty margins so all crops are safe.

## 3. Firefly settings (every image)

| Setting | Value |
|---|---|
| Model | Latest Firefly Image model |
| Content type | **Photo** (gives the clean 3D render look) |
| Aspect ratio | As stated per item |
| Visual intensity | Low |
| Style reference | Make **item 20** first. Once approved, upload it as the Style reference for every other light-background image. For navy-background items (28–30, 40, videos), make item 28 first and use that as their reference |
| Variations | 4, keep the best 1 |

**Exclude (paste into the negative prompt for every image):**

```
text, letters, numbers, words, logo, brand mark, watermark, signature, people, person, face, hands, office interior, city skyline, screen content, readable interface, teal, green, orange, red, purple, pink, neon, clutter, busy background
```

## 4. Consistency (from the shot list review)

1. Generate everything **in one sitting** inside the one paid month. Credits don't roll over.
2. Change only the subject. The style sentences inside each prompt are identical on purpose.
3. Review all images together as a contact sheet before using any. Expect to redo about a third.
4. Reject anything that has turned teal, green, orange or purple, or shows text, a logo or a person.

## 5. Save as

PNG, named `NN-short-name.png` exactly as shown (e.g. `20-navy-cube-with-steel-core.png`), into
`D:\IN2ITEBS-Website-deployment\assets\firefly\`. Note the generation date of each file.

---

## 6. The 51 image prompts

### 1–3 · Hubs (used on three pages each)

**1 · Cubes on a steel rail** — save as `01-cubes-on-a-steel-rail.png`

- **Where:** /services/enterprise-platforms/ hero · /services/ card · /about/ Platforms pillar
- **Copy beside it:** “The platforms your business runs on” — what matters is who is still accountable in year three.
- **Generate:** 4:3, pale background · **Crop:** 4:3 hero (600×450)
- **Status:** Ready — slot exists

```
A row of identical deep navy cubes travelling in single file along a long precision steel rail, evenly spaced, the rail continuing out of the frame to the right. One cube in the middle has a thin sand line around it. Mood: platforms that keep running long after go-live. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**2 · Ring of glass slabs with compass dial** — save as `02-ring-of-glass-slabs-with-compass-dial.png`

- **Where:** /services/advisory/ hero · /services/ card · /about/ Advisory pillar
- **Copy beside it:** “Advice that is never followed by delivery is a deck” — we advise and we deliver.
- **Generate:** 4:3, pale background · **Crop:** 4:3 hero (600×450)
- **Status:** Ready — slot exists

```
A ring of upright frosted glass slabs standing around a flat brushed steel compass dial at the centre. The ring has one gap, and the compass needle points straight through it. Mood: a clear direction that leads somewhere. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**3 · Lattice of connected spheres** — save as `03-lattice-of-connected-spheres.png`

- **Where:** /services/digital-data-ai/ hero · /services/ card · /about/ third pillar
- **Copy beside it:** “The ERP holds the transaction, not the process” — the risk sits in the apps and data around it.
- **Generate:** 4:3, pale background · **Crop:** 4:3 hero (600×450)
- **Status:** Ready — slot exists

```
An open three-dimensional lattice of frosted glass spheres joined by thin steel rods, built around one larger solid deep navy sphere at its centre. The lattice extends outward from the core in every direction. Mood: everything that surrounds the core system. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

### 4–12 · Industries

**4 · Robotic arm and conveyor** — save as `04-robotic-arm-and-conveyor.png`

- **Where:** /industries/manufacturing/ hero · /industries/ large Manufacturing panel
- **Copy beside it:** “Where the shop floor and the ledger have to agree.”
- **Generate:** 4:3, pale background · **Crop:** 4:3 hero; also the large Industries panel (≈7:6, 718×620) — keep the object centred
- **Status:** Ready — slot exists

```
A compact stylised industrial robotic arm in steel and navy placing an identical navy part onto a short conveyor belt. Each part on the belt passes under a small frosted glass gate that matches it exactly. Mood: the shop floor and the ledger counting the same thing. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**5 · Pylon, smart meter and substation** — save as `05-pylon-smart-meter-and-substation.png`

- **Where:** /industries/power-utilities/ hero · /industries/ Energy & utilities panel
- **Copy beside it:** “Meters installed is not revenue collected.”
- **Generate:** 4:3, pale background · **Crop:** 4:3 hero; also an Industries small panel (5:3, 510×304)
- **Status:** Ready — slot exists

```
A miniature steel transmission pylon, a small navy smart-meter box and a compact substation block standing on one navy base, joined by a single taut steel wire. The wire ends at a short stack of frosted glass discs. Mood: from the meter to the money. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**6 · Packaged goods on a conveyor** — save as `06-packaged-goods-on-a-conveyor.png`

- **Where:** /industries/consumer-goods-distribution/ hero · /industries/ Consumer products panel
- **Copy beside it:** “One business, and a different tax authority in every market.”
- **Generate:** 4:3, pale background · **Crop:** 4:3 hero; also an Industries small panel (5:3, 510×304)
- **Status:** Ready — slot exists

```
Identical plain navy and light-sky-blue boxes with no labels moving along a conveyor that splits into three branches, each branch ending in its own frosted glass tray. Mood: one product line, many markets. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**7 · Steel slabs with pouring ladle** — save as `07-steel-slabs-with-pouring-ladle.png`

- **Where:** /industries/metals-mining-steel/ hero  ◆ unused diagram e1-reconciliation-gap.svg also fits
- **Copy beside it:** “Where the tonnage and the ledger have to be the same number.”
- **Generate:** 4:3, pale background · **Crop:** 4:3 hero (600×450)
- **Status:** Ready — slot exists

```
A tilted steel ladle pouring a thin stream of softly glowing sand-coloured molten metal onto a neat stack of brushed steel slabs, which rest on a precision weighing platform. Mood: weight that has to match the books. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**8 · Civic building with columns** — save as `08-civic-building-with-columns.png`

- **Where:** /industries/government-public-sector/ hero  ◆ unused diagram f2-approval-path.svg also fits
- **Copy beside it:** “Built for the buyer who has to show their working.”
- **Generate:** 4:3, pale background · **Crop:** 4:3 hero (600×450)
- **Status:** Ready — slot exists

```
A small stylised civic building in soft white ceramic with a row of classical columns and a navy roof. In front of it stands a frosted glass box holding neatly ordered navy blocks, fully visible. Mood: public, transparent, accountable. Generic building, no flags, no emblems. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**9 · Vials, blister pack and microscope** — save as `09-vials-blister-pack-and-microscope.png`

- **Where:** /industries/pharma-healthcare-life-sciences/ hero  ◆ unused diagram r2-healthcare-book.svg also fits
- **Copy beside it:** “The implementation is a project. The audit trail is forever.”
- **Generate:** 4:3, pale background · **Crop:** 4:3 hero (600×450)
- **Status:** Ready — slot exists

```
A row of sealed glass vials with navy caps, a blank blister pack and a compact steel microscope arranged on a navy tray. One thin unbroken sand line runs beneath all of them. Mood: precise, regulated, recorded. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**10 · Server racks with laptop and cloud** — save as `10-server-racks-with-laptop-and-cloud.png`

- **Where:** /industries/technology-digital-natives/ hero
- **Copy beside it:** “A real ERP, before the spreadsheets become the risk.”
- **Generate:** 4:3, pale background · **Crop:** 4:3 hero (600×450)
- **Status:** Ready — slot exists

```
Two compact navy server racks and an open laptop with a plain blank screen, beneath a soft frosted glass cloud form, all linked by thin steel lines. Mood: a young company putting proper systems in place. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**11 · Vault door, card and coins** — save as `11-vault-door-card-and-coins.png`

- **Where:** /industries/banking-financial-services/ hero
- **Copy beside it:** “Development finance, with the audit scrutiny that comes with it.”
- **Generate:** 4:3, pale background · **Crop:** 4:3 hero (600×450)
- **Status:** Ready — slot exists

```
A round brushed steel vault door standing slightly open, a plain navy card leaning against it and a neat stack of plain steel coins with no markings. Mood: secure, scrutinised, orderly. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**12 · Crane lifting a glass block** — save as `12-crane-lifting-a-glass-block.png`

- **Where:** /industries/real-estate-infrastructure/ hero
- **Copy beside it:** “Workspace and property operations on a cloud core.”
- **Generate:** 4:3, pale background · **Crop:** 4:3 hero (600×450)
- **Status:** Ready — slot exists

```
A slender steel tower crane lowering a frosted glass block into the last empty slot of a modular navy building volume. Generic architecture, no signage. Mood: building and running property on one core. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

### 13–19 · Homepage service cards

**13 · Server tower lifting to a cloud** — save as `13-server-tower-lifting-to-a-cloud.png`

- **Where:** Homepage “RISE with SAP” card · /services/rise-s4hana/ hero
- **Copy beside it:** “Getting there is the project. Running it is the decade.”
- **Generate:** 4:3, pale background · **Crop:** 4:3 RISE hero; homepage card crop 16:10 (279×174) — keep the object in the middle 80%
- **Status:** Ready — slot exists

```
A deep navy server tower lifting off its base and rising up a short column of light-sky-blue glass steps toward a soft frosted glass cloud form above. Mood: moving the core system to the cloud, steadily. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**14 · Ring of ID badges** — save as `14-ring-of-id-badges.png`

- **Where:** Homepage “SAP SuccessFactors” card · /services/successfactors/ hero
- **Copy beside it:** “HR systems fail quietly. Payroll fails on the 28th.”
- **Generate:** 4:3, pale background · **Crop:** 4:3 SuccessFactors hero; homepage card crop 16:10
- **Status:** Ready — slot exists

```
A ring of blank ID badges on thin lanyards hanging evenly around a central brushed steel disc. One badge is a slightly brighter light-sky-blue. The badges carry no photos and no writing. Mood: every employee, every month, on time. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**15 · Dashboard panels and gauge** — save as `15-dashboard-panels-and-gauge.png`

- **Where:** Homepage “SAP SAC” card (links to /services/data-engineering-analytics/)
- **Copy beside it:** “SAP SAC” — business intelligence, planning and analytics on BTP.
- **Generate:** 16:9, pale background · **Crop:** Homepage card 16:10 (279×174)
- **Status:** Ready — slot exists

```
Three floating frosted glass panels with simple abstract bar shapes of even, unremarkable heights, and a round brushed steel gauge beside them with its needle at the middle. No numbers, labels or upward-trending curves. Mood: planning and analysis in one place. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**16 · Cube sprouting into a stack** — save as `16-cube-sprouting-into-a-stack.png`

- **Where:** Homepage “Grow with SAP” card (links to /services/converged-pulse/)
- **Copy beside it:** “Grow with SAP” — S/4HANA Public Cloud, fit-to-standard, quarterly releases.
- **Generate:** 16:9, pale background · **Crop:** Homepage card 16:10
- **Status:** Ready — slot exists

```
A single deep navy cube with a clean vertical stack of smaller steel and frosted glass cubes growing up out of its top face. Mood: starting small on a standard core and growing. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**17 · Modules clicking into one frame** — save as `17-modules-clicking-into-one-frame.png`

- **Where:** Homepage “Other Enterprise Solutions” card (links to /services/enterprise-platforms/)
- **Copy beside it:** “Other Enterprise Solutions” — implement what we are designated for, integrate the rest.
- **Generate:** 16:9, pale background · **Crop:** Homepage card 16:10
- **Status:** Ready — slot exists

```
Four navy and steel modules sliding into one open brushed steel frame. Three are already seated; the fourth is just about to click into place. Mood: different systems fitted into one estate. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**18 · Spheres through a glass prism** — save as `18-spheres-through-a-glass-prism.png`

- **Where:** Homepage “Data Analytics & AI” card
- **Copy beside it:** “Data Analytics & AI” — turning varied data into answers you can act on.
- **Generate:** 16:9, pale background · **Crop:** Homepage card 16:10
- **Status:** Ready — slot exists

```
A loose stream of mixed small spheres of different sizes entering a triangular frosted glass prism from the left and leaving on the right as one neat, evenly spaced line of identical navy spheres. Mood: varied data becoming a clear answer. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**19 · Robotic arm stacking code blocks** — save as `19-robotic-arm-stacking-code-blocks.png`

- **Where:** Homepage “Application Development & Maintenance Services” card
- **Copy beside it:** “ADMS” — build and maintain modern and legacy applications.
- **Generate:** 16:9, pale background · **Crop:** Homepage card 16:10
- **Status:** Ready — slot exists

```
A small brushed steel robotic arm stacking plain rounded navy and light-sky-blue blocks, each with simple bracket-shaped grooves and no characters, into a tidy tower. Mood: applications built carefully, piece by piece. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

### 20–27 · Service page heroes

**20 · Navy cube with steel core** — save as `20-navy-cube-with-steel-core.png`

- **Where:** /services/sap/ hero
- **Copy beside it:** “Our deepest practice. Measured, not asserted.”
- **Generate:** 4:3, pale background · **Crop:** 4:3 hero (600×450)
- **Status:** Ready — slot exists

```
A solid deep navy cube with one corner precisely cut away to reveal a polished brushed steel-blue core, standing on a flat steel measuring plate with fine engraved tick marks and no numbers. Mood: depth you can measure. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**21 · Spheres with a light pulse** — save as `21-spheres-with-a-light-pulse.png`

- **Where:** /services/converged-pulse/ hero
- **Copy beside it:** “A real ERP, on a date you can plan around” — live in 12 weeks at a fixed price.
- **Generate:** 4:3, pale background · **Crop:** 4:3 hero (600×450)
- **Status:** Ready — slot exists

```
Twelve evenly spaced frosted glass spheres in a straight line along a brushed steel rail, with one soft pulse of light-sky-blue light passing through them in sequence. Mood: a steady, predictable schedule. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**22 · Glass channel from field to invoice** — save as `22-glass-channel-from-field-to-invoice.png`

- **Where:** /services/converged-flow/ hero
- **Copy beside it:** “A batch you can trace, from the field to the invoice.”
- **Generate:** 4:3, pale background · **Crop:** 4:3 hero (600×450)
- **Status:** Ready — slot exists

```
A clear frosted glass channel running in a gentle curve from a small rough mound of raw material at one end to a crisp plain navy card at the other, with one bright bead travelling along it. Mood: one batch, traceable end to end. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**23 · Wheel of slabs with profit gauge** — save as `23-wheel-of-slabs-with-profit-gauge.png`

- **Where:** /services/converged-momentum/ hero
- **Copy beside it:** “Project profitability you can see during the project.”
- **Generate:** 4:3, pale background · **Crop:** 4:3 hero (600×450)
- **Status:** Ready — slot exists

```
An upright wheel built from alternating navy and steel slabs, with a small round steel gauge mounted at its hub, needle at the middle, no numbers. Mood: progress and margin visible while the work is moving. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**24 · Cloud of cubes with headset** — save as `24-cloud-of-cubes-with-headset.png`

- **Where:** /services/salesforce/ hero
- **Copy beside it:** “A certified team. And a straight answer about where we are.”
- **Generate:** 4:3, pale background · **Crop:** 4:3 hero (600×450)
- **Status:** Ready — slot exists

```
An irregular floating cluster of small frosted glass and navy cubes, with a brushed steel over-ear headset resting on the ground beside it. The cluster must not resemble any company logo. Mood: customer service, answered directly. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**25 · Calendar grid with raised tile** — save as `25-calendar-grid-with-raised-tile.png`

- **Where:** /services/workday/ hero
- **Copy beside it:** “A certified team. And the same straight answer.”
- **Generate:** 4:3, pale background · **Crop:** 4:3 hero (600×450)
- **Status:** Ready — slot exists

```
A flat deep navy grid of square tiles like a blank calendar month, with one tile raised above the rest and finished in brushed steel-blue. No numbers. Mood: people and time, organised. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**26 · Glass pipes joining into one block** — save as `26-glass-pipes-joining-into-one-block.png`

- **Where:** /services/data-engineering-analytics/ hero
- **Copy beside it:** “Reporting that agrees with the ledger.”
- **Generate:** 4:3, pale background · **Crop:** 4:3 hero (600×450)
- **Status:** Ready — slot exists

```
Several frosted glass pipes arriving from different directions and joining into one solid deep navy block, from which a single straight steel pipe leaves. Mood: many sources, one agreed figure. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**27 · Lattice with glowing node** — save as `27-lattice-with-glowing-node.png`

- **Where:** /services/applied-ai/ hero
- **Copy beside it:** “AI where it moves a number you already report.”
- **Generate:** 4:3, pale background · **Crop:** 4:3 hero (600×450)
- **Status:** Ready — slot exists

```
A regular lattice of thin steel rods and small navy spheres in which a single node glows softly light-sky-blue, its light reaching only the rods next to it. Mood: one precise, targeted change. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

### 28–30 · Homepage claim cards (navy background)

**28 · Fanned register plates** — save as `28-fanned-register-plates.png`

- **Where:** Homepage “Three claims you can check” — card 1
- **Copy beside it:** “We publish what we cannot do.”
- **Generate:** 4:3, navy background · **Crop:** Card on navy, about 4:3 — slot to be added
- **Status:** Slot must be added to the page first

```
A fan of thin brushed steel and frosted glass plates like the pages of a register, one plate slightly pulled out of the fan and edged with a thin sand line. Mood: an open, checkable record. Set on a seamless deep navy background (#121E3B), with generous empty margin on every side. Premium 3D illustration in a clean product-render style. Materials: brushed steel-blue (#3F75A3) metal, frosted light-sky-blue (#A3CBE6) glass and soft white ceramic, with one thin muted sand (#CDC8A5) accent; a subtle cool rim light separates the object from the dark ground. Soft diffused light from the upper left, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**29 · Hourglass of cubes** — save as `29-hourglass-of-cubes.png`

- **Where:** Homepage claim card 2
- **Copy beside it:** “Our claims expire.”
- **Generate:** 4:3, navy background · **Crop:** Card on navy — slot to be added
- **Status:** Slot must be added to the page first

```
An hourglass of frosted glass in a slim steel frame, filled with tiny steel cubes instead of sand, a few cubes passing through the narrow neck. Mood: claims with a date on them. Set on a seamless deep navy background (#121E3B), with generous empty margin on every side. Premium 3D illustration in a clean product-render style. Materials: brushed steel-blue (#3F75A3) metal, frosted light-sky-blue (#A3CBE6) glass and soft white ceramic, with one thin muted sand (#CDC8A5) accent; a subtle cool rim light separates the object from the dark ground. Soft diffused light from the upper left, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**30 · Prism with blank tag** — save as `30-prism-with-blank-tag.png`

- **Where:** Homepage claim card 3
- **Copy beside it:** “SAP describes our packages. We don’t.”
- **Generate:** 4:3, navy background · **Crop:** Card on navy — slot to be added
- **Status:** Slot must be added to the page first

```
A frosted glass prism with a plain blank steel tag hanging from it on a thin cord. The tag has no writing. Mood: described by someone else, independently. Set on a seamless deep navy background (#121E3B), with generous empty margin on every side. Premium 3D illustration in a clean product-render style. Materials: brushed steel-blue (#3F75A3) metal, frosted light-sky-blue (#A3CBE6) glass and soft white ceramic, with one thin muted sand (#CDC8A5) accent; a subtle cool rim light separates the object from the dark ground. Soft diffused light from the upper left, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

### 31–35 · Who we are — generate, kept on file

**31 · Arrow slab (Mission)** — save as `31-arrow-slab.png`

- **Where:** /about/who-we-are/ — Mission, Purpose, Vision, Values, Support
- **Copy beside it:** These cards were removed on purpose (the page code notes the old Vision was copied from another company). There is nothing to put these images on.
- **Generate:** 4:3, pale background · **Crop:** No slot exists
- **Status:** Generate now — no place on the page yet; kept on file for when the section returns

```
A thick deep navy slab shaped as a broad arrow, pointing to the right, resting on a thin steel base. Mood: direction. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**32 · Ring with one sphere (Purpose)** — save as `32-ring-with-one-sphere.png`

- **Where:** /about/who-we-are/ — Mission, Purpose, Vision, Values, Support
- **Copy beside it:** These cards were removed on purpose (the page code notes the old Vision was copied from another company). There is nothing to put these images on.
- **Generate:** 4:3, pale background · **Crop:** No slot exists
- **Status:** Generate now — no place on the page yet; kept on file for when the section returns

```
A brushed steel ring standing upright with one frosted glass sphere resting at its lowest point. Mood: a single reason at the centre. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**33 · Glass lens with light (Vision)** — save as `33-glass-lens-with-light.png`

- **Where:** /about/who-we-are/ — Mission, Purpose, Vision, Values, Support
- **Copy beside it:** These cards were removed on purpose (the page code notes the old Vision was copied from another company). There is nothing to put these images on.
- **Generate:** 4:3, pale background · **Crop:** No slot exists
- **Status:** Generate now — no place on the page yet; kept on file for when the section returns

```
A round frosted glass lens on a steel stand with a soft beam of light passing through it and landing on the ground. Mood: looking ahead. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**34 · Three cubes on a beam (Values)** — save as `34-three-cubes-on-a-beam.png`

- **Where:** /about/who-we-are/ — Mission, Purpose, Vision, Values, Support
- **Copy beside it:** These cards were removed on purpose (the page code notes the old Vision was copied from another company). There is nothing to put these images on.
- **Generate:** 4:3, pale background · **Crop:** No slot exists
- **Status:** Generate now — no place on the page yet; kept on file for when the section returns

```
Three cubes — navy, steel and frosted glass — sitting level on a long slim steel beam. Mood: principles held in balance. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**35 · Slab on two supports (Support)** — save as `35-slab-on-two-supports.png`

- **Where:** /about/who-we-are/ — Mission, Purpose, Vision, Values, Support
- **Copy beside it:** These cards were removed on purpose (the page code notes the old Vision was copied from another company). There is nothing to put these images on.
- **Generate:** 4:3, pale background · **Crop:** No slot exists
- **Status:** Generate now — no place on the page yet; kept on file for when the section returns

```
A long deep navy slab resting on two brushed steel supports. Mood: dependable support. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

### 36–40 · Pricing, Markets, Contact, 404

**36 · Balance beam with cubes** — save as `36-balance-beam-with-cubes.png`

- **Where:** /services/how-we-price/ hero
- **Copy beside it:** “Two commercial models, and who carries which risk in each.”
- **Generate:** 4:3, pale background · **Crop:** 4:3 hero — slot to be added
- **Status:** Slot must be added to the page first

```
A precision brushed steel balance beam with navy cubes on one pan and frosted glass cubes on the other, perfectly level. Mood: risk shared fairly and stated openly. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**37 · Segmented dial** — save as `37-segmented-dial.png`

- **Where:** /services/how-we-price/ “Fixed scope, or managed service”
- **Copy beside it:** Two models: “Fixed scope, fixed price” and “Managed service, monthly fee”.
- **Generate:** 4:3, pale background · **Crop:** Beside the two pricing cards — slot to be added
- **Status:** Slot must be added to the page first

```
A flat round dial divided into two segments, one deep navy and one frosted glass, with a slim steel pointer resting exactly on the line between them. No numbers. Mood: two clear choices. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**38 · Dotted globe with lit points** — save as `38-dotted-globe-with-lit-points.png`

- **Where:** /about/markets/ hero
- **Copy beside it:** “Registered, staffed and delivering” — every city listed has people in it.
- **Generate:** 4:3, pale background · **Crop:** 4:3 hero — slot to be added
- **Status:** Slot must be added to the page first

```
A globe made of small deep navy dots with only a handful of points lit in light-sky-blue; the rest of the dots stay dim. No continents drawn in detail, no labels. Mood: a real, specific footprint. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**39 · Map pins on a dotted plane** — save as `39-map-pins-on-a-dotted-plane.png`

- **Where:** /contact/ hero
- **Copy beside it:** “Let's talk about your transformation” — start, or reach the nearest office.
- **Generate:** 4:3, pale background · **Crop:** Contact hero 4:3 (on phones 3:2 — keep pins central)
- **Status:** Ready — slot exists

```
A flat plane of fine navy dots with a few brushed steel and navy map pins standing on it, casting soft long shadows. No map labels. Mood: reachable, close by. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**40 · Row of cubes, one lifted** — save as `40-row-of-cubes-one-lifted.png`

- **Where:** 404 page and /thank-you/
- **Copy beside it:** 404: “This page has moved on.” · Thank you: “Your request has been accepted.”
- **Generate:** 16:9, navy background · **Crop:** Wide band on navy — slot to be added
- **Status:** Slot must be added to the page first

```
A row of identical steel and frosted glass cubes, with one cube lifted out of line and floating just above its empty gap. Mood: one thing out of place, easily put back. Set on a seamless deep navy background (#121E3B), with generous empty margin on every side. Premium 3D illustration in a clean product-render style. Materials: brushed steel-blue (#3F75A3) metal, frosted light-sky-blue (#A3CBE6) glass and soft white ceramic, with one thin muted sand (#CDC8A5) accent; a subtle cool rim light separates the object from the dark ground. Soft diffused light from the upper left, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

### 41–42 · Careers

**41 · Doorway of frosted slabs** — save as `41-doorway-of-frosted-slabs.png`

- **Where:** /careers/current-openings/ hero
- **Copy beside it:** “Build a career with endless opportunities.”
- **Generate:** 4:3, pale background · **Crop:** 4:3 hero (600×450)
- **Status:** Ready — slot exists

```
An open doorway formed by two tall frosted glass slabs and a brushed steel lintel, with soft light coming through onto the ground in front. Mood: an open invitation in. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**42 · Stack of plates, one sliding out** — save as `42-stack-of-plates-one-sliding-out.png`

- **Where:** /careers/ “Open roles.”
- **Copy beside it:** “Open roles.” — vacancies are listed on LinkedIn for now.
- **Generate:** 4:3, pale background · **Crop:** Beside the “Open roles” card — slot to be added
- **Status:** Slot must be added to the page first

```
A neat stack of thin navy and frosted glass plates with one plate sliding out toward the viewer. Mood: a role ready to be taken. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

### 43–46 · Insight covers

**43 · SAP cover** — save as `43-sap-cover.png`

- **Where:** /insights/ — “What GROW with SAP commits to…”, “What RISE actually changes…” · homepage News
- **Copy beside it:** Articles about GROW and RISE with SAP.
- **Generate:** 16:9, pale background · **Crop:** Insight card 16:10 (399×249) and homepage news 16:9
- **Status:** Ready — slot exists

```
A deep navy core block with smaller steel and frosted glass modules docked neatly around it, viewed from slightly further back to leave space around it. No SAP logo or lettering. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**44 · People and payroll cover** — save as `44-people-and-payroll-cover.png`

- **Where:** /insights/ — SuccessFactors sequencing, Simplify Talent, Simplify Hiring
- **Copy beside it:** Articles about SuccessFactors, talent and hiring.
- **Generate:** 16:9, pale background · **Crop:** Insight card 16:10 and homepage news 16:9
- **Status:** Ready — slot exists

```
A row of blank ID badges standing upright beside a brushed steel calendar disc with one date tile raised. No writing anywhere. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**45 · Data and AI cover** — save as `45-data-and-ai-cover.png`

- **Where:** /insights/ — “SuccessFactors AI: what is generally available…”
- **Copy beside it:** An article separating available AI from roadmap AI.
- **Generate:** 16:9, pale background · **Crop:** Insight card 16:10 and homepage news 16:9
- **Status:** Ready — slot exists

```
Fine streams of small beads flowing into a frosted glass sphere with a solid navy core, a few beads already resting inside. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**46 · Delivery and run cover** — save as `46-delivery-and-run-cover.png`

- **Where:** /insights/ — no article in this category yet
- **Copy beside it:** No current article fits this cover.
- **Generate:** 16:9, pale background · **Crop:** Insight card 16:10
- **Status:** Generate now — kept on file until an article in this category is published

```
A brushed steel gear assembly enclosed in a frosted glass case, set on a long straight steel track. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

### 47–51 · Case-study covers

**47 · Energy cover** — save as `47-energy-cover.png`

- **Where:** /case-studies/ cards — 4 power utility case studies
- **Copy beside it:** Anonymised client case studies, grouped by sector.
- **Generate:** 16:9, pale background · **Crop:** Case-study card cover — slot to be added (cards are text-only today)
- **Status:** Slot must be added to the page first

```
A row of miniature steel transmission pylons linked by taut steel wires across a flat navy plane, with a small substation block at one end. Camera looks straight down from above (flat-lay), objects arranged in a wide horizontal composition. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**48 · Metals cover** — save as `48-metals-cover.png`

- **Where:** /case-studies/ cards — 4 metals and heavy engineering case studies
- **Copy beside it:** Anonymised client case studies, grouped by sector.
- **Generate:** 16:9, pale background · **Crop:** Case-study card cover — slot to be added (cards are text-only today)
- **Status:** Slot must be added to the page first

```
Stacked brushed steel ingots and slabs beside a small steel ladle on a flat navy plate. Camera looks straight down from above (flat-lay), objects arranged in a wide horizontal composition. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**49 · Government cover** — save as `49-government-cover.png`

- **Where:** /case-studies/ cards — Railway and state mining undertaking case studies
- **Copy beside it:** Anonymised client case studies, grouped by sector.
- **Generate:** 16:9, pale background · **Crop:** Case-study card cover — slot to be added (cards are text-only today)
- **Status:** Slot must be added to the page first

```
A short row of soft white classical columns supporting a frosted glass slab, on a flat navy plane. Camera looks straight down from above (flat-lay), objects arranged in a wide horizontal composition. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**50 · Consumer goods cover** — save as `50-consumer-goods-cover.png`

- **Where:** /case-studies/ cards — 3 food, beverage and wellness case studies
- **Copy beside it:** Anonymised client case studies, grouped by sector.
- **Generate:** 16:9, pale background · **Crop:** Case-study card cover — slot to be added (cards are text-only today)
- **Status:** Slot must be added to the page first

```
Plain unlabelled navy boxes and light-sky-blue bottles arranged in neat rows on a short conveyor. Camera looks straight down from above (flat-lay), objects arranged in a wide horizontal composition. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**51 · Technology cover** — save as `51-technology-cover.png`

- **Where:** /case-studies/ cards — 4 IT, EdTech and ICT case studies
- **Copy beside it:** Anonymised client case studies, grouped by sector.
- **Generate:** 16:9, pale background · **Crop:** Case-study card cover — slot to be added (cards are text-only today)
- **Status:** Slot must be added to the page first

```
A compact navy server rack, an open laptop with a blank screen and a small frosted glass cloud form, arranged in a row. Camera looks straight down from above (flat-lay), objects arranged in a wide horizontal composition. Set on a seamless pale off-white background (#F7F8FA), with generous empty margin on every side so the image can be cropped. Premium 3D illustration in a clean product-render style. Materials: matte deep navy (#121E3B) ceramic, brushed steel-blue (#3F75A3) metal and frosted light-sky-blue (#A3CBE6) glass, with at most one thin muted sand (#CDC8A5) accent. Soft diffused studio light from the upper left, soft contact shadow, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

---

## 7. The 5 homepage hero videos

**Where they would play:** behind the homepage headline, full screen, on the navy hero. Today that
spot shows a drawn figure at 7% opacity, and there is no video player there: AI video (42 MB) was
removed on 18 November. Adding video back means a small player and a decision on how visible it is.
The review advised shipping the stills first and deciding on video a month later. **V1 is the one
marked Required.**

V2–V4 are also listed for the Enterprise Platforms, Digital Data & AI and Advisory hub heroes. Those
heroes sit on the pale page and have no video support, so a navy loop would not match there. I
recommend the homepage only.

**How to make each one (two steps):**

1. **Keyframe still** — Firefly Text to Image, **16:9**, using the keyframe prompt below. Approve it.
2. **Video** — Firefly Generate Video → **Image to video**. Upload the keyframe as the **first frame
   and the same image as the last frame** (this makes a seamless loop). 16:9, 1080p, 5 seconds.
   Paste the motion prompt. Save as `V1-converged-enterprise-loop.mp4` and so on.

### V1 · Converged enterprise loop (Required)

- **Where:** Homepage hero, all slides
- **Save as:** `V1-converged-enterprise-loop.mp4` (keyframe `V1-keyframe.png`)

**Step 1 — keyframe prompt (Text to Image, 16:9):**

```
A composition on the right side of the frame: a row of brushed steel cubes on a slim rail, a ring of frosted glass slabs and a small lattice of light-sky-blue glass spheres, all arranged around one central cube with a polished steel core. Place everything in the right half of the frame and keep the left half empty and dark. Set on a seamless deep navy background (#121E3B), with generous empty margin on every side. Premium 3D illustration in a clean product-render style. Materials: brushed steel-blue (#3F75A3) metal, frosted light-sky-blue (#A3CBE6) glass and soft white ceramic, with one thin muted sand (#CDC8A5) accent; a subtle cool rim light separates the object from the dark ground. Soft diffused light from the upper left, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**Step 2 — motion prompt (Image to video, first frame = last frame = keyframe):**

```
The cubes glide slowly along the rail, the ring of glass slabs turns a few degrees, and the spheres drift gently toward the central cube, then everything eases back to its starting position. A very slow camera orbit to the left. Deep navy background (#121E3B) throughout. Keep the left half of the frame dark and empty for white headline text; all motion stays in the right half. Smooth, slow, calm motion only. Seamless loop: the last frame matches the first frame. Same materials, colours and lighting as the source image. No new objects appear, no camera shake, no flicker, no text, no logos, no people.
```

### V2 · SAP core loop (Optional)

- **Where:** Homepage hero, SAP slide
- **Save as:** `V2-sap-core-loop.mp4` (keyframe `V2-keyframe.png`)

**Step 1 — keyframe prompt (Text to Image, 16:9):**

```
A solid cube in soft white ceramic and brushed steel with one corner cut away to reveal a glowing light-sky-blue core, with smaller steel modules docked on its faces, placed in the right third of the frame. Place everything in the right half of the frame and keep the left half empty and dark. Set on a seamless deep navy background (#121E3B), with generous empty margin on every side. Premium 3D illustration in a clean product-render style. Materials: brushed steel-blue (#3F75A3) metal, frosted light-sky-blue (#A3CBE6) glass and soft white ceramic, with one thin muted sand (#CDC8A5) accent; a subtle cool rim light separates the object from the dark ground. Soft diffused light from the upper left, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**Step 2 — motion prompt (Image to video, first frame = last frame = keyframe):**

```
The docked modules slide a few centimetres out from the cube in unison and slide back, while a soft band of light sweeps once across the cut-away core. The camera stays still. Deep navy background (#121E3B) throughout. Keep the left half of the frame dark and empty for white headline text; all motion stays in the right half. Smooth, slow, calm motion only. Seamless loop: the last frame matches the first frame. Same materials, colours and lighting as the source image. No new objects appear, no camera shake, no flicker, no text, no logos, no people.
```

### V3 · Applications build loop (Optional)

- **Where:** Homepage hero, Applications slide
- **Save as:** `V3-applications-build-loop.mp4` (keyframe `V3-keyframe.png`)

**Step 1 — keyframe prompt (Text to Image, 16:9):**

```
A small brushed steel robotic arm beside a short tower of rounded light-sky-blue and white blocks with simple bracket-shaped grooves, placed in the right third of the frame. Place everything in the right half of the frame and keep the left half empty and dark. Set on a seamless deep navy background (#121E3B), with generous empty margin on every side. Premium 3D illustration in a clean product-render style. Materials: brushed steel-blue (#3F75A3) metal, frosted light-sky-blue (#A3CBE6) glass and soft white ceramic, with one thin muted sand (#CDC8A5) accent; a subtle cool rim light separates the object from the dark ground. Soft diffused light from the upper left, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**Step 2 — motion prompt (Image to video, first frame = last frame = keyframe):**

```
The arm picks up one block, places it on top of the tower with a soft precise stop, then lifts it back to where it started by the end of the clip. A very slow push-in. Deep navy background (#121E3B) throughout. Keep the left half of the frame dark and empty for white headline text; all motion stays in the right half. Smooth, slow, calm motion only. Seamless loop: the last frame matches the first frame. Same materials, colours and lighting as the source image. No new objects appear, no camera shake, no flicker, no text, no logos, no people.
```

### V4 · Platforms hub loop (Optional)

- **Where:** Homepage hero, Platforms slide
- **Save as:** `V4-platforms-hub-loop.mp4` (keyframe `V4-keyframe.png`)

**Step 1 — keyframe prompt (Text to Image, 16:9):**

```
A row of identical brushed steel and frosted glass cubes on a long slim rail running from the centre of the frame out to the right edge. Place everything in the right half of the frame and keep the left half empty and dark. Set on a seamless deep navy background (#121E3B), with generous empty margin on every side. Premium 3D illustration in a clean product-render style. Materials: brushed steel-blue (#3F75A3) metal, frosted light-sky-blue (#A3CBE6) glass and soft white ceramic, with one thin muted sand (#CDC8A5) accent; a subtle cool rim light separates the object from the dark ground. Soft diffused light from the upper left, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**Step 2 — motion prompt (Image to video, first frame = last frame = keyframe):**

```
The cubes travel slowly along the rail in single file at an even pace, the last cube leaving the frame as a new one enters, so the row always looks the same. The camera stays still. Deep navy background (#121E3B) throughout. Keep the left half of the frame dark and empty for white headline text; all motion stays in the right half. Smooth, slow, calm motion only. Seamless loop: the last frame matches the first frame. Same materials, colours and lighting as the source image. No new objects appear, no camera shake, no flicker, no text, no logos, no people.
```

### V5 · Data and AI prism loop (Optional)

- **Where:** Homepage hero, Data and AI slide
- **Save as:** `V5-data-and-ai-prism-loop.mp4` (keyframe `V5-keyframe.png`)

**Step 1 — keyframe prompt (Text to Image, 16:9):**

```
A triangular frosted glass prism in the right half of the frame, with a loose stream of small mixed glass and steel spheres to its left and a neat line of identical light-sky-blue spheres leaving it to the right. Place everything in the right half of the frame and keep the left half empty and dark. Set on a seamless deep navy background (#121E3B), with generous empty margin on every side. Premium 3D illustration in a clean product-render style. Materials: brushed steel-blue (#3F75A3) metal, frosted light-sky-blue (#A3CBE6) glass and soft white ceramic, with one thin muted sand (#CDC8A5) accent; a subtle cool rim light separates the object from the dark ground. Soft diffused light from the upper left, three-quarter view from slightly above, precise geometry, calm and engineered. No people, no text, no letters or numbers, no logos, no readable screens.
```

**Step 2 — motion prompt (Image to video, first frame = last frame = keyframe):**

```
The mixed spheres drift into the prism and come out the other side as an evenly spaced line of identical spheres, in a continuous gentle flow. A very slow camera drift to the right. Deep navy background (#121E3B) throughout. Keep the left half of the frame dark and empty for white headline text; all motion stays in the right half. Smooth, slow, calm motion only. Seamless loop: the last frame matches the first frame. Same materials, colours and lighting as the source image. No new objects appear, no camera shake, no flicker, no text, no logos, no people.
```

---

## 8. Before anything goes on the site

- **Provider:** `APPROVED_PROVIDERS` in `web/content/image-licences.ts` does not list Adobe Firefly.
  Rudra Shatapathy's approval can be recorded by adding it, with his name as approver.
- **Register line per file:** provider, the Firefly generation reference, the date, what it shows
  (e.g. “An abstract navy cube with a steel core on a pale background”), `aiGenerated: true`, and the
  approver's name. The build fails on any image without one.
- **Fitting (Claude):** convert each PNG to WebP at the measured sizes, add the missing picture boxes
  (items marked “slot must be added”), wire every image in, run the build and send screenshots from
  http://127.0.0.1:3117. Nothing goes to the live site until you say so.

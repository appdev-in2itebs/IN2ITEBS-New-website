# Hero images

The original artwork for the picture on the right of each page's hero. The folders mirror the
website's menus. The site never loads these PNGs directly: `npm run heroes` (run in `web/`) turns
them into small WebP files in `web/public/heroes/` and lists them in `web/content/hero-images.json`.

```
assets/hero-images/
├── alt-text.json      one line per picture: what it shows (screen readers and search engines read it)
├── pages/             top-level pages, by name           e.g. about.png, contact.png, sap-ariba.png
├── services/          Services menu, by page slug         e.g. agile-devops.png  -> /services/agile-devops/
├── industries/        Industries menu, by page slug       e.g. automobiles.png   -> /industries/automobiles/
├── partners/          Partners menu, by page slug         e.g. oracle.png        -> /partners/oracle/
├── about/             About menu pages                    who-we-are, our-leadership, accreditation,
│                                                          customer-stories, blogs-articles
├── careers/           Career menu pages                   our-culture, events-celebrations, current-openings
├── _pending/          artwork not on a page yet; the build ignores it. Move a file into a section
│                      folder (and add its alt text) to use it. Holds two Contact images for now.
└── _pack-notes/       the art packs' own READMEs, prompts and contact sheets, for reference
```

## Add or replace a picture

1. Save a PNG, 1536 x 1024, in the right folder. Name it after the page:
   - **services / industries / partners**: the slug in the page's URL. `/services/big-data/` is
     `services/big-data.png`. It then appears on that page with no code change.
   - **pages / about / careers**: any name. The page's code refers to it by that name (see below).
   - Use a transparent background (a cut-out), or a plain near-white studio background. Either
     works; the build tells them apart and blends the studio background into the page.
2. Add a line to `alt-text.json`:
   ```json
   "services/big-data": "Data streams flowing from many sources into large storage clusters",
   ```
3. Build and check:
   ```powershell
   cd D:\IN2ITEBS-Website\web
   npm run heroes
   npm run dev
   ```
   The build stops and lists the line to add if a picture has no alt text.
4. Commit both the original and the result: `git add assets web`.

To replace a picture, overwrite the PNG with the same name and run `npm run heroes` again.

## Using a picture on a page that does not pick one up by itself

On a page under `web/app/` (About, Contact, `/sap-enterprise-solutions/...`):

```tsx
import { HeroObject } from "@/components/sections/hero-media";
// in the <PageHero ...> or <V2Hero ...> block:
media={<HeroObject name="pages/about" />}
frame={false}   // PageHero only: no box around the picture
```

A Services page with no `services/<slug>.png` of its own can borrow another picture with
`heroObject: "pages/oracle"` in `web/content/legacy-services.ts`.

## Which page uses which picture

- `about/`: Who We Are? (/about/who-we-are/), Our Leadership, Accreditation (/accreditation-awards/),
  Customer Stories, and Blogs & Articles (/insights/).
- `careers/`: Our Culture, Events & Celebrations and Current Openings.
- `pages/services.png` is the /services/ overview. `pages/insights.png` is no longer used (Blogs &
  Articles uses `about/blogs-articles`).
- `pages/` is used by the page of the same name: `about` on /about/, `sap-ariba` on
  /sap-enterprise-solutions/ariba/, `what-we-do` on /what-we-do/, and so on. `homepage.png` is not
  used; the homepage keeps its video hero.
- `services/`, `industries/` and `partners/` are used by the page whose slug matches the file name.
- Services pages with no `services/` picture borrow one: SAP Enterprise Solutions, SAP Concur,
  ECC Prism, SAP SAC, SAP SuccessFactors, Oracle and Microsoft use the `pages/` picture of the same
  subject.

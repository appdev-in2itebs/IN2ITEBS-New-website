# Fixes for the site that is live now

**19 November 2026.** Four independent changes, each small enough to apply and deploy on its own,
**without waiting for the content-rebuild branch, a review, or anything else on the backlog.**

They are ordered by value. Nothing here depends on anything else here — do one, do all four, or
do them on separate days.

Every item below was **measured against the live site**, not inferred from the branch.

---

## First, a correction to an earlier claim of mine

I previously told the Managing Director that the live site says **"8 offices"** while the submitted
bids say four, and that the website therefore contradicts your own tenders.

**That was wrong, and the live site is right.** Checked directly: the footprint section reads
_"8 offices"_ and names Bangalore, Bhubaneswar, Hyderabad, Delhi NCR, Singapore, Dubai, Kenya and
South Africa. Eight offices is true. Four **delivery centres** is also true — they are the four in
India, and the site's own definition has always distinguished the two (_a delivery centre is
somewhere staffed that you can visit_; an office or an entity is not the same thing).

So there is nothing to fix here, and I am recording the error rather than quietly dropping it. It
is the same mistake this project exists to catch: a claim stated more strongly than the evidence
supported.

---

## 1 · Remove "10+ Years of experience"

**Where:** the homepage statistics band.
**Severity:** it is either stale or understating, and has been for years.

The figure has read "10+" for several years. Either the number has moved and nobody updated it, or
it was conservative to begin with. A figure that ages on its own does not belong in a block that
is reviewed twice a year — nobody is ever going to remember to move it, which is exactly what
happened.

**The change.** In whatever file defines the statistics array — on the current branch that is
`content/site.ts`, exported as `stats` — delete this entry:

```ts
{ value: "10+", label: "Years of experience" },
```

Nothing else changes. The band reflows to the remaining figures.

**If somebody wants a years figure back**, the honest one is derivable and does not age: the CIN
(`U72900KA2016PTC147788`) encodes incorporation in Karnataka in 2016. "Incorporated 2016" is a
fact that never needs updating. "10+ years" needs updating every year and never gets it.

---

## 2 · Remove or correct "14+ Industry verticals"

**Where:** the homepage statistics band.
**Severity:** it contradicts both of the places that define the number.

"14+" matches neither source of truth:

- The **master data standard** (Integrated Business Systems Plan v2.0, §16) defines **nine
  industry groups across thirty verticals**. Not fourteen.
- The **website** publishes **nine industry pages**.

So the figure agrees with nothing, and a buyer who counts the industry pages gets nine. Fourteen
is the kind of number a tender reviewer checks precisely because it is oddly specific.

**The change.** Replace:

```ts
{ value: "14+", label: "Industry verticals" },
```

with:

```ts
{ value: "9", label: "Industry groups we publish pages for" },
```

Nine is the number the master data standard and the site already agree on, and it is countable
from the navigation — which is the point.

---

## 3 · Take down the AI-generated hero footage

**Where:** the homepage hero.
**Severity:** the only live defect with a **contractual** dimension rather than a quality one.

Five AI-generated clips of stylised offices with the In2IT EBS logo rendered onto the walls, and
the extraction script records that the provider's watermark was removed before use. Still live —
confirmed 19 November, the page references `hero-frames/slide-1/poster.jpg`.

**Full instructions are in `docs/HOTFIX_HERO_FOOTAGE.md`** — one line in `brand-hero.tsx`,
replacing the footage layer with flat brand navy, leaving the carousel, copy, buttons and layout
untouched.

---

## 4 · Delete the stale `sitemap.xml` — the site currently has no working sitemap

**Where:** the deployed web root.
**Severity:** search engines are being handed a sitemap whose every entry is broken.

`https://in2itebs.com/sitemap.xml` returns a **Yoast sitemap index** — a leftover from the
WordPress era — listing fourteen child sitemaps:

```
post-sitemap.xml   page-sitemap.xml   product-sitemap.xml   portfolio-sitemap.xml
gva__template-sitemap.xml   tribe_events-sitemap.xml   post-archive-sitemap.xml
category-sitemap.xml   post_tag-sitemap.xml   product_cat-sitemap.xml
product_tag-sitemap.xml   category_portfolio-sitemap.xml   author-sitemap.xml
```

**Every one of those children returns an error.** They are WordPress, WooCommerce and Events
Calendar sitemaps for a CMS that no longer serves this domain. The site is a Next.js application —
confirmed by `/_next/image` in the page source and the absence of any `wp-content` path.

So the file is a fossil that was copied into the new application's `public/` folder during
migration, where it is served as a static file and **overrides the application's own generated
sitemap**. Net effect: Google is given a sitemap index it cannot follow, and the application's
real sitemap is unreachable.

This is almost certainly why case studies and newer pages have never appeared in search.

**The change.** Find and delete `sitemap.xml` from the deployed application's `public/` directory
(check also for any of the `*-sitemap.xml` children alongside it). If nginx serves it from the web
root directly rather than through the app, remove it there.

**Then verify** — `https://in2itebs.com/sitemap.xml` should return a flat list of the site's own
page URLs, not a list of other sitemap files. If it still returns the Yoast index, the file is
being served from somewhere else and the path needs tracking down.

**Afterwards:** resubmit the sitemap in Google Search Console. The old one has been failing
silently for however long it has been there.

---

## What is deliberately not on this list

**The chat widget.** Removing it is a decision taken on the branch, not a defect. It can wait for
the branch to land.

**`robots.txt` disallowing `/api/`.** On the branch this blocked the capability feed and was a
real defect. On the live build that endpoint does not exist, so the rule costs nothing there.

**Everything else in the audits.** The capability register, the restructure, the figure provenance
gates, the photography removal, the machine-readable layer — all of that is the branch's job, and
stacking it into hotfixes would be worse than waiting.

---

## Verifying any of these

Each change needs the ordinary build and a look at the page:

```bash
npm run check
SITE_ENV=production npm run build
npm start      # then open the homepage
```

For items 1 and 2, confirm the statistics band reads correctly and reflows. For item 3, confirm
the hero is flat navy and no request for `/hero-frames/` appears in the network tab. For item 4,
fetch `/sitemap.xml` and confirm it lists pages rather than other sitemaps.

**One caution on applying these.** The deployed build is older than any commit on the
content-rebuild branch — it carries labels ("Professionals", "Packaged accelerators") that appear
nowhere in that branch's history. So the file paths above are the branch's, and the deployed tree
may differ. **Search for the text, not the line number.** Each change is a find-and-replace on a
string that is unambiguous.

# The November 2026 rebuild — what changed, and what the team still has to do

This is the handover note for the website team. It covers the content and structure rebuild
carried out on 12 November 2026, merged with the Phase 0 audit remediation already on `main`
(commits 5a570d5, 3a47c80, 4180bda).

**Both pieces of work were fixing the same site from different ends.** The remediation closed the
false-claim and consent exposure; the rebuild closed the structure. Nothing from either side was
dropped silently, and where the two disagreed the disagreement is recorded in the code rather than
resolved quietly. Section 8 lists what needs a decision.

Nothing in the platform was rewritten. The application is a well-built Next.js 15 App Router site
with an admin CMS, a chatbot and voice; it did not need recoding. What it needed was the content
replaced and the structure corrected, and that is what this is.

**Verified in a clean container before handover:** clean install, `npm run format:check`,
`npm run lint`, `npm run typecheck`, 112 unit tests, a production build with
`SITE_ENV=production`, the repository's own `scripts/check-build.mjs`, and a crawl of all 51
sitemap URLs against the built server — every one returns 200.

---

## 1 · The architecture

Seven top-level items, flat service URLs, three pillars.

```
/                       Home
/services/              → three pillar hubs and fourteen service pages, all at /services/<slug>/
/industries/            → nine industry pages
/case-studies/          Client work
/insights/              Insights
/about/                 → who-we-are · our-leadership · credentials · partnerships · markets
/careers/               → our-culture · current-openings · events-celebrations
/contact/
```

Every service lives at `/services/<slug>/` — `/services/sap/`, not
`/sap-enterprise-solutions/`. A new platform, a new practice or a new country becomes one more
entry in a typed content file; it never becomes a new top-level item and never changes a URL that
already earns traffic.

### Routes deleted

`sap-enterprise-solutions`, `platform-services`, `advisory`, `digital-data-ai`, `ecc-prism`,
`salesforce`, `workday`, `oracle`, `microsoft`, `what-we-do`, `delivery-excellence`,
`why-in2it-ebs`, `partners`, `accreditation-awards`, `about/customer-stories`.

Each one is in `web/content/redirects.mjs` with a 301 to its successor. The map holds **217
redirects, no duplicates, no chains, and none pointing at a page that does not exist** — the test
suite enforces all four.

**49 of those are new and easy to miss.** The older entries catch legacy WordPress URLs. These
catch URLs the *rebuilt* app has already been serving — `/services/sap-enterprise-solutions/`,
`/industries/telecom/`, `/services/cyber-security-enterprise-risk/` and the rest. They are in the
deployed sitemap, so they have already been offered to Google. Two slugs survive the restructure
unchanged and are deliberately absent: `/services/ecc-prism/` and `/industries/manufacturing/`.

### Pages added

`/about/credentials/`, `/about/partnerships/`, `/about/markets/`.

---

## 2 · What was fixed, and why it mattered

**Ford Motor Company's vision statement was on the About page.** It had been carried over from the
legacy site and printed twice. It is gone, and nothing replaces it until approved copy exists. The
reason is in a comment in `app/about/who-we-are/page.tsx` so that nobody restores it.

**The canonical URL defect is fixed, by the remediation commits rather than by this branch.**
`lib/utils.ts` now sets `www.in2itebs.com` as the public `SITE_URL` and adds `INDEXING_ENABLED`,
and `check-build.mjs` verifies it. **What remains is at the edge, not in the code: www and non-www
are still indexed as separate sites. Pick one and 301 the other.**

**Google Tag Manager (GTM-PWV2BPZH) is wired in**, in `components/layout/google-tag-manager.tsx`
and `app/layout.tsx`. The container id reads from `NEXT_PUBLIC_GTM_ID` where it is set, so a
preview deployment can point at a different container or at none; set it to an empty string on a
development machine. The Content-Security-Policy in `next.config.mjs` was blocking `gtm.js`
outright — the page rendered fine and every signal was lost silently — so `googletagmanager.com`
and the GA4 beacon hosts are now allowed in `script-src`, `connect-src`, `img-src` and `frame-src`.

**Internal links that only worked because of a redirect are gone.** After the restructure, the
homepage hero, the About pages, the partner strips, the assistant's prompt, the analytics click
handler and one article body were all still pointing at deleted routes. They resolved, via a 301,
so nothing looked broken. Two new tests now fail the build if that happens again: *no page links to
a URL that only redirects*, and *the sitemap lists no URL that redirects*. **If one of them fails,
fix the link, not the test.**

**The sitemap was listing sixteen retired paths.** It now lists exactly the 69 live URLs.

---

## 3 · The facts the site now states

Held in one place, `web/content/site.ts`, and used everywhere:

| | |
|---|---|
| People | 500+ |
| SAP consultants | 380+, across eleven practices |
| Engineers | 170+, in development, data, cloud and quality |
| Global customers | 150+ |
| SAP clients | 50+ |
| Countries delivered in | 30+ |
| Delivery centres | 8 — Bengaluru, Delhi, Bhubaneswar, Hyderabad, Singapore, Dubai, Nairobi, Johannesburg |
| Legal entities | 5 — India, South Africa, Singapore, UAE, Kenya |
| Headquarters and registered office | Bengaluru, India |

**Removed because they could not be evidenced:** "RISE with SAP" in the credentials strip (it is a
product, not a status), a bare "CMMI" with no level, and an unverified ISO 9001. The strip is now
CMMI Level 3 · ISO 27001 · SAP Gold Partner · SAP PCE Partner.

A delivery centre is somewhere you can visit. An entity without a staffed office is listed as an
entity, not as a delivery centre. Mumbai, Chennai and the US entity came off the list for that
reason.

`/about/credentials/` names a gap on purpose: **In2IT EBS is not a RISE with SAP Validated
Partner.** Some Indian public-sector tenders use that designation as a pre-qualification. A
competitor can raise it either way, and it is better raised by us.

---

## 4 · Client work

Four case studies written from signed purchase orders were added: **Welspun Group, Odisha Mining
Corporation, Varun Beverages and NALCO**. They are written from the purchase order, never from
another case study — that is how five slides across three practice decks ended up carrying one
client's text under another client's name.

Three rules were applied, and they are repeated in a comment at the top of the block in
`web/content/case-studies.ts`:

1. Every figure is one a document states. Where the documents prove duration and breadth rather
   than business outcome, there is no outcome field. **Do not add percentages to strengthen these.**
2. Varun Beverages is described as its purchase-order register describes it — SuccessFactors, SAP
   HCM and statutory e-invoicing — not as "Ariba across 14 countries". Welspun is described as
   retention across thirteen entities, not as an Analytics Cloud account. Both deck claims are
   unevidenced and are open questions with the client teams.
3. **Consent gate — now enforced in code, not by convention.** `content/compliance.ts` holds
   `clientEvidenceApproved = false`, and while it is false the logo wall, the testimonials, every
   named case study, the client list in the assistant's prompt and the reference-book diagram all
   render nothing. The four new case studies are behind it like everything else, and the sitemap
   and the prerender list follow it. **Flipping that one flag publishes all of it, so flip it only
   when written consent covering the name, the figures and the logo is actually on file.**

**Manipal Hospitals is deliberately not published.** Its purchase order does not name the
SuccessFactors modules on its face, and the only copy available to fill the gap is generic sector
writing.

**The 2017 "Nalco SAP Migration PO" is a data centre hardware refresh awarded to In2IT
Technologies Pvt. Ltd. — a different legal entity.** It must never be cited as an In2IT EBS SAP
credential. The NALCO case study in the repository is the Plant Maintenance award, which is ours.

---

## 5 · Diagrams

Thirty-two hand-drawn SVGs in the brand palette are in `web/public/diagrams/`. They render through
`components/sections/diagram-band.tsx`, a full-width band with a white frame.

Wired in: eleven service pages (`diagram` on a `ServicePage`), the Welspun case study (`diagram` on
a `CaseStudy`), `/about/credentials/` and `/case-studies/`. The rest are planning diagrams from the
content documents and are not referenced by a page.

The reference-book diagram on `/case-studies/` names clients by sector, so it sits behind
`clientEvidenceApproved` with the logo wall and the testimonials. **A diagram is a publication like
any other** — worth remembering before adding the next one.

Two things to know before adding more:

- The drawings are 1760px wide and carry 12px type. Below roughly 720px the frame scrolls sideways
  rather than shrinking the drawing, because a diagram nobody can read is worse than no diagram.
- **`alt` is not decoration.** Each diagram makes a point that is made nowhere else on the page, so
  the alt text has to carry that point. "Three stages of an ECC assessment" is a caption; the alt
  text names the stages and the decision gate.

If a Tailwind class you have just used appears to have no effect, delete `.next` and rebuild. The
build cache will serve a stale stylesheet that does not contain a utility used for the first time.

---

## 6 · Still outstanding — these need Rudra or a named owner

| # | Item | What it blocks |
|---|---|---|
| 1 | **Written client consent for the named clients** — name, figures and logo are three separate permissions | Every named case study and the reference book |
| 2 | **Page owners.** Not one page on this site has a named owner | Nothing technical; everything editorial |
| 3 | **Manipal module scope** — the annexure or signed workbook | The Manipal case study |
| 4 | **Varun Beverages: is there Ariba work** outside the purchase-order register? | Correcting or retiring the deck claim |
| 5 | **Welspun: is there Analytics Cloud work** outside the register? | Same |
| 6 | **The fourteenth Welspun entity.** The register header says fourteen; thirteen are listed | One figure on a diagram |
| 7 | **CMMI and ISO certificate references and validity dates** | Publishing the certificate references on /about/credentials/ |
| 8 | **Certificates for five awards** — the APJ Partner Excellence award, Mid-Market Partner of the Year, HXM Champions, HXM Partner of the Year and DivHERsity appear in the practice decks with no certificate on file, so they are named in a comment in `app/about/credentials/page.tsx` and not published | Five award lines |
| 8a | **Delivery centres: eight or four.** The MD confirmed eight; the submitted Ghana MoF IFMIS proposal states four. The website and a bid in a client's hands cannot disagree | The headline figure, and any tender that cites it |
| 8b | **"SAP PCE Partner"** — reinstated on the MD's confirmation after commit 5a570d5 removed it as an unstable string. Needs SAP's own wording | The footer credential strip |
| 9 | **QPPS status** | Nothing on the site claims it; it was removed |
| 10 | **GROW Fast duration and price** — the page says fixed scope, fixed duration, fixed price without stating them | A stronger page |
| 11 | **`NEXT_PUBLIC_SITE_URL` in production**, and the www / non-www decision | Correct canonicals; see §2 |

---

## 7 · Running it

```bash
cd web
npm ci
npm run check                 # format, lint, typecheck, 112 tests
SITE_ENV=production NEXT_PUBLIC_SITE_URL=https://www.in2itebs.com npm run build
npx next start -p 3000
```

The build refuses to run without `SITE_ENV=production` or `SITE_ENV=preview`. That is deliberate —
it is what stops a preview build shipping with production canonicals.

Content lives in `web/content/*.ts` as the base layer. Edits made in `/admin` are stored in
Supabase and laid **over** that base at render time, so a file in `web/content/` is the default,
not the last word. Anything edited in the admin wins until it is deleted there.

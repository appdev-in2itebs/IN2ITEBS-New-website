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
| Delivery centres | 4 — Bengaluru, Hyderabad, Delhi NCR, Bhubaneswar. All in India |
| Offices without a delivery centre | Singapore, Dubai, Nairobi, Johannesburg |
| Legal entities | 5 — India, South Africa, Singapore, UAE, Kenya |
| Headquarters and registered office | Bengaluru, India |

**Removed because they could not be evidenced:** "RISE with SAP" in the credentials strip (it is a
product, not a status), a bare "CMMI" with no level, an unverified ISO 9001, and "SAP PCE Partner"
— withdrawn on the Managing Director's instruction, 12 November 2026, because the designation
could not be produced in SAP's own wording with a date. The strip is now
**CMMI Level 3 · ISO 27001 · SAP Gold Partner**, and /about/credentials/ says on the page that we
do not claim a PCE partnership.

A delivery centre is somewhere staffed that you can visit. **Four, not eight** — settled on
12 November 2026 to match the submitted Ghana MoF IFMIS proposal, so the website and a bid in a
client's hands carry the same number. Singapore, Dubai, Nairobi and Johannesburg are offices and
legal entities; they are listed as entities and must never be counted as delivery centres. Mumbai,
Chennai and the US entity came off the list entirely.

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

## 5 · What was carried over from the running app

The instruction was to keep the better parts of the Next.js app as it runs today, and the design
system, motion, video heroes, chatbot, voice assistant and admin CMS are all untouched. The
restructure deleted fifteen route folders, which left some good work orphaned. Four pieces were
rescued rather than retired:

- **The RISE vs GROW chooser** (`components/interactive/rise-grow-chooser.tsx`, 455 lines) now sits
  on `/services/rise-s4hana/`. It is the only thing on this site that answers a buyer's question
  before they talk to us, and it was about to be deleted along with the page it happened to live
  on.
- **The SAP delivery toolchain** (Signavio, LeanIX, Cloud ALM, Tricentis, Activate, WalkMe) now
  sits on `/services/sap/`.
- **The award certificate photographs** now sit on `/about/credentials/`. The page lists the award
  names and then shows the certificates, because a name is a claim and a certificate is evidence.
- **The partner logo strip** now sits on `/about/partnerships/`.

Both of the first two attach through a `interactive` key on a `ServicePage`, so content stays data
and markup stays in components. Adding another means one key and one case in `ServicePageV2`.

Retired on purpose: `three-reasons`, `pillar-cards`, `three-tiers-hero`, `platform-practice-links`,
`extended-practice-page` and `comparison-table`. All six were layout blocks tied to the old
information architecture, and the V2 section components do the same work.

## 6 · Four new things, and the research behind each

Built after reading how the comparable firms do it. In each case the design is a reaction to a
specific weakness in theirs, recorded in a comment at the top of the file so it is not undone by
somebody who thinks they are tidying up.

**The Application Estate Review diagnostic** — `/services/application-estate-review/`. Eight
questions, scored, with a tailored scope list at the end. Persistent's Application Portfolio
Rationalization page is the nearest competitor equivalent and it has no assessment on it at all:
a problem statement, a framework name, a claim of 20–30% savings, and a "Request a Demo" button.
So ours: no savings percentage (nobody can know it before looking), no "demo", and the output
scores *the visitor's own estate visibility* rather than our capability. A buyer can finish it,
close the tab, and be better off.

**The SAP maintenance checker** — `/services/ecc-prism/`. Five questions, and the database answer
decides most of it. **The research corrected a date we had wrong: the transition option runs to
2033, not 2035.** The facts are SAP's own, from "Planning Beyond 2030", SAP News Center,
7 October 2026: mainstream to 31 Dec 2027, extended to 31 Dec 2030, customer-specific from 2031,
and a transition option 2031–2033 requiring SAP ERP private edition on HANA before 31 Dec 2030,
with no Java-dependent capabilities.

Three things are deliberately absent and must not be added without a source printed on the page:
the uplift percentage for extended maintenance (SAP says "an additional fee" and publishes no
number), a minimum database size for the transition option (SAP has published none), and any
migration-progress percentage (ASUG and DSAG disagree by more than twenty points). **Re-verify
every date before any campaign** — the 2033 option was announced weeks before this was built.

The checker also surfaces the fact that actually matters to an Indian buyer: customer-specific
maintenance carries **no legal-change updates**. GST changes, statutory payroll and e-invoicing
do not stop arriving because your maintenance phase changed.

**Where we stand** — `/about/where-we-stand/`. Every capability with one of four statuses, gaps
printed next to strengths. No competitor publishes anything like it, which is the opportunity and
the warning. **It needs a named monthly owner in Marketing or it should not go live** — the rules
are at the top of `content/capability-status.ts`, and the owner field currently reads INPUT
REQUIRED. A stale status table is worse than none.

**How we price** — `/services/how-we-price/`. Two models, fixed scope and managed service, with
the risk allocation written in both directions, a defined change-control trigger and what the
client supplies. The nearest credible example is ScienceSoft's pricing page, and reading it is
what shaped this one: it lists models without ever saying who carries the risk, offers a "cap"
without defining it, has a "mixed model — depending on the situation", never says what the client
supplies, and puts every number behind a form. Outcome-linked and gain-share stay off the page on
the Managing Director's decision; no rate card, ever.

## 7 · Diagrams

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

## 8 · Still outstanding — these need Rudra or a named owner

| # | Item | What it blocks |
|---|---|---|
| 1 | **Written client consent for the named clients** — name, figures and logo are three separate permissions | Every named case study and the reference book |
| 2 | **Page owners.** Not one page on this site has a named owner | Nothing technical; everything editorial |
| 3 | **Manipal module scope** — the annexure or signed workbook | The Manipal case study |
| 4 | **Varun Beverages: is there Ariba work** outside the purchase-order register? | Correcting or retiring the deck claim |
| 5 | **Welspun: is there Analytics Cloud work** outside the register? | Same |
| 6 | **The fourteenth Welspun entity.** The register header says fourteen; thirteen are listed | One figure on a diagram |
| 6a | **A named monthly owner for /about/where-we-stand/.** Without one, take the page down rather than let it drift | The capability table |
| 6b | **The fixed price bracket for the Application Estate Review.** The duration is published as three to four weeks; the price is stated as fixed and agreed up front, with no number | The diagnostic's closing block |
| 7 | **CMMI and ISO certificate references and validity dates** | Publishing the certificate references on /about/credentials/ |
| 8 | **Certificates for five awards** — the APJ Partner Excellence award, Mid-Market Partner of the Year, HXM Champions, HXM Partner of the Year and DivHERsity appear in the practice decks with no certificate on file, so they are named in a comment in `app/about/credentials/page.tsx` and not published | Five award lines |
| ~~8a~~ | ~~Delivery centres: eight or four~~ — **settled 12 Nov 2026: four** | Closed |
| ~~8b~~ | ~~"SAP PCE Partner"~~ — **settled 12 Nov 2026: removed** | Closed |
| 9 | **QPPS status** | Nothing on the site claims it; it was removed |
| 10 | **GROW Fast duration and price** — the page says fixed scope, fixed duration, fixed price without stating them | A stronger page |
| 11 | **`NEXT_PUBLIC_SITE_URL` in production**, and the www / non-www decision | Correct canonicals; see §2 |

---

## 9 · Running it

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

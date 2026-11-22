# Deploying to Azure — the Node path

**19 November 2026.** Written after the IT team's decision to stay on Azure rather than move to
Cloudflare Workers. `docs/DEPLOY_RUNBOOK.md` describes the Cloudflare route and does not apply;
use this instead. Nothing in the branch has to change for Azure.

---

## 1 · Why this is a small decision, and the one way it is not

**The application code is platform-neutral.** Nothing under `app/`, `components/`, `lib/` or
`content/` imports `@opennextjs/cloudflare`, a Worker binding, or anything else Cloudflare-specific
— checked, not assumed. The Cloudflare coupling lives entirely in two files that only the
`opennextjs-cloudflare` CLI reads:

- `open-next.config.ts`
- `wrangler.jsonc`

Leave both in place. They cost nothing on Azure and they are the record of how to move later.

`npm run build` and `npm start` are plain Next.js. That is the path every check in this project
has been run on — 147 tests, 72 routes all returning 200, the production build clean — so Azure is
running the configuration that was actually tested, not a variant of it.

**The one thing that genuinely changes** is the four services Cloudflare was providing for free.
Section 3 lists them and what each becomes here.

---

## 2 · Environment

### Required

| Variable              | Value        | Why                                                                                                                                                                                                                                                                          |
| --------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SITE_ENV`            | `production` | Read at build time for `robots.txt` and `X-Robots-Tag`. **The build refuses to start without it.** Set it in the build step **and** in the App Service configuration — `/api/health` reports it at runtime and an Azure VM was once left on `preview` after DNS had cut over |
| `TRUST_PROXY_HEADERS` | `1`          | **See §3.4. Without it every visitor shares one rate-limit bucket.** This was optional on Cloudflare and is not optional here                                                                                                                                                |
| `NODE_ENV`            | `production` | Set by the platform, but confirm it                                                                                                                                                                                                                                          |

Plus the Supabase and lead-delivery variables already in use — `SUPABASE_URL`,
`SUPABASE_PUBLIC_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `ALLOWED_ORIGINS`,
`LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_TOKEN`. Secrets belong in App Service configuration or Key
Vault, never in the repository.

### Confirm after every deploy

```bash
curl -s https://www.in2itebs.com/api/health/ | jq
```

Four fields decide whether the deploy is correct:

```json
{
  "siteEnv": "production",
  "indexingEnabled": true,
  "perVisitorLimitsActive": true,
  "leadDeliveryConfigured": true
}
```

`siteEnv: "preview"` means the site is telling search engines not to index it. `false` on
`perVisitorLimitsActive` means §3.4 has not been done.

---

## 3 · What Cloudflare was doing, and what it becomes here

### 3.1 · Instant content editing — the one worth a decision

On Cloudflare the page cache lived in an R2 bucket with two Durable Objects marking pages stale
and re-rendering them in the background. An editor saved in `/admin` and the change was live in
seconds, across every edge location.

On Azure, Next's incremental cache is **`.next/cache` on the instance's own disk**. On a single
instance this works exactly as intended: `revalidatePath()` marks the page stale and the next
visitor gets the new version.

**On more than one instance it does not.** An editor's save revalidates whichever instance served
the save; the others keep serving the old page until something else evicts it. Visitors see the
old page or the new one depending on which instance they land on, which is the most confusing
possible failure for a content editor to report.

Two honest options:

1. **Run one instance.** Entirely defensible at this site's traffic, and the simplest correct
   answer. Scale up rather than out; use a deployment slot for zero-downtime releases.
2. **Give Next a shared cache handler.** `cacheHandler` in `next.config.mjs`, pointing at Azure
   Cache for Redis. Half a day's work plus the Redis cost, and only worth it if you are scaling
   out for a reason.

Decide this before go-live rather than after the first "my edit did not appear" ticket.

### 3.2 · Image optimisation — nothing to do

Cloudflare's Images binding handled `/_next/image`. On Azure, Next's own optimiser handles it
using `sharp`, which ships as a direct dependency of `next@15.5.29` — verified by running a
production build and requesting an optimised image, which returned AVIF at the requested width.

The only consequence is that resizing now costs CPU on the app server rather than at the edge. At
this volume that is not a real cost, and almost every image on the site is an SVG or a small mark
that is not resized at all.

### 3.3 · Rollback

`wrangler rollback` is gone. Use **App Service deployment slots**: deploy to `staging`, verify
against the checklist in §5, then swap. A bad swap is undone by swapping back, which is the Azure
equivalent and takes about as long.

Do not rely on redeploying from `main` as a rollback. That rebuilds, which takes minutes, and
assumes the build is still reproducible at that moment.

### 3.4 · Rate limiting — the item that must not be skipped

**This is the one defect the platform change introduces, and it is silent.**

`lib/api-guard.ts` resolves a visitor's address from `cf-connecting-ip` first. Behind Azure that
header never arrives, so it falls back to `x-forwarded-for` — **but only when
`TRUST_PROXY_HEADERS=1`**. Otherwise it returns null, and every caller keys its bucket as
`` `apply:${hashIp(ip) ?? "anon"}` ``. With no address, that key is the constant `"anon"`, and the
whole internet shares one bucket.

Measured against a production build, seven requests from seven different addresses:

|                             | Result                                                                        |
| --------------------------- | ----------------------------------------------------------------------------- |
| `TRUST_PROXY_HEADERS` unset | **The sixth visitor is refused with 429**, having made one request            |
| `TRUST_PROXY_HEADERS=1`     | All seven pass. One address making seven attempts is refused on its own sixth |

So the careers application form and the voice endpoint stop working for everybody after five
requests a minute, site-wide. The contact form is affected differently: its per-address tier is
skipped entirely, leaving only the process-wide limit.

**Set `TRUST_PROXY_HEADERS=1`, and only once a trusted proxy in front of the app overwrites
`x-forwarded-for`.** If an untrusted client can set that header, the limit can be defeated by
spoofing it — which is why the default is off rather than on.

The app now warns once in the log when it sees `x-forwarded-for` without the variable set, and
`/api/health` reports `perVisitorLimitsActive`. Check the field; do not assume.

---

## 4 · The deploy

```bash
# 1 · Exactly what the lockfile says
npm ci

# 2 · The gates: prettier, eslint, tsc, 147 tests
npm run check

# 3 · Build. SITE_ENV is read here and baked in.
SITE_ENV=production npm run build

# 4 · Serve it and look at it before anyone else does
SITE_ENV=production TRUST_PROXY_HEADERS=1 npm start
```

For App Service, either deploy the repository and let Oryx run `npm ci && npm run build`, or build
in CI and deploy the artefact. **If you build in CI, `SITE_ENV` must be set in the CI job** — it is
baked into `robots.txt` at build time and cannot be corrected afterwards by an app setting.

`npm start` binds `127.0.0.1:3107`. On App Service, bind the platform's `PORT` and `0.0.0.0`
instead — either change the `start` script for that environment or front it with the platform's
own proxy.

---

## 5 · Before moving any DNS

- [ ] `/api/health/` shows `siteEnv: production`, `indexingEnabled: true`, `perVisitorLimitsActive: true`
- [ ] `/robots.txt` allows crawling and does **not** disallow `/api/capabilities/`
- [ ] `/sitemap.xml` lists this site's own pages — **not** a Yoast index of other sitemaps
- [ ] The apex redirects to `www`, once, with a 308
- [ ] Submit the sitemap in Google Search Console and remove the old one
- [ ] An edit in `/admin` appears on the public page within seconds (§3.1)
- [ ] The contact form delivers a test enquiry and it arrives

---

## 6 · What is left behind, deliberately

`open-next.config.ts`, `wrangler.jsonc` and the `cf:*` scripts stay in the repository. They are
inert — nothing in a Next build reads them — and they are the costed, working record of the
Cloudflare route if it is ever wanted. Deleting them saves nothing and discards the work.

`docs/DEPLOY_RUNBOOK.md` likewise stays. Sections 1, 2, 3 and 9 of it — what is ready, the Next 16
costing, the environment table and the two review dates — apply whatever the platform. Sections
4, 5, 6 and 8 are Cloudflare-only and are replaced by this document.

---

## 7 · The two dates, which do not care about the platform

**10 February 2027** — the capability register goes stale at 90 days and the build stops.
**31 May 2027** — the corporate facts go stale at 200 days and the build stops.

Diarise both now, against a named person. Moving a date without doing the review is the one
failure this system cannot catch.

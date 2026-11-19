# Deploy runbook — in2itebs.com

**Written 18 November 2026**, with the production site returning 403/500 and the rebuild finished
but unpushed. Everything here has been run except the final `deploy` command, which needs
credentials this engagement does not and should not hold.

---

## 0 · Before anything: the old site

**If the previous site has not yet been recovered, do that first and do not let this runbook
distract from it.** Ask the host to identify and _preserve_ the most recent good backup before
anyone troubleshoots — rotating nightly backups will happily overwrite a good snapshot with the
broken state, so every night of downtime risks the restore point.

Pointing DNS at the new site while the old one is unrecovered makes the old one harder to
diagnose. Recover first, cut over deliberately.

---

## 1 · What is ready, and what is not

|                                             | State                                                           |
| ------------------------------------------- | --------------------------------------------------------------- |
| Branch `claude/content-rebuild`             | **35 commits, never pushed.** Lives only in a session workspace |
| `npm run check`                             | Passes — 143 tests, 0 failing                                   |
| Production build                            | Passes, 72 routes, all 200                                      |
| Cloudflare Worker artifact                  | **Builds** — `.open-next/worker.js`, 528 edge assets, 19 MB     |
| CI workflow                                 | Written, **never run** (no remote to run it on)                 |
| Code review by anyone other than its author | **None**                                                        |

### Blocking, and why each one is

1. **Authorise the GitHub repository** (`appdev-in2itebs/IN2ITEBS-New-website`) as a session
   source. Nothing else can happen first. The exact proxy error is:
   _"not in this session's authorized repository set, so the proxy will not inject a credential."_
2. **The apex → www redirect**, as a DNS or edge rule. www is the confirmed canonical.
   _(`NEXT_PUBLIC_SITE_URL` is belt and braces — see §3. `lib/utils.ts` already pins the canonical
   host whenever `SITE_ENV=production`, so this item is infrastructure, not code.)_
3. **Rotate the staging admin password** that was pasted into a chat transcript.
4. **Check the Cloudflare zone's AI-bot defaults** (§5).
5. **Someone other than the author reads the code.** Not ceremony: 35 commits and ~200 files have
   had one author, and the CTO review in `website-final-document.md` is that author reviewing
   himself.

---

## 2 · Next.js 15 is out of support — and 16 has been costed

The Cloudflare adapter refuses to build this app without an override:

```
ERROR Next.js version 15.5.29 is not supported by the Next.js team.
Major versions are supported for 2 years from their release date.
```

It is right. **Next.js 15.0.0 shipped 21 October 2024, so the window closed 21 October 2026.**
Current is **16.4.6**. The pinned `15.5.29` is a 3 November 2026 security backport, so it is
patched today — what has gone is the guarantee of a patch for the _next_ advisory.

Until the upgrade lands the build needs:

```bash
SITE_ENV=production npx opennextjs-cloudflare build --dangerouslyUseUnsupportedNextVersion
```

**Do not bury that flag in `package.json` without a comment.** A flag with the word _dangerously_
in it, quietly added to a script, is how a team forgets what it is running.

### What the Next 16 upgrade actually costs — measured, not estimated

The upgrade was attempted on a throwaway branch and reverted. It is **not** a clean swap, and it
is **not** a large project either. Precisely:

- `npm install next@latest eslint-config-next@latest` installs without complaint.
- **`tsc --noEmit` passes clean.** No type changes anywhere in ~35,000 lines.
- **One config file must change.** `eslint-config-next@16` ships flat config natively, so the
  `FlatCompat` wrapper in `eslint.config.mjs` breaks — it produces a circular reference eslint
  cannot serialise, and it surfaces as a stack trace inside `config-validator.js` rather than as
  anything resembling a config error. The fix is to import `eslint-config-next/core-web-vitals`
  and `eslint-config-next/typescript` directly and spread them; both export arrays.
- **One asset must be re-encoded.** The Turbopack build fails on `app/favicon.ico`:
  _"The PNG is not in RGBA format"_. Re-save it as RGBA and it passes.
- **Sixteen lint problems across eleven files**, all from the React Compiler rules that Next 16
  turns on: `set-state-in-effect` ×6, `refs` ×4, `purity` ×2, `immutability` ×2, `use-memo` ×1,
  `static-components` ×1.

**Read that last number carefully before anyone panics.** A meaningful share are false positives
against **async Server Components** — both `purity` hits are `Date.now()` inside
`export default async function`, which runs on the server and cannot cause a hydration mismatch,
and the `static-components` hit is a lookup from a map rather than a component defined in render.

The genuine ones cluster in `/admin` client components — the page builder, the visual editor,
`count-up`, `splash` — with four in public client components: `header`, `region-preference`,
`brand-hero` and `demo-form`.

### The recommendation

**Do it, as its own pull request, with its own review.** Roughly half a day. It should not be
stacked onto this branch, because the genuine fixes change the behaviour of interactive
components and this branch has not yet been reviewed by anybody.

Whoever picks it up is not starting cold: every issue is enumerated above, `tsc` is known clean,
and the only two mechanical changes are the eslint config and the favicon.

## 3 · Environment

Thirteen variables are read. Five matter for a public deploy; the rest degrade gracefully.

### Required

| Variable                               | Value                      | Why                                                                                                                                                                                     |
| -------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SITE_ENV`                             | `production`               | Read at build time. Decides `robots.txt` and the `X-Robots-Tag` header. **The build refuses to start without it.** Also set it in `wrangler.jsonc` `vars` — it currently says `preview` |
| `NEXT_PUBLIC_SITE_URL`                 | `https://www.in2itebs.com` | Preview hosts only — production pins the canonical itself; see below                                                                                                                    |
| `SUPABASE_URL`                         | the project origin         | The /admin content overlay                                                                                                                                                              |
| `SUPABASE_SECRET_KEY`                  | secret                     | As above                                                                                                                                                                                |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | public                     | Admin sign-in                                                                                                                                                                           |

**`NEXT_PUBLIC_SITE_URL` is less load-bearing than the CTO review claimed.** `lib/utils.ts` pins
`SITE_URL` to `https://www.in2itebs.com` whenever `SITE_ENV=production` — put there precisely
because an Azure VM was once left on `SITE_ENV=preview` after DNS had cut over. So canonical tags
are **correct in a production build with the variable unset**, and the review's "canonical tags are
wrong until this is set" was overstated. Set it anyway for preview environments, where it does
decide the host.

What genuinely remains is the **apex → www redirect**, which is a DNS or edge rule. The application
has nothing to say about a request that never reaches it.

**If Supabase is unset or unreachable, the site still builds and serves** — every page renders
from `content/*.ts` and the build logs exactly which reads fell back. `/admin` will not work.
That behaviour is deliberate; see `lib/cms/outage.ts`.

### Optional

`ALLOWED_ORIGINS`, `TRUST_PROXY_HEADERS`, `SUPABASE_PUBLIC_URL`, `LEAD_WEBHOOK_URL`,
`LEAD_WEBHOOK_TOKEN` (lead forwarding — without it leads are stored, not forwarded),
`NVIDIA_API_KEY`, `NVIDIA_BASE_URL`, `SARVAM_API_KEY` (admin assistant and voice preview only;
nothing public depends on them).

Secrets go in with `npx wrangler secret put <NAME>`, never into `wrangler.jsonc`.

---

## 4 · Cloudflare prerequisites

One thing must exist **before** the first deploy, and it is not created automatically:

- **R2 bucket `in2it-ebs-next-cache`** — Cloudflare dashboard → R2 → Create bucket. This is the
  page cache that makes /admin edits appear without a redeploy. The deploy fails without it.

Created for you on deploy: the two Durable Objects (`DOQueueHandler`, `DOShardedTagCache`) via the
`v1-next-cache` migration, the `ASSETS` binding, and the `IMAGES` binding.

Worth knowing: the Worker is minified to stay under the **3 MiB** free-plan limit — about 2.65 MiB
compressed. Anything that adds a large dependency can push it over, and the failure appears at
deploy, not at build.

---

## 5 · Cloudflare AI crawlers — decide this before going live

Since **15 September 2026** Cloudflare splits AI bots into **Search**, **Agent** and **Training**,
and blocks Agent and Training **by default** on domains newly added after that date, new sites on
existing accounts, and untouched free-tier accounts.

If the zone is new at cutover, ChatGPT's and Perplexity's live-retrieval crawlers are blocked out
of the box, and the site ranks normally in Google while being invisible to AI assistants.

**Keep these two apart in the conversation with whoever administers the zone**, because the
dashboard language merges them:

- **Training** — may our content be used to train models? "No" is defensible and costs nothing in
  visibility.
- **Agent** — may an assistant read the page _on a buyer's behalf, when asked_? This is the one
  that matters commercially, and blocking it by accident is expensive.

The managed `robots.txt` `Content-Signal` default reads `search=yes, ai-train=no, use=reference`.

---

## 6 · The deploy

```bash
# 1 · Install exactly what the lockfile says
npm ci

# 2 · Gates: prettier, eslint, tsc, 143 tests, 21 content and policy gates
npm run check

# 3 · Build the Worker (see §2 for the flag)
SITE_ENV=production npx opennextjs-cloudflare build --dangerouslyUseUnsupportedNextVersion

# 4 · Serve it locally on the real Workers runtime, and check it before it is public
npx opennextjs-cloudflare preview

# 5 · Deploy
npx opennextjs-cloudflare deploy
```

Step 4 is not optional. It runs the actual Worker runtime rather than `next start`, and it is the
only place runtime-only failures — a missing binding, a Node API the Worker lacks — appear before
the public does.

---

## 7 · After deploying, before moving DNS

Check these against the Workers URL, not the live domain:

- [ ] `/` renders, navy hero, client logo band populated
- [ ] `/robots.txt` — `Allow: /api/capabilities/`, **not** `Disallow: /`. If it disallows
      everything, `SITE_ENV` was not `production` at build time
- [ ] `/api/capabilities/` returns JSON, HTTP 200
- [ ] `/llms.txt` and `/insights/feed.xml` return 200
- [ ] `/sitemap.xml` lists 72 routes
- [ ] View source on `/` — the `Organization` block carries the CIN and `hasCertification`
- [ ] Canonical tag on any page reads `https://www.in2itebs.com/...`, not a workers.dev host
- [ ] A handful of the 224 redirects resolve — **test them against real inbound URLs from the old
      site's analytics or Search Console, not against the sitemap.** Walking the sitemap is the
      method that missed a 404 twice during this build
- [ ] `/contact/` submits and the lead arrives at `sales@`
- [ ] `/admin/` signs in, an edit appears on the public page

Then move DNS, with the TTL lowered an hour beforehand so a rollback is minutes rather than hours.

---

## 8 · Rollback

Workers keeps previous versions. `npx wrangler deployments list`, then
`npx wrangler rollback [version-id]`. Seconds, no rebuild.

If DNS has already moved and the new site is wrong, rolling the Worker back is faster than moving
DNS again — which is the reason to cut over on a lowered TTL and to keep the old origin alive and
reachable for a week after.

---

## 9 · Diarise these two dates now

The gates that keep this site honest will stop the build when they lapse, and whoever meets that
failure will not know what it means unless they were told.

| Date                 | What happens                                            | What to actually do                                                                                                                                                                  |
| -------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **10 February 2027** | The capability register expires and **the build fails** | Re-check every line of `content/capability-status.ts` against delivery evidence, then move `capabilityReviewed`. **Do not just move the date** — that is the whole point of the gate |
| **31 May 2027**      | The corporate-facts review lapses, same effect          | Re-verify `content/site.ts` — headcount, certifications, delivery centres — then move `contentUpdated`                                                                               |

`capabilityOwner` currently reads "Marketing and Communications", which is a function, not a
person who has been told. **Name someone and put both dates in their calendar before this ships.**
The most likely failure mode for this site is not a bug; it is a red build in February that
somebody resolves by deleting the gate.

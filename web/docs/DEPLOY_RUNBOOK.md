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
2. **Set `NEXT_PUBLIC_SITE_URL=https://www.in2itebs.com`.** Canonical tags are wrong until it is
   set, and www is the confirmed canonical.
3. **Rotate the staging admin password** that was pasted into a chat transcript.
4. **Check the Cloudflare zone's AI-bot defaults** (§5).
5. **Someone other than the author reads the code.** Not ceremony: 35 commits and ~200 files have
   had one author, and the CTO review in `website-final-document.md` is that author reviewing
   himself.

---

## 2 · The Next.js support window has closed — read this before deploying

The Cloudflare adapter now **refuses to build this app** without an override flag:

```
ERROR Next.js version 15.5.29 is not supported by the Next.js team.
Major versions are supported for 2 years from their release date.
```

It is right. **Next.js 15.0.0 was released 21 October 2024, so the window closed 21 October
2026** — about four weeks ago. Current is **16.4.6**; Next 16 shipped 22 October 2025 and has had
thirteen months to settle.

**This is not a reason to stop a deploy today.** The pinned `15.5.29` was published 3 November
2026 on the `backport` tag, so it carries the latest security backports and is patched as of now.

**It is a reason to schedule the Next 16 upgrade as real work, soon.** What has actually changed:
there is no longer a guarantee of future patches, so the next advisory in this major may not get
one. The CTO review did not catch this because the version was inside its window when the branch
was started, and the clock ran out mid-engagement — which is its own small lesson about pinned
dependencies on a long branch.

Until then the build needs:

```bash
npx opennextjs-cloudflare build --dangerouslyUseUnsupportedNextVersion
```

**Do not bury that flag in `package.json` without a comment.** A flag with the word
_dangerously_ in it, silently added to a script, is how a team forgets it is running an
out-of-support framework.

---

## 3 · Environment

Thirteen variables are read. Five matter for a public deploy; the rest degrade gracefully.

### Required

| Variable                               | Value                      | Why                                                                                                                                                                                     |
| -------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SITE_ENV`                             | `production`               | Read at build time. Decides `robots.txt` and the `X-Robots-Tag` header. **The build refuses to start without it.** Also set it in `wrangler.jsonc` `vars` — it currently says `preview` |
| `NEXT_PUBLIC_SITE_URL`                 | `https://www.in2itebs.com` | Canonical tags, sitemap, JSON-LD, the capability feed                                                                                                                                   |
| `SUPABASE_URL`                         | the project origin         | The /admin content overlay                                                                                                                                                              |
| `SUPABASE_SECRET_KEY`                  | secret                     | As above                                                                                                                                                                                |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | public                     | Admin sign-in                                                                                                                                                                           |

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

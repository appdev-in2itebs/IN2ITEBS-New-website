## What this is

36 commits rebuilding in2itebs.com — and, as of today, **36 commits of fixes to a site that is already live**. Production is running this codebase at an early commit, so most of what follows is not a proposal. It is a description of defects currently published. See `claude/production-state.md`.

**143 tests, 0 failing · 72 routes, all 200 · `public/` 86 MB → 16 MB · 21 build-stopping gates**

---

## Read these four files, not the 200-file diff

The diff is mostly content and markup. The judgment is concentrated in a few places:

| File                             | Why                                                                                                                                                              |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content/capability-status.ts`   | The capability register — four statuses per line, including "Ahead of us". The centre of the repositioning, and the page that does not exist in production today |
| `content/evidence.ts`            | Why five inherited percentages are published as unsourced rather than quietly kept                                                                               |
| `tests/machine-readable.test.ts` | The gate that checks a claim _about the site_ is true. Added after the worst defect in this branch                                                               |
| `lib/cms/outage.ts`              | The failure policy, and why "just catch the error" would have lost editors' work                                                                                 |

Then `docs/DEPLOY_RUNBOOK.md` before anyone deploys.

---

## What changed, in one pass

**Facts settled and gated.** Four delivery centres, not eight. SAP PCE Partner withdrawn because it could not be produced in SAP's own wording with a date. The word "certified" banned — provable from payroll is not the same as a register a tender can demand. Two self-ageing figures removed.

**Machinery, not prose.** Eighteen build-stopping gates became twenty-one. Unfalsifiable adjectives fail the build. A percentage without baseline, window and measurer fails the build. An off-palette diagram, a photograph outside the allow-list, an internal link that 404s or takes a redirect hop, an FAQ answer that has drifted from its page — all fail the build. The capability register expires after 90 days and takes the build with it.

**Every photograph removed** — 190-odd images and 1,205 extracted video frames. The prompt was an unresolvable licence position. The argument is that a stock photograph is the visual form of an unfalsifiable adjective, on a site that already fails its build over the written kind. Replaced by a deterministic generated figure per route.

**Made readable by machines.** The capability register as JSON, entity markup carrying the CIN and the subsidiaries, FAQPage on five routes, `llms.txt`, an insights feed.

---

## Please push back on these

Four places where I made a call that a second reader might reasonably reverse:

1. **Anonymised case studies cost us the question buyers ask first.** 94 client names publish only as `alt` attributes on a logo marquee, and 13 studies have a real client held behind a flag. House style, but nobody had priced this side of it.
2. **We publish fewer numbers than every competitor.** That is the figure gate working as designed. It is still a visibility cost and it should be a decision, not a side effect.
3. **Question-form headings were planned and not written.** Every candidate meant degrading a headline to match a query string. The FAQ markup carries the question form instead. Disagree if you think retrieval needs more.
4. **`parentOrganization` is deliberately absent** from the entity markup. The holding structure is published nowhere on the site, and markup is not where to disclose what the pages do not.

---

## Five defects I shipped, and what each one taught

This is the section I would read first if I were reviewing.

1. **Six diagrams shipped off-palette.** The November re-palette was verified by hand and recorded as clean; the generator that draws them was never updated. _A one-off manual verification records a moment; it does not hold a standard._
2. **Every diagram was unreadable on a phone** — fifteen placements at 0.4 scale, 12.5px type rendering at 5px, in a frame whose own comment claimed it scrolled rather than shrank. _The comment described the intent and the number contradicted it, and nobody measured._
3. **A commit went in unformatted** because the check output was grepped for `error` and prettier reports `[warn]`. _The check had passed; the reading of it had not._
4. **A featured tile returned 404 while every crawl reported the site clean.** The crawl walked the sitemap, and a broken URL is not in the sitemap — which is what makes it broken.
5. **The one endpoint built for machines was blocked by our own robots.txt**, while three sentences of the handover called it published. _The gates check that a claim about the business is evidenced. Nothing checked that a claim about the site was true._ That gate now exists, and I verified it by reintroducing the defect and watching it fail.

Four of the five were a check that existed and was trusted without being exercised. Twice the method was "walk the sitemap" and twice the defect was something a sitemap cannot list. `.github/workflows/ci.yml` is in this PR and is the answer to all of them.

---

## Before merge

- [ ] Someone other than the author has read the four files above
- [ ] `NEXT_PUBLIC_SITE_URL=https://www.in2itebs.com` set in production
- [ ] Staging admin password rotated (it was pasted into a chat transcript)
- [ ] Sucuri firewall: audit trail read, and AI-crawler user agents tested — see `claude/production-state.md` §4
- [ ] R2 bucket `in2it-ebs-next-cache` created, if deploying to Workers
- [ ] CI green (this is its first ever run — it has never executed)

## Known and accepted

**Next.js 15 left its support window on 21 October 2026.** The pinned `15.5.29` is a 3 November security backport, so it is patched today, but the Cloudflare adapter now refuses to build it without `--dangerouslyUseUnsupportedNextVersion`. Next 16 is at 16.4.6. The upgrade is real work and needs scheduling; it does not block this merge. `docs/DEPLOY_RUNBOOK.md` §2.

**Five figures remain unsourced** and are named as such in `content/evidence.ts`, each with the exact question that would close it. None may be cleared by inventing the missing part.

---

## Two dates to put in a calendar now

| Date            | What happens                                                 |
| --------------- | ------------------------------------------------------------ |
| **10 Feb 2027** | The capability register expires and the build starts failing |
| **31 May 2027** | The corporate-facts review lapses, same effect               |

`capabilityOwner` currently names a function, not a person. The likeliest way this site dies is not a bug — it is a red build in February that somebody resolves by deleting the gate.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01K8tXoQkeJrw3Myuj1Doa4Z

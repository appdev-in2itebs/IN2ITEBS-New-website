# For whoever holds the Sucuri account

**18 November 2026.** Two separate things to check in one dashboard visit. The first is an
incident that will recur; the second is a commercial problem nobody has looked at.

The site is behind **Sucuri CloudProxy**, and the origin is nginx/1.24.0 on Ubuntu proxying a
Next.js process. Both items below are firewall settings, not server problems — this needs a
Sucuri login, not SSH.

---

## 1 · Real visitors were served 403 twice today

**What happened.** The site returned a bare `403 Forbidden` to ordinary visitors in at least two
windows this afternoon, recovered on its own between them, and was serving normally again by
17:48 UTC.

**What it was not.** Not the server. During a window when a request got through, the origin
returned a complete, correctly rendered page with Next.js cache hits — nginx and the application
were healthy throughout. Not disk, not memory, not a crashed process. The `Server` header on the
failing responses reads `Sucuri/Cloudproxy`, so the refusals came from the firewall, not the
origin.

**Why it matters now.** Nobody identified a cause, so nothing has been changed to stop it
happening again. It recovered rather than being fixed.

**What to do.** **Firewall → Audit Trail.** Sucuri logs the rule that fired against each blocked
request, with IP and timestamp. Read **roughly 17:30–17:55 UTC on 18 November 2026** — those
entries age out, so this is worth doing before anything else on this page.

While there, check three settings that produce exactly this pattern:

- **Account status.** A lapsed subscription is a common cause.
- **Security mode.** An allowlist-only or emergency-hardening setting will 403 ordinary visitors.
- **The configured origin IP**, under the general settings — confirm it matches the current
  server. A stale origin IP after a server move produces intermittent failures of this shape, and
  this site has been moved recently.

**One thing that will appear in that log and should not mislead you.** While diagnosing, roughly
twenty automated requests were made to the homepage from an office IP, some with cache-busting
query strings. They did not cause the outage — the first 403 was reported before any of them —
but they are in the log, and a burst of scripted requests is an easy thing to mistake for the
cause.

---

## 2 · The firewall may be blocking AI search engines — unverified, and worth ten seconds

**The observation.** Sucuri returned 403 to a browser whose user agent carried an unfamiliar token
(`…Claude/6.6395.0 Chrome/156…`), while ordinary Chrome **on the same machine and the same IP**
was served normally. So that block was on the user agent, not the address.

**Why that is a commercial problem.** `ClaudeBot`, `GPTBot`, `OAI-SearchBot`, `ChatGPT-User` and
`PerplexityBot` all carry unfamiliar tokens. If the firewall treats them the way it treated that
one, the site is invisible to AI assistants — and it fails **silently**. Google ranking is
unaffected, the site looks perfect to every human who checks, and it is simply absent from the
answers buyers increasingly start from.

For a firm selling eighteen-month SAP programmes to committees, the assistant that drafts the
long-list now sits upstream of the first conversation. A November 2026 study of sixty B2B buying
questions found vendors' own sites cited in 88–97% of answers, because there is nowhere else for
the specifics to come from.

**The test.** From any terminal:

```bash
for ua in \
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36" \
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
  "Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)" \
  "Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)" \
  "Mozilla/5.0 (compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot)" \
  "Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)"; do
  curl -sS -o /dev/null -A "$ua" -w "%{http_code}  ${ua:0:62}\n" https://www.in2itebs.com/
done
```

**Reading it.** Chrome and Googlebot should both return `200`. If the three AI bots return `403`
while Googlebot returns `200`, the firewall is blocking AI search engines and that setting is
worth more than anything else currently on the website backlog.

**If they are blocked.** In the Sucuri dashboard this usually sits under the firewall's bot or
crawler controls, or an aggressive security level that blocks unrecognised agents by default.
Allow the AI search crawlers, or lower the setting so unknown agents are challenged rather than
refused outright.

**One distinction to hold on to**, because the settings tend to merge them and the difference is
the whole point:

- **Training crawlers** — may our content be used to train models? Declining is perfectly
  defensible and costs nothing in visibility.
- **Search and agent crawlers** — may an assistant read the page _on a buyer's behalf, when
  asked_? This is the commercial one. Blocking it by accident is expensive and invisible.

---

## 3 · While you are in there

Worth confirming, though neither is urgent:

- **The origin should only accept traffic from Sucuri's IP ranges.** If the server is reachable
  directly, the firewall can be bypassed and is largely decorative.
- **The production CSP allowlists `https://57-159-30-28.sslip.io`** — a staging host — for images.
  Harmless but untidy, and it suggests production and staging configuration have not been fully
  separated.

---

## Summary

|     | Action                                                             | Where                       |
| --- | ------------------------------------------------------------------ | --------------------------- |
| 1   | Read today's 17:30–17:55 UTC entries before they age out           | Firewall → Audit Trail      |
| 2   | Check account status, security mode, configured origin IP          | Firewall → Settings         |
| 3   | Run the user-agent test above; allow AI search crawlers if blocked | Terminal, then bot settings |
| 4   | Confirm the origin only accepts Sucuri IPs                         | Server firewall             |

# For whoever holds the GoDaddy account

**18 November 2026.** The 403s on in2itebs.com today are **resolved and understood**. This note
records what they were, the one-click fix, the question worth asking anyway, and a separate
setting nobody has looked at.

The site sits behind **GoDaddy Website Firewall** — the Sucuri product GoDaddy acquired, which is
why responses carry `Server: Sucuri/Cloudproxy`. Everything here is a firewall dashboard setting.
None of it needs SSH.

---

## 1 · What happened: the office IP was blocked, not the site

The firewall's own block page settles it:

```
Access Denied — GoDaddy Website Firewall
Your IP:       182.77.77.53
URL:           in2itebs.com/services/agile-devops/
Block ID:      TMP022
Block reason:  Your IP address was temporarily blocked by our IDS for this website.
Time:          2026-11-18 13:13:13
```

**There was no outage.** Verified from an unrelated IP while the office was blocked: the homepage
returned in full, with the correct title and headline. The site served everyone else normally the
whole time. The origin —
nginx/1.24.0 proxying a Next.js process — was healthy in every window it was reached, returning
complete pages with cache hits. Nothing was wrong with the server, the disk, or the application.

It also explains the two things that looked impossible from inside the office:

- **A phone on mobile data worked** — different IP, never blocked.
- **Chrome worked while a freshly opened browser was refused, on the same machine and the same
  IP** — the firewall issues a clearance cookie once a client has passed. Chrome held one from
  before the block; a new browser profile did not, so it met the IP block directly.

### The fix

**Allowlist `182.77.77.53`** in the firewall dashboard. The block page says so itself.

### The question worth asking first

An office IP tripping an intrusion-detection rule **twice in one day** usually has a cause. Open a
support ticket quoting **Block ID `TMP022`** and the timestamp, and ask which rule fired.

Allowlisting without that answer hides the signal rather than fixing anything — and if something
on the network is generating traffic the IDS reads as hostile (a scanner, a plugin, a misbehaving
integration), it will keep doing it against every other site that network touches.

**Our own testing is a likely contributor, and this note corrected itself on the point.** An
earlier version said the block timestamp preceded the diagnostic requests by several hours. That
assumed the firewall displays UTC. It does not: two block pages captured 4m13s apart carried
timestamps 4m45s apart, tracking local time with a constant ~10h30m offset, which puts the
display at **UTC-5**. The blocks therefore landed at 18:13 and 18:17 UTC — roughly twenty minutes
**after** a burst of about twenty scripted requests with cache-busting query strings, not before.

The very first 403 of the day still predates all of that, so testing did not start it. But
`TMP022` is a _temporary_ block and repeated reloading is what re-arms it, and the site was being
reloaded steadily from the office for an hour. **The first thing to try is leaving it alone for
twenty to thirty minutes.**

Ask support "which rule fires on this, and is our own testing tripping it" rather than assuming
something hostile. On current evidence that is the likeliest answer.

---

## 2 · Separately: does the firewall block AI search engines?

Unverified, unrelated to the block above, and worth ten seconds.

**Why it matters.** For a firm selling eighteen-month SAP programmes to committees, the assistant
that drafts a buyer's long-list now sits upstream of the first conversation. A November 2026 study
of sixty B2B buying questions found vendors' own sites cited in 88–97% of answers, because there
is nowhere else for the specifics to come from.

If the firewall refuses `ClaudeBot`, `GPTBot`, `OAI-SearchBot` or `PerplexityBot`, the site is
absent from those answers — and it **fails silently**. Google ranking is unaffected, the site
looks perfect to every human who checks.

**The test**, from a terminal on an IP that is _not_ blocked:

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

Chrome and Googlebot should both return `200`. If the AI bots return `403` while Googlebot returns
`200`, the firewall's bot settings outrank everything else on the website backlog.

**One distinction to hold on to**, because these settings tend to merge them:

- **Training crawlers** — may our content be used to train models? Declining is perfectly
  defensible and costs nothing in visibility.
- **Search and agent crawlers** — may an assistant read the page _on a buyer's behalf, when
  asked_? This is the commercial one, and blocking it by accident is both expensive and invisible.

---

## 3 · While you are in there

Neither is urgent:

- **The origin should only accept traffic from the firewall's IP ranges.** If the server is
  reachable directly, the firewall can be bypassed and is largely decorative.
- **The production CSP allowlists `https://57-159-30-28.sslip.io`** — a staging host — for images.
  Harmless, but it suggests production and staging configuration have not been fully separated.

---

## Summary

|     | Action                                                       | Where                       |
| --- | ------------------------------------------------------------ | --------------------------- |
| 1   | Allowlist `182.77.77.53`                                     | Firewall → Access Control   |
| 2   | Ask support which IDS rule fired, quoting Block ID `TMP022`  | Support ticket              |
| 3   | Run the user-agent test; allow AI search crawlers if blocked | Terminal, then bot settings |
| 4   | Confirm the origin only accepts firewall IPs                 | Server firewall             |

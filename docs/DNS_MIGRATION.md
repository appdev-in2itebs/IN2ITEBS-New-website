# Putting in2itebs.com on Cloudflare

How to move `in2itebs.com` from GoDaddy DNS to Cloudflare so the Next.js Worker can serve it, without
taking down company email.

Cloudflare charges nothing for this: custom domains, SSL and DNS hosting are all free. The cost is
care, not money.

## Read this first

Cloudflare Workers can only serve a domain whose DNS Cloudflare hosts. On the free plan that means
moving the **nameservers** — the whole zone, not just the website record. Serving one subdomain from
Cloudflare while leaving the rest at GoDaddy (a "partial" or CNAME zone) is Enterprise-only.

So this migration moves **email DNS too**. `in2itebs.com` receives mail through Microsoft 365. If the
MX or SPF records do not survive the move, inbound mail bounces and outbound mail is marked as spam.
That is a worse incident than any website outage, and it is the reason for the verification steps
below.

Moving to Cloudflare also takes **Sucuri** out of the path — it currently fronts the site at
`192.124.249.119`. Cloudflare has its own WAF, but this is a security change someone has to own.
Note that `web/.env.example` documents `TRUST_PROXY_HEADERS=1` as safe behind Sucuri because Sucuri
*overwrites* `X-Forwarded-For`. Cloudflare *appends* to it, so that setting must stay `0`.

## Current DNS, captured 2026-09-22

⚠️ **This list is what could be found by querying known names. It is not authoritative.** There is no
way to enumerate a zone from outside, so records that exist under names not guessed here are not
listed. **Export the real zone file from GoDaddy and work from that**, using this only as a
cross-check.

Registrar / DNS today: **GoDaddy** (`ns33.domaincontrol.com`, `ns34.domaincontrol.com`)

### Root (`@`)

| Type | Value | Purpose |
| --- | --- | --- |
| A | `192.124.249.119` | Current website, behind Sucuri. **This is the one the Worker replaces.** |
| MX | `in2itebs-com.mail.protection.outlook.com` (priority 0) | ⚠️ **Microsoft 365 mail delivery** |
| TXT | `v=spf1 include:spf.protection.outlook.com -all` | ⚠️ **SPF — outbound mail passes checks** |
| TXT | `google-site-verification=ADOe1OeMqGqCXLvS3U0MzYDEqhN4mOGGLngsPtvtFtc` | Google Search Console |
| TXT | `google-site-verification=oF3LyM8Mq2EZo4tSbUoIuUrDyMwEEmUSLqimNazgFvg` | Google Search Console |
| TXT | `D5863182` | Unidentified verification token — preserve it |

### Subdomains

| Name | Type | Value | Purpose |
| --- | --- | --- | --- |
| `www` | CNAME | `in2itebs.com` | Website alias (also answers A `192.124.249.119`) |
| `www` | TXT | same four TXT values as root | Verification |
| `autodiscover` | CNAME | `autodiscover.outlook.com` | ⚠️ **Outlook client auto-configuration** |
| `lyncdiscover` | CNAME | `webdir.online.lync.com` | Teams / Skype for Business |
| `sip` | CNAME | `sipdir.online.lync.com` | Teams / Skype for Business |
| `enterpriseregistration` | CNAME | `enterpriseregistration.windows.net` | Entra ID device join |
| `enterpriseenrollment` | CNAME | `enterpriseenrollment.manage.microsoft.com` | Intune enrolment |
| `mail` | A | `166.62.10.185` | GoDaddy host — confirm what uses it before dropping it |

**Not found, worth checking in GoDaddy:** DKIM (`selector1._domainkey`, `selector2._domainkey`),
DMARC (`_dmarc`), and Teams SRV records (`_sip._tls`, `_sipfederationtls._tcp`). No DKIM or DMARC
record answered, which may mean they are genuinely absent — if so, that is a separate mail-security
gap worth closing, but do not introduce it during this migration.

## The migration

### Step 1 — Export the real zone from GoDaddy

GoDaddy → Domain → DNS → **Export zone file**. Keep the file. It is the rollback reference and the
authoritative record list. Do not skip this.

### Step 2 — Add the zone to Cloudflare

Cloudflare dashboard → **Add a domain** → `in2itebs.com` → **Free** plan. Cloudflare scans the
existing DNS and imports what it finds.

Nothing changes yet. The nameservers are still GoDaddy's, so the live site and email are untouched.

### Step 3 — Verify every record, line by line

Compare Cloudflare's imported list against the GoDaddy export. Cloudflare's scan is best-effort and
routinely misses records.

Check in particular:

- [ ] MX is present with the correct priority
- [ ] The SPF TXT record is present and **exactly** as it was
- [ ] Both `google-site-verification` TXT records are present
- [ ] The `D5863182` TXT record is present
- [ ] `autodiscover`, `lyncdiscover`, `sip`, `enterpriseregistration`, `enterpriseenrollment` are present
- [ ] Any DKIM / DMARC / SRV records from the export are present
- [ ] `MX`, `autodiscover` and every other mail record is set to **DNS only** (grey cloud), never
      proxied. Proxying a mail record breaks mail.

Leave `@` and `www` pointing at `192.124.249.119` for now. The website cutover is Step 6, deliberately
separate from the DNS move.

### Step 4 — Change the nameservers at GoDaddy

⚠️ **This is the irreversible-feeling step and the one that needs a maintenance window.** Pick a
quiet time, not a Friday.

GoDaddy → Domain → Nameservers → **Change** → enter the two Cloudflare nameservers shown in Step 2.

Propagation takes anywhere from minutes to 48 hours.

### Step 5 — Verify, and live on it for a few days

Before touching the website at all:

```bash
# Nameservers now Cloudflare
nslookup -type=NS in2itebs.com
# Mail still routes to Microsoft 365
nslookup -type=MX in2itebs.com
# SPF intact
nslookup -type=TXT in2itebs.com
```

Then the checks that actually matter:

- [ ] Send an email **to** someone at in2itebs.com from an outside account — it arrives
- [ ] Send an email **from** in2itebs.com to an outside account — it arrives, not in spam
- [ ] Outlook connects on a machine that has not cached settings
- [ ] Teams signs in
- [ ] https://in2itebs.com still serves the old site

**Do not move on until email has been healthy for several days.** There is no deadline here.

### Step 6 — Put the Worker on a subdomain first

In Cloudflare → **Compute → Workers & Pages → `in2it-ebs-web` → Settings → Domains & Routes → Add**:

```
staging.in2itebs.com
```

Cloudflare issues the certificate itself. Then set the `SITE_URL` repository variable to
`https://staging.in2itebs.com` and re-run the deploy so canonical URLs and the sitemap match.

`SITE_ENV` stays `preview`, so the staging host keeps its `noindex` header and cannot compete with
the live site in search. Review the site here, and get sign-off, before Step 7.

### Step 7 — Cut the live site over

Only after sign-off. This replaces the current website.

1. Add `in2itebs.com` and `www.in2itebs.com` as custom domains on the Worker.
2. In `.github/workflows/deploy.yml`, change `SITE_ENV: preview` to `SITE_ENV: production`.
3. Set the `SITE_URL` repository variable to `https://in2itebs.com`.
4. Push, and let the deploy run.
5. Verify:

```bash
curl -sI https://in2itebs.com/ | grep -i x-robots-tag      # must return NOTHING
curl -s https://in2itebs.com/api/health/                    # "siteEnv":"production"
curl -sI https://in2itebs.com/who-we-are/ | grep -i location # 308 to /about/who-we-are/
```

The `x-robots-tag` check is the important one. If `noindex` is still being sent, Google will drop the
site from search. `web/scripts/check-build.mjs` fails the build when `SITE_ENV` and the expected
header disagree, so a mismatch should never reach production — but verify anyway.

Old URLs keep working: `web/content/redirects.mjs` maps every legacy path to its new home, wired
through `next.config.mjs`. This was verified against the Worker on 2026-09-22 (`/who-we-are/` → 308 →
`/about/who-we-are/`).

## Rollback

- **During Steps 2–3:** nothing has changed. Delete the Cloudflare zone.
- **After Step 4 (email or site broken):** change the nameservers back to `ns33.domaincontrol.com` and
  `ns34.domaincontrol.com` at GoDaddy. GoDaddy still holds the old zone. Propagation applies again, so
  this is not instant — which is why Step 3 matters more than any other step here.
- **After Step 7 (website wrong):** remove the custom domain from the Worker and point `@` and `www`
  back to `192.124.249.119` in Cloudflare DNS. That is a DNS edit inside Cloudflare and takes effect
  quickly; email is unaffected.

## What this does not cover

Sucuri. It currently fronts the site and will no longer be in the path afterwards. Decide before
Step 7 whether Cloudflare's WAF replaces it, whether the Sucuri subscription should be cancelled, and
who owns that decision.

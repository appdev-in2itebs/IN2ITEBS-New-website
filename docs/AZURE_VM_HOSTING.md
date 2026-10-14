# Hosting on the Azure VM

The site also runs on an Azure VM (Ubuntu 24.04, public IP 57.159.30.28) as a plain Next.js server:
`next build` + `next start` under pm2, behind nginx. Since 2026-10-13 the VM also runs its own
**self-hosted Supabase** (Docker, `/srv/supabase`), with the data, stored files and admin login copied from
the hosted project, so nothing on the VM depends on Cloudflare or supabase.com.

## URLs

| URL | Notes |
| --- | --- |
| https://57-159-30-28.sslip.io | Let's Encrypt certificate (installed automatically once ports 80/443 are open) |
| https://57.159.30.28 | Self-signed certificate until then (browser warning, then works) |
| http://57.159.30.28 | Redirects to HTTPS |

HTTPS is required: the app's Content-Security-Policy sends `upgrade-insecure-requests`, so plain HTTP pages
would try to load their assets over HTTPS and fail.

**Azure network:** the VM's network security group must allow inbound TCP 80 and 443
(Azure portal → the VM → Networking → Add inbound port rule). Without that only SSH (22) reaches the VM.

## Layout on the VM

| Path | What |
| --- | --- |
| `/srv/in2it/app/web` | the built application (`.env.local` holds the secrets) |
| `/srv/in2it/ecosystem.config.cjs` | pm2 app `in2it-web`, Next.js on 127.0.0.1:3107 |
| `/srv/in2it/logs/` | app output, errors and the TLS log |
| `/etc/nginx/sites-available/in2it` | nginx: 80 → 443 redirect, TLS, static assets, proxy to 3107 |
| `/srv/in2it/deploy.sh` | rebuild and restart from a new `site.tar.gz` |
| `/srv/in2it/enable-tls.sh` | certbot for 57-159-30-28.sslip.io (run once ports are open; a retry loop also tries every 15 min for 24 h) |

pm2 is registered with systemd (`pm2-appuser`), so the site comes back after a reboot.

## Environment on the VM

`SITE_ENV=preview` (sends `X-Robots-Tag: noindex`, so this copy never competes with in2itebs.com in
search), `NEXT_PUBLIC_SITE_URL=https://57-159-30-28.sslip.io`, `TRUST_PROXY_HEADERS=1` (nginx overwrites
`X-Forwarded-For`), `ALLOWED_ORIGINS` listing the IP and in2itebs.com, plus the Supabase, NVIDIA and
Sarvam keys. To make this the production site, point DNS at the VM, set `SITE_ENV=production` and the
real `NEXT_PUBLIC_SITE_URL` in `.env.local`, add the domain to nginx and certbot, and rebuild.

## Self-hosted Supabase on the VM

| What | Where |
| --- | --- |
| Stack | `/srv/supabase` (official `supabase/docker` compose; `sh run.sh start|stop|status|logs`) |
| Secrets and keys | `/srv/supabase/.env` (`sh run.sh secrets` prints them); copy of the hosted env in `/srv/in2it/env.hosted-supabase.bak` |
| API gateway | 127.0.0.1:8000 only; the website uses `SUPABASE_URL=http://127.0.0.1:8000` |
| Studio (dashboard) | https://supabase.57-159-30-28.sslip.io (basic auth: `DASHBOARD_USERNAME` / `DASHBOARD_PASSWORD` from `.env`) |
| Uploaded files | served from the site's own origin, `https://57-159-30-28.sslip.io/storage/v1/...` (`SUPABASE_PUBLIC_URL`) |
| Database | Postgres 17 in the `supabase-db` container, port 5432 on loopback only; data in `/srv/supabase/volumes/db/data` |
| Schema | the five files in `supabase/migrations/` applied with `docker exec -i supabase-db psql -U postgres -d postgres < file.sql` |

Admin sign-ins were recreated (Supabase passwords cannot be exported); the temporary passwords are in
`.website-runtime/vm-admin-temporary-passwords.txt` on the machine that ran the copy. Public sign-up is
disabled; new admins are added in Studio (Authentication) plus a row in `admin_users`.

Back up with `docker exec supabase-db pg_dump -U postgres postgres | gzip > backup.sql.gz` plus
`/srv/supabase/volumes/storage`.

## Deploys from GitHub (CI/CD)

`.github/workflows/deploy.yml` runs after `ci` passes on `main` (or by hand from the Actions tab): it packs
the verified commit, sends it over SSH to the VM and runs `/srv/in2it/deploy.sh` there (npm ci, next build,
pm2 reload, no downtime). It signs in with the `VM_SSH_KEY` repository secret, whose public half sits in
`appuser`'s `authorized_keys` with a forced command (`/srv/in2it/ci-deploy.sh`), so that key can do nothing
on the VM except deploy. The VM's host key is pinned in the workflow. Cloudflare is no longer deployed.

## Going live on in2itebs.com

1. Azure portal: allow inbound TCP 80 and 443 on the VM's network security group.
2. GoDaddy DNS: A record `@` and `www` to 57.159.30.28 (leave MX/TXT alone: company email).
3. On the VM: `/srv/in2it/go-live.sh` (refuses to run until DNS points here; gets the certificate, switches
   to `SITE_ENV=production`, rebuilds).

Change an admin's password on the VM: `/srv/in2it/set-admin-password.sh email@in2itebs.com`.

## Redeploy by hand

From the repo root, with the deploy key in `~/.ssh/azure_in2it`:

```bash
git archive --format=tar.gz -o site.tar.gz HEAD web supabase && scp -i ~/.ssh/azure_in2it site.tar.gz appuser@57.159.30.28:/srv/in2it/ && ssh -i ~/.ssh/azure_in2it appuser@57.159.30.28 /srv/in2it/deploy.sh
```

Useful on the VM: `pm2 ls`, `pm2 logs in2it-web`, `pm2 restart in2it-web`, `sudo systemctl reload nginx`,
`curl -sk https://127.0.0.1/api/health/`.

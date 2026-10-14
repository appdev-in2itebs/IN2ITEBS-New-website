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
| `/srv/in2it/app/web` | the running release (`app` is a symlink into `releases/<timestamp>`; the three newest are kept for rollback) |
| `/srv/in2it/shared/.env.local` | the website's settings and secrets, copied into every release |
| `/srv/backups/<date>/` | nightly backups (database dump, uploaded files, config), 14 days kept; `backup.sh` runs at 02:15 UTC |
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

Backups run nightly (`/srv/in2it/backup.sh`, log in `/srv/in2it/logs/backup.log`) into `/srv/backups`.
Restore the database with `gunzip -c postgres.sql.gz | docker exec -i supabase-db psql -U postgres -d postgres`
and the files with `tar -xzf storage.tar.gz -C /srv/supabase/volumes`. Copying `/srv/backups` off the VM
(for example to Azure Blob Storage) is still to be set up. `housekeeping.sh` prunes Docker images and old
releases weekly; the VM has 4 GB of swap for builds.

Rollback: `ln -sfn releases/<older> /srv/in2it/app && pm2 reload in2it-web`.

Never run `npm run dev` on the VM: it is a development server. Since 2026-10-14 dev builds go to
`.next-dev` so they cannot overwrite a production build, but the dev server would still fight pm2 for the port.

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

## In2Recruit on the same VM

Moved from the InsForge cloud on 2026-10-14. Repo: https://github.com/In2ITEBSLtd/In2Recruit.

| What | Where |
| --- | --- |
| App | https://recruit.57-159-30-28.sslip.io (later recruit.in2itebs.com); pm2 app `in2recruit`, 127.0.0.1:3200 |
| Code | `/srv/recruit/app` -> `releases/<ts>` (3 kept); env in `/srv/recruit/shared/.env.local` |
| Backend | self-hosted InsForge in Docker, `/srv/insforge` (`docker compose ps|logs`), API on 127.0.0.1:7130, dashboard https://insforge.57-159-30-28.sslip.io (login: `ROOT_ADMIN_USERNAME/PASSWORD` in `/srv/insforge/.env`) |
| Database | Postgres 15 in the `insforge-postgres-1` container, 127.0.0.1:5442; `/srv/recruit/apply-migrations.sh <release>` applies the repo's SQL in order and records it |
| CV text extraction | Apache Tika container `in2recruit-tika` on 127.0.0.1:9998 (same image the cloud used) |
| Scheduled jobs | `/srv/recruit/cron.sh <route>` from appuser's crontab: offer-watchdog every 15 min, feedback-scan hourly, expiry/preboarding/consistency nightly, digests 03:30 UTC; log in `/srv/recruit/logs/cron.log` |
| Deploys | `.github/workflows/deploy.yml` in the repo: check job, then SSH to the VM with the `VM_SSH_KEY` secret (forced command `/srv/recruit/ci-deploy.sh`) |
| Backups | included in the nightly `/srv/in2it/backup.sh` (InsForge dump, files, config) |

Fresh-install notes: the repo's migrations were written against the cloud database, so three things were
set by hand before they applied cleanly: the `role_permissions(role, resource)` unique index must exist before
`001`, `user_profiles.auth_user_id` is `text` (not uuid) and `user_profiles.role` is the `app_role` enum
(created by hand with every role value in use). One migration (`20261001065249`) was applied as a patched
copy that skips tables which never had the `authenticated_workspace` policy.

AI: the OpenRouter key is in `/srv/recruit/shared/.env.local`. The OpenRouter account has no credits, so the
model the app shipped with (`google/gemma-4-26b-a4b-it`, paid) is refused; the `ai_settings` row and
`OPENROUTER_MODEL` are set to `dots-studio/dots-3-note-preview:free`, which passed the workbench and JD
extraction routes (free models are rate-limited per day). To use the original model, add credits at
openrouter.ai and change the model in the app's AI settings page.

Data: copied from the InsForge cloud project on 2026-10-14 with `/srv/recruit/sync-from-cloud.py`
(cloud URL and API key in `/srv/recruit/shared/cloud.env`). It syncs the cloud's catalogs first (enum
types, tables, columns, constraints, indexes, all functions, triggers, policies, RLS flags), then every
public table, then `auth.users` including password hashes (so existing passwords keep working), then the
files through the storage API, and reloads PostgREST. Re-runnable: it truncates and reloads. After the
first run 17 duplicate constraints created by the migrations (`*_fkey` twins of the cloud's `*_fkey1`)
had to be dropped, otherwise PostgREST reports two relationships between the same tables.

App address: https://in2recruit.57-159-30-28.sslip.io (`recruit.` redirects). Still to do: point
`in2recruit.in2itebs.com` at the VM, then delete the InsForge cloud project.

## Redeploy by hand

From the repo root, with the deploy key in `~/.ssh/azure_in2it`:

```bash
git archive --format=tar.gz -o site.tar.gz HEAD web supabase && scp -i ~/.ssh/azure_in2it site.tar.gz appuser@57.159.30.28:/srv/in2it/ && ssh -i ~/.ssh/azure_in2it appuser@57.159.30.28 /srv/in2it/deploy.sh
```

Useful on the VM: `pm2 ls`, `pm2 logs in2it-web`, `pm2 restart in2it-web`, `sudo systemctl reload nginx`,
`curl -sk https://127.0.0.1/api/health/`.

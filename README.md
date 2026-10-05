# In2IT EBS — corporate website

The In2IT EBS website (https://in2itebs.com), rebuilt as a Next.js 15 App Router application with
typed in-repo content and a hardened enquiry API. It deploys itself: every push to `main` that
passes CI ships to Cloudflare Workers.

## Repository layout

```
.
├── README.md                 # this file
├── .github/workflows/        # ci.yml (checks + tests) and deploy.yml (Cloudflare)
├── docs/                     # ADMIN_AND_CHATBOT_SETUP.md (connect Supabase, first admin),
│                             # DNS_MIGRATION.md (putting in2itebs.com on Cloudflare),
│                             # website-platform-blueprint.docx (architecture and roadmap)
├── assets/hero-images/       # original hero artwork (PNG), one folder per site menu; see its README
│   ├── pages/  services/  industries/  partners/  about/  careers/
│   ├── alt-text.json         # what each picture shows
│   ├── _pending/             # artwork not used on a page yet (not built)
│   └── _pack-notes/          # the art packs' own notes and contact sheets
├── supabase/migrations/      # SQL schema, applied through the Supabase SQL editor
├── .claude/launch.json       # dev-server entry for the Claude Code browser pane (port 3117)
└── web/                      # the Next.js application (see web/README.md)
    ├── app/                  # routes (App Router), API routes under app/api/
    ├── components/           # layout, sections, ui, media, motion, forms, seo
    ├── content/              # typed content modules: nav, services, clients, offices, …
    ├── lib/                  # metadata, JSON-LD, lead API service, Supabase client, utilities
    ├── public/               # brand SVGs, logos, photos, hero frame sequences, videos;
    │                         # heroes/ is generated from assets/hero-images by `npm run heroes`
    ├── scripts/              # build check, hero images, hero-frame extraction, YouTube feed, world map
    ├── tests/                # unit tests (node:test) and Playwright browser specs
    ├── wrangler.jsonc        # Cloudflare Worker configuration
    └── .env.example          # every environment variable, documented
```

## Quick start

Requires Node.js 20 or newer and npm.

```bash
cd web
npm ci
npm run dev        # http://127.0.0.1:3107 with hot reload
```

Production build and serve (the build refuses to run without `SITE_ENV`):

```bash
cd web
SITE_ENV=preview npm run build
SITE_ENV=preview npm start
```

To share work with a reviewer, push it: the deploy below puts it on a public URL. There is no local
tunnel to start.

## Environment variables

Copy `web/.env.example` to `web/.env.local` and fill in what you need. `.env.local` is git-ignored.

| Variable | Required | Meaning |
| --- | --- | --- |
| `SITE_ENV` | build + start | `preview` (default for reviews) or `production` (approved releases only). |
| `NEXT_PUBLIC_SITE_URL` | build | Public origin used for canonical URLs, sitemap and the enquiry origin allow-list. Defaults to `https://in2itebs.com`. |
| `LEAD_WEBHOOK_URL` | for lead delivery | HTTPS endpoint that durably accepts an enquiry before returning 2xx. Unset: the form answers 503 asking the visitor to email instead, and `/api/health/` reports `leadDeliveryConfigured: false`. |
| `LEAD_WEBHOOK_TOKEN` | for lead delivery | Bearer token sent to the webhook. |
| `ALLOWED_ORIGINS` | optional | Extra browser origins (comma-separated) allowed to submit the enquiry form, e.g. a staging host. |
| `TRUST_PROXY_HEADERS` | optional | `1` only behind an ingress that overwrites `X-Forwarded-*`; leave `0` otherwise (see the comments in `.env.example`). |

Secrets never go in source control. `web/.env.example` is the committed template; `.env.local` is
ignored. In CI the values live in GitHub Actions secrets, and the deploy job uploads the Supabase
pair to Cloudflare as Worker secrets — so each one exists in exactly one place.

## API routes

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/health/` | GET | Liveness for deploy checks. Returns app name, release, `siteEnv`, and whether lead delivery and Supabase are configured. |
| `/api/lead/` | POST | The enquiry form. Validates with `lib/lead-schema.ts`, enforces a browser-origin allow-list and a per-address rate limit, then forwards to the configured webhook (`lib/lead-service.ts`). |
| `/api/gone/` | GET | Serves 410 for retired URLs listed in `content/redirects.mjs`. |

Old-site URLs are redirected by `content/redirects.mjs` (wired through `next.config.mjs`), so
existing inbound links keep working.

## Quality checks

Run from `web/`:

| Command | What it does |
| --- | --- |
| `npm run check` | Prettier, ESLint, TypeScript and the unit tests. |
| `npm test` | Unit tests only (content integrity, metadata, redirects, palette rules). |
| `npm run test:browser` | Playwright specs against the built site on :3107 (`npm run build` first, or let Playwright start it). |
| `npm run check:full` | Everything above plus the production build. |

## Deployment

The site deploys itself. Push to `main`, and once [`ci.yml`](.github/workflows/ci.yml) is green,
[`deploy.yml`](.github/workflows/deploy.yml) builds the Worker and ships it to Cloudflare. A push
whose checks, build or browser tests fail never reaches the live site.

```
push to main -> ci (prettier, eslint, tsc, unit tests, build, Playwright)
             -> deploy (opennextjs-cloudflare build -> wrangler deploy)
             -> live, about 2-4 minutes end to end
```

Nothing is deployed by hand, and no machine has to stay switched on.

### For a teammate

```bash
git clone https://github.com/appdev-in2itebs/IN2ITEBS-New-website.git
cd IN2ITEBS-New-website/web
npm ci
npm run dev                 # http://127.0.0.1:3107
# make the change, then
npm run check               # the same gate CI runs
git commit -am "..." && git push
```

That is the whole workflow. There is no deploy step to remember.

### Configuration

Repository secrets (Settings -> Secrets and variables -> Actions) — `CLOUDFLARE_API_TOKEN`,
`CLOUDFLARE_ACCOUNT_ID`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SUPABASE_PUBLISHABLE_KEY`. The
Supabase pair is pushed to Cloudflare as Worker secrets by the deploy job, so the values live in
exactly one place and never in the repository.

Repository variable `SITE_URL` sets `NEXT_PUBLIC_SITE_URL` at build time; unset, it falls back to
`https://in2itebs.com`. Set it to the Workers URL once the first deploy has printed one.

`SITE_ENV` is `preview` in CI and in the deploy job, which keeps the `noindex` header on. Only an
approved production release sets `production`, and only after `in2itebs.com` is the target.

### Running the Cloudflare build locally

```bash
cd web
npm run cf:build            # build the Worker bundle
npm run cf:preview          # run it locally in workerd
npx wrangler deploy --dry-run   # report the upload size
```

The Worker is currently **~2.3 MB gzipped against Cloudflare's 3 MB free-tier limit**. Check the
dry-run size when adding dependencies; crossing 3 MB means moving to the paid plan (10 MB).

### Local preview

`npm run dev` for day-to-day work, or `SITE_ENV=preview npm run build && SITE_ENV=preview npm start`
to check the production build. Both serve on port 3107 — keep that port for this site on shared
machines; 3000 belongs to another project.

## Brand and content

- Logos and brand SVGs: `web/public/brand/`. Client, partner and certification marks: `web/public/logos/`.
- All copy and structured data are typed modules in `web/content/`; there is no CMS.
- The homepage hero plays WebP frame sequences on a canvas (`web/public/hero-frames/`), regenerated
  with `web/scripts/extract-hero-frames.mjs`.

# In2IT EBS — corporate website

The In2IT EBS website (https://in2itebs.com), rebuilt as a Next.js 15 App Router application with
typed in-repo content, a hardened enquiry API, and a one-click local preview with a public ngrok
link for reviewers.

## Repository layout

```
.
├── README.md                 # this file
├── run.bat                   # Windows: build, serve on :3107 and open a public ngrok link
├── tools/                    # ngrok config template + notes (real token is git-ignored)
│   ├── README.md
│   └── ngrok.example.yml
├── .claude/launch.json       # dev-server entry for the Claude Code browser pane (port 3117)
└── web/                      # the Next.js application (see web/README.md)
    ├── app/                  # routes (App Router), API routes under app/api/
    ├── components/           # layout, sections, ui, media, motion, forms, seo
    ├── content/              # typed content modules: nav, services, clients, offices, …
    ├── lib/                  # metadata, JSON-LD, lead API service, utilities
    ├── public/               # brand SVGs, logos, photos, hero frame sequences, videos
    ├── scripts/              # build check, hero-frame extraction, YouTube feed, world map
    ├── tests/                # unit tests (node:test) and Playwright browser specs
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

On Windows, `run.bat` at the repository root does all of that and then opens a public link through
ngrok. See [tools/README.md](tools/README.md) for the one-time ngrok setup.

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

Secrets never go in source control: not the lead webhook token, not the ngrok authtoken. Templates
(`web/.env.example`, `tools/ngrok.example.yml`) are committed; the real files are ignored.

## API routes

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/health/` | GET | Liveness for run.bat and deploy checks. Returns app name, release, `siteEnv` and whether lead delivery is configured. |
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

## Deployment notes

- The app is a standard Next.js server (`next start`); it prerenders every marketing route and
  runs the API routes on Node.
- Set `SITE_ENV=production` and `NEXT_PUBLIC_SITE_URL` before `next build` for a real release.
- Keep port 3107 for this site on shared machines; 3000 belongs to another project.

## Brand and content

- Logos and brand SVGs: `web/public/brand/`. Client, partner and certification marks: `web/public/logos/`.
- All copy and structured data are typed modules in `web/content/`; there is no CMS.
- The homepage hero plays WebP frame sequences on a canvas (`web/public/hero-frames/`), regenerated
  with `web/scripts/extract-hero-frames.mjs`.

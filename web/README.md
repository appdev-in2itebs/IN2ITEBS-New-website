# web/ — the In2IT EBS site (Next.js 15, App Router)

TypeScript · Tailwind CSS · Framer Motion · typed in-repo content (no CMS). The repository-level
[README](../README.md) covers setup, environment variables, the API routes and deployment.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server with hot reload on http://127.0.0.1:3107 |
| `SITE_ENV=preview npm run build` | Production build (`postbuild` runs `scripts/check-build.mjs`) |
| `SITE_ENV=preview npm start` | Serve the production build on :3107 |
| `npm run check` | Prettier + ESLint + TypeScript + unit tests |
| `npm run test:browser` | Playwright specs (Chrome) against :3107 |
| `npm run format` | Rewrite files with Prettier |

## Where things live

| Folder | Contents |
| --- | --- |
| `app/` | One folder per route. `layout.tsx` mounts the header, footer, splash loader, region provider and the floating scroll-down button. `api/` holds the health, lead and gone endpoints. |
| `components/layout/` | Header with mega-menus and the mobile drawer, footer, page loader, scroll-down button, region preference. |
| `components/sections/` | Page sections: the homepage hero carousel (`brand-hero.tsx` + `hero-chrome.tsx`), services, partners, team, testimonials, office map, case-study grids, page heroes. |
| `components/media/` | `frame-sequence.tsx` draws the hero's WebP frame sequences on a canvas; `ambient-video.tsx` for looping clips. |
| `components/motion/` | Reveal-on-scroll, autoplay and scroll-position hooks; `motion-observer.tsx` owns the global motion flags. |
| `content/` | All copy and data as typed modules: navigation, services, industries, clients, partners, offices, leadership, testimonials, insights, awards, redirects. |
| `lib/` | Page metadata, JSON-LD, the lead form schema and service, utilities. |
| `public/` | `brand/` (logo SVGs), `logos/`, photography by section, `hero-frames/` (five slides × frames), `video/`, `youtube/`. |
| `scripts/` | `extract-hero-frames.mjs` (MP4 → WebP frames via ffmpeg-static), `fetch-youtube.mjs`, `gen-world-map.mjs`, `check-build.mjs`. |
| `tests/` | `*.test.ts` unit tests run by `node:test` via tsx; `browser/*.spec.ts` Playwright specs. |

## Conventions worth knowing

- Colours are semantic tokens (`bg-surface`, `text-on-brand`, `bg-glass`, …). A unit test rejects
  legacy classes such as `text-white` in markup.
- The homepage header stays hidden over the hero until the first scroll; the hero shows its own
  logo and hamburger in the meantime and dispatches an event that opens the header's drawer.
- Every page keeps a floating scroll-down button bottom-right; it hides once the footer is in view.
- Reduced-motion users get static posters instead of frame sequences and no travelling animations.

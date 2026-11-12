// Asserts that the artefacts in .next match SITE_ENV. Runs automatically after `next build` (postbuild).
import { readFileSync, existsSync } from "node:fs";
const env = process.env.SITE_ENV;
if (env !== "production" && env !== "preview") {
  console.error(`check-build: SITE_ENV must be production or preview, got ${JSON.stringify(env)}`);
  process.exit(1);
}
const robotsPath = ".next/server/app/robots.txt.body";
if (!existsSync(robotsPath)) {
  console.error(`check-build: ${robotsPath} not found`);
  process.exit(1);
}
const robots = readFileSync(robotsPath, "utf8");
const manifest = JSON.parse(readFileSync(".next/routes-manifest.json", "utf8"));
const headerValues = (manifest.headers ?? []).flatMap((h) => h.headers.map((x) => `${x.key}: ${x.value}`));
const hasNoindex = headerValues.some((v) => /^x-robots-tag: .*noindex/i.test(v));
// Matches next.config.mjs: GitHub CI preview artefacts stay blocked; the deployed Azure build is
// public even while its legacy shared environment still says SITE_ENV=preview.
const indexingEnabled = env === "production" || process.env.CI !== "true";
const failures = [];
if (indexingEnabled) {
  if (!/Allow: \//.test(robots) || /Disallow: \/\s*$/m.test(robots))
    failures.push("production build has a robots.txt that blocks crawling");
  if (hasNoindex) failures.push("production build still sends X-Robots-Tag noindex");
  if (!/Disallow: \/api\//.test(robots) || !/Disallow: \/thank-you\//.test(robots))
    failures.push("production robots.txt must disallow /api/ and /thank-you/");
  if (/^Host:/m.test(robots)) failures.push("robots.txt must not use the non-standard Host directive");
} else {
  if (!/Disallow: \/\s*$/m.test(robots)) failures.push("preview build must disallow crawling in robots.txt");
  if (!hasNoindex) failures.push("preview build must send X-Robots-Tag noindex");
}
const prerender = JSON.parse(readFileSync(".next/prerender-manifest.json", "utf8"));
const prerenderedPages = Object.keys(prerender.routes).filter(
  (r) => !/\.(xml|txt)$/.test(r) && r !== "/opengraph-image",
);
/**
 * The floor exists to catch a layout accidentally going dynamic (a cookies() or headers() call in
 * a layout silently turns every page server-rendered), not to police the size of the site.
 *
 * Lowered from 60 to 45 on 12 November 2026. The restructure retired fifteen routes and collapsed
 * fourteen industry pages into nine, and the named case studies are prerendered only once client
 * consent is recorded (content/compliance.ts), so a correct build of this site is now 54 pages.
 * Raise it again when the consent gate opens; do not raise it to hide a drop.
 */
const PRERENDER_FLOOR = 45;
if (prerenderedPages.length < PRERENDER_FLOOR)
  failures.push(
    `only ${prerenderedPages.length} pages are prerendered; expected at least ${PRERENDER_FLOOR} (is cookies()/headers() used in a layout?)`,
  );
if (failures.length) {
  for (const f of failures) console.error(`check-build: ${f}`);
  process.exit(1);
}
console.log(`check-build: ok (SITE_ENV=${env}, indexing=${indexingEnabled}, noindex=${hasNoindex})`);

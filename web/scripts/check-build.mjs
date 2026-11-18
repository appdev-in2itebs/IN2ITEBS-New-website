// Asserts that the artefacts in .next match SITE_ENV. Runs automatically after `next build` (postbuild).
import { readFileSync, existsSync } from "node:fs";
import { houseStyleOffenders } from "./house-style.mjs";
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
/**
 * The capability table at /about/where-we-stand/ is the one page on this site whose value is
 * entirely in being current. A stale status table is worse than none: it turns an instrument of
 * honesty into evidence that we do not check our own claims. So staleness fails the build rather
 * than sitting in a backlog.
 *
 * To clear this failure, review the lines against delivery evidence and move `capabilityReviewed`
 * in content/capability-status.ts. Moving the date without doing the review is the one failure
 * mode this cannot catch, and it is a choice somebody has to make deliberately.
 */
const capabilitySource = readFileSync("content/capability-status.ts", "utf8");
const reviewed = capabilitySource.match(/capabilityReviewed = "(\d{4}-\d{2}-\d{2})"/)?.[1];
const maxAge = Number(capabilitySource.match(/CAPABILITY_REVIEW_MAX_AGE_DAYS = (\d+)/)?.[1] ?? 90);
if (!reviewed) {
  failures.push("content/capability-status.ts has no capabilityReviewed date");
} else {
  const ageDays = Math.floor((Date.now() - Date.parse(reviewed)) / 86_400_000);
  if (ageDays > maxAge)
    failures.push(
      `the capability table was last reviewed ${ageDays} days ago (limit ${maxAge}). Review the lines against delivery evidence and update capabilityReviewed, or take /about/where-we-stand/ down.`,
    );
}

/**
 * The same gate on the corporate facts block.
 *
 * Every figure on this site, in a deck and in a bid comes from content/site.ts, which makes it
 * the one file where a stale number does the most damage — it propagates into documents that are
 * already in a client's hands. Six months, then the build stops.
 */
const siteSource = readFileSync("content/site.ts", "utf8");
const statsAt = siteSource.match(/statsReviewed = "(\d{4}-\d{2}-\d{2})"/)?.[1];
const statsMaxAge = Number(siteSource.match(/STATS_REVIEW_MAX_AGE_DAYS = (\d+)/)?.[1] ?? 200);
if (!statsAt) {
  failures.push("content/site.ts has no statsReviewed date");
} else {
  const ageDays = Math.floor((Date.now() - Date.parse(statsAt)) / 86_400_000);
  if (ageDays > statsMaxAge)
    failures.push(
      `the corporate facts in content/site.ts were last checked ${ageDays} days ago (limit ${statsMaxAge}). Check each figure against its source and update statsReviewed.`,
    );
}

/**
 * THE ADJECTIVE GATE. The word list, the exemption and the reasoning live in
 * scripts/house-style.mjs, because the test suite runs the same scan — see
 * tests/house-style.test.ts. One list, two enforcers: a style rule with two
 * definitions is a style rule with none.
 */
const adjectiveHits = houseStyleOffenders("content");
if (adjectiveHits.length)
  failures.push(
    `unfalsifiable adjectives in site copy — say the number, the name or the mechanism instead:\n    ${adjectiveHits.join("\n    ")}`,
  );

if (failures.length) {
  for (const f of failures) console.error(`check-build: ${f}`);
  process.exit(1);
}
console.log(`check-build: ok (SITE_ENV=${env}, indexing=${indexingEnabled}, noindex=${hasNoindex})`);

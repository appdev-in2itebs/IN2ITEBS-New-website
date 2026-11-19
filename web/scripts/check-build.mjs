// Asserts that the artefacts in .next match SITE_ENV. Runs automatically after `next build` (postbuild).
import { readFileSync, existsSync } from "node:fs";
import { houseStyleOffenders } from "./house-style.mjs";
import { figureOffenders, unprovenancedCount } from "./figures.mjs";
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

/**
 * THE FIGURE GATE. No percentage in a case study without its provenance — either a `Metric`, or a
 * named entry in UNPROVENANCED / CLIENT_FACTS. See scripts/figures.mjs for why this is a build
 * failure rather than a guideline: the rule already existed in writing and changed nothing,
 * because a working method is changed by a build that stops, not by a document saying it should.
 */
const figureHits = figureOffenders();
if (figureHits.length)
  failures.push(
    `quantified claims with no recorded provenance — add a Metric (what the number is of, the window, who measured it) or name it in content/evidence.ts:\n    ${figureHits.join("\n    ")}`,
  );

/**
 * THE CREDENTIAL EXPIRY GATE.
 *
 * Every credential this site publishes has a date on which it stops being true, and until now
 * none of those dates was recorded anywhere. A lapsed ISO certificate would have gone on
 * publishing indefinitely, caught — if at all — by the 200-day corporate-facts sweep, months
 * late, by accident.
 *
 * Two different severities, deliberately:
 *   · A MISSING date warns and is counted. Nobody has supplied them yet, and failing the build
 *     over information the team does not hold turns a gate into an obstacle. Same treatment as
 *     an UNPROVENANCED figure.
 *   · A PASSED date FAILS. Publishing a credential that has expired is a different class of
 *     wrong from publishing one nobody has re-checked — it is a false statement about an
 *     external body's assessment, on the page a tender reviewer reads first.
 *   · Thirty days out, it warns, so the renewal is somebody's problem before it is everybody's.
 */
const certBlock = siteSource.slice(siteSource.indexOf("export const certifications"));
const certs = [
  ...certBlock.matchAll(/name:\s*"([^"]+)",[\s\S]{0,200}?validUntil:\s*(?:"(\d{4}-\d{2}-\d{2})"|null)/g),
].map((m) => ({ name: m[1], validUntil: m[2] ?? null }));
const certsMissing = certs.filter((c) => !c.validUntil).map((c) => c.name);
const certsExpired = [];
const certsExpiring = [];
for (const c of certs) {
  if (!c.validUntil) continue;
  const daysLeft = Math.floor((Date.parse(c.validUntil) - Date.now()) / 86_400_000);
  if (daysLeft < 0) certsExpired.push(`${c.name} expired ${-daysLeft} days ago (${c.validUntil})`);
  else if (daysLeft <= 30) certsExpiring.push(`${c.name} expires in ${daysLeft} days (${c.validUntil})`);
}
if (certsExpired.length)
  failures.push(
    `a published credential has expired — renew it, or take it off content/site.ts:\n    ${certsExpired.join("\n    ")}`,
  );

if (failures.length) {
  for (const f of failures) console.error(`check-build: ${f}`);
  process.exit(1);
}
if (certsExpiring.length) for (const c of certsExpiring) console.log(`check-build: RENEWAL DUE — ${c}`);
if (certsMissing.length)
  console.log(
    `check-build: ${certsMissing.length} credential${certsMissing.length === 1 ? " has" : "s have"} no expiry date recorded (${certsMissing.join(", ")}). The site cannot tell whether ${certsMissing.length === 1 ? "it is" : "they are"} still valid.`,
  );
const owed = unprovenancedCount();
if (owed)
  console.log(
    `check-build: ${owed} inherited figure${owed === 1 ? "" : "s"} still unsourced (content/evidence.ts). Each needs a baseline, a window and a measurer, or it comes out of the copy.`,
  );
console.log(`check-build: ok (SITE_ENV=${env}, indexing=${indexingEnabled}, noindex=${hasNoindex})`);

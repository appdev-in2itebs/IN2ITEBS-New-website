import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { redirects, goneSources } from "../content/redirects.mjs";

/**
 * Legacy URLs that must keep resolving, with the page they must land on.
 *
 * Updated 12 November 2026 for the flat service URLs and the nine-industry list. Where a
 * destination changed, it changed because the page it used to point at no longer exists — not
 * because the requirement went away. Entries are never deleted from this list; a URL that once
 * earned a click keeps its destination.
 */
const required: [string, string][] = [
  [
    "/how-rise-with-sap-s-4hana-cloud-can-transform-your-business",
    "/insights/how-rise-with-sap-s-4hana-cloud-can-transform-your-business/",
  ],
  [
    "/revolutionizing-hr-with-sap-successfactors-a-strategic-approach-to-modern-hcm-solutions",
    "/insights/revolutionizing-hr-with-sap-successfactors-a-strategic-approach-to-modern-hcm-solutions/",
  ],
  [
    "/igniting-organizational-potential-sap-successfactors-ai-innovations-revealed-at-sap-successconnect-las-vegas",
    "/insights/igniting-organizational-potential-sap-successfactors-ai-innovations-revealed-at-sap-successconnect-las-vegas/",
  ],
  // The two SAP paths got their own ported pages on 2026-09-17; the legacy URLs follow the page
  // that is actually about them, not the one comparing them.
  ["/grow-with-sap", "/insights/grow-with-sap/"],
  ["/sap-grow-fast", "/services/grow-fast/"],
  ["/sap-rise-with-sap", "/services/rise-s4hana/"],
  ["/other-enterprise-solutions", "/services/enterprise-platforms/"],
  ["/grow-with-sap-leadership-forum-event", "/services/rise-s4hana/"],
  ["/in2it-ebs-simplify-hiring", "/insights/in2it-ebs-simplify-hiring/"],
  ["/in2it-ebs-simplify-talent-2", "/insights/in2it-ebs-simplify-talent-2/"],
  ["/sap-successfactors-partner-in-india", "/services/successfactors/"],
  ["/sap-success-factors-in-bangalore", "/services/successfactors/"],
  ["/sap-successfactors-partner-in-mumbai", "/services/successfactors/"],
  ["/sap-successfactors-partner-in-chennai", "/services/successfactors/"],
  ["/sap-successfactors-partner-in-delhi", "/services/successfactors/"],
  ["/sap-successfactors-partner-in-kolkata", "/services/successfactors/"],
  ["/sap-success-factors-in-hyderabad", "/services/successfactors/"],
  ["/sap-success-factors-in-bhubaneswar", "/services/successfactors/"],
  ["/unlock-the-power-of-hr-technology-transformation", "/services/successfactors/"],
  ["/unlock-the-power-of-hr-technology-transformation-register-now", "/services/successfactors/"],
  ["/unlock-the-power-of-hr-technology-transformation-register-now1", "/services/successfactors/"],
  ["/join-our-team", "/careers/current-openings/"],
  ["/apply-now", "/careers/current-openings/"],
  ["/our-culture", "/careers/our-culture/"],
  ["/sap-and-success-factor-consultant", "/careers/current-openings/"],
  ["/events-celebrations-3", "/careers/events-celebrations/"],
  ["/faq", "/contact/"],
  ["/dharmendra-sharma", "/about/our-leadership/"],
  ["/anil-kumar-soleti", "/about/our-leadership/"],
  ["/rajat-kapoor", "/about/our-leadership/"],
  ["/news/page/2", "/insights/"],
  ["/global-webinar", "/insights/"],
];
const gone = [
  "/attract-and-retain-quality-high-paying-customers",
  "/coronavirus-lockdown-leads-to-more-gaming-and-e-sports",
  "/future-where-technology-creates-good-jobs",
  "/live-stream-from-awwwards-showcasing-trends",
  "/solutions-for-all-small-and-large-business",
  "/what-you-do-today-improve-your-tomorrows",
  "/case",
  "/case/:path*",
  "/event",
  "/event/:path*",
];

test("every required legacy URL redirects to its new home", () => {
  const map = new Map(redirects.map((r) => [r.source, r.destination]));
  for (const [source, destination] of required) assert.equal(map.get(source), destination, source);
});
test("redirect destinations resolve to a route directory", () => {
  for (const r of redirects) {
    const target = r.destination.replace(/#.*$/, "");
    assert.ok(target.endsWith("/"), `${r.destination} needs a trailing slash`);
    const dir = path.join(process.cwd(), "app", target);
    const dynamicParent = path.join(process.cwd(), "app", target.split("/").slice(0, -2).join("/"), "[slug]");
    assert.ok(
      existsSync(path.join(dir, "page.tsx")) || existsSync(dynamicParent),
      `${r.source} -> ${r.destination} has no page`,
    );
  }
  const sources = new Set(redirects.map((r) => r.source));
  for (const r of redirects)
    assert.ok(!sources.has(r.destination.replace(/\/$/, "")), `${r.source} chains into another redirect`);
});
test("theme-demo URLs are listed as gone, not redirected", () => {
  for (const g of gone) assert.ok(goneSources.includes(g), g);
  const sources = new Set(redirects.map((r) => r.source));
  for (const g of goneSources) assert.ok(!sources.has(g), `${g} is both gone and redirected`);
});

/**
 * A redirect is a safety net for links we do not control — not a way of linking inside our own
 * site. The November 2026 restructure deleted sixteen route folders, and the pages that linked to
 * them kept working only because the redirect map caught them. That is invisible rot: the link
 * still resolves, so nobody notices until the redirect is retired.
 *
 * These two tests make it visible. If one fails, fix the link, not the test.
 */
const INTERNAL_PATH = /["'`]((?:\/(?!\/)[a-z0-9-]+)+\/?)["'`]/g;
/** Paths that are not pages: API routes, static assets and the file-system route segments. */
const NOT_A_PAGE =
  /^\/(api|_next|admin|logos|brand|heroes|images|img|video|videos|diagrams|fonts|icons|photos|hero|rest|auth|storage|speech-to-text|text-to-speech|translate|path|404|opengraph-image)\b/;
/** Dynamic routes, which have no literal path to compare against. */
const DYNAMIC = [
  /^\/insights\/[^/]+\/$/,
  /^\/case-studies\/[^/]+\/$/,
  /^\/industries\/[^/]+\/$/,
  /^\/services\/[^/]+\/$/,
  /^\/careers\/(current-openings|apply)\/[^/]+\/$/,
];

const sourceSet = new Set(redirects.map((r) => r.source.replace(/\/?$/, "/")));

test("no page links to a URL that only redirects", () => {
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(tsx?|mjs)$/.test(entry) || full.includes("redirects.mjs")) continue;
      const source = readFileSync(full, "utf8");
      for (const m of source.matchAll(INTERNAL_PATH)) {
        const p = m[1].endsWith("/") ? m[1] : `${m[1]}/`;
        if (NOT_A_PAGE.test(p) || DYNAMIC.some((r) => r.test(p))) continue;
        if (sourceSet.has(p)) offenders.push(`${path.relative(process.cwd(), full)}: ${p}`);
      }
    }
  };
  for (const dir of ["app", "components", "content", "lib"]) walk(path.join(process.cwd(), dir));
  assert.deepEqual([...new Set(offenders)], []);
});

test("the sitemap lists no URL that redirects", async () => {
  const { default: sitemap } = await import("../app/sitemap");
  const listed = (await sitemap()).map((e) => new URL(e.url).pathname);
  assert.deepEqual(
    listed.filter((p) => sourceSet.has(p)),
    [],
  );
});

/**
 * Every page has exactly one accountable role.
 *
 * The November 2026 audit found someone else's vision statement on the About page, withdrawn ISO
 * standards on the certification page and two main navigation items returning 404. None of that
 * was a bad decision; it was nobody being answerable for noticing. This test is the friction that
 * stops a page shipping without an owner — about thirty seconds, once.
 */
test("every page in the sitemap has an accountable owner", async () => {
  const { default: sitemap } = await import("../app/sitemap");
  const { ownerOf } = await import("../content/page-owners");
  const unowned = (await sitemap()).map((e) => new URL(e.url).pathname).filter((p) => !ownerOf(p));
  assert.deepEqual(unowned, []);
});

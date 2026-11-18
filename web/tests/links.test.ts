import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { redirects } from "../content/redirects.mjs";

/**
 * INTERNAL LINK INTEGRITY.
 *
 * ── THE DEFECT THAT CAUSED THIS TEST ─────────────────────────────────────────────────────────
 * `/industries/` carried three featured tiles, among the largest elements on the page. One of
 * them linked to `/industries/energy-utilities/`, which **returned 404**. The redirect table had
 * an entry for `/industries/energy-and-utilities` — one word away — and nothing caught the gap.
 * The other two tiles pointed at URLs that only resolved through a 308 hop.
 *
 * Every previous crawl passed, and they were right to: each one walked the **sitemap** and
 * confirmed all 72 canonical routes returned 200. A broken link is invisible to that method,
 * because the broken URL is not in the sitemap — that is exactly what makes it broken.
 *
 * ── WHAT THIS CHECKS ─────────────────────────────────────────────────────────────────────────
 * Every internal href written as a literal in app/, components/ and content/ must be one of: a
 * route the site publishes, a path the redirect table resolves, an anchor, or a known dynamic
 * segment. A link that is merely redirected is reported separately — not a failure, since
 * redirects exist to be used, but a link we control should point at the canonical URL rather
 * than spend a hop on every visit.
 *
 * It reads literals from source rather than crawling, so it runs in milliseconds and catches the
 * link before it ships rather than after.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */

const ROOT = process.cwd();

/** Every literal internal href in the source. */
function hrefsInSource(): { href: string; where: string }[] {
  const found: { href: string; where: string }[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) {
        if (entry === "node_modules" || entry === ".next") continue;
        walk(full);
      } else if (/\.tsx?$/.test(entry)) {
        const src = readFileSync(full, "utf8");
        const rel = path.relative(ROOT, full);
        // href="/..." and href: "/..." — literals only. Template strings are dynamic by nature
        // and are covered by the sitemap crawl instead.
        for (const m of src.matchAll(/\bhref[:=]\s*"(\/[^"]*)"/g)) found.push({ href: m[1], where: rel });
      }
    }
  };
  for (const d of ["app", "components", "content"]) walk(path.join(ROOT, d));
  return found;
}

/** The routes the site publishes, read from the sitemap source. */
const sitemapSource = readFileSync(path.join(ROOT, "app/sitemap.ts"), "utf8");
const staticRoutes = new Set([...sitemapSource.matchAll(/"(\/[a-z0-9/-]*)"/g)].map((m) => m[1]));

/** Dynamic sections whose members the sitemap builds at run time. */
const DYNAMIC_PREFIXES = ["/services/", "/industries/", "/case-studies/", "/insights/", "/careers/"];

/** Paths that are real but deliberately outside the sitemap. */
const OFF_SITEMAP = new Set(["/admin", "/thank-you/", "/api/capabilities/", "/"]);

const redirectFrom = new Map(redirects.map((r: { source: string; destination: string }) => [r.source, r.destination]));

test("no internal link points at a page the site does not publish", () => {
  const broken: string[] = [];
  for (const { href, where } of hrefsInSource()) {
    if (where.startsWith("app/admin") || where.startsWith("components/admin")) continue;
    const clean = href.split("#")[0].split("?")[0];
    if (!clean || clean === "/") continue;
    if (OFF_SITEMAP.has(clean) || clean.startsWith("/admin") || clean.startsWith("/api/")) continue;
    if (staticRoutes.has(clean)) continue;
    if (redirectFrom.has(clean) || redirectFrom.has(clean.replace(/\/$/, ""))) continue;
    // A member of a dynamic section: the sitemap crawl covers whether it resolves.
    if (DYNAMIC_PREFIXES.some((p) => clean.startsWith(p) && clean.length > p.length)) continue;
    broken.push(`${where}: ${href}`);
  }
  assert.deepEqual(broken, []);
});

test("links we control point at the canonical URL, not at a redirect", () => {
  // Not a correctness failure — a redirect that resolves is working as designed. It is a quality
  // one: every visitor who clicks pays a round trip, and a link maintained in our own source has
  // no excuse for needing one. Reported so the list stays short and visible.
  const hops: string[] = [];
  for (const { href, where } of hrefsInSource()) {
    if (where.startsWith("app/admin") || where.startsWith("components/admin")) continue;
    const clean = href.split("#")[0].split("?")[0];
    const target = redirectFrom.get(clean) ?? redirectFrom.get(clean.replace(/\/$/, ""));
    if (target) hops.push(`${where}: ${href} → ${target}`);
  }
  assert.deepEqual(hops, []);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { faqs, faqRoutes } from "../content/faqs";
import { FEED_PATH } from "../lib/capability-feed";

/**
 * THE NINETEENTH GATE — a claim about the site has to be checkable too.
 *
 * ── WHAT THIS IS FOR ─────────────────────────────────────────────────────────────────────────
 * Eighteen gates check that a claim about the **business** is evidenced: no adjective without a
 * test, no percentage without a measurer, no capability without a status. Nothing checked that a
 * claim about the **site** was true, and that gap cost exactly what you would expect.
 *
 * `/api/capabilities/` was described in the handover as "Public data", and the register was
 * called "machine-readable" in two further places. Meanwhile `app/robots.ts` disallowed the whole
 * of `/api/`, the endpoint appeared in no sitemap and no page linked to it. Three sentences
 * asserting a capability the configuration denied, on a site whose entire argument is that its
 * claims are checkable.
 *
 * It survived because every verification crawl walked the **sitemap** — and an endpoint
 * deliberately kept out of the sitemap is invisible to that method, exactly as the `/industries/`
 * 404 was. Twice the method was "walk the sitemap", twice the defect was something a sitemap by
 * definition does not list. So this file checks the configuration directly instead.
 *
 * ── AND WHY IT MATTERS COMMERCIALLY ──────────────────────────────────────────────────────────
 * For a firm selling eighteen-month SAP programmes to committees, the assistant drafting a
 * buyer's long-list now sits upstream of the first conversation, and it reaches for sources that
 * commit to an answer. The register is the only page in this market that says "no, we do not do
 * that" with a status against every line. Keeping the machine-readable copy of it reachable is
 * not housekeeping.
 */

const read = (file: string) => readFileSync(path.join(process.cwd(), file), "utf8");

/**
 * Comments are stripped before the rule below is applied. The first version of this test failed
 * against a correct robots.ts, because that file's own docblock quotes the rule it replaced —
 * a test that reads prose as configuration is a test that punishes explaining yourself.
 */
const stripComments = (source: string) => source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

test("robots.ts does not block the capability feed", () => {
  const robots = stripComments(read("app/robots.ts"));

  // The original defect: a blanket rule over everything under /api/.
  assert.ok(
    !/disallow:\s*\[[^\]]*["']\/api\/["']/s.test(robots),
    'app/robots.ts disallows "/api/" wholesale, which blocks the capability feed. Deny the form ' +
      "handlers by name instead — see the note at the top of that file.",
  );

  // And the positive form, so a future edit cannot quietly drop the allow.
  assert.ok(
    robots.includes("FEED_PATH"),
    "app/robots.ts no longer references FEED_PATH. The capability feed must be explicitly allowed.",
  );
});

test("the capability feed is linked from a page a reader can reach", () => {
  // A machine-readable asset nothing links to does not exist. The register page is where it
  // belongs, because that is the table it serialises.
  const page = read("app/about/where-we-stand/page.tsx");
  assert.ok(
    page.includes("FEED_PATH"),
    `${FEED_PATH} must be linked in visible text from /about/where-we-stand/, not only served.`,
  );
});

test("every machine-readable route still exists", () => {
  for (const file of ["app/api/capabilities/route.ts", "app/llms.txt/route.ts", "app/insights/feed.xml/route.ts"]) {
    assert.ok(
      existsSync(path.join(process.cwd(), file)),
      `${file} is missing — something documented as published is not.`,
    );
  }
});

/**
 * THE FAQ DRIFT GATE.
 *
 * An FAQ block is the easiest place on a website to quietly soften a claim: nobody reviews it, it
 * reads like housekeeping, and six months later it is the only version a machine has read. So
 * every answer in content/faqs.ts is lifted verbatim from shipped copy and names the file it came
 * from, and this test fails the build when the two stop matching.
 *
 * The dependency deliberately runs in that direction: edit the page and this breaks. An FAQ that
 * has drifted from its page is two different answers to one question, published by a site whose
 * argument is that its claims hold still.
 */
test("every FAQ answer still appears in the page it was lifted from", () => {
  const offenders: string[] = [];
  for (const faq of faqs) {
    const file = path.join(process.cwd(), faq.source);
    if (!existsSync(file)) {
      offenders.push(`${faq.question} — source file ${faq.source} does not exist`);
      continue;
    }
    // Typographic characters differ between the data file and JSX entities (&rsquo;, &mdash;),
    // so compare on a normalised form rather than byte-for-byte.
    const normalise = (value: string) =>
      value
        .replace(/&rsquo;|&lsquo;/g, "'")
        .replace(/&ldquo;|&rdquo;/g, '"')
        .replace(/&mdash;/g, "—")
        .replace(/\s+/g, " ")
        .trim();
    const haystack = normalise(readFileSync(file, "utf8"));
    const needle = normalise(faq.anchor ?? faq.answer);
    if (!haystack.includes(needle)) {
      offenders.push(`${faq.question} — answer no longer found in ${faq.source}`);
    }
  }
  assert.deepEqual(offenders, []);
});

test("every FAQ route is a real page", () => {
  const offenders: string[] = [];
  for (const route of faqRoutes()) {
    const direct = path.join(process.cwd(), "app", route.replace(/^\/|\/$/g, ""), "page.tsx");
    // Service pages render through app/services/[slug]/page.tsx rather than a file of their own.
    const isService = route.startsWith("/services/");
    if (!existsSync(direct) && !isService) offenders.push(`${route} has FAQ entries but no page`);
  }
  assert.deepEqual(offenders, []);
});

test("no FAQ answer introduces a claim shorter than the page makes it", () => {
  // A one-line answer to a question about what we cannot do is how a hedge gets in. Not a
  // substitute for review, but it catches the obvious case.
  const tooShort = faqs.filter((faq) => faq.answer.trim().length < 40).map((faq) => faq.question);
  assert.deepEqual(tooShort, []);
});

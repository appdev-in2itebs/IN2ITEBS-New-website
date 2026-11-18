import { test } from "node:test";
import assert from "node:assert/strict";
import { writeFileSync, unlinkSync, mkdirSync, rmSync } from "node:fs";
import { BANNED, EXEMPT, houseStyleOffenders } from "../scripts/house-style.mjs";
import { corrections, publicCorrections, reducedCount, correctionsReviewed } from "../content/corrections";
import { capabilities, capabilityExpires, capabilityReviewed, longDate } from "../content/capability-status";
import { capabilityFeed, capabilityJsonLd, FEED_VERSION } from "../lib/capability-feed";
import { servicePages } from "../content/legacy-services";

/**
 * The house style, the corrections log and the capability feed — the three mechanisms added on
 * 18 November 2026 whose whole value is that somebody cannot quietly switch them off.
 *
 * Each one is a claim the site makes about its own honesty. A claim about honesty that nothing
 * verifies is the most expensive kind of claim to be caught making, so each gets a test that
 * fails loudly rather than a comment asking people to be careful.
 */

// ─────────────────────────────────────────────────────────────────── house style

test("no unfalsifiable adjectives in shipped copy", () => {
  assert.deepEqual(houseStyleOffenders("content"), []);
});

test("the adjective gate actually fires, and ignores comments", () => {
  // Proving the gate works matters more than the list being empty: an empty result from a broken
  // scanner looks exactly like an empty result from clean copy.
  const dir = "content/__house_style_probe__";
  mkdirSync(dir, { recursive: true });
  const file = `${dir}/probe.ts`;
  writeFileSync(
    file,
    ["// a comment saying world-class must not trip it", 'export const a = "our world-class delivery";'].join("\n"),
  );
  try {
    const hits = houseStyleOffenders("content");
    assert.equal(hits.length, 1, `expected exactly one hit, got ${JSON.stringify(hits)}`);
    assert.match(hits[0], /probe\.ts:2 "world-class"/);
  } finally {
    unlinkSync(file);
    rmSync(dir, { recursive: true, force: true });
  }
});

test("every banned word is a valid regex, and the exemption list stays short", () => {
  for (const w of BANNED) assert.doesNotThrow(() => new RegExp(w, "i"), `${w} is not a valid pattern`);
  // An exemption list that grows is the gate being negotiated with rather than fixed.
  assert.ok(EXEMPT.size <= 2, `${EXEMPT.size} files are exempt from the house style; justify each one`);
});

// ───────────────────────────────────────────────────────────────── corrections

test("the corrections log keeps its curation rule", () => {
  assert.ok(publicCorrections.length > 0, "the page renders nothing without entries");
  // The rule that makes the page worth reading: entries have to have cost something. A log that
  // drifts to all-typos is a firm performing humility while conceding nothing.
  assert.ok(reducedCount > 0, "no correction on the log reduced a claim — this is a changelog, not an errata page");
  assert.ok(
    reducedCount / publicCorrections.length >= 0.3,
    `only ${reducedCount} of ${publicCorrections.length} corrections reduced a claim; the log is drifting towards typos`,
  );
});

test("every correction is dated, sourced, and says what we published", () => {
  for (const c of corrections) {
    assert.match(c.date, /^\d{4}-\d{2}-\d{2}$/, `${c.heading}: bad date`);
    assert.ok(Date.parse(c.date), `${c.heading}: unparseable date`);
    assert.ok(c.source.trim().length, `${c.heading}: no commit cited, so nobody can check it`);
    for (const field of ["published", "correct", "action"] as const) {
      assert.ok(c[field].trim().length > 20, `${c.heading}: ${field} is too short to be a real account`);
    }
  }
  assert.ok(Date.parse(correctionsReviewed), "correctionsReviewed is not a date");
});

// ─────────────────────────────────────────────────────────── the capability feed

test("the JSON feed and the JSON-LD are built from the same register", () => {
  const feed = capabilityFeed();
  const ld = capabilityJsonLd() as { itemListElement: unknown[]; numberOfItems: number };
  assert.equal(feed.version, FEED_VERSION);
  assert.equal(feed.register.capabilities.length, capabilities.length);
  assert.equal(ld.numberOfItems, capabilities.length);
  assert.equal(ld.itemListElement.length, capabilities.length);
});

test("the feed publishes a review date and an expiry that follows from it", () => {
  const feed = capabilityFeed();
  assert.equal(feed.register.reviewed, capabilityReviewed);
  assert.equal(feed.register.expires, capabilityExpires);
  assert.ok(
    Date.parse(feed.register.expires) > Date.parse(feed.register.reviewed),
    "a register that expires before it was reviewed is a broken clock",
  );
  // The corrections log rides along in the feed, which is the part nobody will copy.
  assert.equal(feed.corrections.count, publicCorrections.length);
});

test("the feed is JSON-serialisable with no undefined holes", () => {
  // `undefined` silently disappears through JSON.stringify, so a consumer would see a field vanish
  // rather than see null. Every optional in the serialiser is written as `?? null` for this reason.
  const round = JSON.parse(JSON.stringify(capabilityFeed()));
  for (const p of round.sapQualifiedPackages.packages) assert.ok("live" in p, "a package lost its `live` key");
  for (const e of round.corrections.entries) assert.ok("where" in e, "a correction lost its `where` key");
});

test("the staleness clock is published as fixed dates, not a countdown", () => {
  // A build-time "checked 12 days ago" on a statically generated page goes on saying twelve
  // forever. Both dates must survive a round trip through the formatter unchanged in meaning.
  assert.match(longDate(capabilityReviewed), /\d{1,2} \w+ \d{4}/);
  assert.match(longDate(capabilityExpires), /\d{1,2} \w+ \d{4}/);
});

// ───────────────────────────────────────────────────────────── the position slab

test("every service page with a closing block has a position worth promoting", () => {
  // closing[0] now renders as the navy slab third on the page, not as a footnote at the bottom.
  // A one-line closing is fine; an empty or stub one would put a blank band on the page.
  for (const page of servicePages) {
    if (!page.closing?.length) continue;
    const position = page.closing[0];
    assert.ok(
      position.trim().length > 40,
      `/services/${page.slug}/: closing[0] is "${position}" — too short to carry the position slab`,
    );
  }
});

test("blueprint layout is only used where the sections are a sequence", () => {
  const blueprint = servicePages.filter((p) => p.layout === "blueprint");
  assert.ok(blueprint.length > 0, "the blueprint pattern is declared but never used");
  for (const p of blueprint) {
    assert.ok(
      p.sections.length >= 3,
      `/services/${p.slug}/: a numbered sequence of ${p.sections.length} is a list, not a blueprint`,
    );
  }
});

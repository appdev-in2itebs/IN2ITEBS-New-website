import { test } from "node:test";
import assert from "node:assert/strict";
import { writeFileSync, unlinkSync, mkdirSync, rmSync } from "node:fs";
import { BANNED, EXEMPT, houseStyleOffenders } from "../scripts/house-style.mjs";
import { capabilities, capabilityExpires, capabilityReviewed, longDate } from "../content/capability-status";
import { capabilityFeed, capabilityJsonLd, FEED_VERSION } from "../lib/capability-feed";
import { figureOffenders } from "../scripts/figures.mjs";
import { servicePages } from "../content/legacy-services";
import { caseStudies } from "../content/case-studies";
import { ATTRIBUTION_LABELS, CLIENT_FACTS, UNPROVENANCED } from "../content/evidence";

/**
 * The house style, the capability feed and the figure gate — the mechanisms added on 18 November
 * 2026 whose whole value is that somebody cannot quietly switch them off.
 *
 * Each one is a claim the site makes about its own rigour. A claim about rigour that nothing
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
});

test("the feed is JSON-serialisable with no undefined holes", () => {
  // `undefined` silently disappears through JSON.stringify, so a consumer would see a field vanish
  // rather than see null. Every optional in the serialiser is written as `?? null` for this reason.
  const round = JSON.parse(JSON.stringify(capabilityFeed()));
  for (const p of round.sapQualifiedPackages.packages) assert.ok("live" in p, "a package lost its `live` key");
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

// ───────────────────────────────────────────────────────────── outcome figures

test("no quantified claim in a case study without recorded provenance", () => {
  assert.deepEqual(figureOffenders(), []);
});

test("the figure gate fires on a new unsourced percentage", () => {
  // As with the adjective gate: an empty result from a broken scanner looks exactly like an empty
  // result from clean copy, so the scanner has to be shown catching something.
  const probe = "tests/__figure_probe__.ts";
  writeFileSync(probe, ['export const x = {', '  differentiator: "Delivered a 47% improvement in throughput.",', "};"].join("\n"));
  try {
    const hits = figureOffenders(probe, "content/evidence.ts");
    assert.equal(hits.length, 1, `expected one hit, got ${JSON.stringify(hits)}`);
    assert.match(hits[0], /"47%"/);
  } finally {
    unlinkSync(probe);
  }
});

test("every published metric carries what it is a number of, a window and a measurer", () => {
  const withMetrics = caseStudies.filter((c) => c.metrics?.length);
  assert.ok(withMetrics.length > 0, "the metric mechanism is built but no study uses it");
  for (const study of withMetrics) {
    for (const m of study.metrics ?? []) {
      // The type enforces presence; this enforces that nobody satisfied it with a placeholder.
      assert.ok(m.of.trim().length > 15, `${study.slug}: "${m.value}" does not say what it is a number of`);
      assert.ok(m.window.trim().length > 10, `${study.slug}: "${m.value}" has no usable measurement window`);
      assert.ok(m.attribution in ATTRIBUTION_LABELS, `${study.slug}: "${m.value}" has an unknown attribution`);
      assert.doesNotMatch(m.of, /^\s*(the|a|an)?\s*(result|outcome|improvement)s?\s*$/i, `${study.slug}: circular baseline`);
    }
  }
});

test("the unsourced-figure list is specific enough to be closed", () => {
  // A migration list only shrinks if each line says what is actually needed to clear it.
  for (const u of UNPROVENANCED) {
    assert.ok(u.needs.includes("?"), `"${u.figure}" (${u.study}) does not pose the question that would clear it`);
    assert.ok(u.study.trim().length > 5, `"${u.figure}" does not say which claim it is`);
  }
  for (const f of CLIENT_FACTS) {
    assert.ok(f.about.trim().length > 20, `"${f.figure}" does not say whose fact it is`);
  }
  // If this ever reaches zero the migration is done and the list should go, not grow.
  assert.ok(UNPROVENANCED.length <= 5, `${UNPROVENANCED.length} unsourced figures — the list is meant to shrink`);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { writeFileSync, unlinkSync, mkdirSync, rmSync, readFileSync } from "node:fs";
import { BANNED, EXEMPT, houseStyleOffenders } from "../scripts/house-style.mjs";
import {
  capabilities,
  capabilityExpires,
  capabilityReviewed,
  longDate,
  platformsWeDoNotImplement,
} from "../content/capability-status";
import { capabilityFeed, capabilityJsonLd, FEED_VERSION } from "../lib/capability-feed";
import { figureOffenders } from "../scripts/figures.mjs";
import { servicePages, serviceGroups } from "../content/legacy-services";
import { caseStudies } from "../content/case-studies";
import { ATTRIBUTION_LABELS, CLIENT_FACTS, UNPROVENANCED } from "../content/evidence";
import { deliveryCentres, legalEntities } from "../content/site";

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
  writeFileSync(
    probe,
    ["export const x = {", '  differentiator: "Delivered a 47% improvement in throughput.",', "};"].join("\n"),
  );
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
      assert.doesNotMatch(
        m.of,
        /^\s*(the|a|an)?\s*(result|outcome|improvement)s?\s*$/i,
        `${study.slug}: circular baseline`,
      );
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

/**
 * THE CAPABILITY-CLAIM GATE, tested rather than trusted.
 *
 * The gate itself lives in scripts/check-build.mjs and runs after every build. This test runs in
 * the check job, minutes earlier, and — more to the point — proves the gate catches the defect it
 * was written for. The November review's single recurring finding was six defects that shipped
 * because a check existed and nobody exercised it. A gate added in response to that finding, and
 * then not exercised, would be the finding happening again.
 */
test("no copy claims we deliver a platform the register marks ahead of us", () => {
  assert.ok(platformsWeDoNotImplement.length > 0, "the vendor list is empty — the claim gate is blind");
  const ahead = capabilities.filter((c) => c.status === "ahead");
  assert.ok(
    ahead.some((c) => platformsWeDoNotImplement.every((v) => !v.includes(" ") || c.capability.includes(v))),
    "platformsWeDoNotImplement has drifted away from the register's own 'Ahead of us' lines",
  );

  const DELIVERY =
    /practices?\b|we implement|we deliver|we run\b|implement and customise|plan, implement|transform and run/i;
  const EXONERATING =
    /no designation|do not implement|ahead of us|are not on this list|which is which|Microsoft Azure|Microsoft 365/i;
  const scan = (label: string, text: string) => {
    for (const line of text.split("\n")) {
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) continue;
      if (EXONERATING.test(line) || !DELIVERY.test(line)) continue;
      for (const vendor of platformsWeDoNotImplement) {
        assert.ok(
          !new RegExp(`\\b${vendor}\\b`).test(line),
          `${label} claims we deliver ${vendor}: ${line.trim().slice(0, 120)}`,
        );
      }
    }
  };

  // The copy that actually ships, read the way the gate reads it.
  scan("content/home-hero.ts", readFileSync("content/home-hero.ts", "utf8"));
  scan("content/services.ts", readFileSync("content/services.ts", "utf8"));
  scan("components/sections/pillars.tsx", readFileSync("components/sections/pillars.tsx", "utf8"));

  // And the gate's own teeth: the sentence that was live on 19 November must not pass.
  assert.throws(
    () =>
      scan(
        "regression",
        '  body: "Explore SuccessFactors, Workday, Salesforce, Oracle and Microsoft practices for your teams.",',
      ),
    /claims we deliver Oracle/,
    "the claim gate no longer catches the sentence it was written for",
  );
});

/**
 * SPELLED-OUT COUNTS IN HEADINGS MUST MATCH WHAT THEY COUNT.
 *
 * `/services/` carried `heading="Eight groups, one partner."` directly above a grid rendering
 * `serviceGroups`, which the restructure reduced to three. A reader was told eight and could
 * count three, on the page whose job is to say what we do. It was right when the catalogue had
 * eight groups and forty-six services; nothing made it wrong when that changed.
 *
 * This is a defect class rather than a typo — a hardcoded word beside a data-driven list — and it
 * is invisible to every other gate here: it is not an adjective, not a percentage, not a date.
 * Found on 19 November 2026 by extracting every spelled-out number in the content compendium and
 * checking each against the data behind it, which is the fourth time that method has caught
 * something twenty-two build gates could not.
 *
 * The check is explicit rather than clever. A regex that paired any number-word with any nearby
 * list would have to understand page structure to be right, and a gate that is sometimes right is
 * worse than a short list somebody has to extend. Adding a counted heading means adding a line
 * here, and that is the intended cost.
 */
test("every counted heading matches the list it counts", () => {
  const WORDS: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
    nineteen: 19,
  };

  const counted: { file: string; phrase: RegExp; actual: number; what: string; derivedFrom?: string }[] = [
    {
      file: "app/services/page.tsx",
      phrase: /(\w+) groups, one partner/i,
      actual: serviceGroups.length,
      what: "service group cards",
      // Preferred state: the heading counts the array, so there is no word to go stale.
      derivedFrom: "countWord(serviceGroups.length)",
    },
    {
      file: "app/about/markets/page.tsx",
      phrase: /(\w+) entities, four delivery centres/i,
      actual: legalEntities.length,
      what: "legal entities",
    },
    {
      file: "app/about/markets/page.tsx",
      phrase: /entities, (\w+) delivery centres/i,
      actual: deliveryCentres.length,
      what: "delivery centres",
    },
  ];

  for (const c of counted) {
    // Comments quote the old wording to explain the fix; a comment is not a heading.
    const source = readFileSync(c.file, "utf8")
      .split("\n")
      .filter((line) => !/^\s*(\/\/|\*|\/\*)/.test(line))
      .join("\n");
    const m = source.match(c.phrase);
    if (!m) {
      // A heading that counts its own array is the fix this gate exists to push people towards,
      // so finding one instead of a literal is a pass — as long as it counts the right array.
      assert.ok(
        c.derivedFrom && source.includes(c.derivedFrom),
        `${c.file}: the counted heading matching ${c.phrase} is gone and nothing derives it from ${c.what} — update this test or the page`,
      );
      continue;
    }
    const word = m[1].toLowerCase();
    // A heading that derives its own number has nothing to drift; that is the preferred fix.
    if (!(word in WORDS)) continue;
    assert.equal(
      WORDS[word],
      c.actual,
      `${c.file} says "${m[0]}" but there are ${c.actual} ${c.what}. Derive the number from the data rather than correcting the word.`,
    );
  }
});

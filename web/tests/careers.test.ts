import { test } from "node:test";
import assert from "node:assert/strict";
import { daysSince, lines, paragraphs, places, postedLabel, skillList } from "../lib/careers";

test("each line becomes one bullet, without the bullets people type", () => {
  assert.deepEqual(lines("- Build ABAP reports\n• Tune performance\n\n1. Support go-live\r\n"), [
    "Build ABAP reports",
    "Tune performance",
    "Support go-live",
  ]);
  assert.deepEqual(lines(null), []);
});

test("skills split on commas, semicolons and lines, once each", () => {
  assert.deepEqual(skillList("ABAP, OData; CDS Views\nabap\n- BAPI"), ["ABAP", "OData", "CDS Views", "BAPI"]);
});

test("paragraphs split on blank lines", () => {
  assert.deepEqual(paragraphs("One.\n\nTwo\nlines."), ["One.", "Two\nlines."]);
});

test("days since posting and its label", () => {
  const now = Date.parse("2026-10-06T12:00:00Z");
  assert.equal(daysSince("2026-10-06T01:00:00Z", now), 0);
  assert.equal(daysSince("2026-09-26T12:00:00Z", now), 10);
  assert.equal(daysSince("not a date", now), 0);
  assert.equal(postedLabel(0), "Posted today");
  assert.equal(postedLabel(1), "Posted yesterday");
  assert.equal(postedLabel(279), "Posted 279 days ago");
});

test("locations split into places for the filter", () => {
  assert.deepEqual(places("Bangalore, Bhubaneshwar and Chennai"), ["Bangalore", "Bhubaneshwar", "Chennai"]);
  assert.deepEqual(places("Bhubaneshwar - Mumbai - Bangalore"), ["Bhubaneshwar", "Mumbai", "Bangalore"]);
  assert.deepEqual(places("Bangalore, Chennai, + 4 more"), ["Bangalore", "Chennai"]);
});

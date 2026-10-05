import { test } from "node:test";
import assert from "node:assert/strict";
import {
  BLOCKS,
  HOME_SECTIONS,
  blockProblem,
  defaultHomeBlocks,
  newBlock,
  safeHref,
  sanitizeBlocks,
  slugProblem,
  slugify,
  youtubeId,
  type BlockType,
} from "../lib/builder/blocks";
import { can } from "../lib/admin/permissions";
import { getAt, leaves, norm, setAt } from "../components/admin/visual/annotate";
import { CONTENT_TYPES, type Field } from "../lib/cms/registry";
import { toStored } from "../lib/cms/admin-content";
import { homeHeroSlides } from "../content/home-hero";

const anyPicture = () => true;

test("every block's defaults survive a save unchanged and are complete", () => {
  for (const type of Object.keys(BLOCKS) as BlockType[]) {
    if (type === "section" || type === "video") continue;
    const b = newBlock(type);
    const [saved] = sanitizeBlocks([b], anyPicture);
    assert.equal(saved.type, type);
    assert.deepEqual(saved.props, b.props, type);
    assert.equal(blockProblem([saved]), null, type);
  }
});

test("a save keeps known blocks and fields only", () => {
  const saved = sanitizeBlocks(
    [
      { id: "a1", type: "hero", props: { title: "Hi", onclick: "alert(1)", tone: "purple" } },
      { id: "a2", type: "script", props: {} },
      { id: "a1", type: "spacer", props: { size: "l" } },
      "nonsense",
    ],
    anyPicture,
  );
  assert.equal(saved.length, 2);
  assert.deepEqual(saved[0], { id: "a1", type: "hero", props: { title: "Hi" } });
  assert.equal(saved[1].type, "spacer");
  assert.notEqual(saved[1].id, "a1", "duplicate ids are replaced");
});

test("homepage sections are kept only on the homepage, once each", () => {
  const blocks = [...defaultHomeBlocks(), { id: "x", type: "section", props: { section: "services" } }];
  assert.equal(sanitizeBlocks(blocks, anyPicture, true).length, Object.keys(HOME_SECTIONS).length);
  assert.equal(sanitizeBlocks(blocks, anyPicture, false).length, 0);
  assert.equal(sanitizeBlocks([{ id: "y", type: "section", props: { section: "evil" } }], anyPicture, true).length, 0);
});

test("publishing names the first required field left empty", () => {
  const hero = newBlock("hero");
  hero.props.title = "";
  assert.match(blockProblem([newBlock("text"), hero]) ?? "", /Block 2 \(Hero\): Headline is required/);
  const faq = newBlock("faq");
  faq.props.items = [{ question: "Why?" }];
  assert.match(blockProblem([faq]) ?? "", /question 1: Answer is required/);
});

test("page addresses", () => {
  assert.equal(slugify("SAP Health-Check Offer 2026!"), "sap-health-check-offer-2026");
  assert.equal(slugify("Offers/ Été  Promo /x/y"), "offers/ete-promo/x");
  const taken = new Set(["/contact/", "/services/"]);
  assert.equal(slugProblem("offers/sap", taken), null);
  assert.match(slugProblem("contact", taken) ?? "", /already has a page/);
  assert.match(slugProblem("admin/x", taken) ?? "", /reserved/);
  assert.match(slugProblem("api", taken) ?? "", /reserved/);
  assert.match(slugProblem("Bad Slug", taken) ?? "", /lowercase/);
  assert.match(slugProblem("a/b/c/d", taken) ?? "", /lowercase/);
  assert.match(slugProblem("", taken) ?? "", /address/);
});

test("links typed by an editor are limited to safe kinds", () => {
  for (const ok of ["/contact/", "#pricing", "https://in2itebs.com", "mailto:a@b.com", "tel:+911234"])
    assert.equal(safeHref(ok), ok);
  for (const bad of ["javascript:alert(1)", "//evil.com", "data:text/html,x", " ", 3, undefined])
    assert.equal(safeHref(bad), null);
});

test("YouTube links in every usual shape", () => {
  for (const url of [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtu.be/dQw4w9WgXcQ?si=abc",
    "https://www.youtube.com/watch?feature=share&v=dQw4w9WgXcQ",
    "https://www.youtube.com/shorts/dQw4w9WgXcQ",
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
  ])
    assert.equal(youtubeId(url), "dQw4w9WgXcQ", url);
  assert.equal(youtubeId("https://vimeo.com/123"), null);
});

test("the page builder is for admins and editors", () => {
  assert.ok(can("admin", "builder"));
  assert.ok(can("editor", "builder"));
  assert.ok(!can("sales", "builder"));
  assert.ok(!can("hr", "builder"));
  assert.ok(can("editor", "site"));
  assert.ok(!can("sales", "site"));
});

// ------------------------------------------------------------------ the visual editor

test("visual editor: values are read and written by path", () => {
  const v = { title: "A", intro: ["one", "two"], sections: [{ title: "S1", bullets: ["b"] }] };
  assert.equal(getAt(v, "intro.1"), "two");
  assert.equal(getAt(v, "sections.0.bullets.0"), "b");
  assert.equal(getAt(v, "sections.4.title"), undefined);
  const next = setAt(v, "sections.0.title", "New");
  assert.equal((next.sections[0] as { title: string }).title, "New");
  assert.equal(v.sections[0].title, "S1", "the original is not changed");
  assert.deepEqual(setAt(v, "intro.0", "first").intro, ["first", "two"]);
});

test("visual editor: every text and picture of a content type has a path and a label", () => {
  const { texts, pics } = leaves(CONTENT_TYPES.services.fields as Field[], {
    title: "T",
    intro: ["p1", "p2"],
    heroImage: "services/agile-devops",
    sections: [{ title: "S", body: "B", bullets: ["x"] }],
  });
  assert.deepEqual(
    texts.map((t) => t.path),
    ["title", "intro.0", "intro.1", "sections.0.title", "sections.0.body", "sections.0.bullets.0"],
  );
  assert.equal(pics[0].path, "heroImage");
  assert.match(texts[3].label, /section 1 · Heading/);
});

test("visual editor: text matching ignores spacing, quotes and case", () => {
  assert.equal(norm("“Change  with\nconfidence.”"), norm("change with confidence."));
  assert.notEqual(norm("Change"), norm("Changed"));
});

test("homepage hero slides survive the editor's round trip", async () => {
  const items = homeHeroSlides.map(({ cta, secondary, ...s }) => ({
    ...s,
    ctaLabel: cta.label,
    ctaHref: cta.href,
    secondaryLabel: secondary.label,
    secondaryHref: secondary.href,
  }));
  const stored = toStored("homeHero", "list", { items });
  assert.ok(!("error" in stored));
  assert.deepEqual((stored as { data: unknown }).data, homeHeroSlides);
});

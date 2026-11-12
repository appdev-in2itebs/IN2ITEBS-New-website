import { test, expect } from "@playwright/test";

// Display headings arrive word by word (`components/motion/words.tsx`), and the homepage alternates
// between the variants down the page so no two sections in a row make the same move
// (owner, 2026-09-17: "not only one way different text animation").
const headings = [
  { section: "section[data-home-services]", text: "Services we offer." },
  { section: "section[data-partners]", text: "Our partners & technology ecosystem." },
  { section: "section[data-home-team]", text: "Meet our team." },
  { section: "section[data-home-news]", text: "News & articles." },
];

test("the homepage display headings arrive word by word, in more than one way", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  for (const { section, text } of headings) {
    const words = page.locator(`${section} h2 .words`);
    await expect(words).toHaveCount(1);
    // Splitting on spaces, never on characters: the heading has to stay one selectable, searchable
    // string, and every word keeps its trailing space so wrapping and copy-paste behave.
    await expect(words).toHaveText(text);
    expect(await words.locator(".word").count()).toBe(text.split(" ").length);

    // And the words must be *rendered* apart, not merely separated in the DOM. The first cut put
    // each space inside the masked `.word` box, where it collapsed: `textContent` still read
    // "Services we offer." while the screen showed "Servicesweoffer." (owner, 2026-09-17), so a
    // text assertion alone cannot catch this — only the geometry can.
    const boxes = await words.locator(".word").evaluateAll((els) =>
      els.map((el) => {
        const b = el.getBoundingClientRect();
        return { left: b.left, right: b.right, top: Math.round(b.top) };
      }),
    );
    for (let i = 1; i < boxes.length; i += 1) {
      // Words that wrapped to the next line are neighbours in the DOM but not on the screen.
      if (boxes[i].top !== boxes[i - 1].top) continue;
      expect(boxes[i].left - boxes[i - 1].right, `no gap before word ${i} of "${text}"`).toBeGreaterThan(2);
    }
  }

  const variants = await page
    .locator(".words")
    .evaluateAll((spans) =>
      Array.from(
        new Set(spans.flatMap((s) => Array.from(s.classList).filter((c) => c.startsWith("words-") && c !== "words"))),
      ).sort(),
    );
  expect(variants.length).toBeGreaterThan(1);
});

test("the words are held back until their section arrives, then settle in place", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  // The map closes the page, so at the top of the document its heading has not been revealed yet.
  const word = page.locator("#offices h2 .words .word-rise").first();
  // Start from the top on purpose. A restored scroll position would put the map on screen, the
  // heading would already have been revealed, and the first assertion below would never come true.
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator("html")).toHaveAttribute("data-motion-ready", /.*/);
  // Visible-first: the words paint before hydration and only fade out once the motion flag is set,
  // so this polls rather than sampling — an instant read catches that fade mid-flight, and on a
  // loaded machine the flag itself can take a moment to land.
  await expect.poll(() => word.evaluate((el) => getComputedStyle(el).opacity), { timeout: 15000 }).toBe("0");

  await page.locator("#offices").scrollIntoViewIfNeeded();
  await expect.poll(() => word.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  // The opacity lands at 560ms but the transform keeps easing until 900ms, so sampling it the
  // instant the word is opaque reads a last fraction of a pixel of travel. Poll until it settles.
  await expect
    .poll(() => word.evaluate((el) => getComputedStyle(el).transform), { timeout: 5000 })
    .toMatch(/none|matrix\(1, 0, 0, 1, 0, 0\)/);
});

test("reduced motion leaves every word exactly where it is", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto("/");
  // The withheld testimonial section contributes no animated text or caret.
  await expect(page.locator("section[data-testimonials] .words-type")).toHaveCount(0);
  await expect(page.locator(".type-caret")).toHaveCount(0);
  const settled = await page.locator(".word-rise").evaluateAll((spans) =>
    spans.every((s) => {
      const style = getComputedStyle(s);
      return (
        style.opacity === "1" && style.filter === "none" && /none|matrix\(1, 0, 0, 1, 0, 0\)/.test(style.transform)
      );
    }),
  );
  expect(settled).toBe(true);
  await context.close();
});

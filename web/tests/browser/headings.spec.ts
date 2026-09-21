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

// "What people say." is the one that types itself out instead (owner, 2026-09-18), so it has no
// per-word boxes at all and is checked on its own below.
const typed = { section: "section[data-testimonials]", text: "What people say." };

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

test("the testimonial heading lifts in and then types itself out under a caret", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const words = page.locator(`${typed.section} h2 .words-type`);
  await expect(words).toHaveCount(1);
  // Nothing is split: one text node, so selection and find-in-page still see a single string.
  await expect(words).toHaveText(typed.text);
  expect(await words.locator(".word").count()).toBe(0);
  expect(await words.locator(".type-text").evaluate((el) => el.childNodes.length === 1 && el.textContent)).toBe(
    typed.text,
  );

  const text = words.locator(".type-text");
  const caret = words.locator(".type-caret");
  // Before the section arrives the line is clipped away to nothing and the caret sits at the left.
  await expect.poll(() => text.evaluate((el) => getComputedStyle(el).clipPath)).toMatch(/inset\(.*100%/);

  await page.locator(typed.section).scrollIntoViewIfNeeded();

  // The caret tracks the typing edge, so watching it is watching the typing: it starts at the left
  // of the line and walks to the end. Polling the clip alone would not do — the clip stops reading
  // "100%" after the very first character, which says the typing started, not that it finished.
  const distanceToEnd = async () => {
    const line = (await words.locator(".type-line").boundingBox())!;
    const tip = (await caret.boundingBox())!;
    return Math.abs(tip.x - (line.x + line.width));
  };
  expect(await distanceToEnd(), "the caret should start at the left of the line").toBeGreaterThan(100);
  await expect.poll(distanceToEnd, { timeout: 8000 }).toBeLessThan(6);

  // With the caret home, every character is painted and the lift has settled.
  expect(await text.evaluate((el) => getComputedStyle(el).clipPath)).not.toMatch(/[1-9]\d*%/);
  expect(await text.evaluate((el) => getComputedStyle(el).transform)).toMatch(/none|matrix\(1, 0, 0, 1, 0, 0\)/);

  // And it does not blink for ever — a heading that never stops repainting is a distraction.
  await expect.poll(() => caret.evaluate((el) => getComputedStyle(el).opacity), { timeout: 12000 }).toBe("0");
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
  expect(await word.evaluate((el) => getComputedStyle(el).transform)).toMatch(/none|matrix\(1, 0, 0, 1, 0, 0\)/);
});

test("reduced motion leaves every word exactly where it is", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto("/");
  // The typed line is simply there, with no caret at all.
  await expect(page.locator(".type-caret")).toBeHidden();
  expect(await page.locator(".type-text").evaluate((el) => getComputedStyle(el).clipPath)).toBe("none");
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

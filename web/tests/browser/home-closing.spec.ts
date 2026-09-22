import { test, expect } from "@playwright/test";
import { testimonials } from "../../content/testimonials";
import { insights } from "../../content/insights";

// The closing run of the homepage mirrors the existing site: the client quotes ("What people say"),
// the YouTube ribbon, then the article strip ("News & articles") directly above the footer.
const slider = "section[data-testimonials]";
const news = "section[data-home-news]";

test("the testimonial row steps on one quote at a time and the portraits jump to a speaker", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator(slider).scrollIntoViewIfNeeded();
  await expect(page.locator(slider).getByRole("heading", { level: 2 })).toHaveText("What people say.");

  // The real roster appears once; the second copy exists only so the row can turn over.
  const real = page.locator(`${slider} [data-testimonial]`);
  await expect(real).toHaveCount(testimonials.length);
  for (const [index, item] of testimonials.entries()) {
    const card = real.nth(index);
    await expect(card).toContainText(item.quote.slice(0, 60));
    await expect(card).toContainText(item.name);
    await expect(card).toContainText(item.role);
  }

  const track = page.locator(`${slider} [data-testimonial-track]`);
  expect(await track.evaluate((el) => getComputedStyle(el).overflowX)).toBe("auto");
  expect(await track.evaluate((el) => getComputedStyle(el).scrollSnapType)).toContain("x");

  // Two cards are in view on a desktop, so one step moves the row by exactly one card.
  const step = await track.evaluate((el) => {
    const card = el.firstElementChild as HTMLElement;
    return card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
  });
  const viewport = await track.evaluate((el) => el.clientWidth);
  expect(step).toBeLessThan(viewport * 0.75);

  // The portraits jump straight to a speaker, and the live one is marked.
  await page.getByRole("button", { name: `Show the testimonial from ${testimonials[2].name}` }).click();
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(step * 1.5);
  await expect(page.getByRole("button", { name: `Show the testimonial from ${testimonials[2].name}` })).toHaveAttribute(
    "aria-current",
    "true",
  );
});

test("the testimonial row advances on its own, pointer or no pointer", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator(slider).scrollIntoViewIfNeeded();
  const track = page.locator(`${slider} [data-testimonial-track]`);
  const started = await track.evaluate((el) => el.scrollLeft);
  // INTERVAL is 7s; one step lands within that plus the smooth scroll.
  await expect.poll(() => track.evaluate((el) => el.scrollLeft), { timeout: 12000 }).toBeGreaterThan(started + 50);

  // Hovering must not stop it (2026-09-17). A reader's pointer sits over the quotes they are
  // reading, so gating the step on hover meant the row only ever moved once they had left.
  await page.locator("#testimonials-title").hover();
  const under = await track.evaluate((el) => el.scrollLeft);
  await expect
    .poll(() => track.evaluate((el, from) => Math.abs(el.scrollLeft - from), under), { timeout: 12000 })
    .toBeGreaterThan(50);

  // The page-wide pause control is what stops it on purpose.
  await page.evaluate(() => document.documentElement.setAttribute("data-motion-paused", "true"));
  await page.waitForTimeout(800);
  const parked = await track.evaluate((el) => el.scrollLeft);
  await page.waitForTimeout(9000);
  expect(Math.abs((await track.evaluate((el) => el.scrollLeft)) - parked)).toBeLessThan(4);
});

test("one quote fills the row on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(slider).scrollIntoViewIfNeeded();
  const track = page.locator(`${slider} [data-testimonial-track]`);
  const card = await track.evaluate((el) => (el.firstElementChild as HTMLElement).offsetWidth);
  const viewport = await track.evaluate((el) => el.clientWidth);
  // A single card carries the row on a narrow screen rather than two half-width ones.
  expect(card).toBeGreaterThan(viewport * 0.75);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(
    true,
  );
});

test("the article strip travels right to left on its own and can be moved by hand", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator(news).scrollIntoViewIfNeeded();
  await expect(page.locator(news).getByRole("heading", { level: 2 })).toHaveText("News & articles.");

  // The archive is repeated so the strip never shows an end; only the first copy is real content.
  const cards = page.locator(`${news} [data-news-article]`);
  await expect(cards).toHaveCount(insights.length);
  for (const [index, article] of insights.slice(0, 3).entries()) {
    const card = cards.nth(index);
    // Most cards open their article here; "grow-with-sap" is an event landing page on the live
    // site with no body, so its card carries an explicit destination instead.
    await expect(card).toHaveAttribute("href", article.href ?? `/insights/${article.slug}/`);
    await expect(card).toContainText(article.title);
    await expect(card).toContainText(article.excerpt);
    await expect(card).toContainText(article.category);
  }

  // The duplicates must never be reachable or announced, or the archive doubles for screen readers.
  const clones = page.locator(`${news} .news-copy`);
  expect(await clones.count()).toBeGreaterThan(0);
  expect(await clones.first().getAttribute("aria-hidden")).toBe("true");
  expect(
    await clones.locator("a").evaluateAll((links) => links.every((a) => a.getAttribute("tabindex") === "-1")),
  ).toBe(true);

  const track = page.locator(`${news} [data-news-track]`);
  expect(await track.evaluate((el) => getComputedStyle(el).overflowX)).toBe("auto");
  // Snapping would fight the drift, dragging every frame back to the nearest card edge.
  expect(await track.evaluate((el) => getComputedStyle(el).scrollSnapType)).toBe("none");

  // It travels on its own, with no control to press, at DRIFT px/s. The window allows for a loaded
  // first paint; the drift itself covers ten pixels in well under a second once it is running.
  await expect(page.getByRole("button", { name: /articles/ })).toHaveCount(0);
  const started = await track.evaluate((el) => el.scrollLeft);
  await expect.poll(() => track.evaluate((el) => el.scrollLeft), { timeout: 10000 }).toBeGreaterThan(started + 10);

  // A hand on the strip holds it, so a card is never pulled out from under a drag.
  await track.dispatchEvent("pointerdown");
  const held = await track.evaluate((el) => el.scrollLeft);
  await page.waitForTimeout(1200);
  expect(Math.abs((await track.evaluate((el) => el.scrollLeft)) - held)).toBeLessThan(4);

  await expect(page.locator(news).getByRole("link", { name: "All insights" })).toHaveAttribute("href", "/insights/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

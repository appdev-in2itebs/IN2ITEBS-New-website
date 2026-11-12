import { test, expect } from "@playwright/test";
import { insights } from "../../content/insights";

const news = "section[data-home-news]";

test("unapproved testimonials and client videos stay off the homepage", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("section[data-testimonials]")).toHaveCount(0);
  await expect(page.locator("section[data-youtube-ribbon]")).toHaveCount(0);
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

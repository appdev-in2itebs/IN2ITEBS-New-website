import { test, expect } from "@playwright/test";
import { youtubeVideos } from "../../content/youtube";

// The YouTube ribbon (2026-09-15 17:08) is a horizontal strip of the channel's uploads, newest
// first, each card a direct link to the video on YouTube, with self-hosted thumbnails (the CSP
// allows no third-party images). It travels right to left on its own, with no controls of any kind
// (owner, 2026-09-17) — a trackpad, a swipe and the keyboard move the same `scrollLeft` the drift
// does. It closes the homepage with the testimonial slider above it and the article strip below,
// mirroring the order of the existing site.
const ribbon = "section[data-youtube-ribbon]";

test("the ribbon closes the homepage between the testimonials and the article strip", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator("main > section[data-testimonials] ~ section[data-youtube-ribbon]")).toHaveCount(1);
  await expect(page.locator("main > section[data-youtube-ribbon] + section[data-home-news]")).toHaveCount(1);
  const cards = page.locator(`${ribbon} [data-youtube-video]`);
  await expect(cards).toHaveCount(youtubeVideos.length);
  for (const [index, video] of youtubeVideos.slice(0, 3).entries()) {
    const card = cards.nth(index);
    await expect(card).toHaveAttribute("href", `https://www.youtube.com/watch?v=${video.id}`);
    await expect(card).toHaveAttribute("target", "_blank");
    await expect(card).toHaveAttribute("rel", /noopener/);
    await expect(card).toContainText(video.title);
    await expect(card.locator("img")).toHaveAttribute("src", `/youtube/${video.id}.jpg`);
  }
  await page.locator(ribbon).scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      cards
        .first()
        .locator("img")
        .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
    )
    .toBeTruthy();
  await expect(page.locator(ribbon).getByRole("link", { name: /YouTube channel/ })).toHaveAttribute(
    "href",
    /youtube\.com\/channel\//,
  );
});

test("the ribbon drifts right to left on its own, with nothing to press", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator(ribbon).scrollIntoViewIfNeeded();
  const track = page.locator(`${ribbon} [data-youtube-track]`);
  // Snap points would fight the drift, dragging every frame back to the nearest card edge, so the
  // ribbon carries none — the same rule the article strip follows.
  expect(await track.evaluate((el) => getComputedStyle(el).scrollSnapType)).toBe("none");
  expect(await track.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  await expect(page.locator(`${ribbon} button`)).toHaveCount(0);

  const started = await track.evaluate((el) => el.scrollLeft);
  await expect.poll(() => track.evaluate((el) => el.scrollLeft), { timeout: 6000 }).toBeGreaterThan(started + 10);

  // The page pause control is what stops it on purpose.
  await page.evaluate(() => document.documentElement.setAttribute("data-motion-paused", "true"));
  await page.waitForTimeout(600);
  const parked = await track.evaluate((el) => el.scrollLeft);
  await page.waitForTimeout(1500);
  expect(Math.abs((await track.evaluate((el) => el.scrollLeft)) - parked)).toBeLessThan(4);
});

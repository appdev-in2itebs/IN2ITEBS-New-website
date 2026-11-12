import { test, expect } from "@playwright/test";
import { services } from "../../content/services";

// "Services we offer" follows the hero after the unapproved client ribbon was withheld.
const grid = "section#services";

test("the service ribbon follows the hero and lists every service in the existing order", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(`main > section[data-brand-hero] + ${grid}`)).toHaveCount(1);

  const title = page.locator("#home-services-title");
  await expect(title).toHaveText("Services we offer.");
  // The heading block is centred.
  expect(await title.evaluate((el) => getComputedStyle(el).textAlign)).toBe("center");

  // The roster is repeated so the ribbon can turn over; only the first copy counts as content.
  const real = page.locator(`${grid} [data-service]`);
  await expect(real).toHaveCount(services.length);
  for (const [index, service] of services.entries()) {
    const card = real.nth(index);
    await expect(card).toHaveAttribute("data-service", service.slug);
    await expect(card.getByRole("heading", { level: 3 })).toHaveText(service.name);
    await expect(card).toContainText(service.blurb);
    // No card may ship the existing site's cut-off WordPress excerpt.
    expect(service.blurb).not.toMatch(/\.\.$/);
  }

  // The photograph on every card resolves. They are lazy, so the ribbon has to be looked at first.
  await page.locator(grid).scrollIntoViewIfNeeded();
  for (const service of services) {
    const image = page.locator(`${grid} [data-service="${service.slug}"] img`);
    await expect(image).toHaveAttribute("alt", service.imageAlt);
    await expect
      .poll(() => image.evaluate((el: HTMLImageElement) => el.naturalWidth), { timeout: 10000 })
      .toBeGreaterThan(0);
  }

  // The duplicates must never be reachable or announced, or they multiply the list for screen readers.
  const copy = page.locator(`${grid} .services-ribbon-copy`).first();
  await expect(copy).toHaveAttribute("aria-hidden", "true");
  expect(await copy.locator("a").evaluateAll((links) => links.every((a) => a.getAttribute("tabindex") === "-1"))).toBe(
    true,
  );

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("the service ribbon travels on its own and can be moved by hand in both directions", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator(grid).scrollIntoViewIfNeeded();
  const track = page.locator(`${grid} [data-services-track]`);

  // A real scroll container, so a drag, a swipe or a wheel moves the same property the drift does.
  expect(await track.evaluate((el) => getComputedStyle(el).overflowX)).toBe("auto");
  expect(await track.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);

  // It travels on its own, and keeps travelling under the pointer.
  const box = (await track.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  const started = await track.evaluate((el) => el.scrollLeft);
  // The window allows for a loaded first paint, as in home-team.spec.ts; at DRIFT px/s the ten
  // pixels themselves take well under a second once the loop is running.
  await expect.poll(() => track.evaluate((el) => el.scrollLeft), { timeout: 10000 }).toBeGreaterThan(started + 10);

  // A hand on the ribbon holds it, so a card is never pulled out from under a drag.
  await track.dispatchEvent("pointerdown");
  const held = await track.evaluate((el) => el.scrollLeft);
  await page.waitForTimeout(1200);
  expect(Math.abs((await track.evaluate((el) => el.scrollLeft)) - held)).toBeLessThan(4);

  // Parked outright, so only the hand moves the numbers below.
  await page.evaluate(() => document.documentElement.setAttribute("data-motion-paused", "true"));
  await track.evaluate((el) => el.scrollBy({ left: 500 }));
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(held + 400);
  const right = await track.evaluate((el) => el.scrollLeft);
  await track.evaluate((el) => el.scrollBy({ left: -300 }));
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeLessThan(right - 250);

  // Travelling back past the start wraps into another copy instead of hitting a wall.
  await track.evaluate((el) => el.scrollTo({ left: 0 }));
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  await page.evaluate(() => document.documentElement.removeAttribute("data-motion-paused"));
});

test("reduced motion lays the services out as a static grid", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator(grid).scrollIntoViewIfNeeded();
  const track = page.locator(`${grid} [data-services-track]`);
  // Nothing travels: the cards are simply laid out, so scrollLeft stays where it started.
  const at = await track.evaluate((el) => el.scrollLeft);
  await page.waitForTimeout(1200);
  expect(await track.evaluate((el) => el.scrollLeft)).toBe(at);
  expect(
    await page
      .locator(`${grid} .services-ribbon-copy`)
      .first()
      .evaluate((el) => getComputedStyle(el).display),
  ).toBe("none");
  // Every service stays visible once the loop is gone.
  for (const service of services)
    await expect(page.locator(`${grid} .services-ribbon-list [data-service="${service.slug}"]`)).toBeVisible();
});

test("every service card lands on a real page on this site", async ({ page, request }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  for (const service of services) {
    const href = await page.locator(`${grid} [data-service="${service.slug}"] a`).getAttribute("href");
    expect(href, `${service.name} must point at this site's page for it`).toBe(service.href);
    // Not a redirect and not a 404: the card's destination is a page that exists and is rendered.
    const response = await request.get(service.href, { maxRedirects: 0 });
    expect(response.status(), `${service.href} should be served directly`).toBe(200);
  }
});

test("the ribbon does not widen the page on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(grid).scrollIntoViewIfNeeded();
  const width = await page
    .locator(`${grid} .services-ribbon-list [data-service]`)
    .first()
    .evaluate((el) => Math.round(el.getBoundingClientRect().width));
  // One card fills the ribbon on a narrow screen rather than a row of slivers.
  expect(width).toBeGreaterThan(280);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

import { test, expect } from "@playwright/test";
import { leadership } from "../../content/leadership";

// "Meet our team" sits directly below the partner ecosystem: the senior leadership on a continuous
// left-to-right marquee, the same pure-CSS loop the client ribbon runs (two identical copies inside
// a `w-max` track translating to -50%).
const team = "section[data-home-team]";

test("the team ribbon follows the partners section and lists every leader once for assistive tech", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator("main > section[data-partners] + section[data-home-team]")).toHaveCount(1);
  await expect(page.locator(team).getByRole("heading", { level: 2 })).toHaveText("Meet our team.");

  // The roster is repeated for the seamless loop; only the first copy counts as content.
  const copies = await page.locator(`${team} ul[aria-label], ${team} .team-ribbon-copy`).count();
  expect(copies).toBeGreaterThan(1);
  await expect(page.locator(`${team} [data-team-member]`)).toHaveCount(leadership.length * copies);
  const real = page.locator(`${team} .team-ribbon-list [data-team-member]`);
  await expect(real).toHaveCount(leadership.length);
  for (const [index, leader] of leadership.entries()) {
    const card = real.nth(index);
    await expect(card).toContainText(leader.name);
    await expect(card).toContainText(leader.title);
    await expect(card).toContainText(leader.bio);
  }

  // The duplicate must never be reachable or announced, or it doubles the roster for screen readers.
  const copy = page.locator(`${team} .team-ribbon-copy`).first();
  await expect(copy).toHaveAttribute("aria-hidden", "true");
  // Not inert: the clone scrolls into view, so a mouse must still be able to click its links.
  expect(await copy.evaluate((el) => el.hasAttribute("inert"))).toBe(false);
  expect(await copy.locator("a").evaluateAll((links) => links.every((a) => a.getAttribute("tabindex") === "-1"))).toBe(
    true,
  );

  // Each leader with a cleared photograph shows it; the rest carry a monogram, never a stand-in face.
  for (const leader of leadership) {
    const card = page.locator(`${team} .team-ribbon-list [data-team-member="${leader.slug}"]`);
    await expect(card.locator("img")).toHaveCount(leader.photo ? 1 : 0);
  }
});

test("the team ribbon drifts on its own, holds under the pointer and scrolls both ways by hand", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator(team).scrollIntoViewIfNeeded();
  const track = page.locator(`${team} [data-team-track]`);

  // A real scroll container, so a drag, a swipe or a wheel moves the same property the drift does.
  expect(await track.evaluate((el) => getComputedStyle(el).overflowX)).toBe("auto");
  expect(await track.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);

  // It advances on its own, at DRIFT px/s — ten pixels take well under a second. This is the test
  // that caught `scrollLeft += fraction` being swallowed by whole-pixel snapping, which left the
  // ribbon moving about a pixel every few seconds; the window allows for a loaded first paint, not
  // for the drift being slow.
  const started = await track.evaluate((el) => el.scrollLeft);
  await expect.poll(() => track.evaluate((el) => el.scrollLeft), { timeout: 10000 }).toBeGreaterThan(started + 10);

  // Hovering must not stop it (2026-09-17). A reader's pointer is almost always inside the section
  // they are reading, so gating the drift on hover meant it only ever ran once they had left.
  const box = (await track.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  const under = await track.evaluate((el) => el.scrollLeft);
  await expect.poll(() => track.evaluate((el) => el.scrollLeft), { timeout: 10000 }).toBeGreaterThan(under + 10);

  // A hand on the ribbon does hold it, so a card is never pulled out from under a drag.
  await track.dispatchEvent("pointerdown");
  const held = await track.evaluate((el) => el.scrollLeft);
  await page.waitForTimeout(1200);
  expect(Math.abs((await track.evaluate((el) => el.scrollLeft)) - held)).toBeLessThan(4);

  // The paging arrows went on 2026-09-17; the ribbon is moved by hand instead, in both directions.
  // The drift is parked outright for this stretch so only the hand moves the numbers.
  await page.evaluate(() => document.documentElement.setAttribute("data-motion-paused", "true"));
  await expect(page.locator(team).getByRole("button")).toHaveCount(0);
  await track.evaluate((el) => el.scrollBy({ left: 400 }));
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(held + 300);
  const right = await track.evaluate((el) => el.scrollLeft);
  await track.evaluate((el) => el.scrollBy({ left: -250 }));
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeLessThan(right - 200);

  // Scrolling back past the start wraps into another copy instead of hitting a wall.
  await track.evaluate((el) => el.scrollTo({ left: 0 }));
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  await page.evaluate(() => document.documentElement.removeAttribute("data-motion-paused"));

  // The ribbon must not widen the page.
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("reduced motion lays the roster out as a static grid", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator(team).scrollIntoViewIfNeeded();
  const track = page.locator(`${team} [data-team-track]`);
  // Nothing drifts: the roster is simply laid out, so scrollLeft stays where it started.
  const at = await track.evaluate((el) => el.scrollLeft);
  await page.waitForTimeout(1200);
  expect(await track.evaluate((el) => el.scrollLeft)).toBe(at);
  expect(
    await page
      .locator(`${team} .team-ribbon-copy`)
      .first()
      .evaluate((el) => getComputedStyle(el).display),
  ).toBe("none");
  expect(await page.locator(`${team} .team-ribbon-list`).evaluate((el) => getComputedStyle(el).flexWrap)).toBe("wrap");
  // Every leader stays visible once the loop is gone.
  for (const leader of leadership)
    await expect(page.locator(`${team} .team-ribbon-list [data-team-member="${leader.slug}"]`)).toBeVisible();
});

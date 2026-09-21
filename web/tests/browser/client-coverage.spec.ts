import { test, expect } from "@playwright/test";
import { clients } from "../../content/clients";
import { existsSync } from "node:fs";
import path from "node:path";

test("every source client has an asset and appears in the homepage ribbon", async ({ page }) => {
  test.setTimeout(120000);
  expect(clients).toHaveLength(94);
  expect(new Set(clients.map((c) => c.logo)).size).toBe(clients.length);
  expect(clients.some((c) => c.slug === "airports-authority-of-india")).toBeTruthy();
  expect(new Set(clients.map((c) => c.slug)).size).toBe(clients.length);
  for (const client of clients) {
    expect(client.logo, client.name).toBeTruthy();
    expect(existsSync(path.join(process.cwd(), "public", client.logo!)), client.name).toBeTruthy();
  }
  // The ribbon has no controls since 2026-09-15 pm (no view-all grid, no pause button); reduced
  // motion is what lays the complete list out as a static grid.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".client-ribbon-list [role=listitem]")).toHaveCount(clients.length);
  await expect(page.getByRole("button", { name: /client ribbon|client entries/ })).toHaveCount(0);
  await expect(page.locator(".client-ribbon-copy")).toBeHidden();
  for (const client of clients) {
    const logo = page.locator(`.client-ribbon-list [data-client="${client.slug}"] img`);
    await logo.scrollIntoViewIfNeeded();
    await expect(logo).toHaveAttribute("alt", client.name);
    await expect
      .poll(() => logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
      .toBeTruthy();
  }
});

test("complete client grid fits mobile and preserves colour on hover", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".client-ribbon-list img")).toHaveCount(clients.length);
  const first = await page.locator(".client-ribbon-list [role=listitem]").nth(0).boundingBox();
  const second = await page.locator(".client-ribbon-list [role=listitem]").nth(1).boundingBox();
  expect(first!.y).toBe(second!.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  const logo = page.locator('.client-ribbon-list [data-client="natural-remedies"] img');
  await page.locator('.client-ribbon-list [data-client="natural-remedies"]').scrollIntoViewIfNeeded();
  await expect.poll(() => logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBeTruthy();
  await logo.hover();
  // The logos are painted in full colour at all times (the grayscale-until-hover treatment went
  // with the palette rework), so "no grayscale" is the assertion, not a literal filter string.
  const filter = await logo.evaluate((el) => getComputedStyle(el).filter);
  expect(filter === "none" || /grayscale\(0\)/.test(filter), `logo filter is ${filter}`).toBe(true);
  await page.locator('.client-ribbon-list [data-client="sentiss"]').scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/client-grid-mobile.png" });
});

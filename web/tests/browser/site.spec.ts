import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [320, 375, 768, 1024, 1100, 1280, 1440]) {
  test(`navigation and reflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/what-we-do/");
    await expect(page.locator("header").getByRole("link", { name: "Talk to us" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    if (width >= 1280) {
      // The contact-region dropdown went with the header rebuild (owner, 2026-09-17: a flat white
      // bar carrying the logo, the nav and "Talk to us", nothing else). The preference itself still
      // exists — the contact form sets it — so what the header must show is the route to that form.
      await expect(page.locator("header").getByRole("combobox")).toHaveCount(0);
      const services = page.locator("header").getByRole("link", { name: "Services", exact: true });
      await services.hover();
      const box = await page.locator("#desktop-nav-0").boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      await expect(page.locator("#desktop-nav-0").getByRole("link", { name: "Oracle", exact: true })).toBeVisible();
      await services.focus();
      await page.keyboard.press("ArrowDown");
      await expect(page.locator("#desktop-nav-0").getByRole("link").first()).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(services).toBeFocused();
    } else {
      await page.getByRole("button", { name: "Open menu", exact: true }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("button", { name: "Open menu", exact: true })).toBeFocused();
      await page.getByRole("button", { name: "Open menu", exact: true }).click();
      await page.setViewportSize({ width: 1440, height: 900 });
      await expect(page.getByRole("dialog")).not.toBeVisible();
      await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
    }
  });
}
// One theme only since 2026-09-15 15:28 (dark mode removed on request): no cookie, no root class.
for (const route of [
  "/",
  "/contact/",
  "/what-we-do/",
  "/partners/",
  "/oracle/",
  "/microsoft/",
  "/sap-enterprise-solutions/rise-vs-grow/",
]) {
  test(`accessibility ${route}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    await expect(page.locator("html")).not.toHaveClass(/theme-(light|dark)/);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
      })),
    ).toEqual([]);
  });
}
test("static content works without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3107/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();
  await expect(page.locator("main")).not.toContainText("being prepared");
  await context.close();
});
test("static pages stay cacheable and ship no theme script", async ({ page }) => {
  await page.goto("/about/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).not.toHaveClass(/theme-(light|dark)/);
  const response = await page.request.get("/about/");
  const cacheControl = response.headers()["cache-control"] ?? "";
  expect(cacheControl).not.toContain("no-store");
  const html = await response.text();
  expect(html.indexOf("theme-init")).toBe(-1);
  expect(html.indexOf("<header")).toBeGreaterThan(-1);
  expect(html.indexOf('<script id="theme-init">')).toBeLessThan(html.indexOf("<header"));
});

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
// One theme only since 2026-09-15 15:28 (dark mode removed on request).
for (const theme of ["light"])
  test(`all published routes: ${theme}`, async ({ page, request }) => {
    test.setTimeout(600000);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const xml = await (await request.get("/sitemap.xml")).text();
    const paths = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
    const failures: unknown[] = [];
    for (const path of paths) {
      await page.goto(path);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://www.in2itebs.com${path}`);
      const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      if (result.violations.length)
        failures.push({
          path,
          violations: result.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
          })),
        });
      await page.setViewportSize({ width: 375, height: 812 });
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
        failures.push({ path, issue: "mobile overflow" });
      await page.setViewportSize({ width: 1280, height: 900 });
    }
    expect(failures).toEqual([]);
  });
test("visual captures", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  for (let y = 0; y < (await page.locator("body").evaluate((el) => el.scrollHeight)); y += 850) {
    await page.evaluate((y) => scrollTo(0, y), y);
    await page.waitForTimeout(100);
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: "test-results/home-desktop.png", fullPage: true });
  await page.screenshot({ path: "test-results/home-hero.png" });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: "test-results/home-mobile.png", fullPage: true });
  await page.screenshot({ path: "test-results/home-mobile-hero.png" });
});

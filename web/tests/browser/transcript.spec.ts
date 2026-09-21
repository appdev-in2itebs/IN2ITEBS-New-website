import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("homepage implements the transcript visibly", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /Change with confidence\.\s*Run without compromise\./,
  );
  // The homepage header clears the hero until the first scroll (2026-09-16), and the address moved
  // out of it — the mobile drawer still carries info@in2itebs.com.
  await expect(page.locator("header")).toHaveAttribute("data-at-top", "true");
  await page.mouse.wheel(0, 500);
  await expect(page.locator("header")).toHaveAttribute("data-at-top", "false");
  await expect(page.locator("header").getByRole("link", { name: "Talk to us" })).toBeVisible();
  await expect(page.locator("header").getByRole("link", { name: "info@in2itebs.com" })).toHaveCount(0);
  // The service slides live inside the hero carousel (2026-09-15 15:28). Under reduced motion it
  // holds the brand slide, so the service copy is in the document but hidden, with no controls.
  const hero = page.locator("section[data-brand-hero]");
  await expect(hero.locator('[data-hero-slide="1"] h2')).toHaveText("Transform your enterprise with SAP.");
  await expect(hero.locator('[data-hero-slide="2"] h2')).toHaveText("Applications built around your business.");
  await expect(hero.locator('[data-hero-slide="2"] a[href="/digital-data-ai/application-engineering/"]')).toHaveCount(
    1,
  );
  await expect(page.getByRole("button", { name: /Next service|Previous service/ })).toHaveCount(0);
  // The platform-practice nav went off the homepage with the services directory (2026-09-17). The
  // practices are reached from the Services mega-menu now, which the mega-menu tests below cover.
  await expect(page.getByRole("navigation", { name: "Platform practices" })).toHaveCount(0);
  for (const name of [
    "SAP",
    "Microsoft",
    "Oracle",
    "Salesforce",
    "Workday",
    "IBM",
    "HP",
    "OpenText",
    "Newgen",
    "SAP Concur",
    "Qualtrics",
  ])
    await expect(page.locator("#partners").getByText(name, { exact: true })).toBeVisible();
  // The quick-contact button was replaced by the floating scroll-down cue (2026-09-21): a press
  // carries the page to the next block and parks it right under the header.
  await page.evaluate(() => scrollTo(0, 0));
  const before = await page.evaluate(() => window.scrollY);
  await page.getByRole("button", { name: "Scroll down", exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before + 200);
});
for (const route of ["/what-we-do/", "/contact/"])
  test(`transcript mega-menu ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(route);
    await page.locator("header").getByRole("link", { name: "Services", exact: true }).hover();
    const box = await page.locator("#desktop-nav-0").boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(1280);
    for (const name of ["Oracle", "Microsoft"])
      await expect(page.locator("#desktop-nav-0").getByRole("link", { name, exact: true })).toBeVisible();
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(result.violations).toEqual([]);
  });
for (const width of [320, 375, 1440])
  test(`transcript homepage at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await page.mouse.wheel(0, 500);
    await expect(page.locator("header")).toHaveAttribute("data-at-top", "false");
    await expect(page.locator("header").getByRole("link", { name: "Talk to us" })).toBeVisible();
    await page.screenshot({ path: `test-results/transcript-home-${width}.png` });
  });
test("the hero carousel mounts only the active and the next clip", async ({ page }) => {
  await page.goto("/");
  // Five video slides since 2026-09-15 15:28; the slide backgrounds are clips, not responsive images.
  const hero = page.locator("section[data-brand-hero]");
  await expect(hero.locator("img[srcset]")).toHaveCount(0);
  await expect(hero.locator("[data-ambient-video]")).toHaveCount(2);
  await expect(hero.locator('[data-hero-slide][data-active="true"]')).toHaveAttribute("data-hero-slide", "1", {
    timeout: 7000,
  });
  await expect(hero.locator("[data-ambient-video]")).toHaveCount(2, { timeout: 3000 });
});

test("desktop navigation uses unified hover and focus disclosures", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  // The homepage header clears the hero until the first scroll (2026-09-16), so bring it in first.
  await page.mouse.wheel(0, 600);
  await expect(page.locator("header")).toHaveAttribute("data-at-top", "false");
  const header = page.locator("header");
  const services = header.getByRole("link", { name: "Services", exact: true });
  await expect(services).toHaveAttribute("href", "/what-we-do/");
  await expect(header.getByRole("button", { name: /Services navigation/ })).toHaveCount(0);
  await services.hover();
  await expect(page.locator("#desktop-nav-0")).toBeVisible();

  const about = header.getByRole("link", { name: "About", exact: true });
  await about.hover();
  const aboutMenu = page.locator("#desktop-nav-5");
  await expect(aboutMenu).toBeVisible();
  await expect(aboutMenu.getByRole("link", { name: "Who We Are" })).toBeVisible();
  await expect(aboutMenu.getByRole("link", { name: "Why In2IT EBS" })).toBeVisible();
  await expect(aboutMenu.getByRole("link", { name: "Insights" })).toBeVisible();
  await expect(aboutMenu.getByRole("link", { name: "Partners" })).toHaveCount(0);
  await expect(aboutMenu.getByRole("link", { name: "Careers" })).toHaveCount(0);
  await expect(header.getByRole("button", { name: /About navigation/ })).toHaveCount(0);
});

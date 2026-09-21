import { test, expect } from "@playwright/test";
test("drawer contains keyboard focus and returns it", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/contact/");
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest("dialog")))).toBeTruthy();
  }
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu", exact: true })).toBeFocused();
});
test("there is no theme switch anywhere in the header or the mobile menu", async ({ page }) => {
  // Dark mode was removed on 2026-09-15 15:28 at the owner's request.
  await page.goto("/");
  await expect(page.getByRole("button", { name: /Switch to (dark|light) theme/ })).toHaveCount(0);
  await page.setViewportSize({ width: 375, height: 812 });
  // The homepage header clears the hero until the first scroll (2026-09-16), so bring it in first.
  await page.mouse.wheel(0, 600);
  await expect(page.locator("header")).toHaveAttribute("data-at-top", "false");
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("button", { name: /theme/ })).toHaveCount(0);
  await page.keyboard.press("Escape");
});
test("filter changes announce results and reset", async ({ page }) => {
  await page.goto("/case-studies/");
  const initial = await page.getByRole("status").textContent();
  await page.getByRole("button", { name: "GROW", exact: true }).click();
  await expect(page.getByRole("button", { name: "GROW", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("status")).not.toHaveText(initial!);
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByRole("status")).toHaveText(initial!);
});
test("offer, result and region are carried into the preview form", async ({ page }) => {
  await page.goto("/contact/?offer=pathway&assessment=RISE&interest=SAP");
  await expect(page.locator('select[name="offer"]')).toHaveValue("pathway");
  await expect(page.locator('input[name="assessment"]')).toHaveValue("RISE");
  await expect(page.locator('select[name="interest"]')).toHaveValue("SAP");
  await page.locator('select[name="region"]').selectOption("KE");
  await page.reload();
  await expect(page.locator('select[name="region"]')).toHaveValue("KE");
  await expect(page.getByRole("status")).toContainText("Online enquiries are not enabled");
  await expect(page.getByRole("button", { name: "Send enquiry" })).toBeDisabled();
});
test("comparison remains scrollable at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/sap-enterprise-solutions/rise-vs-grow/");
  const table = page.getByRole("region", { name: /comparison, scroll horizontally/ });
  await table.focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => table.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});
test("reduced motion never hides the hero and exposes all client marks", async ({ page }) => {
  // The visible pause controls went on 2026-09-15 pm; `prefers-reduced-motion` is the pause now.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("button", { name: /page animation|client ribbon|client entries/ })).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 2 }).first()).toHaveCSS("opacity", "1");
  await expect(page.locator(".client-ribbon-copy")).toBeHidden();
  await expect(page.locator(".client-ribbon-list")).toHaveCSS("flex-wrap", "wrap");
});
test("unconfirmed direct visits never claim lead delivery", async ({ page }) => {
  await page.goto("/thank-you/");
  await expect(page.locator("main")).toContainText("There is no recent enquiry confirmation");
});
test("heading scale and client hover treatment are intact", async ({ page }) => {
  // Reduced motion holds the ribbon still for the hover; there is no pause button to press any more.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  // The services directory that used to carry the display-scale h2 went on 2026-09-17, so the
  // homepage's display heading is the hero's own h1.
  expect(
    await page.locator("section[data-brand-hero] h1").evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
  ).toBeGreaterThan(32);
  await expect(page.getByRole("button", { name: /client ribbon|client entries/ })).toHaveCount(0);
  const logo = page.locator(".client-ribbon-list img").first();
  await logo.hover();
  // The logos are painted in full colour at all times (the grayscale-until-hover treatment went
  // with the palette rework), so "no grayscale" is the assertion, not a literal filter string.
  const filter = await logo.evaluate((el) => getComputedStyle(el).filter);
  expect(filter === "none" || /grayscale\(0\)/.test(filter), `logo filter is ${filter}`).toBe(true);
});
test("the scroll-down button hides while the footer is in view", async ({ page }) => {
  await page.goto("/about/");
  const button = page.getByRole("button", { name: "Scroll down", exact: true });
  await expect(button).toBeVisible();
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(button).toBeHidden();
  await page.evaluate(() => scrollTo(0, 0));
  await expect(button).toBeVisible();
});
test("the scroll-down button keeps keyboard focus near the footer", async ({ page }) => {
  await page.goto("/about/");
  const button = page.getByRole("button", { name: "Scroll down", exact: true });
  await button.focus();
  await expect(button).toBeFocused();
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(button).toBeVisible();
  await expect(button).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(button).toBeHidden();
});
test("below-the-fold reveals become visible on scroll on an observer-owned page", async ({ page }) => {
  // MotionObserver owns the motion flags on every page and drives the reveals (the hero's pause
  // control, the only other owner, went on 2026-09-15).
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/about/");
  await expect(page.locator("html")).toHaveAttribute("data-motion-ready", "true");
  // Pin the first still-hidden reveal by index: a `:not([data-reveal="in"])` locator would
  // re-resolve to a different element the moment this one flips.
  const reveals = page.locator(".reveal");
  const index = await reveals.evaluateAll((els) => els.findIndex((el) => el.dataset.reveal !== "in"));
  expect(index).toBeGreaterThan(-1);
  const pending = reveals.nth(index);
  await expect(pending).toHaveCSS("opacity", "0");
  await pending.scrollIntoViewIfNeeded();
  await expect(pending).toHaveAttribute("data-reveal", "in");
  await expect(pending).toHaveCSS("opacity", "1");
});
// The desktop mega-menu opens on hover (2026-09-11) and the panel hangs from the bottom of the header row,
// 26px below the trigger. A pointer travelling down into the panel crosses that band; the menu must survive it.
for (const label of ["Services", "About"])
  test("hovering " + label + " keeps its menu open while the pointer travels into it", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    // The hover handlers exist only after hydration; a single pointer move before that opens nothing.
    await page.locator("html[data-motion-ready]").waitFor();
    // The homepage header clears the hero until the first scroll (2026-09-16).
    await page.mouse.wheel(0, 600);
    await expect(page.locator("header")).toHaveAttribute("data-at-top", "false");
    // It slides in over 500ms; a boundingBox read now would point at a bar still moving.
    await expect.poll(() => page.locator("header").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    const trigger = page.locator('nav[aria-label="Primary"]').getByRole("link", { name: label, exact: true });
    const box = (await trigger.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    const panel = page.locator("#" + (await trigger.getAttribute("aria-controls")));
    await expect(panel).toBeVisible();
    const link = panel.getByRole("link").first();
    const target = (await link.boundingBox())!;
    for (let y = box.y + box.height / 2; y < target.y + target.height / 2; y += 4) {
      await page.mouse.move(box.x + box.width / 2, y);
    }
    await page.mouse.move(target.x + 8, target.y + target.height / 2, { steps: 10 });
    await expect(panel).toBeVisible();
    await expect(link).toBeVisible();
  });

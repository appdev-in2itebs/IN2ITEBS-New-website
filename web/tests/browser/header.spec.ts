import { test, expect } from "@playwright/test";

// The header was reduced on 2026-09-16: the logo is the only "home", the address and the SAP Gold
// Partner badge are gone, "Talk to us" sits on the right in the action blue rather than a gold pill,
// the navigation is flat on the header's own white, and on the homepage the bar clears the hero
// until the first scroll.
const header = "header";

test("the header carries a logo home link, a flat nav and one call to action", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/about/");

  // The logo is the home link, and it is the only one.
  const home = page.locator(header).getByRole("link", { name: "In2IT EBS home" });
  await expect(home).toHaveAttribute("href", "/");
  await expect(page.locator(header).getByRole("navigation", { name: "Primary" }).getByRole("link")).not.toHaveText([
    "Home",
  ]);

  // Removed for good: the address and the partner badge.
  await expect(page.locator(header).getByRole("link", { name: "info@in2itebs.com" })).toHaveCount(0);
  await expect(page.locator(header).getByRole("link", { name: "SAP Gold Partner" })).toHaveCount(0);
  await expect(page.locator(`${header} img[src*="sap-gold-partner"]`)).toHaveCount(0);

  // One call to action, in the action blue — not the gold pill it used to be.
  const cta = page.locator(header).getByRole("link", { name: "Talk to us" });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute("href", "/contact/");
  await expect(cta).not.toHaveClass(/glass-gold/);
  // Resolve the token through a probe rather than string-matching it: the custom property holds
  // "44.5% 0.105 244" while the computed colour normalises to "oklch(0.445 0.105 244)".
  const action = await page.evaluate(() => {
    const probe = document.createElement("div");
    probe.style.backgroundColor = "oklch(var(--color-action))";
    document.body.append(probe);
    const value = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return value;
  });
  expect(action).toMatch(/^oklch\(/);
  expect(await cta.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(action);

  // The nav sits on the header's own white: no pill, no panel, no shadow of its own.
  const nav = page.locator(header).getByRole("navigation", { name: "Primary" });
  const chrome = await nav.evaluate((el) => {
    const s = getComputedStyle(el);
    return { background: s.backgroundColor, radius: s.borderRadius, shadow: s.boxShadow, border: s.borderTopWidth };
  });
  expect(chrome.background).toBe("rgba(0, 0, 0, 0)");
  expect(chrome.shadow).toBe("none");
  expect(chrome.border).toBe("0px");

  // The bar itself is opaque white, not a translucent wash.
  expect(await page.locator(header).evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(
    "oklch(0.992 0.003 255)",
  );
});

test("the homepage header clears the hero, then slides in on the first scroll", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const bar = page.locator(header);

  // At rest over the hero it is out of the way and cannot be clicked through.
  await expect(bar).toHaveAttribute("data-over-hero", "true");
  await expect(bar).toHaveAttribute("data-at-top", "true");
  expect(await bar.evaluate((el) => getComputedStyle(el).opacity)).toBe("0");
  expect(await bar.evaluate((el) => getComputedStyle(el).pointerEvents)).toBe("none");

  // A scroll brings it back.
  await page.mouse.wheel(0, 600);
  await expect(bar).toHaveAttribute("data-at-top", "false");
  await expect.poll(() => bar.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  expect(await bar.evaluate((el) => getComputedStyle(el).pointerEvents)).not.toBe("none");
  await expect(bar.getByRole("link", { name: "Talk to us" })).toBeVisible();

  // Back at the top it steps aside again.
  await page.mouse.wheel(0, -900);
  await expect(bar).toHaveAttribute("data-at-top", "true");
  await expect.poll(() => bar.evaluate((el) => getComputedStyle(el).opacity)).toBe("0");
});

test("the keyboard reaches the navigation before any scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(header)).toHaveAttribute("data-at-top", "true");
  // Tab past the skip link into the header: focus must override the hidden state, or the navigation
  // would be focusable but invisible.
  for (let i = 0; i < 3; i++) await page.keyboard.press("Tab");
  await expect.poll(() => page.locator(header).evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  expect(await page.locator(header).evaluate((el) => el.contains(document.activeElement))).toBe(true);
});

test("the hero hamburger calls the bar in on desktop and opens the drawer on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const bar = page.locator(header);
  const drawer = page.locator("#mobile-navigation");
  await expect(bar).toHaveAttribute("data-at-top", "true");

  // Desktop: the bar slides in with the flat navigation; the drawer stays shut.
  await page.getByRole("button", { name: "Open site menu" }).click();
  await expect(bar).toHaveAttribute("data-pinned", "true");
  await expect.poll(() => bar.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  await expect(bar.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Services" })).toBeVisible();
  await expect(drawer).toBeHidden();

  // Escape lets it go again, and focus lands back on the hamburger.
  await page.keyboard.press("Escape");
  await expect(bar).not.toHaveAttribute("data-pinned", "true");
  await expect.poll(() => bar.evaluate((el) => getComputedStyle(el).opacity)).toBe("0");
  await expect(page.getByRole("button", { name: "Open site menu" })).toBeFocused();

  // A press outside the bar dismisses it too.
  await page.getByRole("button", { name: "Open site menu" }).click();
  await expect(bar).toHaveAttribute("data-pinned", "true");
  await page.mouse.click(720, 600);
  await expect(bar).not.toHaveAttribute("data-pinned", "true");

  // Phone: the same hamburger opens the drawer, exactly as before.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open site menu" }).click();
  await expect(drawer).toBeVisible();
  await expect(bar).not.toHaveAttribute("data-pinned", "true");
  await expect(drawer.getByRole("button", { name: "Close menu" })).toBeVisible();
});

test("inner pages keep the header visible at the top", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const route of ["/about/", "/contact/"]) {
    await page.goto(route);
    const bar = page.locator(header);
    await expect(bar).not.toHaveAttribute("data-over-hero", "true");
    expect(await bar.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    await expect(bar.getByRole("link", { name: "Talk to us" })).toBeVisible();
  }
});

test("the hero no longer carries the SAP Gold Partner pill", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator('section[data-brand-hero] [aria-label="SAP Gold Partner"]')).toHaveCount(0);
});

import { test, expect } from "@playwright/test";
import { clients } from "../../content/clients";
import { clientEvidenceApproved } from "../../content/compliance";
import { existsSync } from "node:fs";
import path from "node:path";

test("every source client has an asset while unapproved evidence stays off the homepage", async ({ page }) => {
  test.setTimeout(120000);
  expect(clients).toHaveLength(94);
  expect(new Set(clients.map((c) => c.logo)).size).toBe(clients.length);
  expect(clients.some((c) => c.slug === "airports-authority-of-india")).toBeTruthy();
  expect(new Set(clients.map((c) => c.slug)).size).toBe(clients.length);
  for (const client of clients) {
    expect(client.logo, client.name).toBeTruthy();
    expect(existsSync(path.join(process.cwd(), "public", client.logo!)), client.name).toBeTruthy();
  }
  expect(clientEvidenceApproved).toBe(false);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".client-ribbon-list [role=listitem]")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /client ribbon|client entries/ })).toHaveCount(0);
  await expect(page.locator(".client-ribbon-copy")).toHaveCount(0);
});

test("unapproved client evidence is absent on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".client-ribbon-list img")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});

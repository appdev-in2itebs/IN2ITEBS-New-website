import { test, expect } from "@playwright/test";
import { clientEvidenceApproved } from "../../content/compliance";

test("unapproved client videos are absent while the article strip remains", async ({ page }) => {
  expect(clientEvidenceApproved).toBe(false);
  await page.goto("/");
  await expect(page.locator("section[data-youtube-ribbon]")).toHaveCount(0);
  await expect(page.locator("main > section[data-home-news]")).toHaveCount(1);
});

import { test, expect } from "@playwright/test";
test("security headers are present and the CSP breaks nothing", async ({ page, request }) => {
  const response = await request.get("/");
  const headers = response.headers();
  expect(headers["content-security-policy"]).toContain("default-src 'self'");
  expect(headers["content-security-policy"]).toContain("frame-ancestors 'self'");
  expect(headers["x-frame-options"]).toBe("SAMEORIGIN");
  expect(headers["strict-transport-security"]).toContain("max-age=63072000");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  const violations: string[] = [];
  page.on("console", (message) => {
    if (/Content Security Policy/i.test(message.text())) violations.push(message.text());
  });
  for (const path of ["/", "/contact/", "/sap-enterprise-solutions/rise-vs-grow/", "/partners/"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("img").first()).toBeVisible();
  }
  expect(violations).toEqual([]);
});
test("removed pages return 410 and legacy URLs redirect permanently", async ({ request }) => {
  const gone = await request.get("/case/anything/", { maxRedirects: 0 });
  expect(gone.status()).toBe(410);
  expect(gone.headers()["content-type"]).toContain("text/html");
  const moved = await request.get("/join-our-team/", { maxRedirects: 0 });
  expect(moved.status()).toBe(308);
  expect(moved.headers()["location"]).toMatch(/\/careers\/$/);
});

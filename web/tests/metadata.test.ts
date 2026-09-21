import { test } from "node:test";
import assert from "node:assert/strict";
import { pageMetadata } from "../lib/metadata";

test("page metadata brands the social title and uses trailing-slash image URLs", () => {
  const m = pageMetadata("/about/", { title: "Who We Are", description: "x".repeat(80) });
  assert.equal(m.alternates?.canonical, "https://in2itebs.com/about/");
  const og = m.openGraph as { title: string; url: string; images: { url: string }[] };
  assert.equal(og.title, "Who We Are · In2IT EBS");
  assert.equal(og.url, "https://in2itebs.com/about/");
  assert.equal(og.images[0].url, "/opengraph-image/");
  assert.equal((m.twitter as { site: string }).site, "@in2itebs_");
});
test("an absolute title is used verbatim", () => {
  const m = pageMetadata("/", {
    title: { absolute: "In2IT EBS — Enterprise transformation under control" },
    description: "y".repeat(80),
  });
  assert.equal((m.openGraph as { title: string }).title, "In2IT EBS — Enterprise transformation under control");
});
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { caseStudies } from "../content/case-studies";
import { insights } from "../content/insights";

function pages(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    return statSync(full).isDirectory() ? pages(full) : entry === "page.tsx" ? [full] : [];
  });
}
test("static page descriptions stay within 70 to 160 characters", () => {
  for (const file of pages(path.join(process.cwd(), "app"))) {
    const source = readFileSync(file, "utf8");
    const match = source.match(/description:\s*\n?\s*"([^"]+)"/);
    if (!match || file.includes("[slug]")) continue;
    const length = match[1].length;
    const noindex = /robots:\s*\{\s*index: false/.test(source);
    assert.ok(length <= 160, `${path.relative(process.cwd(), file)}: description is ${length} characters`);
    if (!noindex)
      assert.ok(length >= 70, `${path.relative(process.cwd(), file)}: description is only ${length} characters`);
  }
});
test("named case studies carry a summary of at most 155 characters", () => {
  for (const study of caseStudies.filter((s) => s.named)) {
    assert.ok(
      study.summary && study.summary.length >= 60 && study.summary.length <= 155,
      `${study.slug}: summary length ${study.summary?.length ?? 0}`,
    );
  }
  for (const article of insights) assert.ok(article.excerpt.length <= 160, article.slug);
});
import sitemap from "../app/sitemap";
import { contentUpdated } from "../content/site";
test("every sitemap entry has a valid lastModified and the homepage is included", () => {
  const entries = sitemap();
  assert.ok(entries.some((e) => e.url === "https://in2itebs.com/"));
  for (const entry of entries) {
    assert.ok(entry.lastModified instanceof Date && !Number.isNaN(entry.lastModified.getTime()), entry.url);
    assert.ok(!entry.url.endsWith("/thank-you/"));
  }
  assert.match(contentUpdated, /^\d{4}-\d{2}-\d{2}$/);
});
import { safeJsonLd } from "../lib/json-ld";
test("json-ld output cannot close its script tag early", () => {
  const out = safeJsonLd({ name: "</script><script>alert(1)</script>" });
  assert.ok(!out.includes("</script"));
  assert.deepEqual(JSON.parse(out), { name: "</script><script>alert(1)</script>" });
});
test("every inner page renders a breadcrumb trail", () => {
  for (const file of pages(path.join(process.cwd(), "app"))) {
    const source = readFileSync(file, "utf8");
    const match = source.match(/pageMetadata\((["'`])([^"'`]+)\1/);
    if (!match || match[2] === "/" || match[2] === "/404/") continue;
    assert.ok(source.includes("<BreadcrumbJsonLd"), `${path.relative(process.cwd(), file)} has no BreadcrumbJsonLd`);
    if (file.includes("[slug]")) continue;
    assert.ok(
      source.includes(`BreadcrumbJsonLd path="${match[2]}"`),
      `${path.relative(process.cwd(), file)}: breadcrumb path does not match pageMetadata path ${match[2]}`,
    );
  }
});
import { breadcrumbItems, isKnownPage } from "../lib/json-ld";
test("breadcrumbs skip intermediate levels that are not pages", () => {
  const legal = breadcrumbItems("/legal/privacy-policy/", undefined, isKnownPage);
  assert.deepEqual(
    legal.map((i) => i.name),
    ["Home", "Privacy Policy"],
  );
  assert.equal(legal[1].item, "https://in2itebs.com/legal/privacy-policy/");
  const concur = breadcrumbItems("/sap-enterprise-solutions/concur/", undefined, isKnownPage);
  assert.deepEqual(
    concur.map((i) => i.name),
    ["Home", "SAP Enterprise Solutions", "Concur"],
  );
  const study = breadcrumbItems(
    "/case-studies/wipro-infrastructure-engineering/",
    "Wipro Infrastructure Engineering",
    isKnownPage,
  );
  assert.deepEqual(
    study.map((i) => i.name),
    ["Home", "Clients & Case Studies", "Wipro Infrastructure Engineering"],
  );
});
test("nav labels do not depend on collection order", () => {
  // Hash children such as /advisory/#change-assurance must not claim the parent path.
  for (const [p, label] of [
    ["/advisory/", "Advisory Services"],
    ["/digital-data-ai/", "Digital, Data & AI"],
    ["/delivery-excellence/", "Delivery Excellence"],
  ] as const) {
    assert.deepEqual(
      breadcrumbItems(p).map((i) => i.name),
      ["Home", label],
      p,
    );
  }
  // Deep nav children are still known, so intermediate crumbs survive.
  assert.ok(isKnownPage("/sap-enterprise-solutions/rise-vs-grow/"));
  assert.deepEqual(
    breadcrumbItems("/sap-enterprise-solutions/rise-vs-grow/").map((i) => i.name),
    ["Home", "SAP Enterprise Solutions", "RISE vs GROW"],
  );
  // The default predicate applies the no-404 guard; an explicit passthrough restores the old behaviour.
  assert.deepEqual(
    breadcrumbItems("/legal/disclaimer/").map((i) => i.name),
    ["Home", "Disclaimer"],
  );
  assert.deepEqual(
    breadcrumbItems("/legal/disclaimer/", undefined, () => true).map((i) => i.name),
    ["Home", "Legal", "Disclaimer"],
  );
});

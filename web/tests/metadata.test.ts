import { test } from "node:test";
import assert from "node:assert/strict";
import { pageMetadata } from "../lib/metadata";

test("page metadata brands the social title and uses trailing-slash image URLs", () => {
  const m = pageMetadata("/about/", { title: "Who We Are", description: "x".repeat(80) });
  assert.equal(m.alternates?.canonical, "https://www.in2itebs.com/about/");
  const og = m.openGraph as { title: string; url: string; images: { url: string }[] };
  assert.equal(og.title, "Who We Are · In2IT EBS");
  assert.equal(og.url, "https://www.in2itebs.com/about/");
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
test("every sitemap entry has a valid lastModified and the homepage is included", async () => {
  const entries = await sitemap();
  assert.ok(entries.some((e) => e.url === "https://www.in2itebs.com/"));
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
    if (file.includes("[")) continue; // a dynamic route ([slug], [id]) has no literal path to compare
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
  assert.equal(legal[1].item, "https://www.in2itebs.com/legal/privacy-policy/");
  // Flat service URLs: the pillar groups the page in the menu but is not a path segment, so a
  // service page has exactly one crumb above it.
  const sap = breadcrumbItems("/services/sap/", undefined, isKnownPage);
  assert.deepEqual(
    sap.map((i) => i.name),
    ["Home", "Services", "SAP"],
  );
  const study = breadcrumbItems(
    "/case-studies/wipro-infrastructure-engineering/",
    "Wipro Infrastructure Engineering",
    isKnownPage,
  );
  assert.deepEqual(
    study.map((i) => i.name),
    ["Home", "Client work", "Wipro Infrastructure Engineering"],
  );
});
test("nav labels do not depend on collection order", () => {
  // Hash children such as /advisory/#change-assurance must not claim the parent path.
  for (const [p, label] of [
    ["/services/advisory/", "Advisory"],
    ["/services/digital-data-ai/", "Digital, Data & AI"],
    ["/services/enterprise-platforms/", "Enterprise Platforms"],
  ] as const) {
    assert.deepEqual(
      breadcrumbItems(p).map((i) => i.name),
      ["Home", "Services", label],
      p,
    );
  }
  // Deep nav children are still known, so intermediate crumbs survive.
  assert.ok(isKnownPage("/services/rise-s4hana/"));
  assert.deepEqual(
    breadcrumbItems("/services/rise-s4hana/").map((i) => i.name),
    ["Home", "Services", "RISE and S/4HANA"],
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

/**
 * Anonymised case studies must actually be anonymous.
 *
 * Swapping the client name is not anonymisation. "The 930 km Mombasa–Kisumu mainline" is one
 * railway; "PepsiCo's second-largest bottling franchisee outside the United States" is one
 * company. A reader who can reverse it in a single search has been told the client anyway, and
 * we have signalled that we thought we were hiding them — the worst of both.
 *
 * So this walks every field of every published study and fails on a client name or on any token
 * that identifies one. Add to TELLS whenever a new study is written.
 */
test("anonymised case studies leak no client name or identifying detail", async () => {
  const { caseStudies, publicCaseStudies } = await import("../content/case-studies");
  const { namedCaseStudiesApproved } = await import("../content/compliance");
  if (namedCaseStudiesApproved) return; // Named publication is approved; nothing to anonymise.

  const TELLS = [
    // Proper nouns that identify a single organisation
    "Telangana",
    "Andhra Pradesh",
    "Mombasa",
    "Kisumu",
    "PepsiCo",
    "Navratna",
    "bauxite",
    "National Aluminium",
    "Central Public Procurement Portal",
    "Odisha",
    "Delhi",
    "Gold Category",
    // Every named client, whole. Distinctive parts of a name are listed by hand rather than split
    // out mechanically, because "Engineering" and "India" are words an anonymised study is
    // entitled to use and a test that cries wolf gets deleted.
    ...caseStudies.filter((c) => c.named).map((c) => c.client),
    "Wipro",
    "WayCool",
    "VAHDAM",
    "Triveni",
    "Welspun",
    "Varun",
    "NALCO",
    "TGNPDCL",
    "APTRANSCO",
  ];

  const offenders: string[] = [];
  for (const study of publicCaseStudies) {
    const haystack = JSON.stringify(study);
    for (const tell of TELLS)
      if (new RegExp(`\\b${tell.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(haystack))
        offenders.push(`${study.slug}: "${tell}"`);
  }
  assert.deepEqual([...new Set(offenders)], []);
});

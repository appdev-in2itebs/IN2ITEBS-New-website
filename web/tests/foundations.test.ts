import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { cn } from "../lib/utils";
import { handleLead, resetRateLimitsForTest } from "../lib/lead-service";
import { measurementPayload } from "../lib/measurement";

// The per-email rate limit accepts at most three submissions of `valid` per test.
const valid = {
  name: "Test Person",
  email: "test@example.com",
  company: "Test Company",
  region: "IN",
  interest: "SAP",
  message: "Test only",
  offer: "conversation",
  assessment: "",
};
const request = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("http://localhost/api/lead/", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
beforeEach(resetRateLimitsForTest);
test("measurement allowlist cannot carry personal data", () => {
  assert.deepEqual(measurementPayload("lead_accepted"), { name: "lead_accepted" });
  assert.equal(measurementPayload({ name: "lead_accepted", email: "person@example.com" }), null);
  assert.equal(measurementPayload("person@example.com"), null);
});
test("custom heading sizes survive colour merging", () => {
  assert.equal(cn("text-h1 text-foreground"), "text-h1 text-foreground");
  assert.equal(cn("text-h1", "text-h2"), "text-h2");
});
test("invalid leads do not reach delivery", async () => {
  let sent = false;
  const response = await handleLead(request({ ...valid, email: "invalid" }), async () => {
    sent = true;
  });
  assert.equal(response.status, 400);
  assert.equal(sent, false);
});
test("success requires transport acceptance", async () => {
  let received = false;
  const response = await handleLead(request(valid), async (lead, id) => {
    assert.equal(lead.interest, "SAP");
    assert.ok(id);
    received = true;
  });
  assert.equal(response.status, 200);
  assert.equal(received, true);
  assert.match(response.headers.get("set-cookie") ?? "", /HttpOnly/);
});
test("delivery failure does not claim success", async () => {
  const response = await handleLead(request(valid), async () => {
    throw new Error("unavailable");
  });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
});
test("honeypots, oversized bodies and foreign origins are rejected", async () => {
  assert.equal((await handleLead(request({ ...valid, company_url: "spam" }), async () => {})).status, 400);
  assert.equal((await handleLead(request({ ...valid, message: "x".repeat(17000) }), async () => {})).status, 413);
  assert.equal((await handleLead(request(valid, { origin: "https://foreign.example" }), async () => {})).status, 403);
});
test("a trusted client address is limited to ten requests a minute", async () => {
  const previous = process.env.TRUST_PROXY_HEADERS;
  process.env.TRUST_PROXY_HEADERS = "1";
  try {
    for (let i = 0; i < 10; i++) await handleLead(request({}, { "x-forwarded-for": "203.0.113.7" }), async () => {});
    const blocked = await handleLead(request(valid, { "x-forwarded-for": "203.0.113.7" }), async () => {});
    assert.equal(blocked.status, 429);
    assert.equal(blocked.headers.get("retry-after"), "60");
    const other = await handleLead(request(valid, { "x-forwarded-for": "203.0.113.8" }), async () => {});
    assert.equal(other.status, 200);
  } finally {
    if (previous === undefined) delete process.env.TRUST_PROXY_HEADERS;
    else process.env.TRUST_PROXY_HEADERS = previous;
  }
});
test("without trusted addresses, eleven visitors are not locked out together", async () => {
  const previous = process.env.TRUST_PROXY_HEADERS;
  delete process.env.TRUST_PROXY_HEADERS;
  try {
    for (let i = 0; i < 11; i++)
      assert.equal(
        (await handleLead(request({ ...valid, email: `person${i}@example.com` }), async () => {})).status,
        200,
      );
  } finally {
    if (previous === undefined) delete process.env.TRUST_PROXY_HEADERS;
    else process.env.TRUST_PROXY_HEADERS = previous;
  }
});
test("the same email address is limited to three requests a minute", async () => {
  const previous = process.env.TRUST_PROXY_HEADERS;
  delete process.env.TRUST_PROXY_HEADERS;
  try {
    for (let i = 0; i < 3; i++) assert.equal((await handleLead(request(valid), async () => {})).status, 200);
    assert.equal((await handleLead(request(valid), async () => {})).status, 429);
  } finally {
    if (previous === undefined) delete process.env.TRUST_PROXY_HEADERS;
    else process.env.TRUST_PROXY_HEADERS = previous;
  }
});
test("the receipt cookie is Secure behind a TLS-terminating proxy", async () => {
  const previous = process.env.TRUST_PROXY_HEADERS;
  process.env.TRUST_PROXY_HEADERS = "1";
  try {
    const response = await handleLead(request(valid, { "x-forwarded-proto": "https" }), async () => {});
    assert.equal(response.status, 200);
    assert.match(response.headers.get("set-cookie") ?? "", /; Secure/);
  } finally {
    if (previous === undefined) delete process.env.TRUST_PROXY_HEADERS;
    else process.env.TRUST_PROXY_HEADERS = previous;
  }
});

// --- Logo data integrity (client ribbon + partner ecosystem) ---
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { clients } from "../content/clients";
import { homeEcosystem, partnerCategories } from "../content/partner-ecosystem";

test("client ribbon has no duplicate entries or duplicate artwork", () => {
  const slugs = clients.map((c) => c.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate slug");
  const logos = clients.map((c) => c.logo).filter(Boolean) as string[];
  assert.equal(new Set(logos).size, logos.length, "two clients share a logo path");
  const hashes = new Map<string, string>();
  for (const client of clients) {
    const file = path.join(process.cwd(), "public", client.logo!);
    assert.ok(existsSync(file), `${client.name}: missing ${client.logo}`);
    const digest = createHash("sha1").update(readFileSync(file)).digest("hex");
    assert.ok(!hashes.has(digest), `${client.name} uses the same artwork as ${hashes.get(digest)}`);
    hashes.set(digest, client.name);
  }
});

test("every partner logo path resolves to a file and the homepage grid mirrors the ecosystem data", () => {
  for (const category of partnerCategories)
    for (const partner of category.partners)
      if (partner.logo)
        assert.ok(
          existsSync(path.join(process.cwd(), "public", partner.logo)),
          `${partner.name}: missing ${partner.logo}`,
        );
  for (const entry of homeEcosystem) {
    const source = partnerCategories.flatMap((c) => c.partners).find((p) => p.name === entry.name);
    assert.ok(source, `${entry.name} is on the homepage but not in partnerCategories`);
    assert.equal(entry.logo, source!.logo ?? null);
  }
  const withLogo: string[] = homeEcosystem.filter((e) => e.logo).map((e) => e.name);
  for (const name of [
    "SAP",
    "Microsoft",
    "Oracle",
    "Salesforce",
    "Workday",
    "IBM",
    "HP",
    "OpenText",
    "SAP Concur",
    "Qualtrics",
  ])
    assert.ok(withLogo.includes(name), `${name} should have artwork`);
});

// --- Enquiry origin allowlist (public site + trusted proxy forwarding) ---

test("browser origins that match the public site or trusted forwarded headers are accepted", async () => {
  const previous = process.env.TRUST_PROXY_HEADERS;
  process.env.TRUST_PROXY_HEADERS = "1";
  try {
    let delivered = 0;
    const forwarded = await handleLead(
      request(valid, {
        origin: "https://in2itebs.com",
        host: "in2itebs.com",
        "x-forwarded-proto": "https",
        "x-forwarded-host": "in2itebs.com",
      }),
      async () => {
        delivered++;
      },
    );
    assert.equal(forwarded.status, 200);
    const preview = await handleLead(
      request(valid, {
        origin: "https://preview.example.net",
        "x-forwarded-proto": "https",
        "x-forwarded-host": "preview.example.net",
      }),
      async () => {
        delivered++;
      },
    );
    assert.equal(preview.status, 200);
    const defaultPort = await handleLead(
      request(valid, {
        origin: "https://tunnel.example.net",
        "x-forwarded-proto": "https",
        "x-forwarded-host": "tunnel.example.net:443",
      }),
      async () => {
        delivered++;
      },
    );
    assert.equal(
      defaultPort.status,
      200,
      "a forwarded host carrying the default port must normalise to the browser origin",
    );
    const foreign = await handleLead(
      request(valid, {
        origin: "https://foreign.example",
        "x-forwarded-proto": "https",
        "x-forwarded-host": "in2itebs.com",
      }),
      async () => {
        delivered++;
      },
    );
    assert.equal(foreign.status, 403);
    assert.equal(delivered, 3);
  } finally {
    if (previous === undefined) delete process.env.TRUST_PROXY_HEADERS;
    else process.env.TRUST_PROXY_HEADERS = previous;
  }
});
test("the public site origin is accepted even when forwarded headers are not trusted", async () => {
  const previous = process.env.TRUST_PROXY_HEADERS;
  delete process.env.TRUST_PROXY_HEADERS;
  try {
    const response = await handleLead(request(valid, { origin: "https://in2itebs.com" }), async () => {});
    assert.equal(response.status, 200);
    const www = await handleLead(request(valid, { origin: "https://www.in2itebs.com" }), async () => {});
    assert.equal(www.status, 200);
    const untrusted = await handleLead(
      request(valid, {
        origin: "https://preview.example.net",
        "x-forwarded-proto": "https",
        "x-forwarded-host": "preview.example.net",
      }),
      async () => {},
    );
    assert.equal(untrusted.status, 403, "forwarded headers must not be trusted unless TRUST_PROXY_HEADERS=1");
  } finally {
    if (previous === undefined) delete process.env.TRUST_PROXY_HEADERS;
    else process.env.TRUST_PROXY_HEADERS = previous;
  }
});
test("ALLOWED_ORIGINS entries are normalised before they are matched", async () => {
  const previousTrust = process.env.TRUST_PROXY_HEADERS;
  const previousAllowed = process.env.ALLOWED_ORIGINS;
  delete process.env.TRUST_PROXY_HEADERS;
  process.env.ALLOWED_ORIGINS = "https://staging.example.com/";
  try {
    const staging = await handleLead(request(valid, { origin: "https://staging.example.com" }), async () => {});
    assert.equal(staging.status, 200, "a trailing slash in ALLOWED_ORIGINS must not stop the entry matching");
    const foreign = await handleLead(request(valid, { origin: "https://foreign.example" }), async () => {});
    assert.equal(foreign.status, 403);
  } finally {
    if (previousTrust === undefined) delete process.env.TRUST_PROXY_HEADERS;
    else process.env.TRUST_PROXY_HEADERS = previousTrust;
    if (previousAllowed === undefined) delete process.env.ALLOWED_ORIGINS;
    else process.env.ALLOWED_ORIGINS = previousAllowed;
  }
});
test("the canonical host is defined once", () => {
  for (const file of ["app/sitemap.ts", "app/robots.ts", "components/seo/json-ld.tsx", "lib/metadata.ts"]) {
    const source = readFileSync(path.join(process.cwd(), file), "utf8");
    assert.ok(!/const BASE\s*=\s*"https:\/\//.test(source), `${file} redefines the site host`);
    assert.ok(source.includes("SITE_URL"), `${file} must import SITE_URL`);
  }
});
test("colour opacity modifiers use values Tailwind can generate", () => {
  const roots = ["app", "components"];
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.tsx?$/.test(entry)) {
        const source = readFileSync(full, "utf8");
        for (const m of source.matchAll(
          /\b(?:text|bg|border|via|from|to|ring|fill|stroke|divide|outline|decoration|placeholder)-[a-z][a-z-]*\/(\d{1,3})(?![\d\]])/g,
        )) {
          if (/^text-(?:xs|sm|base|lg|\d?xl)\//.test(m[0])) continue;
          /* line-height shorthand, not opacity */ if (Number(m[1]) % 5 !== 0)
            offenders.push(`${path.relative(process.cwd(), full)}: ${m[0]}`);
        }
      }
    }
  };
  for (const root of roots) walk(path.join(process.cwd(), root));
  assert.deepEqual(offenders, []);
});
test("class names used in markup are either Tailwind utilities or defined in globals.css", () => {
  const css = readFileSync(path.join(process.cwd(), "app/globals.css"), "utf8");
  assert.ok(
    new RegExp(`\\.stage-card-featured\\b`).test(css),
    'the "defined" branch must be able to match a class globals.css really defines',
  );
  for (const hook of [
    "content-reveal",
    "cta-light",
    "flow-line",
    "metric-grid",
    // Premium restyle utilities must exist in globals.css wherever a component uses them.
    "glass",
    "glass-card",
    "glass-elevated",
    "glass-pill",
    "glass-gold",
    "hero-ambient",
    "reveal",
    "text-gradient-numeral",
    "nav-link",
    "btn-shimmer",
    "icon-tile",
    // Ambient video sections (2026-09-15): the palette scope, the veil and the liquid-glass tiles.
    "on-video",
    "video-veil",
    "glass-liquid",
  ]) {
    const defined = new RegExp(`\\.${hook}\\b`).test(css);
    const used = [
      "components/motion/reveal.tsx",
      "components/sections/cta-section.tsx",
      "app/page.tsx",
      "components/ui/button.tsx",
      "components/ui/card.tsx",
      "components/layout/header.tsx",
      "components/sections/brand-hero.tsx",
      "components/sections/home-partners.tsx",
    ].some((f) => readFileSync(path.join(process.cwd(), f), "utf8").includes(hook));
    assert.ok(defined || !used, `${hook} is used but never defined`);
  }
});

// --- Contact data from one source ---
import { offices, regionalContacts, officeCities } from "../content/offices";
import { regions } from "../content/site";
test("regional contacts and office cities are derived from the office list", () => {
  assert.equal(regionalContacts[0].region, "Global");
  assert.equal(new Set(regionalContacts.map((c) => c.email)).size, regionalContacts.length);
  for (const c of regionalContacts)
    assert.ok(
      offices.some((o) => o.email === c.email),
      c.email,
    );
  assert.deepEqual(
    officeCities,
    offices.map((o) => o.city),
  );
  for (const region of regions)
    assert.ok(
      offices.some((o) => o.email === region.email),
      `${region.code} email is not an office email`,
    );
});

test("every component and content module is imported somewhere", () => {
  const sources = new Map<string, string>();
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.(tsx?|mjs)$/.test(entry)) sources.set(full, readFileSync(full, "utf8"));
    }
  };
  for (const root of ["app", "components", "content", "lib", "tests", "scripts"]) walk(path.join(process.cwd(), root));
  sources.set(
    path.join(process.cwd(), "next.config.mjs"),
    readFileSync(path.join(process.cwd(), "next.config.mjs"), "utf8"),
  );
  // The match must sit inside an import specifier: a bare data string such as `slug: "converged-intelligence"` is not an import.
  const specifier = (base: string) => {
    const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(?:from\\s*|require\\(\\s*|import\\(\\s*)['"][^'"]*[/]${escaped}(\\.mjs)?['"]`);
  };
  assert.ok(
    !specifier("converged-intelligence").test('const x = { slug: "converged-intelligence" };'),
    "a data string must not count as an import",
  );
  assert.ok(
    specifier("converged-intelligence").test('import { X } from "@/components/sections/converged-intelligence";'),
    "an import specifier must count as an import",
  );
  assert.ok(
    specifier("redirects").test('import {redirects} from "./content/redirects.mjs"'),
    "an .mjs import specifier must count as an import",
  );
  const unused: string[] = [];
  for (const file of sources.keys()) {
    // Only the shared components/ and content/ folders: a route folder of the same name (app/admin/content/)
    // holds pages Next.js loads by their location, never by an import.
    if (!/^(components|content)[\\/]/.test(path.relative(process.cwd(), file)) || /types\.ts$/.test(file)) continue;
    const pattern = specifier(path.basename(file).replace(/\.(tsx?|mjs)$/, ""));
    const imported = [...sources.entries()].some(([other, source]) => other !== file && pattern.test(source));
    if (!imported) unused.push(path.relative(process.cwd(), file));
  }
  assert.deepEqual(unused, []);
});

test("legacy palette classes are no longer used in markup", () => {
  // The premium restyle moved every page onto semantic roles; the legacy aliases stay in tailwind.config.ts only as migration adapters.
  // `white` is the trap among them and is matched on every prefix, not just `bg-white`: the alias
  // resolves to `--color-legacy-white`, which is `bg-surface` -- dark in the dark theme -- so a
  // `text-white` or `border-white` reads as a light value in markup and paints a dark one.
  const legacy =
    /\b(?:text-navy|(?:text|bg|border|ring)-white|text-grey-muted|bg-off-white|(?:text|bg|border|ring)-blue-(?:accent|light|pale)|shadow-soft|shadow-lift|rounded-xl2|rounded-xl3|border-navy|bg-navy|ring-navy|(?:text|bg|border|rule)-sand|font-serif)(?:\/[\w.[\]]+)?\b/g;
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.tsx$/.test(entry))
        for (const m of readFileSync(full, "utf8").matchAll(legacy))
          offenders.push(`${path.relative(process.cwd(), full)}: ${m[0]}`);
    }
  };
  for (const root of ["app", "components"]) walk(path.join(process.cwd(), root));
  assert.deepEqual(offenders, []);
});

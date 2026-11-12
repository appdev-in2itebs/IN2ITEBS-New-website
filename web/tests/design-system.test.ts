import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const read = (file: string) => readFileSync(path.join(process.cwd(), file), "utf8");
const css = () => read("app/globals.css");

/** Returns the body of the first CSS block whose selector list contains `selector`. */
function block(source: string, selector: string): string {
  const start = source.indexOf(selector);
  assert.ok(start >= 0, `${selector} block missing`);
  const open = source.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    if (source[i] === "{") depth++;
    if (source[i] === "}") depth--;
    if (depth === 0) return source.slice(open + 1, i);
  }
  throw new Error(`unterminated block for ${selector}`);
}

test("gold and glass tokens exist in the root block and the on-video scope", () => {
  const source = css();
  const light = block(source, ":root {");
  const dark = block(source, ".on-video {");
  for (const token of [
    "--color-gold:",
    "--color-gold-display:",
    "--color-gold-on-brand:",
    "--color-gold-soft:",
    "--color-glass:",
    "--color-glass-line:",
    "--shadow-glass:",
    "--shadow-glass-hover:",
    "--glow-gold:",
    "--glass-alpha:",
    "--glass-alpha-elevated:",
    "--glass-blur:",
    "--gradient-heading:",
    "--gradient-heading-on-brand:",
    "--gradient-numeral:",
  ]) {
    assert.ok(light.includes(token), `light theme lacks ${token}`);
    assert.ok(dark.includes(token), `dark theme lacks ${token}`);
  }
  // The accent has moved twice: gold/amber until 2026-09-17, a deep teal until 2026-11-12, and
  // now the brand palette. These pins are what stop it moving again by accident.
  //
  // Two values, because one accent cannot serve both surfaces. On light it is Steel Blue #3F75A3
  // (4.90:1 on white; Muted Sand would be 1.69:1). On navy it is Muted Sand #CDC8A5 (9.73:1; Steel
  // Blue would be 3.36:1 and fail). Brand book v2.0 sets this rule.
  assert.match(light, /--color-gold:\s*54\.57% 0\.092 246\.3/);
  assert.match(light, /--color-gold-on-brand:\s*82\.77% 0\.047 100\.6/);
  // Hue 196 is the retired teal. It must not reappear under any token name.
  assert.doesNotMatch(light, /--color-gold[\w-]*:\s*[\d.]+% [\d.]+ 196/);
  assert.doesNotMatch(dark, /--color-gold[\w-]*:\s*[\d.]+% [\d.]+ 196/);
  assert.match(dark, /--color-bg-canvas:\s*12\.87% 0\.008 268\.5/);
  // Over video both surfaces are dark, so both take Muted Sand.
  assert.match(dark, /--color-gold:\s*82\.77% 0\.047 100\.6/);
});

test("the on-brand scope remaps gold to the champagne tone", () => {
  const onBrand = block(css(), ".theme-on-brand {");
  assert.match(onBrand, /--color-gold:\s*var\(--color-gold-on-brand\)/);
  assert.match(onBrand, /--color-gold-display:\s*var\(--color-gold-on-brand\)/);
});

test("tailwind exposes the gold and glass roles", () => {
  const config = read("tailwind.config.ts");
  // Prettier leaves `gold` and `glass` unquoted and quotes the hyphenated keys, so the quotes are optional here.
  for (const role of ["gold", "gold-display", "gold-on-brand", "gold-soft", "glass", "glass-line"])
    assert.ok(new RegExp(`"?${role}"?:\\s*"oklch\\(var\\(--color-${role}\\) / <alpha-value>\\)"`).test(config), role);
  for (const shadow of ["glass:", '"glass-hover":', '"glow-gold":']) assert.ok(config.includes(shadow), shadow);
});

test("three.js left with the WebGL hero", () => {
  // 2026-09-15: the sculpture was replaced by an ambient video; nothing may pull three back in.
  const pkg = JSON.parse(read("package.json"));
  assert.equal(pkg.dependencies.three, undefined);
  assert.equal(pkg.devDependencies["@types/three"], undefined);
});

test("the video sections carry one 20% black veil token and the old wash layers are gone", () => {
  const source = css();
  const root = block(source, ":root {");
  assert.ok(root.includes("--video-veil-alpha: 0.2;"), "root lacks --video-veil-alpha: 0.2");
  assert.ok(root.includes("--video-veil-alpha-hero: 0.55;"), "root lacks --video-veil-alpha-hero: 0.55");
  assert.ok(source.includes(".video-veil {"), ".video-veil is not defined");
  assert.ok(
    // The hero is the only section on the heavier veil; the services directory that briefly
    // shared it went on 2026-09-17.
    source.includes("[data-brand-hero] {\n    --video-veil-alpha: var(--video-veil-alpha-hero);"),
    "the hero does not take the heavier veil",
  );
  for (const gone of [
    "--video-tint-alpha:",
    "--video-wash-base:",
    "--video-wash-base-loose:",
    "--video-wash-copy:",
    "--video-wash-methods:",
    ".video-tint",
    ".video-wash",
  ])
    assert.ok(!source.includes(gone), `${gone} should be gone`);
});

test("dark mode is gone: no theme classes, toggle, cookie script or service carousel", () => {
  const source = css();
  assert.ok(!source.includes(".theme-dark"), "the .theme-dark scope should be gone");
  assert.ok(!source.includes(".theme-light"), "the .theme-light scope should be gone");
  assert.ok(!existsSync(path.join(process.cwd(), "components/layout/theme-toggle.tsx")), "theme-toggle.tsx");
  assert.ok(!existsSync(path.join(process.cwd(), "components/sections/service-hero.tsx")), "service-hero.tsx");
  const layout = read("app/layout.tsx");
  assert.ok(!layout.includes("in2it-theme"), "layout still reads the theme cookie");
  assert.ok(!layout.includes("theme-init"), "layout still ships the theme script");
  const header = read("components/layout/header.tsx");
  assert.ok(!header.includes("ThemeToggle"), "header still mounts the toggle");
  assert.ok(!header.includes("theme-logo-"), "header still swaps logos per theme");
});

test("every glass, gradient and motion utility the components use is defined", () => {
  const source = css();
  for (const hook of [
    "glass",
    "glass-elevated",
    "glass-card",
    "glass-card-selected",
    "glass-card-bezel",
    "glass-pill",
    "glass-liquid",
    "glass-gold",
    "rule-gold",
    "hero-ambient",
    "reveal",
    "stagger",
    "text-gradient-heading",
    "text-gradient-numeral",
    "text-gold",
    "heading-plain",
    "nav-link",
    "btn-shimmer",
    "icon-tile",
  ])
    assert.ok(new RegExp(`\\.${hook}(?![\\w-])`).test(source), `.${hook} is not defined in globals.css`);
});

test("headings are solid colour, so an accent phrase can take its own", () => {
  const source = css();
  // Until 2026-11-12 every h1 and h2 in main was painted with a gradient and clipped to the text,
  // which set the computed colour to rgba(0,0,0,0). The accent phrase could not then take a colour
  // of its own — the inherited transparent fill won — and the heading degraded in forced-colours
  // mode and printed unpredictably. The gradient survives as an opt-IN class.
  assert.doesNotMatch(source, /main h1,\s*main h2\s*\{[^}]*background-image:\s*var\(--gradient-heading\)/);
  assert.match(source, /\.text-gradient-heading\s*\{[^}]*background-image:\s*var\(--gradient-heading\)/);
  // The accent is the brand's one typographic device: Newsreader italic, in the accent colour.
  assert.match(source, /\.accent\s*\{[^}]*italic/);
  assert.match(source, /\.accent\s*\{[^}]*oklch\(var\(--color-gold\)\)/);
});

test("reveals hide content only after hydration and never while paused or reduced", () => {
  const source = css();
  const hidden = source.match(/([^\n{}]*)\{\s*opacity:\s*0;\s*transform:\s*translateY\(18px\);\s*\}/);
  assert.ok(hidden, "no reveal hiding rule");
  assert.equal(
    hidden![1].trim(),
    'html[data-motion-ready]:not([data-motion-paused="true"]) .reveal:not([data-reveal="in"])',
  );
  const reduced = block(source, "@media (prefers-reduced-motion: reduce)");
  assert.match(reduced, /\.reveal\s*\{[^}]*opacity:\s*1 !important/);
});

test("Reveal, Stagger and StaggerItem render the reveal hooks", () => {
  const source = read("components/motion/reveal.tsx");
  assert.match(source, /"reveal"/);
  assert.match(source, /"stagger"/);
  assert.match(source, /--reveal-delay/);
  assert.match(source, /Math\.min\(index, 8\) \* 70/);
  // `Reveal` honours its own `delay` prop (seconds at the call sites) through the same custom property.
  assert.match(source, /Math\.round\(delay \* 1000\)/);
});

test("MotionObserver is mounted before main and is the only owner of the motion flags", () => {
  const layout = read("app/layout.tsx");
  const observerAt = layout.indexOf("<MotionObserver />");
  assert.ok(observerAt >= 0, "MotionObserver is not mounted in the root layout");
  assert.ok(observerAt < layout.indexOf('<main id="main">'), "MotionObserver must precede main");
  // The hero's pause control went on 2026-09-15 pm, and the ownership handshake with it.
  assert.ok(
    !existsSync(path.join(process.cwd(), "components/sections/motion-controls.tsx")),
    "motion-controls.tsx should be gone",
  );
  const observer = read("components/motion/motion-observer.tsx");
  assert.match(observer, /IntersectionObserver/);
  assert.match(observer, /dataset\.reveal = "in"/);
  assert.doesNotMatch(observer, /motionOwner/);
  // The offscreen pause for the client ribbon moved here from the control.
  assert.match(observer, /motionOffscreen/);
  assert.match(observer, /\.client-ribbon/);
});

test("the ambient video gates on motion state and never autoplays under reduced motion or data saver", () => {
  const source = read("components/media/ambient-video.tsx");
  assert.match(source, /"use client"/);
  for (const hook of ["data-motion-paused", "prefers-reduced-motion", "saveData", "IntersectionObserver"])
    assert.ok(source.includes(hook), `ambient video ignores ${hook}`);
  for (const attr of ["muted", "loop", "playsInline", "poster"])
    assert.ok(source.includes(attr), `video lacks ${attr}`);
  assert.ok(!existsSync(path.join(process.cwd(), "components/hero")), "the WebGL hero directory should be gone");
});

test("check-build no longer looks for a three.js chunk", () => {
  const script = read("scripts/check-build.mjs");
  assert.ok(!script.includes("TorusKnotGeometry"));
  assert.ok(!script.includes("700_000"));
});

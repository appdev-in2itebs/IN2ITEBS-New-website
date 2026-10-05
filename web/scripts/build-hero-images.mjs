// Builds the hero pictures from the originals in assets/hero-images/ (at the repo root):
//
//   assets/hero-images/<section>/<name>.png  ->  web/public/heroes/<section>/<name>.<hash>.webp
//
// and writes web/content/hero-images.json, which the pages read to find them. Sections mirror the
// site: pages/ (one per page, by name), services/, industries/ and partners/ (by the page's slug, so
// a new file there shows up on its page with no code change), and about/ and careers/ for those menus.
//
//   npm run heroes
//
// Every picture needs a line in assets/hero-images/alt-text.json ("<section>/<name>": "what it
// shows"); the script stops if one is missing. Each picture is trimmed to its visible content with a
// slim margin, fitted within 1200px (the hero column is about 600 CSS px, so this covers a 2x screen)
// and saved as a transparent WebP.
//
// Two kinds of original are accepted, and both come out as cut-outs:
// - a PNG already cut out on a transparent ground;
// - a PNG rendered on a near-white studio ground: the ground is lifted to pure white and then turned
//   into transparency.
import { readdirSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

const sourceRoot = resolve("../assets/hero-images");
const targetRoot = resolve("public/heroes");
const manifestPath = resolve("content/hero-images.json");
const sections = ["pages", "services", "industries", "partners", "about", "careers"];

const alt = JSON.parse(readFileSync(join(sourceRoot, "alt-text.json"), "utf8"));

/** Per channel, the median of a thin band around the picture's border. */
function groundColour(data, info) {
  const band = Math.round(Math.min(info.width, info.height) * 0.03);
  const channels = [[], [], []];
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (x >= band && x < info.width - band && y >= band && y < info.height - band) continue;
      const i = (y * info.width + x) * info.channels;
      for (let c = 0; c < 3; c++) channels[c].push(data[i + c]);
    }
  }
  return channels.map((values) => values.sort((a, b) => a - b)[values.length >> 1]);
}

/**
 * Removes a white ground: each pixel keeps only what differs from white, as alpha, with its colour
 * corrected so that laid over white it looks exactly as before. Shadows turn into soft translucency.
 */
async function whiteToAlpha(png) {
  const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, o = 0; i < data.length; i += 3, o += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const a = Math.max(255 - r, 255 - g, 255 - b) / 255;
    if (a < 0.04) continue; // white, or faint noise in the white: leave transparent
    out[o] = Math.round(255 - (255 - r) / a);
    out[o + 1] = Math.round(255 - (255 - g) / a);
    out[o + 2] = Math.round(255 - (255 - b) / a);
    out[o + 3] = Math.round(a * 255);
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer();
}

/** A cut-out has (nearly) see-through corners; a studio render has none. */
function isCutOut(data, info) {
  if (info.channels < 4) return false;
  const corners = [
    [2, 2],
    [info.width - 3, 2],
    [2, info.height - 3],
    [info.width - 3, info.height - 3],
  ];
  return corners.every(([x, y]) => data[(y * info.width + x) * 4 + 3] < 16);
}

const missingAlt = sections.flatMap((section) =>
  existsSync(join(sourceRoot, section))
    ? readdirSync(join(sourceRoot, section))
        .filter((file) => file.endsWith(".png"))
        .map((file) => `${section}/${file.slice(0, -4)}`)
        .filter((key) => !alt[key])
    : [],
);
if (missingAlt.length) {
  console.error("build-hero-images: add these to assets/hero-images/alt-text.json first:");
  for (const key of missingAlt) console.error(`  "${key}": "what the picture shows",`);
  process.exit(1);
}

rmSync(targetRoot, { recursive: true, force: true });
const manifest = {};
let total = 0;
for (const section of sections) {
  const dir = join(sourceRoot, section);
  if (!existsSync(dir)) continue;
  mkdirSync(join(targetRoot, section), { recursive: true });
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".png"))) {
    const name = file.slice(0, -4);
    const key = `${section}/${name}`;
    const { data, info } = await sharp(join(dir, file)).raw().toBuffer({ resolveWithObject: true });
    const kind = isCutOut(data, info) ? "object" : "scene";
    // 1. A scene's studio ground is lifted to pure white first, so it trims and blends cleanly.
    let source = join(dir, file);
    if (kind === "scene") {
      const ground = groundColour(data, info);
      source = await sharp(source)
        .removeAlpha()
        // 5% past the measured ground: the studio floor is a few percent darker near the edges, and
        // anything short of pure white would show as a faint box once trimmed and multiplied.
        .linear(
          ground.map((channel) => 255 / (channel * 0.95)),
          [0, 0, 0],
        )
        .png()
        .toBuffer();
    }
    // 2. The art packs leave wide empty margins (a partner logo fills a quarter of its canvas), which
    //    made every picture look small in its hero box. Trim to the visible content, then give back a
    //    slim margin: enough for a cut-out's soft shadow, and for a scene the zone its edge fade uses.
    const trimmed = await sharp(source)
      .trim({ threshold: kind === "scene" ? 18 : 1 })
      .toBuffer({ resolveWithObject: true });
    const pad = Math.round(Math.max(trimmed.info.width, trimmed.info.height) * (kind === "scene" ? 0.1 : 0.03));
    let padded = await sharp(trimmed.data)
      .extend({
        top: pad,
        bottom: pad,
        left: pad,
        right: pad,
        background: kind === "scene" ? "#ffffff" : { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();
    // 3. A scene's white ground becomes real transparency ("colour to alpha"), so it sits on the
    //    page like a cut-out in every browser. A CSS multiply blend could not do this: the hero's
    //    animated wrapper isolates it from the page background, leaving a pale box.
    if (kind === "scene") padded = await whiteToAlpha(padded);
    const image = sharp(padded).resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true });
    const { data: webp, info: written } = await image
      .webp({ quality: 82, alphaQuality: 90, effort: 6 })
      .toBuffer({ resolveWithObject: true });
    const { width, height } = written;
    // A fingerprint of the content in the file name: when a picture changes, its URL changes, so no
    // browser, Cloudflare or Next.js image cache can keep showing the old one.
    const hashed = `${name}.${createHash("sha256").update(webp).digest("hex").slice(0, 8)}.webp`;
    writeFileSync(join(targetRoot, section, hashed), webp);
    const size = webp.length;
    total += size;
    manifest[key] = { src: `/heroes/${section}/${hashed}`, alt: alt[key], width, height };
    console.log(`${key.padEnd(62)} ${kind === "scene" ? "studio" : "cutout"} ${(size / 1024).toFixed(0)} KB`);
  }
}
const sorted = Object.fromEntries(
  Object.keys(manifest)
    .sort()
    .map((key) => [key, manifest[key]]),
);
writeFileSync(manifestPath, JSON.stringify(sorted, null, 2) + "\n");
console.log(
  `build-hero-images: ${Object.keys(sorted).length} pictures, ${(total / 1024 / 1024).toFixed(1)} MB; wrote content/hero-images.json`,
);

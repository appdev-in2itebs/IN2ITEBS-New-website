// Builds the hero pictures from the originals in assets/hero-images/ (at the repo root):
//
//   assets/hero-images/<section>/<name>.png  ->  web/public/heroes/<section>/<name>.webp
//
// and writes web/content/hero-images.json, which the pages read to find them. Sections mirror the
// site: pages/ (one per page, by name), services/, industries/ and partners/ (by the page's slug, so
// a new file there shows up on its page with no code change) and careers/.
//
//   npm run heroes
//
// Every picture needs a line in assets/hero-images/alt-text.json ("<section>/<name>": "what it
// shows"); the script stops if one is missing. The output is resized to 1200px wide (the hero column
// is at most 576 CSS px, so this covers a 2x screen) and saved as WebP.
//
// Two kinds of original are handled:
// - "object": a PNG cut out on a transparent ground, shown as it is;
// - "scene": a PNG rendered on a near-white studio ground. Its ground is lifted to pure white here
//   and the page multiplies it into the canvas (components/sections/hero-media.tsx), so it vanishes.
import { readdirSync, mkdirSync, statSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";

const sourceRoot = resolve("../assets/hero-images");
const targetRoot = resolve("public/heroes");
const manifestPath = resolve("content/hero-images.json");
const sections = ["pages", "services", "industries", "partners", "careers"];

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
    let image = sharp(join(dir, file)).resize({ width: 1200, withoutEnlargement: true });
    if (kind === "scene") {
      const ground = groundColour(data, info);
      image = image.removeAlpha().linear(
        ground.map((channel) => 255 / channel),
        [0, 0, 0],
      );
    }
    const out = join(targetRoot, section, `${name}.webp`);
    await image.webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(out);
    const size = statSync(out).size;
    total += size;
    manifest[key] = { src: `/heroes/${key}.webp`, alt: alt[key], kind };
    console.log(`${key.padEnd(62)} ${kind.padEnd(6)} ${(size / 1024).toFixed(0)} KB`);
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

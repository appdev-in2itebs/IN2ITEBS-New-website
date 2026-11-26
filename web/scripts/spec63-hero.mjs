// Turns one Firefly download for the 63-figure specification (docs/FIREFLY_PROMPTS_SPEC_63.md)
// into the two files the site keeps:
//
//   node scripts/spec63-hero.mjs <firefly-download> <name>
//
//   ../assets/firefly/spec63/<name>.png   master, 3:2, at least 2400 x 1600, object right of centre
//   public/hero/<name>.webp               what the page loads: a transparent cut-out, 1200 px wide
//
// Firefly Image 5 has no 3:2 option and paints the "off-white" field as a warm cream, often with a
// vignette or a floor, so the field is estimated per pixel and divided out:
// - the field is measured from the border and lifted to the brand off-white #F7F8FA in the master;
// - the object's bounding box is found and the 3:2 frame is placed so the object sits right of
//   centre, as the specification asks, filling any gap with the field colour;
// - for the web file the field is lifted to white and turned into transparency, the same way the
//   other hero cut-outs are made (scripts/build-hero-images.mjs), so it sits on any page background.
import { mkdirSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import sharp from "sharp";

// Optional third argument "top,right,bottom,left" as fractions to cut off the download first, for a
// result whose painted floor or stray mark would otherwise survive (e.g. "0,0,0.25,0").
const [rawInput, name, cutArg] = process.argv.slice(2);
if (!rawInput || !name || !/^[a-z0-9-]+$/.test(name)) {
  console.error("usage: node scripts/spec63-hero.mjs <firefly-download> <name> [top,right,bottom,left]");
  process.exit(1);
}
let input = rawInput;
if (cutArg) {
  const [t, r, b, l] = cutArg.split(",").map(Number);
  const m = await sharp(rawInput).metadata();
  const left = Math.round(m.width * l),
    top = Math.round(m.height * t);
  input = await sharp(rawInput)
    .extract({ left, top, width: Math.round(m.width * (1 - l - r)), height: Math.round(m.height * (1 - t - b)) })
    .png()
    .toBuffer();
}
const masterPath = resolve("../assets/firefly/spec63", `${name}.png`);
const webPath = resolve("public/hero", `${name}.webp`);
const FIELD = [0xf7, 0xf8, 0xfa];

/** Per channel, the median of a thin band around the picture's border. */
function groundColour(data, info) {
  const band = Math.round(Math.min(info.width, info.height) * 0.03);
  const channels = [[], [], []];
  for (let y = 0; y < info.height; y += 2)
    for (let x = 0; x < info.width; x += 2) {
      if (x >= band && x < info.width - band && y >= band && y < info.height - band) continue;
      const i = (y * info.width + x) * info.channels;
      for (let c = 0; c < 3; c++) channels[c].push(data[i + c]);
    }
  return channels.map((v) => v.sort((a, b) => a - b)[v.length >> 1]);
}

const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const ground = groundColour(data, info);
const N = info.width * info.height;

// The field is rarely flat: Firefly paints vignettes, floors and soft gradients. Estimate it per pixel:
// replace everything that is clearly object (far from the field colour) by the field colour, then blur
// hard. Dividing by that estimate makes the whole field white while leaving the object's colours alone.
const filled = Buffer.from(data);
for (let p = 0; p < N; p++) {
  const i = p * 3;
  const d = Math.max(...[0, 1, 2].map((c) => Math.abs(data[i + c] - ground[c])));
  if (d > 28) for (let c = 0; c < 3; c++) filled[i + c] = ground[c];
}
const bg = await sharp(filled, { raw: info })
  .blur(Math.max(8, info.width * 0.04))
  .raw()
  .toBuffer();
const lifted = Buffer.alloc(data.length); // the picture on pure white
for (let i = 0; i < data.length; i++)
  lifted[i] = Math.min(255, Math.round((data[i] * 255) / Math.max(1, bg[i] * 0.985)));

// Object box: whatever is still clearly non-white once lifted.
let x0 = info.width,
  y0 = info.height,
  x1 = -1,
  y1 = -1;
for (let p = 0; p < N; p++) {
  const i = p * 3;
  if (Math.max(255 - lifted[i], 255 - lifted[i + 1], 255 - lifted[i + 2]) < 26) continue;
  const x = p % info.width,
    y = (p / info.width) | 0;
  if (x < x0) x0 = x;
  if (x > x1) x1 = x;
  if (y < y0) y0 = y;
  if (y > y1) y1 = y;
}
if (x1 < 0) throw new Error("no object found against the field");

// 1. Master: the lifted picture multiplied onto #F7F8FA, framed 3:2 with the object's centre at 58% of
//    the width (never closer than 4% to the right edge) and its middle at the frame's middle.
const onField = Buffer.alloc(data.length);
for (let i = 0; i < data.length; i++) onField[i] = Math.round((lifted[i] * FIELD[i % 3]) / 255);
const W = Math.max(info.width, Math.round((info.height * 3) / 2));
const H = Math.round((W * 2) / 3);
const left = Math.round(Math.min(W * 0.58 - (x0 + x1) / 2, W * 0.96 - x1));
const top = Math.round(H / 2 - (y0 + y1) / 2);
const pad = { l: Math.max(0, left), t: Math.max(0, top) };
const canvas = await sharp(onField, { raw: info })
  .extend({
    left: pad.l,
    top: pad.t,
    right: Math.max(0, W - left - info.width),
    bottom: Math.max(0, H - top - info.height),
    background: { r: FIELD[0], g: FIELD[1], b: FIELD[2] },
  })
  .png()
  .toBuffer();
let master = sharp(canvas).extract({ left: pad.l - left, top: pad.t - top, width: W, height: H });
if (W < 2400) master = master.resize(2400, 1600, { kernel: "lanczos3" });
mkdirSync(dirname(masterPath), { recursive: true });
const masterInfo = await master.png({ compressionLevel: 9 }).toFile(masterPath);

// 2. Web cut-out: white to alpha (each pixel keeps only what differs from white, colour corrected so it
//    looks the same laid over white), faint leftovers faded out, trimmed, slim margin, 1200 px.
const out = Buffer.alloc(N * 4);
for (let p = 0; p < N; p++) {
  const i = p * 3,
    o = p * 4;
  const [r, g, b] = [lifted[i], lifted[i + 1], lifted[i + 2]];
  const a = Math.max(255 - r, 255 - g, 255 - b) / 255;
  // Anything that runs off the download's edge fades out over the last 6%, so a cut-out never ends in
  // a hard straight line where Firefly's frame happened to stop.
  const x = p % info.width,
    y = (p / info.width) | 0;
  const edge = Math.min(x, y, info.width - 1 - x, info.height - 1 - y) / (0.06 * Math.min(info.width, info.height));
  const kept = Math.min(1, Math.max(0, (a - 0.06) / 0.94)) * Math.min(1, edge);
  if (kept === 0) continue;
  out[o] = Math.round(255 - (255 - r) / a);
  out[o + 1] = Math.round(255 - (255 - g) / a);
  out[o + 2] = Math.round(255 - (255 - b) / a);
  out[o + 3] = Math.round(kept * 255);
}
// Trim to what is clearly visible (alpha above ~15%), so faint haze cannot hold the box open.
let tx0 = info.width,
  ty0 = info.height,
  tx1 = -1,
  ty1 = -1;
for (let p = 0; p < N; p++) {
  if (out[p * 4 + 3] < 40) continue;
  const x = p % info.width,
    y = (p / info.width) | 0;
  if (x < tx0) tx0 = x;
  if (x > tx1) tx1 = x;
  if (y < ty0) ty0 = y;
  if (y > ty1) ty1 = y;
}
const trimmed = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
  .extract({ left: tx0, top: ty0, width: tx1 - tx0 + 1, height: ty1 - ty0 + 1 })
  .png()
  .toBuffer({ resolveWithObject: true });
const margin = Math.round(Math.max(trimmed.info.width, trimmed.info.height) * 0.05);
const framed = await sharp(trimmed.data)
  .extend({ top: margin, bottom: margin, left: margin, right: margin, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer(); // a separate step: sharp would otherwise resize first and extend after
// Windows refuses to overwrite a file the dev server has open; removing it first always works.
rmSync(webPath, { force: true });
const webInfo = await sharp(framed)
  .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
  .webp({ quality: 85, alphaQuality: 90, effort: 6 })
  .toFile(webPath);

console.log(
  `${name}: field ${ground.map((c) => c.toString(16).padStart(2, "0")).join("")} -> f7f8fa; ` +
    `master ${masterInfo.width}x${masterInfo.height}; web ${webInfo.width}x${webInfo.height} ` +
    `${(webInfo.size / 1024).toFixed(0)} KB`,
);

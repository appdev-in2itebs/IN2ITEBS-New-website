// Cut-out for DARK sections (navy bands), from a Firefly image on its off-white field.
//
//   node scripts/dark-cutout.mjs <input> <output.webp> [top,right,bottom,left crop fractions] [lo] [hi]
//
// spec63-hero.mjs turns near-white into transparency, which is right on light pages but makes pale
// objects half see-through, so they sink into a navy background. Here the object stays fully
// opaque: the mask is the distance from the background field colour (measured at the corners),
// softened at the edge, shadows on the field are dropped, and only background connected to the
// image edge is removed, so white areas inside the object stay solid. Output: trimmed WebP, at most 1400 px.
import sharp from "sharp";

const [input, output, cropArg, loArg, hiArg] = process.argv.slice(2);
if (!input || !output) {
  console.error("usage: node scripts/dark-cutout.mjs <input> <output.webp> [t,r,b,l]");
  process.exit(1);
}
const crop = (cropArg ?? "0,0,0,0").split(",").map(Number);
const meta = await sharp(input).metadata();
const left = Math.round(meta.width * crop[3]);
const top = Math.round(meta.height * crop[0]);
const width = Math.round(meta.width * (1 - crop[1] - crop[3]));
const height = Math.round(meta.height * (1 - crop[0] - crop[2]));
const { data, info } = await sharp(input)
  .extract({ left, top, width, height })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;

// Background field: median of small corner patches.
const samples = [];
for (const [cx, cy] of [
  [0, 0],
  [W - 12, 0],
  [0, H - 12],
  [W - 12, H - 12],
])
  for (let y = cy; y < cy + 12; y++)
    for (let x = cx; x < cx + 12; x++) {
      const i = (y * W + x) * 3;
      samples.push([data[i], data[i + 1], data[i + 2]]);
    }
const med = (k) => samples.map((s) => s[k]).sort((a, b) => a - b)[samples.length >> 1];
const field = [med(0), med(1), med(2)];

// Colour distance: below LO is background, above HI is solid object (tunable per image).
const LO = Number(loArg ?? 14),
  HI = Number(hiArg ?? 34);

// Pass 1: per-pixel "looks like background" (close to the field colour, or a grey shadow on it).
const soft = new Float32Array(W * H); // 0 = background, 1 = object
const bgLike = new Uint8Array(W * H);
for (let p = 0; p < W * H; p++) {
  const i = p * 3;
  const r = data[i],
    g = data[i + 1],
    b = data[i + 2];
  const d = Math.hypot(r - field[0], g - field[1], b - field[2]);
  // A shadow on the field is the field colour, only darker and unsaturated.
  const lum = (r + g + b) / 3,
    flum = (field[0] + field[1] + field[2]) / 3;
  const chroma = Math.max(r, g, b) - Math.min(r, g, b);
  const shadow = lum < flum && chroma < 16 && d < 70;
  soft[p] = shadow ? 0 : d <= LO ? 0 : d >= HI ? 1 : (d - LO) / (HI - LO);
  bgLike[p] = soft[p] < 1 ? 1 : 0;
}
// Pass 2: only background CONNECTED to the image edge is removed. Off-white areas enclosed by
// the object (a white card face, a panel, the glass of an hourglass) stay solid.
const outside = new Uint8Array(W * H);
const queue = new Int32Array(W * H);
let head = 0,
  tail = 0;
const seed = (p) => {
  if (bgLike[p] && !outside[p]) {
    outside[p] = 1;
    queue[tail++] = p;
  }
};
for (let x = 0; x < W; x++) {
  seed(x);
  seed((H - 1) * W + x);
}
for (let y = 0; y < H; y++) {
  seed(y * W);
  seed(y * W + W - 1);
}
while (head < tail) {
  const p = queue[head++];
  const x = p % W,
    y = (p / W) | 0;
  if (x > 0) seed(p - 1);
  if (x < W - 1) seed(p + 1);
  if (y > 0) seed(p - W);
  if (y < H - 1) seed(p + W);
}
const out = Buffer.alloc(W * H * 4);
for (let p = 0; p < W * H; p++) {
  const i = p * 3,
    o = p * 4;
  out[o] = data[i];
  out[o + 1] = data[i + 1];
  out[o + 2] = data[i + 2];
  out[o + 3] = Math.round((outside[p] ? soft[p] : 1) * 255);
}
const trimmed = await sharp(out, { raw: { width: W, height: H, channels: 4 } })
  .png()
  .toBuffer()
  .then((b) => sharp(b).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true }));
const pad = Math.round(Math.max(trimmed.info.width, trimmed.info.height) * 0.03);
await sharp(trimmed.data)
  .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
  .webp({ quality: 90, alphaQuality: 100 })
  .toFile(output);
console.log(`${output}: field ${field.join(",")} ${trimmed.info.width}x${trimmed.info.height}`);

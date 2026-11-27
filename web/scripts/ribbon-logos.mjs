// Builds the homepage client band's logo set (owner's review, 27 Nov 2026: "every logo the same
// care, not just the first few").
//
//   node scripts/ribbon-logos.mjs
//
// For every client in content/clients.ts with a logo:
//   1. render it (SVGs at high density), trim away the blank margin the source file carries,
//   2. add an even 4% breathing margin, and write public/logos/ribbon/<slug>.webp at 2x size,
//   3. record its real width:height in content/client-ribbon-logos.ts.
// logo-marquee.tsx then sizes each logo by visual area rather than by height, so a square mark and
// a long wordmark read as equally heavy. Rerun after adding or replacing a client logo.
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync } from "node:fs";
import sharp from "sharp";

const src = readFileSync("content/clients.ts", "utf8");
const entries = [];
// Each client: its slug, then (before the next slug) its logo, which may be null.
const slugs = [...src.matchAll(/slug: "([^"]+)"/g)];
slugs.forEach((m, i) => {
  const chunk = src.slice(m.index, i + 1 < slugs.length ? slugs[i + 1].index : src.length);
  const logo = chunk.match(/logo: "([^"]+)"/)?.[1];
  if (logo) entries.push({ slug: m[1], logo });
});

const OUT = "public/logos/ribbon";
mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) rmSync(`${OUT}/${f}`);

const HEIGHT = 160; // 2x the largest size the band shows a logo at

// Per-logo repairs for source files cut from slides.
//   mask: rectangles (source px) painted out before trimming, for stray pieces of neighbouring logos
//   unframe: the file carries a thin border box that is not part of the brand; strip it
const FIX = {
  "kirloskar-electric": {
    mask: [
      [0, 0, 150, 110],
      [410, 0, 98, 120],
    ],
  },
  sharechat: { unframe: true },
  "trident-group": { unframe: true },
  mcpi: { unframe: true },
};

/** Crops a thin dark border box off a trimmed RGBA image, then trims the white inside it. */
async function unframe(buf) {
  const { data, info } = await sharp(buf, { limitInputPixels: false }).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const light = (x, y) => {
    const i = (y * W + x) * C;
    return data[i + 3] < 60 || (data[i] + data[i + 1] + data[i + 2]) / 3 > 200;
  };
  // The frame line's thickness: the shortest dark run in from the edge, sampled at several
  // points along each side (the frame is dark everywhere; the artwork is not).
  const runs = [];
  for (const f of [0.08, 0.2, 0.8, 0.92]) {
    const x = Math.floor(W * f),
      y = Math.floor(H * f);
    let k = 0;
    while (k < H / 6 && !light(x, k)) k++;
    runs.push(k);
    k = 0;
    while (k < W / 6 && !light(k, y)) k++;
    runs.push(k);
  }
  const line = Math.min(...runs);
  const cut = Math.min(Math.floor(Math.min(W, H) / 6), line + Math.max(2, Math.round(Math.min(W, H) * 0.01)));
  return sharp(buf, { limitInputPixels: false })
    .extract({ left: cut, top: cut, width: W - 2 * cut, height: H - 2 * cut })
    .trim({ threshold: 22 })
    .toBuffer({ resolveWithObject: true });
}

/** Ink weight: how much of the trimmed logo is dark, opaque colour (0..1). */
async function inkOf(buf) {
  const { data, info } = await sharp(buf, { limitInputPixels: false })
    .resize(200, 200, { fit: "inside" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  let sum = 0;
  const n = info.width * info.height;
  for (let i = 0; i < n; i++) {
    const p = i * info.channels;
    const a = data[p + 3] / 255;
    const lum = (0.2126 * data[p] + 0.7152 * data[p + 1] + 0.0722 * data[p + 2]) / 255;
    sum += a * (1 - lum);
  }
  return sum / n;
}

const rows = [];
for (const { slug, logo } of entries) {
  const input = readFileSync(`public${logo}`);
  const isSvg = logo.endsWith(".svg");
  // SVGs render at a density that gives about 2400 px on the long side, whatever their nominal size.
  let density = 72;
  if (isSvg) {
    const m = await sharp(input).metadata();
    density = Math.max(24, Math.min(1200, Math.round((72 * 2400) / Math.max(m.width, m.height))));
  }
  let img = sharp(input, isSvg ? { density, limitInputPixels: false } : { limitInputPixels: false }).ensureAlpha();
  const fix = FIX[slug] ?? {};
  if (fix.mask) {
    const base = await img.png().toBuffer();
    img = sharp(base, { limitInputPixels: false }).composite(
      fix.mask.map(([x, y, w, h]) => ({
        input: { create: { width: w, height: h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 1 } } },
        left: x,
        top: y,
        blend: "dest-out",
      })),
    );
    img = sharp(await img.png().toBuffer(), { limitInputPixels: false }).ensureAlpha();
  }
  // A flat white or near-white backing (common in JPG/PNG deck logos) trims like transparency.
  let trimmed = await img.trim({ threshold: 22 }).png().toBuffer({ resolveWithObject: true });
  if (fix.unframe) trimmed = await unframe(trimmed.data);
  const ink = await inkOf(trimmed.data);
  const { width: w, height: h } = trimmed.info;
  const pad = Math.round(Math.max(w, h) * 0.04);
  const padded = await sharp(trimmed.data, { limitInputPixels: false })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer({ resolveWithObject: true });
  const ratio = padded.info.width / padded.info.height;
  const outW = Math.min(1200, Math.round(HEIGHT * ratio));
  const outH = Math.round(outW / ratio);
  await sharp(padded.data, { limitInputPixels: false })
    .resize(outW, outH, { fit: "fill" })
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(`${OUT}/${slug}.webp`);
  rows.push({ slug, w: outW, h: outH, ink: Math.round(ink * 1000) / 1000 });
}

const body = rows
  .map(
    (r) => `  ${JSON.stringify(r.slug)}: { src: "/logos/ribbon/${r.slug}.webp", w: ${r.w}, h: ${r.h}, ink: ${r.ink} },`,
  )
  .join("\n");
writeFileSync(
  "content/client-ribbon-logos.ts",
  `// Generated by scripts/ribbon-logos.mjs — do not edit by hand; rerun the script instead.
// Trimmed client logos for the homepage band: true pixel size (2x) and ink weight (0..1).
export const ribbonLogos: Record<string, { src: string; w: number; h: number; ink: number }> = {
${body}
};
`,
);
console.log(`${rows.length} logos written to ${OUT}`);

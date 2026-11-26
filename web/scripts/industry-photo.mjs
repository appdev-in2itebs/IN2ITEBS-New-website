// Turns one Firefly photographic download into the industry page's hero photograph:
//
//   node scripts/industry-photo.mjs <firefly-download> <name> [vertical-anchor]
//
//   ../assets/firefly/industry-photos/<name>.png   master, 3:2
//   public/hero/photos/<name>.webp                 what the page loads, 3:2, at most 2400 px wide
//
// Firefly Image 5 has no 3:2 option, so the 4:3 download is cropped to 3:2. The optional
// vertical anchor (0 = keep the top, 0.5 = centre, 1 = keep the bottom; default 0.5) decides
// where the cut falls. Photographs are not cut out: the page shows them with its soft-edged photo
// mask (components/sections/hero-media.tsx), which heroPicture applies to everything in /hero/photos/.
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import sharp from "sharp";

const [input, name, anchorArg] = process.argv.slice(2);
if (!input || !name || !/^[a-z0-9-]+$/.test(name)) {
  console.error("usage: node scripts/industry-photo.mjs <firefly-download> <name> [vertical-anchor]");
  process.exit(1);
}
const anchor = anchorArg === undefined ? 0.5 : Math.min(1, Math.max(0, Number(anchorArg)));
const masterPath = resolve("../assets/firefly/industry-photos", `${name}.png`);
const webPath = resolve("public/hero/photos", `${name}.webp`);

const meta = await sharp(input).metadata();
const W = meta.width;
const H = Math.min(meta.height, Math.round((W * 2) / 3));
const top = Math.round((meta.height - H) * anchor);
const cropped = sharp(input).removeAlpha().extract({ left: 0, top, width: W, height: H });

mkdirSync(dirname(masterPath), { recursive: true });
mkdirSync(dirname(webPath), { recursive: true });
const m = await cropped.clone().png({ compressionLevel: 9 }).toFile(masterPath);
const w = await cropped
  .clone()
  .resize({ width: 2400, withoutEnlargement: true })
  .webp({ quality: 82, effort: 6 })
  .toFile(webPath);
console.log(`${name}: master ${m.width}x${m.height}; web ${w.width}x${w.height} ${(w.size / 1024).toFixed(0)} KB`);

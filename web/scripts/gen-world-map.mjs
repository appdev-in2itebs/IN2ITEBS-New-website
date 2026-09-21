/**
 * Regenerates `content/world-map.ts` — the land silhouette and country borders the office map
 * draws — from world-atlas' Natural Earth TopoJSON, fetched at run time and never at page load.
 *
 *   node scripts/gen-world-map.mjs            # rewrite content/world-map.ts
 *   node scripts/gen-world-map.mjs --dry-run  # print the size report only
 *
 * The defaults below are tuned so the file stays near 140 kB (38 kB over the wire) while holding
 * up at the 6.5x the map zooms to. Raising TOL or the two minimum sizes trades coastline for bytes.
 */
import { writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const SOURCE = "https://cdn.jsdelivr.net/npm/world-atlas@2";
const OUT = process.argv.includes("--dry-run") ? null : new URL("../content/world-map.ts", import.meta.url);

const W = 4000; // viewBox width; 0.09 deg per unit, which survives the zoom
const TOL = 1.6; // viewBox units between kept points
const MIN_RING = 3; // drop islands smaller than this, in viewBox units
const MIN_ARC = 8; // drop border stubs shorter than this

const LAT_TOP = 84,
  LAT_BOTTOM = -58;
const H = Math.round((W / 360) * (LAT_TOP - LAT_BOTTOM));

/** Decode TopoJSON's delta-encoded, quantised arcs into [lon, lat] pairs. */
function decodeArcs(topo) {
  const { scale, translate } = topo.transform;
  return topo.arcs.map((arc) => {
    let x = 0,
      y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
    });
  });
}

const project = ([lon, lat]) => [((lon + 180) / 360) * W, ((LAT_TOP - lat) / (LAT_TOP - LAT_BOTTOM)) * H];
const inFrame = ([, lat]) => lat <= LAT_TOP && lat >= LAT_BOTTOM;

/** Stitch an arc-index list into one line, honouring TopoJSON's ~i reversal convention. */
function stitch(indices, arcs) {
  const line = [];
  for (const idx of indices) {
    const arc = idx < 0 ? arcs[~idx].slice().reverse() : arcs[idx];
    for (let i = line.length ? 1 : 0; i < arc.length; i++) line.push(arc[i]);
  }
  return line;
}

/** Project a lon/lat line into subpaths, broken at the antimeridian and at the frame edge. */
function toSubpaths(line) {
  const out = [];
  let run = [];
  for (let i = 0; i < line.length; i++) {
    const pt = line[i];
    if (!inFrame(pt)) {
      if (run.length > 1) out.push(run);
      run = [];
      continue;
    }
    if (run.length && Math.abs(pt[0] - line[i - 1][0]) > 180) {
      if (run.length > 1) out.push(run);
      run = [];
    }
    run.push(pt);
  }
  if (run.length > 1) out.push(run);
  return out.map((sub) => sub.map(project));
}

function thin(pts) {
  const kept = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = kept.at(-1);
    if (Math.abs(pts[i][0] - px) >= TOL || Math.abs(pts[i][1] - py) >= TOL) kept.push(pts[i]);
  }
  kept.push(pts.at(-1));
  return kept;
}

const span = (pts) => {
  const xs = pts.map((p) => p[0]),
    ys = pts.map((p) => p[1]);
  return Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
};

/** Relative-command emitter: deltas are one or two digits where absolutes would be four. */
function emit(pts, close) {
  const r = Math.round;
  let [lx, ly] = [r(pts[0][0]), r(pts[0][1])];
  let out = `M${lx} ${ly}`;
  let n = 0;
  for (let i = 1; i < pts.length; i++) {
    const [x, y] = [r(pts[i][0]), r(pts[i][1])];
    const [dx, dy] = [x - lx, y - ly];
    if (!dx && !dy) continue;
    out += (n++ ? "" : "l") + (dx < 0 ? `${dx}` : `${n > 1 ? " " : ""}${dx}`) + (dy < 0 ? `${dy}` : ` ${dy}`);
    [lx, ly] = [x, y];
  }
  if (n < (close ? 2 : 1)) return "";
  return out + (close ? "z" : "");
}

const fetchTopo = async (name) => {
  const res = await fetch(`${SOURCE}/${name}.json`);
  if (!res.ok) throw new Error(`${SOURCE}/${name}.json -> HTTP ${res.status}`);
  return res.json();
};

// ---- land -------------------------------------------------------------------
const landTopo = await fetchTopo("land-50m");
const landArcs = decodeArcs(landTopo);
const rings = [];
for (const geom of landTopo.objects.land.geometries) {
  const polys = geom.type === "Polygon" ? [geom.arcs] : geom.arcs;
  for (const poly of polys) for (const ring of poly) rings.push(stitch(ring, landArcs));
}
let landD = "",
  kept = 0,
  offFrame = 0,
  specks = 0;
for (const ring of rings) {
  if (ring.some((p) => !inFrame(p))) {
    offFrame++;
    continue;
  } // out-of-frame land goes whole
  for (const sub of toSubpaths(ring)) {
    if (span(sub) < MIN_RING) {
      specks++;
      continue;
    }
    const d = emit(thin(sub), true);
    if (d) {
      landD += d;
      kept++;
    }
  }
}

// ---- internal country borders ------------------------------------------------
const cTopo = await fetchTopo("countries-50m");
const cArcs = decodeArcs(cTopo);
const uses = new Map();
for (const geom of cTopo.objects.countries.geometries) {
  const polys = geom.type === "Polygon" ? [geom.arcs] : geom.arcs;
  for (const poly of polys)
    for (const ring of poly)
      for (const idx of ring) {
        const k = idx < 0 ? ~idx : idx;
        uses.set(k, (uses.get(k) ?? 0) + 1);
      }
}
let borderD = "",
  arcs = 0;
for (const [idx, n] of uses) {
  if (n < 2) continue; // used once = coastline; the land fill already draws it
  for (const sub of toSubpaths(cArcs[idx])) {
    if (span(sub) < MIN_ARC) continue;
    const d = emit(thin(sub), false);
    if (d) {
      borderD += d;
      arcs++;
    }
  }
}

const file = `/**
 * World geometry for the office map: a land silhouette plus the borders between countries.
 *
 * Generated on 2026-09-17 from world-atlas' \`land-50m\` and \`countries-50m\` TopoJSON, which derive
 * from Natural Earth and are public domain. 50m is the medium-detail cut — several times the vertex
 * count of the 110m outline it replaced — because the map now zooms to 6.5× and a coastline
 * simplified for world scale falls apart at that magnification. Regenerate with
 * \`node scripts/gen-world-map.mjs\`.
 *
 * The projection is plain equirectangular across the full longitude range, framed ${LAT_TOP}°N–${Math.abs(LAT_BOTTOM)}°S so
 * Antarctica is out of frame. \`project()\` in components/sections/office-map.tsx repeats the same
 * maths to place a pin, so the two must stay in step if the viewBox or latitude bounds ever change.
 *
 * Three things in the generator matter or the map renders wrong:
 *
 * - **Rings are split at the antimeridian.** A ring whose longitude jumps more than 180° between
 *   points starts a new subpath; drawn through, it becomes a bar straight across the whole map.
 * - **Out-of-frame land is dropped whole, never clamped.** Clamping latitude flattens points onto
 *   the frame edge and produces that same bar.
 * - **Borders are the arcs two countries share, drawn once each.** An arc only one country uses is
 *   coastline, and the land silhouette already shows it.
 *
 * Islands under ${MIN_RING} units across and border stubs under ${MIN_ARC} are dropped: at this scale they are
 * single specks that cost bytes and add noise. Coordinates are whole units in relative commands,
 * which is roughly half the bytes of absolute ones.
 */
export const WORLD_VIEWBOX = { width: ${W}, height: ${H} };

/** Latitude bounds of the frame, shared with the pin projection. */
export const WORLD_LAT = { top: ${LAT_TOP}, bottom: ${LAT_BOTTOM} };

export const WORLD_LAND_PATH =
  "${landD}";

/** Borders between countries, without the coastlines the land silhouette already draws. */
export const WORLD_BORDERS_PATH =
  "${borderD}";
`;

if (OUT) writeFileSync(OUT, file);
console.log(
  `${W}x${H} tol${TOL} ring>${MIN_RING} arc>${MIN_ARC} | land ${(landD.length / 1024).toFixed(0)}kB ${kept} rings (-${offFrame} off-frame, -${specks} specks) | borders ${(borderD.length / 1024).toFixed(0)}kB ${arcs} | file ${(file.length / 1024).toFixed(0)}kB gz ${(gzipSync(Buffer.from(file)).length / 1024).toFixed(0)}kB`,
);

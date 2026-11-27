import { cn } from "@/lib/utils";

/**
 * THE HERO FIGURE — the drawing that replaced the photography.
 *
 * ── WHY THERE ARE NO PHOTOGRAPHS ON THIS SITE ────────────────────────────────────────────────
 * Until 18 November 2026 the page heroes were about 190 stock images: cut-out business people on
 * transparent grounds, desks with screens, four colleagues smiling at a laptop. Two problems, and
 * the second is the one that settled it.
 *
 * The first was licensing. No purchase record existed for any of them, the agency that sourced
 * them is gone, and the images carried no provenance metadata — which is what images saved from a
 * web page look like. Sixty-seven megabytes of unresolvable exposure.
 *
 * The second is that **a stock photograph is the visual form of an unfalsifiable adjective.** This
 * site fails its own build over the word "world-class" because no observation could show it false.
 * A photograph of four people who do not work here, in an office we do not occupy, smiling at a
 * screen showing nothing, makes exactly that kind of claim — and it is the same photograph every
 * competitor is using. Having built a gate against the written version, keeping the visual one
 * would have been incoherent.
 *
 * So the site now shows its own work and nothing else: 42 original diagrams, the client logos it
 * has permission for, its own event photography, and this.
 *
 * ── WHAT IT DRAWS, AND WHY THAT SHAPE ────────────────────────────────────────────────────────
 * A field of stacked bands and offset blocks: the same vocabulary as the diagrams — rows on a
 * grid, a few solid cells, some outlined, one Sand hairline. It is abstract, but not arbitrary.
 * It is a picture of a *structured record*, which is what this firm actually produces and what
 * every distinctive thing on this site is made of.
 *
 * It is NOT decoration pretending to be data. There is no fake chart, no invented upward curve,
 * no numbers. A graphic that implies a measurement it does not have would repeat the error the
 * photography made, with extra steps.
 *
 * ── WHY IT IS DETERMINISTIC ──────────────────────────────────────────────────────────────────
 * The composition is derived from a hash of the page key, so `/services/sap/` draws the same
 * figure today, next year and in a screenshot taken by a bid team — but a different one from
 * `/services/workday/`. Randomness at render time would mean a page that looks different on every
 * visit and a diff that never settles. One key, one figure, forever.
 *
 * ── WHY INLINE SVG ───────────────────────────────────────────────────────────────────────────
 * No file, no request, no cache to bust, a few hundred bytes in the HTML, sharp at any size, and
 * it recolours with the theme because it uses the CSS tokens rather than hard-coded hex. The
 * whole replacement set weighs less than one of the photographs it replaced.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */

/** FNV-1a. Small, stable across platforms, and good enough to decorrelate adjacent slugs. */
function hash(key: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** A deterministic stream of numbers from one seed — mulberry32. */
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Weighted hard towards empty. The first draft filled about two thirds of the grid and read as a
 * mosaic rather than a composition — the eye found no entry point, which is the same failure as a
 * card grid with twelve equal cards. At roughly two fifths filled the anchor block becomes the
 * subject and the rest becomes context.
 */
const TREATMENTS = [
  "empty",
  "empty",
  "empty",
  "empty",
  "empty",
  "empty",
  "line",
  "soft",
  "soft",
  "mid",
  "solid",
] as const;

export function HeroFigure({ figureKey, className }: { figureKey: string; className?: string }) {
  const next = rng(hash(figureKey));

  const W = 1200;
  const H = 900;
  const COLS = 6;
  const ROWS = 7;
  const PAD = 70;
  const GAP = 14;
  const cw = (W - PAD * 2 - GAP * (COLS - 1)) / COLS;
  const ch = (H - PAD * 2 - GAP * (ROWS - 1)) / ROWS;

  // One column carries the weight, so the field has a centre of gravity rather than an even
  // scatter — the same reason the Depth Profile reads at a glance.
  const anchorCol = Math.floor(next() * COLS);
  const anchorFrom = Math.floor(next() * (ROWS - 4));
  const anchorSpan = 3 + Math.floor(next() * 2);
  const ruleRow = 1 + Math.floor(next() * (ROWS - 2));

  const cells: { x: number; y: number; w: number; h: number; t: Exclude<(typeof TREATMENTS)[number], "empty"> }[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const inAnchor = c === anchorCol && r >= anchorFrom && r < anchorFrom + anchorSpan;
      if (inAnchor && r !== anchorFrom) continue; // the anchor is one tall block, not a stack
      const t = inAnchor ? "solid" : TREATMENTS[Math.floor(next() * TREATMENTS.length)];
      if (t === "empty") continue;
      cells.push({
        x: PAD + c * (cw + GAP),
        y: PAD + r * (ch + GAP),
        w: cw,
        h: inAnchor ? ch * anchorSpan + GAP * (anchorSpan - 1) : ch,
        t,
      });
    }
  }

  // "empty" never reaches here — those cells are skipped when the field is built — so the map is
  // typed over the treatments that actually draw. A new treatment with no fill is then a compile
  // error rather than a silently invisible cell.
  // The token names are the ones tailwind.config.ts maps, not the utility names. `--color-brand`
  // and `--color-brand-muted` do not exist: the first draft used them, every `solid` cell fell
  // back to black, and it shipped through a build because an invalid custom property resolves to
  // the initial value rather than erroring. Caught by looking at the page.
  const fill: Record<Exclude<(typeof TREATMENTS)[number], "empty">, string> = {
    solid: "oklch(var(--color-bg-brand))",
    mid: "oklch(var(--color-action))",
    soft: "oklch(var(--color-fg-brand-muted) / 0.55)",
    line: "none",
  };

  return (
    <div className={cn("hero-media h-full w-full", className)}>
      <div className="hero-media-float relative h-full w-full">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-full w-full"
          role="presentation"
          aria-hidden="true"
          focusable="false"
        >
          {cells.map((c, i) => (
            <rect
              key={i}
              x={c.x}
              y={c.y}
              width={c.w}
              height={c.h}
              rx={4}
              fill={c.t === "line" ? "none" : fill[c.t]}
              stroke={c.t === "line" ? "oklch(var(--color-action) / 0.42)" : "none"}
              strokeWidth={c.t === "line" ? 2 : 0}
            />
          ))}
          {/* The one Sand rule. Every diagram on this site has exactly one; so does this. */}
          <line
            x1={0}
            x2={W}
            y1={PAD + ruleRow * (ch + GAP) - GAP / 2}
            y2={PAD + ruleRow * (ch + GAP) - GAP / 2}
            stroke="oklch(var(--color-gold-soft))"
            strokeWidth={3}
          />
        </svg>
      </div>
    </div>
  );
}

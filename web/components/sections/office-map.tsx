"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Globe2, Mail, MapPin, Minimize2, Pause, Phone, Play, Route } from "lucide-react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/typography";
import { Reveal } from "@/components/motion/reveal";
import { Words } from "@/components/motion/words";
import { offices } from "@/content/offices";
import { WORLD_BORDERS_PATH, WORLD_LAND_PATH, WORLD_LAT, WORLD_VIEWBOX } from "@/content/world-map";
import { cn } from "@/lib/utils";

/**
 * Equirectangular projection, the same one `content/world-map.ts` was generated with. Returns the
 * point both in viewBox units (for the SVG layers) and as percentages of the plate (for the HTML
 * pins that sit above them).
 */
function project([lat, lon]: [number, number]) {
  const left = ((lon + 180) / 360) * 100;
  const top = ((WORLD_LAT.top - lat) / (WORLD_LAT.top - WORLD_LAT.bottom)) * 100;

  return { x: (left / 100) * WORLD_VIEWBOX.width, y: (top / 100) * WORLD_VIEWBOX.height, left, top };
}

function formatCoords([lat, lon]: [number, number]) {
  return `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? "E" : "W"}`;
}

/** How far in the camera flies when a city is chosen. 6.5x shows roughly one country either side. */
const CITY_ZOOM = 6.5;
/** Labels fade in between these two zoom levels — below the first, the seven Indian pins collide. */
const LABEL_RANGE = [2, 3.2] as const;
const FLIGHT = { duration: 1.15, ease: [0.22, 1, 0.36, 1] } as const;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const mainHub = offices.find((office) => office.slug === "bangalore") ?? offices[0];
const hubPoint = project(mainHub.coords);

const indiaOffices = offices.filter((office) => office.country === "India");
const intlOffices = offices.filter((office) => office.country !== "India");

/** A quadratic arc between two points, bowed away from the straight line by its own length. */
function arcPath(x1: number, y1: number, x2: number, y2: number) {
  const distance = Math.hypot(x2 - x1, y2 - y1);
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 - distance * clamp(distance / 2400, 0.14, 0.34);

  return `M ${x1.toFixed(0)} ${y1.toFixed(0)} Q ${midX.toFixed(0)} ${midY.toFixed(0)} ${x2.toFixed(0)} ${y2.toFixed(0)}`;
}

/**
 * The camera for a given office: scale, plus a translation in percent of the plate that puts the
 * office in the middle of the frame. Clamped so the pan can never drag empty space into view —
 * at zoom z the plate may be offset between (1 - z) * 100% and 0%.
 */
function cameraFor(slug: string | null) {
  const office = slug ? offices.find((entry) => entry.slug === slug) : null;
  if (!office) return { x: 0, y: 0, zoom: 1 };

  const { left, top } = project(office.coords);
  const limit = (1 - CITY_ZOOM) * 100;

  return {
    x: clamp(50 - CITY_ZOOM * left, limit, 0),
    y: clamp(50 - CITY_ZOOM * top, limit, 0),
    zoom: CITY_ZOOM,
  };
}

export function OfficeMap() {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [showRoutes, setShowRoutes] = useState(true);
  const [autoTour, setAutoTour] = useState(false);

  const landId = useId();

  const reduceMotion = useReducedMotion();

  // The camera follows the selection only. Hover previews the office in the panel and lights its
  // pin, but flying the map on every mouseover would make the section impossible to read.
  const shownSlug = hovered ?? active;
  const shownOffice = offices.find((office) => office.slug === shownSlug) ?? null;
  const camera = useMemo(() => cameraFor(active), [active]);

  const panX = useMotionValue(0);
  const panY = useMotionValue(0);
  const zoom = useMotionValue(1);

  // The camera is one pan/zoom pair driving two layers that must never drift apart: an SVG <g>,
  // where the pan is in viewBox units and `non-scaling-stroke` can hold every line at one pixel,
  // and the HTML pin layer above it, where the pan is a percentage of the plate. The pins divide
  // the zoom back out so they keep their size while the world under them grows.
  const plateX = useTransform(panX, (value) => `${value}%`);
  const plateY = useTransform(panY, (value) => `${value}%`);
  const pinScale = useTransform(zoom, (value) => 1 / value);
  const labelOpacity = useTransform(zoom, [...LABEL_RANGE], [0, 1]);
  const insetOpacity = useTransform(zoom, [1, 1.8], [0, 1]);
  const viewLeft = useTransform([panX, zoom], ([x, z]: number[]) => `${-x / z}%`);
  const viewTop = useTransform([panY, zoom], ([y, z]: number[]) => `${-y / z}%`);
  const viewSize = useTransform(zoom, (value) => `${100 / value}%`);

  /**
   * Which pins get a label, and which side it hangs on. Seven Indian offices sit within a few
   * degrees of each other, so at 6.5× their labels would print over one another and over their
   * neighbours' pins. Offices are placed in turn, the one being shown first, each taking the side
   * that is clear of every label already placed and of every other pin; an office with no clear
   * side goes unlabelled. The box is a label's rough size as a share of the plate — much wider
   * than it is tall — divided by the zoom it will be seen at, since the plate grows under a label
   * that does not.
   */
  const labels = useMemo(() => {
    const order = [...offices].sort((a, b) => Number(b.slug === shownSlug) - Number(a.slug === shownSlug));
    const width = 10 / camera.zoom;
    const height = 5.5 / camera.zoom;
    const points = offices.map((office) => project(office.coords));
    const placed: { x1: number; x2: number; y1: number; y2: number }[] = [];
    const sides = new Map<string, "left" | "right">();

    for (const office of order) {
      const { left, top } = project(office.coords);
      // Prefer the side away from the frame's right edge — which is not the world's right edge
      // once the camera has panned.
      const first = camera.x + camera.zoom * left > 72 ? "left" : "right";

      for (const side of [first, first === "left" ? "right" : "left"] as const) {
        const x1 = side === "right" ? left + height / 4 : left - width;
        const box = { x1, x2: x1 + width, y1: top - height / 2, y2: top + height / 2 };

        const blocked =
          placed.some((other) => box.x1 < other.x2 && box.x2 > other.x1 && box.y1 < other.y2 && box.y2 > other.y1) ||
          points.some((pin) => pin.left > box.x1 && pin.left < box.x2 && pin.top > box.y1 && pin.top < box.y2);

        if (blocked) continue;
        placed.push(box);
        sides.set(office.slug, side);
        break;
      }
    }

    return sides;
  }, [shownSlug, camera]);

  // framer maps `x`/`y` on an SVG element to the element's attributes, not to a transform, so the
  // world group is driven straight through its own transform attribute — user units, origin 0,0,
  // off the same motion values the pin layer uses, so the two layers cannot drift apart.
  const worldRef = useRef<SVGGElement>(null);
  useEffect(() => {
    const draw = () => {
      worldRef.current?.setAttribute(
        "transform",
        `translate(${(panX.get() / 100) * WORLD_VIEWBOX.width} ${(panY.get() / 100) * WORLD_VIEWBOX.height}) scale(${zoom.get()})`,
      );
    };

    draw();
    const stop = [panX.on("change", draw), panY.on("change", draw), zoom.on("change", draw)];

    return () => stop.forEach((unsubscribe) => unsubscribe());
  }, [panX, panY, zoom]);

  useEffect(() => {
    const transition = reduceMotion ? { duration: 0 } : FLIGHT;
    const running = [
      animate(panX, camera.x, transition),
      animate(panY, camera.y, transition),
      animate(zoom, camera.zoom, transition),
    ];

    return () => running.forEach((control) => control.stop());
  }, [camera, panX, panY, zoom, reduceMotion]);

  useEffect(() => {
    if (!autoTour) return;
    const timer = setInterval(() => {
      setActive((current) => {
        const index = offices.findIndex((office) => office.slug === current);
        return offices[(index + 1) % offices.length].slug;
      });
    }, 4200);

    return () => clearInterval(timer);
  }, [autoTour]);

  const select = useCallback((slug: string | null) => {
    setAutoTour(false);
    setActive(slug);
  }, []);

  return (
    <Section tone="light" id="offices" className="relative overflow-hidden">
      <Container>
        {/* Centred, and the heading rises word by word (owner, 2026-09-17). */}
        <Reveal repeat className="mx-auto mb-10 max-w-3xl text-center">
          <SectionHeading eyebrow="Global footprint">
            <Words>Where we are.</Words>
          </SectionHeading>
        </Reveal>

        {/* Capped width (owner, 2026-09-17): the plate keeps its aspect ratio, so bounding the
            column is what makes the map smaller without distorting it. */}
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-8">
          <Reveal>
            <div
              data-office-map
              className="glass-card flex flex-col overflow-hidden rounded-feature border border-border-subtle/60 p-3 sm:p-4"
            >
              {/* Control strip */}
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1 text-xs">
                <p className="label-caps flex items-center gap-2 text-foreground-muted">
                  <Globe2 aria-hidden className="h-4 w-4 text-gold" />
                  <span>{offices.length} offices</span>
                  <span aria-hidden className="text-border-strong">
                    /
                  </span>
                  <span>{active ? `${CITY_ZOOM.toFixed(1)}× zoom` : "World view"}</span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRoutes((current) => !current)}
                    aria-pressed={showRoutes}
                    className={cn(
                      "flex min-h-9 items-center gap-1.5 rounded-full px-3 font-semibold transition-colors",
                      showRoutes
                        ? "bg-gold/10 text-gold ring-1 ring-gold/30"
                        : "text-foreground-muted ring-1 ring-border-subtle hover:text-foreground",
                    )}
                  >
                    <Route aria-hidden className="h-3.5 w-3.5" />
                    Delivery routes
                  </button>

                  <button
                    type="button"
                    onClick={() => setAutoTour((current) => !current)}
                    aria-pressed={autoTour}
                    className={cn(
                      "flex min-h-9 items-center gap-1.5 rounded-full px-3 font-semibold transition-colors",
                      autoTour
                        ? "bg-action text-on-action"
                        : "text-foreground-muted ring-1 ring-border-subtle hover:text-foreground",
                    )}
                  >
                    {autoTour ? (
                      <Pause aria-hidden className="h-3.5 w-3.5" />
                    ) : (
                      <Play aria-hidden className="h-3.5 w-3.5" />
                    )}
                    {autoTour ? "Stop tour" : "Tour"}
                  </button>
                </div>
              </div>

              {/* The plate. Both layers inside it fly together on the same camera. */}
              <div
                className="relative isolate w-full overflow-hidden rounded-surface bg-[oklch(var(--color-legacy-blue-pale)/0.28)] ring-1 ring-inset ring-border-subtle/70"
                style={{ aspectRatio: `${WORLD_VIEWBOX.width} / ${WORLD_VIEWBOX.height}` }}
              >
                <svg
                  viewBox={`0 0 ${WORLD_VIEWBOX.width} ${WORLD_VIEWBOX.height}`}
                  className="absolute inset-0 h-full w-full"
                  aria-hidden
                  focusable="false"
                >
                  <defs>
                    <linearGradient id={landId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(var(--color-fg-primary))" />
                      <stop offset="100%" stopColor="oklch(var(--color-fg-primary) / 0.88)" />
                    </linearGradient>
                  </defs>

                  {/* Panning here rather than on the <svg> keeps every stroke a screen pixel wide:
                      `non-scaling-stroke` cancels the transform above it, which it cannot do when
                      the scale comes from a CSS transform on an HTML ancestor. */}
                  <g ref={worldRef}>
                    {/* Graticule every 30°, under the land. */}
                    <g
                      stroke="oklch(var(--color-border-strong) / 0.4)"
                      strokeWidth={1}
                      strokeDasharray="5 9"
                      vectorEffect="non-scaling-stroke"
                    >
                      {[60, 30, 0, -30].map((lat) => {
                        const y = project([lat, 0]).y;
                        return <line key={`lat${lat}`} x1={0} y1={y} x2={WORLD_VIEWBOX.width} y2={y} />;
                      })}
                      {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lon) => {
                        const x = project([0, lon]).x;
                        return <line key={`lon${lon}`} x1={x} y1={0} x2={x} y2={WORLD_VIEWBOX.height} />;
                      })}
                    </g>

                    <path d={WORLD_LAND_PATH} fill={`url(#${landId})`} fillRule="evenodd" />
                    <path
                      d={WORLD_BORDERS_PATH}
                      fill="none"
                      stroke="oklch(var(--color-bg-surface) / 0.3)"
                      strokeWidth={1}
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />

                    {showRoutes &&
                      offices.map((office) => {
                        if (office.slug === mainHub.slug) return null;
                        const point = project(office.coords);
                        const d = arcPath(hubPoint.x, hubPoint.y, point.x, point.y);
                        const lit = shownSlug === office.slug || shownSlug === mainHub.slug;

                        // A lit route crawls its dashes towards the office rather than carrying a
                        // separate pulse along it: one stroke, and the direction still reads.
                        return (
                          <motion.path
                            key={`route-${office.slug}`}
                            d={d}
                            fill="none"
                            stroke="oklch(var(--color-gold))"
                            strokeOpacity={lit ? 0.9 : 0.45}
                            strokeWidth={lit ? 1.75 : 1}
                            strokeDasharray="4 6"
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                            animate={lit && !reduceMotion ? { strokeDashoffset: [10, 0] } : { strokeDashoffset: 0 }}
                            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                          />
                        );
                      })}
                  </g>
                </svg>

                <motion.div
                  className="absolute inset-0"
                  style={{ x: plateX, y: plateY, scale: zoom, transformOrigin: "0 0" }}
                >
                  {/* The city chips are the only controls: seven Indian offices overlap at world
                      scale, and as buttons they would obscure each other past WCAG 2.2 SC 2.5.8. */}
                  <div aria-hidden className="absolute inset-0">
                    {offices.map((office) => {
                      const { left, top } = project(office.coords);
                      const lit = shownSlug === office.slug;
                      const side = labels.get(office.slug);

                      return (
                        <motion.div
                          key={office.slug}
                          className="absolute h-3 w-3"
                          style={{ left: `${left}%`, top: `${top}%`, x: "-50%", y: "-50%", scale: pinScale }}
                        >
                          {lit && (
                            <motion.span
                              key={`halo-${office.slug}`}
                              className="absolute -inset-2 rounded-full bg-gold/30"
                              initial={{ scale: 0.4, opacity: 0.9 }}
                              animate={
                                reduceMotion
                                  ? { scale: 1, opacity: 0.45 }
                                  : { scale: [0.6, 2.1, 0.6], opacity: [0.7, 0, 0.7] }
                              }
                              transition={
                                reduceMotion ? { duration: 0 } : { duration: 2.4, repeat: Infinity, ease: "easeOut" }
                              }
                            />
                          )}

                          <span
                            className={cn(
                              // Opaque, or a route passing behind shows through the dot.
                              "absolute inset-0 rounded-full bg-action shadow-glass ring-2 ring-surface transition-colors duration-300",
                              lit && "bg-gold",
                            )}
                          />

                          {side && (
                            <motion.span
                              style={{ opacity: lit ? 1 : labelOpacity }}
                              className={cn(
                                "pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-semibold leading-tight shadow-glass",
                                lit ? "bg-gold text-on-action" : "bg-surface/90 text-foreground",
                                side === "left" ? "right-full mr-2" : "left-full ml-2",
                              )}
                            >
                              {office.name}
                            </motion.span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Locator inset: where in the world the frame currently sits. At world view the
                    frame is the world, so it has nothing to say and fades out. */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute bottom-2.5 right-2.5 hidden w-28 overflow-hidden rounded-sm border border-border-subtle bg-surface/90 shadow-glass sm:block"
                  style={{ aspectRatio: `${WORLD_VIEWBOX.width} / ${WORLD_VIEWBOX.height}`, opacity: insetOpacity }}
                >
                  <svg viewBox={`0 0 ${WORLD_VIEWBOX.width} ${WORLD_VIEWBOX.height}`} className="h-full w-full">
                    <path d={WORLD_LAND_PATH} fill="oklch(var(--color-fg-primary) / 0.25)" fillRule="evenodd" />
                  </svg>
                  <motion.span
                    className="absolute border border-gold bg-gold/25"
                    style={{ left: viewLeft, top: viewTop, width: viewSize, height: viewSize }}
                  />
                </motion.div>

                {/* Zoom out. Sits on the plate rather than in the strip, where a map's reset lives. */}
                <button
                  type="button"
                  onClick={() => select(null)}
                  disabled={!active}
                  className={cn(
                    "absolute left-2 top-2 flex min-h-9 items-center gap-1.5 rounded-full border border-border-subtle bg-surface/90 px-3 text-xs font-semibold shadow-glass backdrop-blur transition-opacity",
                    active ? "text-foreground hover:border-gold hover:text-gold" : "pointer-events-none opacity-0",
                  )}
                >
                  <Minimize2 aria-hidden className="h-3.5 w-3.5" />
                  World view
                </button>
              </div>

              {/* Readout */}
              <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 px-1 text-xs text-foreground-muted">
                {shownOffice ? (
                  <>
                    <span className="font-semibold text-foreground">{shownOffice.name}</span>
                    <span className="tabular-nums">{formatCoords(shownOffice.coords)}</span>
                  </>
                ) : (
                  <span>Choose a city to fly the map to that office.</span>
                )}
              </p>
              {/* The office detail sits under the map rather than beside it (owner, 2026-09-17), so
                the address reads at full width and lands where the eye already is after clicking a pin. */}
              <div className="glass-card mt-5 flex flex-col gap-3 rounded-feature p-5 sm:p-6">
                {shownOffice ? (
                  <motion.div
                    key={shownOffice.slug}
                    initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-3"
                  >
                    <div>
                      <p className="text-xl font-semibold tracking-tight text-foreground">{shownOffice.name}</p>
                      <p className="mt-0.5 text-xs text-gold">{shownOffice.legalEntity}</p>
                    </div>

                    <p className="flex gap-2.5 text-sm leading-relaxed text-foreground-muted">
                      <MapPin aria-hidden size={18} className="mt-0.5 shrink-0 text-gold" />
                      <span>{shownOffice.address}</span>
                    </p>

                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-2 border-t border-border-subtle pt-3">
                      {shownOffice.email && (
                        <a
                          href={`mailto:${shownOffice.email}`}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-action hover:underline"
                        >
                          <Mail aria-hidden size={15} className="shrink-0" />
                          {shownOffice.email}
                        </a>
                      )}
                      {shownOffice.phone && (
                        <a
                          href={`tel:${shownOffice.phone.replace(/\s+/g, "")}`}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-action hover:underline"
                        >
                          <Phone aria-hidden size={15} className="shrink-0" />
                          {shownOffice.phone}
                        </a>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="m-auto max-w-[24ch] text-center">
                    <Globe2 aria-hidden className="mx-auto mb-2 h-7 w-7 text-gold/50" />
                    <p className="text-sm text-foreground-muted">
                      Choose a city to see where that office is, and how to reach it.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col gap-5">
              {[
                { title: "India", list: indiaOffices },
                { title: "International", list: intlOffices },
              ].map((group) => (
                <div key={group.title}>
                  <h3 className="label-caps mb-2.5 flex items-center gap-2 text-gold">
                    <span>{group.title}</span>
                    <span aria-hidden className="h-px flex-1 bg-gold/20" />
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {group.list.map((office) => (
                      <li key={office.slug}>
                        <button
                          type="button"
                          data-office-row={office.slug}
                          aria-pressed={active === office.slug}
                          onClick={() => select(active === office.slug ? null : office.slug)}
                          onMouseEnter={() => setHovered(office.slug)}
                          onMouseLeave={() => setHovered(null)}
                          onFocus={() => setHovered(office.slug)}
                          onBlur={() => setHovered(null)}
                          className={cn(
                            "glass-pill min-h-11 text-xs font-semibold transition-colors duration-200 motion-reduce:transition-none",
                            active === office.slug
                              ? "bg-action text-on-action ring-1 ring-action"
                              : "text-foreground hover:text-gold",
                          )}
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "h-1.5 w-1.5 shrink-0 rounded-full",
                              active === office.slug ? "bg-on-action" : "bg-gold",
                            )}
                          />
                          {office.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

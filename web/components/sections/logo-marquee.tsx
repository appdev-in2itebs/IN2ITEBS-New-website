import { getImageProps } from "next/image";
import type { Client } from "@/content/types";
import { clientIdentityApproved } from "@/content/compliance";
import { ribbonLogos } from "@/content/client-ribbon-logos";
import { ClientLogo } from "./client-logo";

/**
 * Optical sizing for the band (owner's review, 27 Nov 2026: every logo given the same care).
 *
 * The source files differ wildly: some carry wide blank margins, and shapes run from a tall mark
 * (0.6:1) to a long wordmark (15:1). Equal boxes make square marks loom and long wordmarks shrink to
 * a thread. So every logo is trimmed to its own edges (scripts/ribbon-logos.mjs) and sized here by
 * visual AREA instead of height: height = sqrt(area / ratio), within a height and width ceiling.
 * A square mark and a long wordmark then carry about the same visual weight, a correction for ink
 * weight evens out bold and pale logos, and the gaps between logos are all equal.
 */
const AREA = 5200; // px² at desktop size: a 3.25:1 logo shows 40 px tall
const MAX_H = 52;
const MAX_W = 184;
/** The band's typical ink weight. Solid, dark logos shrink a little and light, thin ones grow a
 *  little (within 16%), so a black plate and a pale wordmark feel equally present. */
const MEDIAN_INK = 0.19;

function opticalSize(w: number, h: number, ink: number) {
  const ratio = w / h;
  const weight = Math.min(1.15, Math.max(0.84, Math.pow(MEDIAN_INK / Math.max(ink, 0.01), 0.22)));
  let height = Math.sqrt(AREA / ratio) * weight;
  height = Math.min(height, MAX_H, MAX_W / ratio);
  return { width: Math.round(height * ratio), height: Math.round(height) };
}

function RibbonLogo({ client }: { client: Client }) {
  const art = ribbonLogos[client.slug];
  if (!art) return <ClientLogo client={client} className="h-9 max-w-[112px] md:h-11 md:max-w-[148px]" />;
  const size = opticalSize(art.w, art.h, art.ink);
  const {
    props: { src, srcSet },
  } = getImageProps({ src: art.src, alt: client.name, width: size.width * 2, height: size.height * 2 });
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      srcSet={srcSet}
      alt={client.name}
      loading="lazy"
      decoding="async"
      width={size.width}
      height={size.height}
      className="object-contain transition-transform duration-300 ease-out group-hover/logo:scale-[1.04]"
      style={{
        width: `calc(${size.width}px * var(--logo-scale))`,
        height: `calc(${size.height}px * var(--logo-scale))`,
      }}
    />
  );
}

/**
 * The ribbon carries no controls (2026-09-15 pm; the view-all grid and the pause button were
 * removed on request). `prefers-reduced-motion` lays the complete list out as a static grid, and
 * MotionObserver pauses the loop while the ribbon is offscreen.
 */
export function LogoMarquee({ clients, duration = clients.length * 2.6 }: { clients: Client[]; duration?: number }) {
  if (!clientIdentityApproved) return null;
  if (!clients.length) return null;
  return (
    <div role="region" aria-label="Client and client-brand logos">
      <div
        className="client-ribbon overflow-hidden [--logo-scale:0.78] md:[--logo-scale:1]"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        <div className="client-ribbon-track flex w-max animate-marquee items-center">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              role={copy === 0 ? "list" : undefined}
              aria-hidden={copy === 1 ? true : undefined}
              className={copy === 0 ? "client-ribbon-list flex shrink-0" : "client-ribbon-copy flex shrink-0"}
            >
              {clients.map((client) => (
                <div
                  key={client.slug}
                  data-client={client.slug}
                  role={copy === 0 ? "listitem" : undefined}
                  className="group/logo flex h-12 shrink-0 items-center justify-center px-5 md:h-14 md:px-8"
                >
                  <RibbonLogo client={client} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

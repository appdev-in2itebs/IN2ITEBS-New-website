import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import heroImages from "@/content/hero-images.json";

/**
 * Frameless hero media (owner, 2026-09-20): the picture sits on the page rather than inside a
 * glass card, with no visible edge or corner, and it arrives with the copy.
 *
 * - a photograph (`.jpg`/`.jpeg`/`.webp`) is masked with a soft ellipse, so it dissolves into the
 *   canvas on every side and reads as part of the page rather than a pasted rectangle;
 * - a logo or diagram (`.png`, or `kind="logo"`) is shown whole, and its white ground is multiplied
 *   away against the light canvas, so only the mark itself is left;
 * - a realistic object illustration (`kind="object"`, or `HeroObject` below) is a transparent WebP
 *   already cut out from its ground, so it is shown whole with no mask and no blend;
 * - a scene rendered on a near-white studio ground (`kind="scene"`, set by the build script) is shown
 *   whole too, but its ground is multiplied into the canvas and its edges fade out, so no rectangle
 *   shows where the studio ground stops;
 * - a page with no picture gets `HeroMark`: one large icon over a soft glow, nothing rectangular.
 *
 * All of them come in through `.hero-media` (settle up, sharpen from a blur) and then drift slowly
 * on `.hero-media-float`; see globals.css next to `.hero-enter`.
 */
const photo = /\.(jpe?g|webp|avif)$/i;

function Motion({
  children,
  className,
  blend = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** Multiply the whole moving group into the page. The float animates `transform`, which opens a
   *  stacking context, so a blend set on the image alone would only see the wrappers, not the canvas. */
  blend?: boolean;
}) {
  return (
    <div className={cn("hero-media h-full w-full", blend && "mix-blend-multiply")}>
      <div className={cn("hero-media-float relative h-full w-full", className)}>{children}</div>
    </div>
  );
}

export function HeroImage({
  src,
  alt,
  priority = true,
  className,
  kind,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  /** Force a treatment; otherwise the file's extension decides. */
  kind?: "photo" | "logo" | "object" | "scene";
}) {
  if (kind === "object" || kind === "scene") {
    return (
      <Motion className={className} blend={kind === "scene"}>
        <div className="relative flex h-full w-full items-center justify-center">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className={cn(
              "h-auto max-h-full w-full object-contain",
              // On the image itself, so the fade reaches nothing exactly at each of its own edges.
              kind === "scene" && "[mask-image:radial-gradient(closest-side,black_68%,transparent_100%)]",
            )}
            priority={priority}
          />
        </div>
      </Motion>
    );
  }
  const isPhoto = kind === "photo" || (!kind && photo.test(src));
  return (
    <Motion className={className} blend={!isPhoto}>
      {isPhoto ? (
        <div className="relative h-full w-full overflow-hidden [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_28%,transparent_98%)]">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
            priority={priority}
          />
        </div>
      ) : (
        <div className="relative flex h-full w-full items-center justify-center">
          <Image
            src={src}
            alt={alt}
            width={1024}
            height={820}
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="h-auto max-h-full w-full rounded-surface object-contain"
            priority={priority}
          />
        </div>
      )}
    </Motion>
  );
}

/** The hero's media for a page with no picture of its own: a large mark over a soft glow. */
export function HeroMark({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <Motion>
      <div className="relative flex h-full w-full items-center justify-center">
        <div aria-hidden className="absolute inset-[12%] rounded-full bg-gold-soft/30 blur-3xl" />
        <div aria-hidden className="absolute inset-[28%] rounded-full bg-action/10 blur-2xl" />
        <span className="icon-tile relative h-36 w-36 rounded-full shadow-glass">
          <Icon size={68} strokeWidth={1.2} />
        </span>
      </div>
    </Motion>
  );
}

/**
 * The hero pictures built from assets/hero-images/ by scripts/build-hero-images.mjs (`npm run
 * heroes`), keyed "<section>/<name>": pages/<name>, services/<slug>, industries/<slug>,
 * partners/<slug>, careers/<name>. Each entry carries its alt text and whether it is a cut-out
 * ("object") or a studio render to blend in ("scene").
 */
export type HeroImageKey = keyof typeof heroImages;

export function hasHeroImage(key: string): key is HeroImageKey {
  return key in heroImages;
}

export function HeroObject({ name }: { name: HeroImageKey }) {
  const { src, alt, kind } = heroImages[name];
  return <HeroImage src={src} alt={alt} kind={kind as "object" | "scene"} />;
}

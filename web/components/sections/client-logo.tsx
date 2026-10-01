import { getImageProps } from "next/image";
import type { Client } from "@/content/types";
import { cn } from "@/lib/utils";

/** A single client mark. Real logo if available, else a refined wordmark plate
 *  (deck-fallback) so the wall stays consistent. Logos are deck-sourced only. */
export function ClientLogo({ client, className }: { client: Client; className?: string }) {
  if (client.logo) {
    // The marks show at most 140px wide; this asks for a 1x/2x pair at that size rather than the
    // original file (some are 60KB+). SVGs pass through untouched.
    const {
      props: { src, srcSet },
    } = getImageProps({ src: client.logo, alt: client.name, width: 140, height: 56 });
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        srcSet={srcSet}
        alt={client.name}
        loading="lazy"
        className={cn(
          "h-8 w-auto max-w-[140px] object-contain opacity-100 transition-all duration-300 ease-out group-hover/logo:scale-[1.035]",
          className,
        )}
      />
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center text-base font-semibold text-logo-foreground transition-opacity duration-300",
        className,
      )}
    >
      {client.name}
    </span>
  );
}

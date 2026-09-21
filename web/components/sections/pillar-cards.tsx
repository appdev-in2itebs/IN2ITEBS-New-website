import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pillars } from "@/content/nav";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/** Accent left-border per pillar — gold across all four in the premium glass system.
 *  The map stays so a pillar can take its own accent again without touching the markup. */
const accentBySlug: Record<string, string> = {
  "platform-services": "border-l-gold",
  "advisory-services": "border-l-gold",
  "digital-data-ai": "border-l-gold",
  "delivery-excellence": "border-l-gold",
};

/** The four pillars rendered as accent-edged cards — the three-pillar
 *  navigation block used on hub and overview pages. */
export function PillarCards() {
  return (
    <Stagger className="grid gap-5 md:grid-cols-2">
      {pillars.map((pillar) => (
        <StaggerItem key={pillar.slug} className="h-full">
          <Link
            href={pillar.href}
            className={cn(
              "group glass-card flex h-full flex-col rounded-surface border-l-4 p-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
              accentBySlug[pillar.slug] ?? "border-l-gold",
            )}
          >
            <h3 className="text-h3 font-bold text-foreground transition-colors group-hover:text-action">
              {pillar.name}
            </h3>
            <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-foreground-muted">{pillar.tagline}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
              Explore
              <ArrowRight
                size={15}
                strokeWidth={1.75}
                className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

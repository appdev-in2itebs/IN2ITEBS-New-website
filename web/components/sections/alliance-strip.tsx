import { partners } from "@/content/partners";

/** Strategic alliances (SOT-04). Renders partner logos where available. */
export function AllianceStrip() {
  const withLogo = partners.filter((p) => p.logo);
  return (
    <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
      {withLogo.map((p) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={p.slug}
          src={p.logo as string}
          alt={p.name}
          loading="lazy"
          className="h-7 w-auto max-w-[120px] object-contain opacity-100 transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_12px_oklch(var(--color-gold-soft)/0.6)]"
        />
      ))}
    </div>
  );
}

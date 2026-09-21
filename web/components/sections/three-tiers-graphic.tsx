"use client";

export function ThreeTiersGraphic() {
  return (
    <div className="relative w-full max-w-xl mx-auto aspect-[4/3] rounded-feature overflow-hidden glass-elevated border border-gold-soft/30 p-2 sm:p-4 shadow-2xl group">
      {/* Ambient background glow and animated radar rings */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-action/10 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-cyan-500/20 animate-[spin_25s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-gold/15 animate-[spin_40s_linear_infinite_reverse]" />
      </div>

      {/* Main 3D Isometric Graphic Image with Subtle Floating Motion */}
      <div className="relative w-full h-full rounded-surface overflow-hidden flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/three-tiers-infographic.jpg"
          alt="Three Tiers and Delivery Engine Infographic"
          className="w-full h-full object-cover object-center rounded-surface transition-transform duration-700 ease-out group-hover:scale-[1.03] animate-float"
        />
      </div>
    </div>
  );
}

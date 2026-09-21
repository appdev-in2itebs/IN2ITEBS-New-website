"use client";
import { Menu } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { OPEN_MENU } from "@/components/layout/header";

/**
 * The chrome that sits on the hero footage before the first scroll (owner, 2026-09-21): the white
 * logo top-left and a round hamburger top-right that opens the site drawer, both inside the hero
 * so they scroll away with the footage while the real header slides in over them. The scroll cue
 * is the site-wide floating button in components/layout/scroll-down.tsx, not part of the hero.
 */
export function HeroChrome() {
  return (
    <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-7">
      <Logo variant="white" priority className="h-9 w-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] sm:h-11" />
      <button
        type="button"
        aria-label="Open site menu"
        aria-haspopup="dialog"
        aria-controls="mobile-navigation"
        onClick={(event) =>
          window.dispatchEvent(new CustomEvent(OPEN_MENU, { detail: { returnTo: event.currentTarget } }))
        }
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-on-brand/25 bg-on-brand/15 text-on-brand shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-on-brand/25"
      >
        <Menu size={22} aria-hidden />
      </button>
    </div>
  );
}

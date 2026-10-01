import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

/**
 * In2IT EBS design tokens (from docs/DESIGN_SYSTEM.md).
 * Navy is the dominant brand colour (60–70% of visual weight).
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        canvas: "oklch(var(--color-bg-canvas) / <alpha-value>)",
        surface: "oklch(var(--color-bg-surface) / <alpha-value>)",
        "surface-subtle": "oklch(var(--color-bg-subtle) / <alpha-value>)",
        foreground: "oklch(var(--color-fg-primary) / <alpha-value>)",
        "foreground-muted": "oklch(var(--color-fg-secondary) / <alpha-value>)",
        action: "oklch(var(--color-action) / <alpha-value>)",
        "action-hover": "oklch(var(--color-action-hover) / <alpha-value>)",
        "on-action": "oklch(var(--color-fg-on-action) / <alpha-value>)",
        brand: "oklch(var(--color-bg-brand) / <alpha-value>)",
        "on-brand": "oklch(var(--color-fg-on-brand) / <alpha-value>)",
        "brand-muted": "oklch(var(--color-fg-brand-muted) / <alpha-value>)",
        "logo-surface": "oklch(var(--color-bg-logo) / <alpha-value>)",
        "logo-foreground": "oklch(var(--color-fg-logo) / <alpha-value>)",
        "border-subtle": "oklch(var(--color-border-subtle) / <alpha-value>)",
        "border-strong": "oklch(var(--color-border-strong) / <alpha-value>)",
        focus: "oklch(var(--color-focus) / <alpha-value>)",
        success: "oklch(var(--color-feedback-success) / <alpha-value>)",
        error: "oklch(var(--color-feedback-error) / <alpha-value>)",
        gold: "oklch(var(--color-gold) / <alpha-value>)",
        "gold-display": "oklch(var(--color-gold-display) / <alpha-value>)",
        "gold-on-brand": "oklch(var(--color-gold-on-brand) / <alpha-value>)",
        "gold-soft": "oklch(var(--color-gold-soft) / <alpha-value>)",
        glass: "oklch(var(--color-glass) / <alpha-value>)",
        "glass-line": "oklch(var(--color-glass-line) / <alpha-value>)",
        navy: "oklch(var(--color-legacy-navy) / <alpha-value>)",
        white: "oklch(var(--color-legacy-white) / <alpha-value>)",
        "blue-light": "oklch(var(--color-legacy-blue-light) / <alpha-value>)",
        "blue-accent": "oklch(var(--color-legacy-blue-accent) / <alpha-value>)",
        "blue-pale": "oklch(var(--color-legacy-blue-pale) / <alpha-value>)",
        "grey-muted": "oklch(var(--color-legacy-grey-muted) / <alpha-value>)",
        "off-white": "oklch(var(--color-legacy-off-white) / <alpha-value>)",
        sand: "oklch(var(--color-legacy-sand) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["var(--font-display)", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Arial", "sans-serif"],
        sans: ["var(--font-plex)", "Calibri", "system-ui", "sans-serif"],
      },
      fontSize: {
        // fluid sizes — balanced hierarchy (reduced heading↔subhead disparity)
        display: ["clamp(2.75rem, 5.8vw, 5.25rem)", { lineHeight: "0.97", letterSpacing: "-0.05em" }],
        h1: ["clamp(2.25rem, 4vw, 3.75rem)", { lineHeight: "1.02", letterSpacing: "-0.04em" }],
        h2: ["clamp(1.75rem, 3vw, 2.75rem)", { lineHeight: "1.08", letterSpacing: "-0.03em" }],
        h3: ["clamp(1.25rem, 1.5vw, 1.5rem)", { lineHeight: "1.25", letterSpacing: "0" }],
      },
      letterSpacing: { label: "0.14em" },
      maxWidth: { measure: "72ch" },
      boxShadow: {
        // soft, navy-tinted elevation — no harsh dark shadows
        soft: "0 1px 2px rgba(18,30,59,.06), 0 12px 32px rgba(18,30,59,.08)",
        lift: "0 2px 4px rgba(18,30,59,.06), 0 24px 60px rgba(18,30,59,.12)",
        "inset-hi": "inset 0 1px 1px rgba(255,255,255,0.6)",
        glass: "var(--shadow-glass)",
        "glass-hover": "var(--shadow-glass-hover)",
        "glow-gold": "var(--glow-gold)",
      },
      borderRadius: {
        control: "var(--radius-control)",
        surface: "var(--radius-surface)",
        feature: "var(--radius-feature)",
        xl2: "var(--radius-surface)",
        xl3: "var(--radius-feature)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.23, 1, 0.32, 1)",
        "in-out": "cubic-bezier(0.77, 0, 0.175, 1)",
        drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee var(--marquee-duration, 40s) linear infinite",
      },
    },
  },
  plugins: [typography],
};

export default config;

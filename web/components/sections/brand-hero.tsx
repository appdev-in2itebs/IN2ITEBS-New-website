"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { FrameSequence } from "@/components/media/frame-sequence";
import { heroFrames } from "@/content/hero-frames";
import { SPLASH_DONE } from "@/components/layout/page-loader";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { HeroChrome } from "@/components/sections/hero-chrome";
import { cn } from "@/lib/utils";

/** Milliseconds each slide holds before the next one fades in. */
const INTERVAL = 4500;
/** Milliseconds the leaving clip stays mounted under the arriving one (the CSS fade is 700 ms). */
const FADE = 800;

type Slide = {
  id: string;
  label: string;
  heading: string[];
  body: string;
  cta: { href: string; label: string };
  secondary: { href: string; label: string };
  /** Which frame sequence in content/hero-frames.ts plays behind this slide (slide-1 … slide-5). */
  frames: string;
};

const slides: Slide[] = [
  {
    id: "brand",
    frames: "slide-1",
    label: "Enterprise transformation, under control",
    heading: ["Change with confidence.", "Run without compromise."],
    body: "In2IT EBS connects enterprise platforms, digital engineering and managed operations through one accountable transformation partner.",
    cta: { href: "/contact/", label: "Start a conversation" },
    secondary: { href: "/what-we-do/", label: "Explore our services" },
  },
  {
    id: "sap",
    frames: "slide-2",
    label: "SAP enterprise solutions",
    heading: ["Transform your enterprise with SAP."],
    body: "From S/4HANA and cloud migration to SuccessFactors, analytics and managed services. Connect the platform to the way your business operates.",
    cta: { href: "/sap-enterprise-solutions/", label: "Explore SAP solutions" },
    secondary: { href: "/contact/", label: "Talk to us" },
  },
  {
    id: "applications",
    frames: "slide-3",
    label: "Application development & maintenance",
    heading: ["Applications built around your business."],
    body: "Design, build, integrate and maintain business applications, with engineering and ongoing support connected from the start.",
    cta: { href: "/digital-data-ai/application-engineering/", label: "Explore application services" },
    secondary: { href: "/contact/", label: "Talk to us" },
  },
  {
    id: "platforms",
    frames: "slide-4",
    label: "People, finance & customer platforms",
    heading: ["Connect people, processes and performance."],
    body: "Explore SuccessFactors, Workday, Salesforce, Oracle and Microsoft practices for the systems your teams rely on every day.",
    cta: { href: "/platform-services/", label: "Explore our platform practices" },
    secondary: { href: "/contact/", label: "Talk to us" },
  },
  {
    id: "data-ai",
    frames: "slide-5",
    label: "Cloud, data & AI",
    heading: ["Turn enterprise data into everyday decisions."],
    body: "Bring data, analytics, integration and AI into the flow of work, with architecture and delivery grounded in your business priorities.",
    cta: { href: "/digital-data-ai/", label: "Explore data & AI services" },
    secondary: { href: "/contact/", label: "Talk to us" },
  },
];

const slideContentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.08,
    },
  },
};

/** One settle for every piece of the slide, so they arrive from different sides on one clock. */
const ENTER = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const };

/**
 * The copy converges on the centre from four directions (owner, 2026-09-18): the label and the
 * first headline line drop in from above, the second line comes in from the left, the lead rises
 * from below, and the two calls to action close in from either side. The section is
 * `overflow-hidden`, which is what keeps the sideways travel from widening the page.
 */
const enterVariants = {
  top: {
    hidden: { opacity: 0, y: -46, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: ENTER },
  },
  left: {
    hidden: { opacity: 0, x: -72, filter: "blur(10px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: ENTER },
  },
  right: {
    hidden: { opacity: 0, x: 72, filter: "blur(10px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: ENTER },
  },
  bottom: {
    hidden: { opacity: 0, y: 46, scale: 0.985, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: ENTER },
  },
  /* The two buttons travel a shorter distance than the headline: at the same 72px they read as
     sliding rather than closing in. */
  ctaLeft: {
    hidden: { opacity: 0, x: -44, filter: "blur(8px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: ENTER },
  },
  ctaRight: {
    hidden: { opacity: 0, x: 44, filter: "blur(8px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: ENTER },
  },
  /* The row itself does not move; it only passes the state down and spaces the two buttons. */
  ctaRow: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  },
} satisfies Record<string, Variants>;

/** Under `prefers-reduced-motion` nothing travels; the same pieces simply fade up in order. */
const staticVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

/**
 * Full-screen brand hero that is itself a five-slide carousel on ambient footage.
 * Enhanced with staggered Framer Motion text animations, crisp legibility shadows,
 * and interactive slide indicators.
 */
export function BrandHero() {
  const [slide, setSlide] = useState<{ active: number; leaving: number | null }>({ active: 0, leaving: null });
  const [rotating, setRotating] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  /** Bumped each time the hero comes back into view, to remount the copy and replay its entrance. */
  const [replay, setReplay] = useState(0);
  const [focused, setFocused] = useState(false);
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  /** The copy holds its entrance until the loading splash over it starts to clear. */
  const [entered, setEntered] = useState(false);
  const enter = (role: keyof typeof enterVariants): Variants => (reduced ? staticVariants : enterVariants[role]);

  useEffect(() => {
    if (document.documentElement.dataset.splash === "done") {
      setEntered(true);
      return;
    }
    const begin = () => setEntered(true);
    window.addEventListener(SPLASH_DONE, begin);
    // A route that does not render the splash must not leave the hero waiting for a signal that
    // never comes, so the entrance starts on its own shortly after mount.
    const fallback = setTimeout(begin, 1200);
    return () => {
      window.removeEventListener(SPLASH_DONE, begin);
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setRotating(!reduced.matches);
    apply();
    reduced.addEventListener("change", apply);
    // Coming back to the hero replays the copy. Without this the entrance runs once on load and a
    // visitor who scrolls down and back up finds a slide that is simply already there. The previous
    // state is kept in a ref, not read inside a `setState` updater: React may call an updater more
    // than once, so a bump raised from inside one does not reliably land.
    let wasOffscreen = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (wasOffscreen && entry.isIntersecting) setReplay((n) => n + 1);
      wasOffscreen = !entry.isIntersecting;
      setOffscreen(!entry.isIntersecting);
    });
    if (root.current) observer.observe(root.current);
    return () => {
      reduced.removeEventListener("change", apply);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!rotating || offscreen || focused) return;
    const timer = setInterval(() => {
      if (document.hidden || document.documentElement.dataset.motionPaused === "true") return;
      setSlide((current) => ({ active: (current.active + 1) % slides.length, leaving: current.active }));
    }, INTERVAL);
    return () => clearInterval(timer);
  }, [rotating, offscreen, focused]);

  useEffect(() => {
    if (slide.leaving === null) return;
    const timer = setTimeout(() => setSlide((current) => ({ ...current, leaving: null })), FADE);
    return () => clearTimeout(timer);
  }, [slide.leaving, slide.active]);

  const { active, leaving } = slide;
  const next = (active + 1) % slides.length;
  const mounted = [leaving, active, next].filter(
    (index, at, all) => index !== null && all.indexOf(index) === at,
  ) as number[];

  return (
    <section
      ref={root}
      data-brand-hero
      aria-labelledby="home-hero-title"
      aria-roledescription="carousel"
      aria-live="off"
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocused(false);
      }}
      className="on-video relative flex min-h-[100svh] overflow-hidden bg-canvas pt-36 text-foreground md:pt-40"
    >
      {/* Clip wrappers with cross-fade opacity */}
      <div aria-hidden className="absolute inset-0 isolate">
        {mounted.map((index) => {
          const item = slides[index];
          return (
            <div
              key={item.id}
              data-hero-video={item.id}
              data-active={index === active ? "true" : undefined}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none",
                index === active ? "z-[2] opacity-100" : index === leaving ? "z-[1] opacity-100" : "z-0 opacity-0",
              )}
            >
              <FrameSequence sequence={heroFrames[item.frames]} urgent={index === active} />
            </div>
          );
        })}
      </div>
      <div aria-hidden className="video-veil pointer-events-none absolute inset-0" />
      <div aria-hidden className="hero-ambient pointer-events-none absolute inset-0" />

      <HeroChrome />

      <Container className="relative z-10 flex flex-1 flex-col justify-center gap-10 py-8 md:py-10">
        <div className="mx-auto grid w-full max-w-[56rem] text-center">
          {slides.map((item, index) => {
            const isActive = index === active;
            const Heading = index === 0 ? "h1" : "h2";
            return (
              <div
                key={item.id}
                data-hero-slide={index}
                data-active={isActive ? "true" : undefined}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${slides.length}`}
                aria-hidden={!isActive}
                inert={!isActive}
                className={cn(
                  "col-start-1 row-start-1 transition-opacity duration-500 ease-out motion-reduce:transition-none",
                  isActive ? "opacity-100" : "pointer-events-none opacity-0",
                )}
              >
                <motion.div
                  key={`content-${item.id}-${isActive}-${replay}`}
                  variants={slideContentVariants}
                  initial="hidden"
                  animate={isActive && entered ? "visible" : "hidden"}
                  className="flex flex-col items-center"
                >
                  <motion.p
                    variants={enter("top")}
                    className={cn(
                      "text-xs font-semibold uppercase tracking-[0.22em] text-on-brand/85 sm:text-sm [text-shadow:_0_1px_8px_rgba(0,0,0,0.85)]",
                    )}
                  >
                    {item.label}
                  </motion.p>

                  <Heading
                    id={index === 0 ? "home-hero-title" : undefined}
                    className="heading-plain mx-auto mt-6 max-w-[22ch] text-balance text-[clamp(2.75rem,5vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-foreground [text-shadow:_0_2px_18px_rgba(0,0,0,0.9)]"
                  >
                    {item.heading.map((line, lineIndex) => (
                      <motion.span
                        key={line}
                        variants={enter(lineIndex === 0 ? "top" : "left")}
                        className="block text-foreground"
                      >
                        {line}
                      </motion.span>
                    ))}
                  </Heading>

                  <motion.p
                    variants={enter("bottom")}
                    className="mx-auto mt-7 max-w-[56ch] text-lg leading-relaxed text-foreground [text-shadow:_0_1px_10px_rgba(0,0,0,0.9)] md:text-xl"
                  >
                    {item.body}
                  </motion.p>

                  <motion.div
                    variants={enter("ctaRow")}
                    className="mt-10 flex flex-wrap items-center justify-center gap-4"
                  >
                    <motion.div variants={enter("ctaLeft")}>
                      <Button href={item.cta.href} withArrow>
                        {item.cta.label}
                      </Button>
                    </motion.div>
                    <motion.div variants={enter("ctaRight")}>
                      <Link
                        href={item.secondary.href}
                        className="inline-flex min-h-12 items-center gap-3 rounded-full border border-glass/40 bg-glass/40 px-5 text-sm font-semibold text-foreground backdrop-blur-md transition-all duration-300 hover:border-glass/80 hover:bg-glass/80 hover:text-foreground"
                      >
                        {item.secondary.label} <ArrowRight size={17} aria-hidden />
                      </Link>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

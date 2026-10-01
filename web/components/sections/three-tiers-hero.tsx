"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Eyebrow, Accent } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { HeroObject } from "@/components/sections/hero-media";
import { site } from "@/content/site";
import type { Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.75,
      ease: "easeOut",
    },
  },
};

const headlineLineVariants: Variants = {
  hidden: { opacity: 0, x: 70, y: 10 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export function ThreeTiersHero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-canvas pt-36 pb-20 md:pt-44 md:pb-28">
      <div aria-hidden className="hero-ambient pointer-events-none absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute right-0 top-20 h-[26rem] w-[26rem] opacity-[0.12]">
        <div className="absolute inset-0 origin-center rotate-45 border-[56px] border-gold-soft" />
      </div>

      <Container className="relative z-10 w-full">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Text Column with Perfect Staggered Slide-in Animation from Right */}
          <motion.div
            className="flex max-w-2xl flex-col gap-6 lg:col-span-7"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow */}
            <motion.div variants={slideFromRight}>
              <Eyebrow>What We Do</Eyebrow>
            </motion.div>

            {/* Headline Animated Line by Line from Right */}
            <h1 className="text-display font-display font-bold leading-[1.05] tracking-[-0.04em]">
              <motion.span variants={headlineLineVariants} className="block">
                Three tiers.
              </motion.span>
              <motion.span variants={headlineLineVariants} className="block text-action mt-1">
                <Accent>One continuous engagement.</Accent>
              </motion.span>
            </h1>

            {/* Subhead Animated Line by Line from Right */}
            <motion.p
              variants={slideFromRight}
              className="max-w-measure text-lg leading-relaxed text-foreground-muted md:text-xl"
            >
              Enter through Advisory, Platforms &amp; Engineering, or Managed Services &amp; Sustenance — and find the
              same delivery engine underneath, whichever door you choose.
            </motion.p>

            {/* CTA Button */}
            <motion.div variants={slideFromRight} className="pt-2">
              <Button href={site.primaryCta.href} variant="primary" withArrow>
                {site.primaryCta.label}
              </Button>
            </motion.div>
          </motion.div>

          {/* Right: the realistic object illustration, which brings its own entrance and drift */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto aspect-[5/4] w-full max-w-xl">
              <HeroObject name="pages/what-we-do" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

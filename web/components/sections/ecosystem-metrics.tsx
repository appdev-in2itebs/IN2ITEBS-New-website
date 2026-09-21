"use client";

import { Award, Cpu, Factory, Globe, Handshake, MapPin, Users, Zap, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CountUp } from "@/components/ui/count-up";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Words } from "@/components/motion/words";
import { stats } from "@/content/site";

const statIcons: Record<string, LucideIcon> = {
  "Years of experience": Award,
  Employees: Users,
  "Global customers": Globe,
  "Countries delivered": MapPin,
  "Industry verticals": Factory,
  "Packaged accelerators": Zap,
  "Strategic partners": Handshake,
  "Proprietary accelerators": Cpu,
};

export function EcosystemMetrics() {
  return (
    <section
      id="ecosystem-metrics"
      aria-label="Scale and global performance metrics"
      className="seamless-section relative overflow-hidden border-t border-border-subtle bg-surface py-20 md:py-28"
    >
      {/* Background ambient lighting effects */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-gold/[0.05] blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-action/[0.06] blur-[120px]"
      />

      <Container className="relative">
        <Reveal className="mx-auto mb-14 max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Proven Track Record &amp; Global Scale
          </p>
          <h2 className="mt-3 text-[clamp(2.2rem,4vw,4rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-foreground">
            <Words variant="blur">Enterprise capability, measured in real performance.</Words>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-foreground-muted">
            Engineered for high-reliability, global reach, and continuous enterprise value across SAP, cloud, and
            digital platforms.
          </p>
        </Reveal>

        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = statIcons[stat.label] ?? Award;
            return (
              <StaggerItem key={stat.label}>
                <div className="glass-card group relative overflow-hidden rounded-feature p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lg">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gold/5 blur-xl transition-opacity group-hover:opacity-100"
                  />
                  <div className="icon-tile mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-surface">
                    <Icon aria-hidden size={22} strokeWidth={1.75} />
                  </div>
                  <div className="text-4xl font-extrabold tracking-tight text-foreground transition-colors duration-200 group-hover:text-gold md:text-5xl">
                    <CountUp value={stat.value} duration={2000} />
                  </div>
                  <p className="mt-3 text-sm font-semibold tracking-wide text-foreground-muted">{stat.label}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}

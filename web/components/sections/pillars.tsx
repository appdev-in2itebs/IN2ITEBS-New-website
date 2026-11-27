import { Layers, Compass, Code2 } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Accent, SectionHeading } from "@/components/ui/typography";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import Link from "next/link";
import { platformPractices } from "@/content/nav";

const pillars = [
  {
    Icon: Layers,
    name: "Platforms",
    // Oracle and Microsoft removed 19 November 2026 — see content/home-hero.ts for the reasoning.
    // The register publishes both as "Ahead of us"; this sentence said we ran them.
    body: "SAP, SuccessFactors, Salesforce and Workday: enterprise platforms connected to your business processes and supported across their lifecycle.",
  },
  {
    Icon: Compass,
    name: "Advisory",
    body: "Strategy, business case, process re-engineering and a board-ready roadmap that de-risks the decision before you commit.",
  },
  {
    Icon: Code2,
    name: "Digital Engineering",
    body: "Custom development, integration and 24×7 managed services across every stack — build, integrate and run.",
  },
];

/** Who we are — AI-led transformation, three pillars. Owner-supplied positioning. */
export function PillarsSection({ tone = "white" as "white" | "light" }) {
  return (
    <Section tone={tone}>
      <Container>
        <Reveal className="mb-14 max-w-3xl">
          <SectionHeading
            eyebrow="Who we are"
            lead="Structured around three pillars that work as one — Platforms, Advisory and Digital Engineering."
          >
            An <Accent>AI-led</Accent> enterprise transformation company.
          </SectionHeading>
        </Reveal>
        <Stagger className="grid gap-5 md:grid-cols-3">
          {pillars.map(({ Icon, name, body }) => (
            <StaggerItem key={name} className="h-full">
              <div className="glass-card flex h-full flex-col gap-5 rounded-feature p-8 md:p-10">
                <span className="icon-tile h-12 w-12 rounded-surface">
                  <Icon size={22} strokeWidth={1.25} />
                </span>
                <h3 className="text-h3 font-bold text-foreground">{name}</h3>
                <p className="text-[0.95rem] leading-relaxed text-foreground-muted">{body}</p>
                {name === "Platforms" && (
                  <ul className="flex flex-wrap gap-x-4 gap-y-1">
                    {platformPractices.map((practice) => (
                      <li key={practice.slug}>
                        <Link
                          href={practice.href}
                          className="inline-flex min-h-11 items-center text-sm font-semibold text-action underline"
                        >
                          {practice.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

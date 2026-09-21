import { Workflow, Network, GaugeCircle, CheckCircle2, Rocket, GraduationCap } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/typography";
import { Accent } from "@/components/ui/typography";

const tools = [
  { Icon: Workflow, name: "Signavio", role: "Process mining & design" },
  { Icon: Network, name: "LeanIX", role: "Enterprise architecture" },
  { Icon: GaugeCircle, name: "SAP Cloud ALM", role: "Delivery & ops management" },
  { Icon: CheckCircle2, name: "Tricentis", role: "Automated testing" },
  { Icon: Rocket, name: "SAP Activate", role: "Delivery methodology" },
  { Icon: GraduationCap, name: "WalkMe", role: "Adoption & enablement" },
] as const;

/** Delivery-toolchain showcase — signals enterprise-grade governance across the SAP lifecycle.
 *  CSS-hover only (no JS), so this stays a server component. Caller supplies the Section tone. */
export function SapToolchain() {
  return (
    <Container>
      <SectionHeading
        eyebrow="The delivery toolchain"
        className="mb-14 max-w-3xl"
        lead="Every engagement runs on a curated stack — from process design through testing to adoption — so governance is built in, not bolted on."
      >
        Enterprise-grade delivery, <Accent>tooled for confidence</Accent>.
      </SectionHeading>

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {tools.map(({ Icon, name, role }) => (
          <li
            key={name}
            className="glass-card group flex flex-col gap-4 rounded-feature p-6 focus-within:ring-2 focus-within:ring-focus"
          >
            <span className="icon-tile h-11 w-11 rounded-surface">
              <Icon size={22} strokeWidth={1.25} aria-hidden />
            </span>
            <div className="flex flex-col gap-1.5">
              <span className="font-semibold text-foreground transition-colors group-hover:text-action">{name}</span>
              <span className="text-sm leading-snug text-foreground-muted">{role}</span>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}

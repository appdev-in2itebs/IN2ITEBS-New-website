import type { Client } from "@/content/types";
import { ClientLogo } from "./client-logo";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { clientEvidenceApproved } from "@/content/compliance";

/** Static grid of client logos for industry pages. */
export function ClientWall({ clients }: { clients: Client[] }) {
  if (!clientEvidenceApproved || !clients.length) return null;
  return (
    <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {clients.map((c) => (
        <StaggerItem
          key={c.slug}
          className="glass-card group/logo flex h-28 items-center justify-center rounded-surface bg-logo-surface px-6"
        >
          <ClientLogo client={c} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

import type { Client } from "@/content/types";
import { clientIdentityApproved } from "@/content/compliance";
import { ClientLogo } from "./client-logo";

/**
 * The ribbon carries no controls (2026-09-15 pm; the view-all grid and the pause button were
 * removed on request). `prefers-reduced-motion` lays the complete list out as a static grid, and
 * MotionObserver pauses the loop while the ribbon is offscreen.
 */
export function LogoMarquee({ clients, duration = clients.length * 2.6 }: { clients: Client[]; duration?: number }) {
  if (!clientIdentityApproved) return null;
  if (!clients.length) return null;
  return (
    <div role="region" aria-label="Client and client-brand logos">
      <div
        className="client-ribbon overflow-hidden"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        <div className="client-ribbon-track flex w-max animate-marquee items-center">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              role={copy === 0 ? "list" : undefined}
              aria-hidden={copy === 1 ? true : undefined}
              className={copy === 0 ? "client-ribbon-list flex shrink-0" : "client-ribbon-copy flex shrink-0"}
            >
              {clients.map((client) => (
                <div
                  key={client.slug}
                  data-client={client.slug}
                  role={copy === 0 ? "listitem" : undefined}
                  className="group/logo flex h-12 w-36 shrink-0 items-center justify-center px-4 md:h-14 md:w-48 md:px-5"
                >
                  <ClientLogo client={client} className="h-9 max-w-[112px] md:h-11 md:max-w-[148px]" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

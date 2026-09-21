import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AmbientVideo } from "@/components/media/ambient-video";
import { Container } from "@/components/ui/container";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Words } from "@/components/motion/words";
import { homeEcosystem as visibleEcosystem } from "@/content/partner-ecosystem";

/**
 * Names from the preserved partner pages, resolved against content/partner-ecosystem.ts; no invented
 * badges for missing artwork. Since 2026-09-15 16:40 the section sits on ambient footage under the
 * 20% black veil and the `.on-video` palette, and every tile is a `.glass-liquid` panel (iOS 26
 * "Liquid Glass"): clear, refractive, light-leaning so the marks keep their contrast.
 */
export function HomePartners() {
  return (
    <section
      id="partners"
      data-partners
      aria-labelledby="home-partners-title"
      className="on-video relative overflow-hidden border-y border-border-subtle bg-surface py-14 text-foreground md:py-20"
    >
      <AmbientVideo src="/video/partners-office-720.mp4" poster="/video/partners-office-poster.jpg" />
      <div aria-hidden className="video-veil pointer-events-none absolute inset-0" />
      {/* Centring the copy (2026-09-18) moved it off the dark left third of this clip and onto the
          bright centre, where the 20% veil alone left the eyebrow and the lead barely legible. This
          scrim darkens only the band the copy sits in and fades out before the logo tiles, so the
          footage behind them keeps its light. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/55 via-black/35 to-transparent"
      />
      <Container className="relative">
        {/* Centred like the rest of the page. The copy over the clip replays on every return, so the
            eyebrow, the heading and the lead each arrive again whenever the section comes back. */}
        <Stagger repeat className="mb-10 text-center">
          <StaggerItem>
            <p className="text-sm font-semibold text-gold">Our ecosystem</p>
          </StaggerItem>
          <StaggerItem>
            <h2 id="home-partners-title" className="heading-plain mx-auto mt-3 max-w-4xl text-h2 font-semibold">
              <Words variant="bloom">Our partners &amp; technology ecosystem.</Words>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-foreground-muted">
              Enterprise applications, cloud and specialist technologies, brought together around your business.
            </p>
          </StaggerItem>
        </Stagger>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {visibleEcosystem.map((partner) => (
            <li
              key={partner.name}
              className="glass-liquid flex min-h-28 flex-col items-center justify-center gap-3 px-4 py-5 text-logo-foreground"
            >
              {partner.logo ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={partner.logo}
                    alt=""
                    width={112}
                    height={40}
                    loading="lazy"
                    className="h-10 w-28 object-contain"
                  />
                  <span className="text-xs font-medium">{partner.name}</span>
                </>
              ) : (
                <span className="text-xl font-semibold tracking-tight">{partner.name}</span>
              )}
            </li>
          ))}
          <li className="glass-liquid text-logo-foreground">
            <Link
              href="/partners/"
              className="flex h-full min-h-28 items-center justify-center gap-2 p-5 text-sm font-semibold hover:underline"
            >
              Full ecosystem <ArrowUpRight size={18} aria-hidden />
            </Link>
          </li>
        </ul>
      </Container>
    </section>
  );
}

import Link from "next/link";
import type { CSSProperties } from "react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Words } from "@/components/motion/words";
import { LinkedInMark } from "@/components/ui/linkedin-mark";
import { footerNav } from "@/content/nav";
import { footerCertifications, site, social } from "@/content/site";
import { Logo } from "@/components/ui/logo";

const socials = [
  {
    href: social.youtube,
    label: "YouTube",
    bg: "bg-[#FF0000] hover:bg-[#D00000]",
    icon: (
      <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    href: social.x,
    label: "X",
    bg: "bg-[#5A6578] hover:bg-[#4A5464]",
    icon: (
      <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: social.linkedin,
    label: "LinkedIn",
    bg: "bg-[#0A66C2] hover:bg-[#084E96]",
    icon: <LinkedInMark className="h-4.5 w-4.5 fill-white" />,
  },
  {
    href: social.instagram,
    label: "Instagram",
    bg: "bg-[#262626] hover:bg-[#1A1A1A]",
    icon: (
      <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
];

/** Entrance order within a footer block (globals.css, "Cinematic entrances"): milliseconds after it. */
const cine = (ms: number) => ({ "--cine-d": `${ms}ms` }) as CSSProperties;

function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="cine">
      <h3 style={cine(0)} className="cine-slide text-xs font-semibold uppercase tracking-[0.18em] text-gold-on-brand">
        {title}
      </h3>
      <ul className="mt-5 space-y-2">
        {links.map((link, index) => (
          <li key={link.href} style={cine(160 + index * 70)} className="cine-item cine-left">
            {/* `inline-flex` plus a minimum height gives each link a 24px tap target on a phone
                (WCAG 2.2 SC 2.5.8); the text itself is only 18px tall. */}
            <Link
              href={link.href}
              className="inline-flex min-h-6 items-center text-sm text-on-brand/70 transition-colors hover:text-on-brand"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="theme-on-brand relative bg-brand pb-20 text-on-brand">
      <div aria-hidden className="rule-gold absolute inset-x-0 top-0" />
      <div className="container py-16 md:py-20">
        <div className="grid gap-12 border-b border-on-brand/20 pb-14 lg:grid-cols-12">
          <Reveal className="cine lg:col-span-5">
            <div style={cine(0)} className="cine-focus">
              <Logo variant="white" asLink={false} className="h-14 w-auto" />
            </div>
            <p className="mt-6 max-w-sm text-lg font-medium leading-relaxed tracking-[-0.02em] text-on-brand">
              <Words variant="blur">
                Enterprise transformation for organisations that cannot afford operational ambiguity.
              </Words>
            </p>
            <p style={cine(650)} className="cine-focus mt-4 max-w-sm text-sm leading-relaxed text-on-brand/[0.58]">
              SAP Gold Partner with delivery across 30+ countries and adjacent strength in advisory, data, AI and
              digital engineering.
            </p>
          </Reveal>

          <Stagger className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            <StaggerItem>
              <LinkColumn title="Company" links={footerNav.company.slice(0, 5)} />
            </StaggerItem>
            <StaggerItem>
              <LinkColumn title="Capabilities" links={footerNav.practices} />
            </StaggerItem>
            <StaggerItem>
              <LinkColumn title="Resources" links={[...footerNav.company.slice(5), ...footerNav.legal]} />
            </StaggerItem>
          </Stagger>
        </div>

        <div className="grid gap-8 border-b border-on-brand/20 py-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <Reveal className="flex flex-wrap gap-x-5 gap-y-2">
            {footerCertifications.map((certification, index) => (
              <span
                key={certification}
                style={cine(index * 90)}
                className="cine-item text-xs font-semibold uppercase tracking-[0.14em] text-gold-on-brand"
              >
                {certification}
              </span>
            ))}
          </Reveal>

          <Reveal className="flex flex-wrap items-center gap-3">
            {socials.map(({ href, label, bg, icon }, index) => (
              <span key={label} style={cine(250 + index * 110)} className="cine-pop inline-flex">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${bg} shadow-md transition-transform hover:scale-110`}
                >
                  {icon}
                </a>
              </span>
            ))}
          </Reveal>
        </div>

        <div className="flex flex-col justify-between gap-5 pt-7 text-xs text-on-brand/[0.52] md:flex-row md:items-center">
          <p>
            © {site.copyrightYear} {site.legalName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

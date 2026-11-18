import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { capabilities, capabilityExpires, capabilityReviewed, longDate } from "@/content/capability-status";
import { qualifiedPackages, SAP_PROFILE_URL } from "@/content/qpps";
import { publicCorrections } from "@/content/corrections";

/**
 * "WHAT ONLY WE CAN SAY" — the homepage's proof block.
 *
 * ── THE PROBLEM THIS SOLVES ──────────────────────────────────────────────────────────────────
 * The homepage described capability for eleven bands and never once made a claim a competitor
 * could not also make. Every sentence on it — "deep SAP expertise", "trusted delivery partner",
 * "global footprint" — is true, and is also on the homepage of every firm we lose to. A claim
 * that anyone can make is not positioning; it is wallpaper.
 *
 * ── THE TEST EVERY LINE HERE HAS TO PASS ─────────────────────────────────────────────────────
 * A line earns a place in this band only if a competitor with fifty thousand consultants
 * *structurally cannot* put it on their own site. Not "would not" — could not. That is a much
 * harder test than it sounds, and it is why there are four lines and not ten.
 *
 *   "We publish what we cannot do"      — a firm that bids everything cannot publish a no.
 *   "Our claims expire"                 — needs a build that fails, not a promise that doesn't.
 *   "We publish what we got wrong"      — needs someone senior to accept the cost in public.
 *   "SAP describes our packages, not us" — needs SAP to have actually done it.
 *
 * Marketing superlatives fail this test by construction, which is the point: there is nothing in
 * this band to write, only things to have already done.
 *
 * ── WHY THE NUMBERS ARE COMPUTED, AND THE DATES ARE NOT ──────────────────────────────────────
 * Every figure here is counted from the file it describes. Nobody can update the register and
 * leave this band claiming the old number, because the band does not hold a number — it holds a
 * `.filter().length`. If that makes a line read worse one day ("two capabilities we don't do"
 * rather than eleven), the worse-reading version is the honest one and the band should say it.
 *
 * The dates are the opposite case and are deliberately NOT relative. "Checked 12 days ago" is
 * computed at build time on a statically generated page, so it goes on saying twelve for as long
 * as nobody rebuilds — a line that starts lying quietly, on the one band whose entire subject is
 * not doing that. Two fixed dates stay true. See `capabilityExpires` in content/capability-status.ts.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */

export function HomeManifesto() {
  const aheadCount = capabilities.filter((c) => c.status === "ahead").length;

  const claims = [
    {
      claim: "We publish what we cannot do.",
      body: `Our capability register carries four statuses, and one of them is “Ahead of us” — we do not do this, and if you need it we will point you at someone who does. ${aheadCount} ${aheadCount === 1 ? "capability sits" : "capabilities sit"} under it today.`,
      href: "/about/where-we-stand/",
      label: "Read the register",
    },
    {
      claim: "Our claims expire.",
      body: `Every line in that register carries the date a person last checked it against delivery evidence. It was checked on ${longDate(capabilityReviewed)}. If nobody checks it again by ${longDate(capabilityExpires)}, this site stops building — a rule in the build, not a promise in a paragraph.`,
      href: "/about/where-we-stand/#upkeep",
      label: "How it is kept",
    },
    {
      claim: "We publish what we got wrong.",
      body: `A dated list of the claims we have corrected or withdrawn, including the ones that cost us something to withdraw. ${publicCorrections.length} entries so far, oldest kept, nothing quietly deleted.`,
      href: "/about/what-we-got-wrong/",
      label: "Read the corrections",
    },
    {
      claim: "SAP describes our packages. We don’t.",
      body: `${qualifiedPackages.length} partner-packaged solutions that SAP reviewed and listed on our partner profile, in SAP’s own wording. You can read every one of them on sap.com without asking us for anything.`,
      href: SAP_PROFILE_URL,
      label: "Our SAP profile",
      external: true,
    },
  ];

  return (
    <section
      aria-labelledby="manifesto-heading"
      className="theme-on-brand relative isolate overflow-hidden bg-brand py-20 text-on-brand md:py-28"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 hero-ambient opacity-70" />
      <div
        aria-hidden
        className="ambient-orb pointer-events-none absolute -right-20 top-10 h-[26rem] w-[26rem] rounded-full bg-gold/10 blur-[140px]"
      />
      <Container className="relative">
        <Reveal className="max-w-[46ch]">
          <span className="label-caps text-gold-on-brand">What only we can say</span>
          <h2
            id="manifesto-heading"
            className="heading-plain mt-6 font-display text-[clamp(2rem,4vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.035em]"
          >
            Four claims you can check without asking us.
          </h2>
          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-on-brand/75">
            Every firm in this market says it is honest. These are the four places you can test whether we are, and each
            one links to the thing itself rather than to a page about it.
          </p>
        </Reveal>

        <Stagger className="mt-14 grid gap-px overflow-hidden rounded-feature bg-on-brand/15 md:grid-cols-2">
          {claims.map((c, i) => (
            <StaggerItem key={c.claim} className="h-full">
              <div className="flex h-full flex-col bg-brand p-8 md:p-10">
                <span aria-hidden className="font-display text-sm font-semibold text-gold-on-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-display text-[clamp(1.35rem,2.2vw,1.9rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-on-brand">
                  {c.claim}
                </h3>
                <p className="mt-5 flex-1 text-base leading-relaxed text-on-brand/75">{c.body}</p>
                {c.external ? (
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-7 inline-flex min-h-6 items-center gap-2 text-sm font-semibold text-gold-on-brand underline-offset-4 hover:underline"
                  >
                    {c.label}
                    <ArrowUpRight size={16} aria-hidden className="transition-transform group-hover:-translate-y-0.5" />
                  </a>
                ) : (
                  <Link
                    href={c.href}
                    className="group mt-7 inline-flex min-h-6 items-center gap-2 text-sm font-semibold text-gold-on-brand underline-offset-4 hover:underline"
                  >
                    {c.label}
                    <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

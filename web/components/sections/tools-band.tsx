import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { siteTools } from "@/content/tools";

/**
 * "Work it out yourself" — the two diagnostics, surfaced where people actually are.
 *
 * See content/tools.ts for why this exists. The short version: both tools were reachable only by
 * scrolling a service page the visitor had to find first, which is a strange way to treat the only
 * two things on the site that give something back before asking for anything.
 *
 * ── DESIGN NOTES ─────────────────────────────────────────────────────────────────────────────
 * The card leads with the visitor's question rather than the tool's name, because nobody has ever
 * wanted an "Application Estate Review diagnostic" — they have wanted to know how much of their
 * estate they can see. The name is below it, as the thing they are clicking into.
 *
 * The duration is published and it is honest. "Two to three minutes" loses a few clicks that "30
 * seconds" would have won, and keeps the people who would otherwise abandon at question five
 * feeling misled. The whole band's claim is that the thing behind the link is useful on its own,
 * and overstating the cost of entry is the fastest way to break that.
 *
 * No form, no gate, no "enter your email to see your result" — if that ever changes, this band
 * comes down, because it would then be advertising something it is not.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */
export function ToolsBand({
  eyebrow = "Before you talk to anyone",
  heading = "Two things you can work out yourself",
  tone = "subtle",
  currentPath,
}: {
  eyebrow?: string;
  heading?: string;
  tone?: "subtle" | "canvas";
  /** Drop the tool that lives on this page, so a page never advertises itself. */
  currentPath?: string;
}) {
  const tools = currentPath ? siteTools.filter((t) => !t.href.startsWith(currentPath)) : siteTools;
  if (!tools.length) return null;
  return (
    <section
      aria-labelledby="tools-band-heading"
      className={`py-16 md:py-24 ${tone === "canvas" ? "bg-surface" : "bg-surface-subtle"}`}
    >
      <Container>
        <Reveal className="max-w-measure">
          <span className="label-caps text-gold">{eyebrow}</span>
          <h2 id="tools-band-heading" className="mt-4 font-display text-h2 font-bold text-foreground">
            {heading}
          </h2>
          <p className="mt-4 text-foreground-muted">
            Both give you an answer on the page. Neither asks for your email first, and neither one needs us to be
            involved for the answer to be worth having.
          </p>
        </Reveal>

        <Stagger className={`mt-10 grid gap-6 ${tools.length > 1 ? "md:grid-cols-2" : ""}`}>
          {tools.map((tool) => (
            <StaggerItem key={tool.href} className="h-full">
              <Link
                href={tool.href}
                className="group flex h-full flex-col rounded-feature border border-border-subtle bg-surface p-7 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-gold-soft/70 hover:shadow-glass md:p-8"
              >
                <span className="font-display text-h3 font-semibold leading-snug text-foreground transition-colors group-hover:text-action">
                  {tool.question}
                </span>
                <span className="mt-4 block max-w-measure text-foreground-muted">{tool.answer}</span>
                <span className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-border-subtle">
                  <span className="text-sm font-semibold text-foreground">{tool.name}</span>
                  <span className="text-sm text-foreground-muted">{tool.duration}</span>
                </span>
                <span
                  aria-hidden
                  className="mt-5 inline-flex min-h-6 items-center gap-2 text-sm font-semibold text-action"
                >
                  Open it
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

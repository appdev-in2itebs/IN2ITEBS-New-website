# The interim image policy

**Decided 20 November 2026 by the Managing Director. Expires 20 November 2027, and the build
enforces that date.**

The site needs richer imagery sooner than an internal library can be built. So licensed imagery
may be used now, while the company collects its own over twelve months. This is the workaround,
the rules it runs under, and the programme that replaces it.

---

## 1 · Where to buy, in order

### Adobe Stock — the default, and the only option that indemnifies

Nothing in the nine AI tools the team compared offers **IP indemnification**, and that is the
question a PSU or government procurement team asks. Adobe does, though the scope matters and is
worth reading rather than assuming:

- Adobe's own guidance says Stock assets, other than those marked editorial-use-only, may be used
  in "any creative project … websites", royalty-free and reusable across projects.
- The **indemnity Adobe describes publicly covers generative (Text to Image) outputs** for
  Individual, Team and Enterprise customers with sufficient credits. Enterprise agreements carry
  "higher levels of indemnification", negotiated in the ETLA. Amounts are not published.
- Team plans come in 10, 40 and 750 assets a month. Prices are not published on the pages above;
  get them from an Adobe account manager with the indemnity position in writing.

**Two traps in Adobe's own terms.** Stock images may not be used _in or as a logo_. And
editorial-use-only assets may not be used commercially at all — which includes our website.

### Runway — if motion is genuinely needed

The clearest written no-watermark policy of the generative tools reviewed: all paid plans export
without a visible mark, from about $15 a month. C2PA provenance metadata is embedded and **stays**.

### Google AI Pro (Veo) — the remediation option

About $19.99 a month, with the setting that permits export without the visible mark. Worth
naming for a reason beyond quality: this is the provider whose watermark was stripped from the
old hero footage. Using it properly, on a paid tier, with the invoice on file, is the cleanest
answer to that episode if it is ever raised.

### Not approved

The Chinese providers in the comparison — Kling, Hailuo, Seedance, Vidu — are excluded for two
reasons, neither about quality. None documents its watermark policy, and one review reports
watermarks on paid exports. More to the point, we bid for Indian PSU and government work and for
African government work, where the provenance of published media is a question we should be able
to answer in one sentence. "An Alibaba or ByteDance service, terms unclear" is not that sentence.

Open-source Wan is a reasonable technical option and a poor commercial one for the same reason:
the team's own note says the Apache-2.0 licence was not confirmed.

---

## 2 · The one rule that is not negotiable

> **No image may depict a place, person, document or credential that a reader could reasonably
> take to be ours when it is not.**

A generic photograph of an office is decoration, and every reader understands it as decoration. A
generated image of _our_ office, with our logo on the wall, is a **depiction** — and that is a
different thing in three ways that all cost money:

- It is what the old hero footage did, and why it came off.
- It engages the **deception** limb of India's IT Rules rather than the labelling limb. The
  labelling duty notified on 10 February 2026 falls on intermediaries, not on us publishing our
  own site; the prohibition on deceptive or impersonating content does reach us, and the
  definition of synthetic content turns on whether it is made to appear real and indistinguishable
  from a real-world event.
- In a tender it reads as evidence that our pictures are as approximate as our claims, on a site
  whose argument is the opposite.

**Decoration is allowed. Depiction of us is not, unless it is actually us.**

Concretely — abstract textures, gradients, generic cityscapes, hands on keyboards, server rooms
that belong to nobody: fine. Our offices, our delivery centres, our people, our certificates,
our clients' premises, a logo rendered onto a wall: not, whatever licence sits behind it.

Two further rules that follow from it:

- **The licence must permit commercial use and export without a visible marker on the tier we
  actually pay for, and we keep the invoice.** No stripping, no cropping, no removing the sparkle.
- **Embedded provenance stays.** SynthID and C2PA are not defects to clean off. Removing
  provenance metadata is a separate act from removing a watermark, and a worse one to be caught at.

---

## 3 · How a new image gets onto the site

Every bitmap that is not ours and is not a third-party mark needs a line in
`content/image-licences.ts`. The build fails without one — this is a gate, not a convention.

```ts
{
  file: "public/hero/abstract-network.jpg",
  source: "licensed-stock",
  provider: "Adobe Stock",            // must be in APPROVED_PROVIDERS
  reference: "AS-1234567890",         // something the provider can confirm. "Paid plan" is rejected
  acquired: "2026-11-24",
  depicts: "An abstract blue network lattice on a dark field",
  aiGenerated: false,
  approvedBy: "Firstname Lastname",   // a person, not a function
}
```

Four checks run on it:

| Check         | What it rejects                                                              |
| ------------- | ---------------------------------------------------------------------------- |
| Provenance    | A photograph with no register line at all                                    |
| Reference     | "Paid plan", "subscription", "n/a" — anything the provider could not confirm |
| Description   | Fewer than three words, so "office" does not pass                            |
| **Depiction** | Any `depicts` containing "our" or "In2IT" — the rule in §2, enforced         |

The register is also what makes §4 possible: in twelve months it lists exactly which files our own
photography has to replace, with no archaeology.

---

## 4 · The twelve-month collection programme

The workaround ends because the build stops, not because somebody remembers.
`INTERIM_POLICY_REVIEW` is **20 November 2027**. The build warns from thirty days out and fails
the day after.

To have something to replace it with:

| When              | What                                                                                                                                                                              | Who            |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| **This month**    | Scan the four certificates — CMMI, ISO 9001, ISO/IEC 27001, SAP Gold Partner — with issuing body and expiry date. These are the only images on the site that are _evidence_       | Compliance     |
| **This month**    | One morning of leadership portraits. Four of the team have one; the rest fall back to a monogram                                                                                  | Marketing      |
| **Every month**   | A standing ask at the delivery and practice reviews: photographs from go-lives, workshops, client visits, site work. Written consent at the point of capture, not retrospectively | Practice leads |
| **Every quarter** | Add what was collected to `public/events/` and replace the licensed files it can stand in for. Delete the register line as you go                                                 | Marketing      |
| **By Aug 2027**   | Review the register. Whatever is left needs either our own photograph or a fresh decision                                                                                         | Marketing      |

**Consent is captured when the photograph is taken.** A photograph of an employee is personal
data under the DPDP Act; consent has to be obtained, recorded, and honoured on withdrawal,
including by people who have left. Collecting it at the moment of capture costs nothing.
Collecting it two years later is a project.

---

## 5 · What this does not change

The generated route figures stay. `components/sections/hero-figure.tsx` draws a deterministic
figure per route — four brand colours, no two routes alike, 4 KB of component code against the
70 MB of JPEGs it replaced. It claims nothing, it never goes stale, and a new page draws its own
the moment it has a URL.

Licensed imagery supplements it where a page genuinely reads thin. It is not a reason to put a
photograph on every page, and the admin picture picker still overrides the figure wherever an
editor chooses one deliberately.

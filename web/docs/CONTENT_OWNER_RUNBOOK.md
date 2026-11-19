# Running this website without breaking it

**For whoever owns the site's content.** You do not need to be a developer to read this. You do
need it before **10 February 2027**, for the reason in §1.

This site is unusual: it refuses to publish things it cannot stand behind. That is deliberate, it
is the whole point, and the first time it stops you it will feel like a bug. It is not. This
document is how to tell the difference.

---

## 1 · Two dates that will stop the site publishing

| Date                 | What happens                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| **10 February 2027** | The capability register expires. **The build fails. Nothing new publishes** until it is reviewed |
| **31 May 2027**      | The corporate facts review lapses. Same effect                                                   |

These are not bugs. They are the site refusing to keep publishing claims nobody has checked in
three months.

**When 10 February arrives**, somebody will see a red build saying the capability review has
expired. The quickest way to make it go away is to change one date in one file. **That is the
wrong fix and it is how this site dies.** The whole value of the register is that it cannot say
something is true for longer than someone is prepared to vouch for it.

**The right fix**, which takes about an hour:

1. Open `content/capability-status.ts`. It lists every capability with one of four statuses.
2. Go through them with whoever runs delivery. For each line, ask: _is this still true, with
   evidence?_ "Delivered" means in production at a named client, signed off, with a named person
   here accountable. A pilot is not delivered. Having people with the skill is not delivered.
3. Change any status that has changed. Moving a line from "Building" to "Delivered" is good news;
   moving one the other way is the system working.
4. **Then** update `capabilityReviewed` to today's date. That buys another 90 days.

Same procedure on 31 May for `content/site.ts` — headcount, certifications, delivery centres —
then update `contentUpdated`.

**Right now `capabilityOwner` says "Marketing and Communications".** That is a function, not a
person who has been told. Put a name against it and both dates in that person's calendar before
this goes anywhere near a handover.

---

## 2 · The build stopped and told me off. What does it mean?

The site checks twenty-one things before it will publish. Here are the ones you will actually
meet, in plain language.

### "Unfalsifiable adjective"

> _house-style: 'world-class' in content/services.ts_

**What it means:** you used a word that cannot be proved wrong. "World-class", "best-in-class",
"cutting-edge" — no observation could show these false, so they tell a buyer nothing.

**What to do:** replace it with the thing that made you reach for it. Not _"world-class SAP
expertise"_ but _"380 SAP consultants across eleven practices"_. A number and a name.

**What not to do:** find a synonym the gate does not catch. The list is not the rule; the rule is
that a claim has to be checkable.

### "A percentage has no recorded baseline, window or measurer"

> _figures: 40% in content/case-studies.ts has no provenance_

**What it means:** you published a number without saying what it is a number _of_, over what
_period_, and who _measured_ it.

**What to do:** fill in all three, in `content/evidence.ts`. If you cannot — because nobody
recorded them — then the honest options are to say so explicitly, or to take the number out. A
figure nobody can defend is worth less than no figure: it hands procurement something to discount.

**What not to do:** invent the missing part. A fabricated baseline survives scrutiny for exactly
one question.

### "A photographic file appeared outside the allow-list"

**What it means:** somebody added a `.jpg`, `.webp` or `.avif`. The site has no stock photography
by decision — see `claude/image-asset-audit.md`.

**What to do:** if it is our own photograph (an event, a certificate, a client's logo), it belongs
in one of the allowed folders. If it is a stock image, it does not go on the site at all; pages
draw their own figure automatically.

### "An internal link points at a route that does not exist"

**What it means:** exactly that, and it caught a 404 on one of the largest elements of the
industries page that every previous check had missed.

**What to do:** fix the link. The error names the file and the URL.

### "An FAQ answer no longer appears in the page it was lifted from"

**What it means:** you edited a page, and an FAQ entry still quotes the old wording. Search engines
and AI assistants read the FAQ version.

**What to do:** update `content/faqs.ts` to match the page. The page is the source of truth; the
FAQ follows it, never the other way round.

### "Client name or identifying token reached published copy"

**What it means:** a case study that publishes anonymously contains something that identifies the
client — not just a name, but _"the 930 km Mombasa–Kisumu mainline"_ is one railway.

**What to do:** remove the identifying detail, or get written permission and change the
compliance flag. Do not do the second without the first being in writing.

---

## 3 · Things you can change freely

Through `/admin`, with no build and no developer:

- Page titles, intros and body copy on service, industry and partner pages
- Hero headline and intro on any page
- News and insight articles
- Job openings
- The announcement bar
- Uploading a picture for a specific page, deliberately, where it earns its place

Edits appear on the live site without a redeploy. The gates still apply — if you write
"world-class" into `/admin`, the next build will stop.

---

## 4 · Things to talk to someone about first

- **Changing a number on the homepage.** Every figure there is counted from a file, so the
  register and the homepage cannot drift apart. Changing one by hand breaks that.
- **Publishing a named client.** Three separate permissions govern this, held by three different
  people. They are separate on purpose.
- **Adding a testimonial.** Needs that person's confirmation in writing. Not "they said it was
  fine on a call".
- **Removing anything from `/about/where-we-stand/`.** The register publishes what we _cannot_
  do, and that is the most distinctive thing on the site. There will be pressure to soften it the
  first time it costs a deal. That pressure is the thing it exists to resist.

---

## 5 · The one rule behind all of it

**Every claim on this site is either checkable or it does not publish.**

That is not a style preference. It is the commercial position: every competitor in this market
says they are experienced, trusted and world-class, and buyers have learned to discount all of it.
This site says fewer things, and each one holds. A page that admits what it cannot do is the only
page in the market worth believing — and, as it turns out, the only kind an AI assistant finds
worth citing.

When a gate stops you, it is doing the job it was built for. The question to ask is never _how do
I get past this?_ It is _what would make this claim true?_

---

## 6 · Who to ask

| Problem                                                       | Who                                                                                                                                  |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| A gate stopped the build and this document did not explain it | Whoever maintains the site                                                                                                           |
| A capability status needs changing                            | Delivery leads, then update the register                                                                                             |
| A figure needs its baseline, window and measurer              | The delivery lead who ran the project                                                                                                |
| Permission to name a client                                   | The three compliance flags are in `content/compliance.ts`; each has an owner                                                         |
| The site is down, or showing an access-denied page            | Check `claude/production-state.md` §4 first — in November 2026 that turned out to be the firewall blocking the office, not an outage |

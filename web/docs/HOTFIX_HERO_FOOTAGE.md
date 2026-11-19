# Hotfix — take the AI-generated hero footage off the homepage

**18 November 2026. One line of code. Does not need the content-rebuild branch.**

This is written to be applied to **whatever is deployed right now**, by whoever has deploy access,
without waiting for the 36 unpushed commits, a review, or anything else on the backlog.

---

## Why this one and not the rest

Everything else in the audits can wait for the branch to land properly. This cannot, for one
reason: it is the only live defect with a **contractual** dimension rather than a quality one.

`public/hero-frames/` is five AI-generated clips — stylised offices with the In2IT EBS logo
rendered onto the walls — sampled at 12fps into 1,205 stills and played back as a flip-book. The
extraction script that built them carries this note:

> `HERO_SOURCE points at another folder of video1.mp4 … video5.mp4 (e.g. the clips with the Gemini
> sparkle removed, 2026-10-06)`

Three separate problems, in order of seriousness:

1. **The provider's watermark was removed.** Google's generative video tools apply a visible
   marker. Stripping it is normally a breach of the provider's terms of use. It is a contract
   question rather than a copyright one, and it was deliberate enough that somebody wrote it down.
2. **It depicts offices and colleagues that do not exist**, carrying a real client logo, as the
   first thing a visitor sees — on a site whose argument is that its claims can be checked.
3. **It reads as AI-generated**, which for a firm positioning on rigour is a own-goal.

(1) does not improve with time, and it is live.

---

## The change

In `components/sections/brand-hero.tsx`, find this line inside the clip-wrapper loop:

```tsx
<FrameSequence sequence={heroFrames[item.frames] ?? heroFrames["slide-1"]} urgent={index === active} />
```

Replace it with:

```tsx
{
  /* The AI-generated footage was removed on 18 November 2026: the provider's watermark had
    been stripped from the source clips, and the clips depict offices and colleagues that do
    not exist. See docs/HOTFIX_HERO_FOOTAGE.md. The carousel, copy and buttons are unchanged;
    this is the brand navy behind them. */
}
<div className="absolute inset-0 bg-brand" />;
```

That is the whole change. The five-slide carousel, the rotation, the copy, the buttons, the slide
indicators, the accessibility attributes and the layout are all untouched — only what renders
behind them changes, from synthetic footage to flat brand navy.

### If the build complains about unused imports

`eslint --max-warnings 0` will now fail on two imports that nothing uses. Delete these two lines
from the top of the same file:

```tsx
import { FrameSequence } from "@/components/media/frame-sequence";
import { heroFrames } from "@/content/hero-frames";
```

Leave `components/media/frame-sequence.tsx`, `content/hero-frames.ts` and `public/hero-frames/`
alone. Deleting them is correct and it is what the branch does, but it is a larger change with a
larger blast radius, and the point of this hotfix is that it is small enough to deploy on its own
judgment. The files cost 42 MB of disk and serve nothing once the line above is gone.

---

## Verify before deploying

```bash
npm run check                 # prettier, eslint, tsc, tests
SITE_ENV=production npm run build
npm start                     # then open the homepage
```

Check: the hero is flat navy, the headline still reads _"Change with confidence. Run without
compromise."_, the carousel still rotates through five slides, and both buttons still work. Then
confirm no request for `/hero-frames/` appears in the browser's network tab.

---

## What it will look like

Navy, with the headline and buttons over it. Deliberately plain, and better than it sounds: the
copy carries the hero instead of competing with a video for attention, and nothing on the page
makes a claim that cannot be checked.

If a richer treatment is wanted afterwards, the content-rebuild branch already has one —
`components/sections/hero-figure.tsx` draws a deterministic generated figure per route, in the
brand palette, that claims nothing. That comes with the branch. It is not needed for this.

---

## Afterwards

Two things that are not this hotfix but belong to it:

- **Confirm with whoever commissioned the clips** what the licence actually permitted and whether
  removing the watermark was cleared. Taking the frames off the site ends the exposure going
  forward; it does not answer what was agreed at the time.
- **Check whether those clips were used anywhere else** — a deck, a proposal, a LinkedIn post, the
  YouTube channel. The same question applies wherever they went, and the website is usually not
  the only place something like this lands.

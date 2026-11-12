import { test, expect, type Page } from "@playwright/test";

// The homepage hero is a five-slide, auto-rotating carousel on ambient footage (2026-09-15 15:28):
// the brand copy plus the four service slides that used to follow it in their own section, one
// clip each, advancing every 4.5 s with no controls of any kind. Since 2026-09-21 the footage is
// not a video file at all: each clip is a frame sequence (scripts/extract-hero-frames.mjs) that
// `FrameSequence` draws on a canvas, reporting on `data-frame-sequence`: "playing", "loading",
// "paused" (hidden tab, motion flag or offscreen) or "poster" (reduced motion or data saver: no
// frame is ever fetched). The hero carries the `.on-video` palette (the former dark theme) over a
// 55% black veil; the page's second video section went with the services directory on 2026-09-17.
const brandHero = "section[data-brand-hero]";
const heroVideo = `${brandHero} [data-frame-sequence]`;
const activeSlide = `${brandHero} [data-hero-slide][data-active="true"]`;
const activeClip = `${brandHero} [data-hero-video][data-active="true"] [data-frame-sequence]`;
const activeCanvas = `${activeClip} canvas`;
const activePoster = `${activeClip} img`;

/** The Discover cue went on 2026-09-17 at the owner's request; nothing replaced it in that corner. */
async function noDiscoverCue(page: Page) {
  await expect(page.getByRole("link", { name: "Scroll to featured services" })).toHaveCount(0);
}

/** Keyboard focus inside the hero holds the rotation, which pins the brand slide for slow runs. */
async function holdOnBrandSlide(page: Page) {
  await page.locator(`${brandHero} [data-hero-slide="0"]`).getByRole("link", { name: "Start a conversation" }).focus();
}

test("desktop: the hero is a five-slide carousel on ambient video with no controls", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await holdOnBrandSlide(page);
  const hero = page.locator(brandHero);
  await expect(hero).toHaveAttribute("aria-roledescription", "carousel");
  await expect(hero).toHaveClass(/on-video/);
  await expect(page.locator(`${brandHero} [data-hero-slide]`)).toHaveCount(5);
  await expect(page.locator(activeSlide)).toHaveAttribute("data-hero-slide", "0");
  await expect(page.locator(`${activeSlide} h1`)).toContainText("Change with confidence.");
  // Only the active clip and the next one are mounted; the active one plays the entry clip.
  await expect(page.locator(heroVideo)).toHaveCount(2);
  await expect(page.locator(activeClip)).toHaveAttribute("data-frame-sequence", "playing", { timeout: 20000 });
  // A flip book, not a video: no <video> anywhere in the hero, a canvas that is being drawn on,
  // the wide frame set on a desktop, and the first slide's poster underneath.
  await expect(page.locator(`${brandHero} video`)).toHaveCount(0);
  await expect(page.locator(activeClip)).toHaveAttribute("data-frame-set", "w1280");
  await expect(page.locator(activeClip)).toHaveAttribute("data-frame-count", "120");
  await expect(page.locator(activePoster)).toHaveAttribute("src", /hero-frames\/slide-1\/poster\.jpg$/);
  const drawn = await page.locator(activeCanvas).evaluate((c: HTMLCanvasElement) => {
    const data = c.getContext("2d")!.getImageData(0, 0, Math.min(64, c.width), Math.min(64, c.height)).data;
    return data.some((v, i) => i % 4 === 3 && v > 0);
  });
  expect(drawn, "the canvas has frames painted on it").toBe(true);
  // One 55% black veil sits between the clips and the copy (owner, 2026-09-15 16:20); none of the
  // earlier layers survive.
  const veil = page.locator(`${brandHero} .video-veil`);
  await expect(veil).toHaveCount(1);
  expect(await veil.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe("rgba(0, 0, 0, 0.55)");
  for (const gone of [".video-tint", ".video-wash", ".video-wash-copy", ".video-wash-methods"])
    await expect(page.locator(`${brandHero} ${gone}`)).toHaveCount(0);
  // The clip wrappers carry z-indexes for the cross-fade. Their container must be its own stacking
  // context, or those z-indexes escape into the section's and the clips paint above the veil
  // (which is exactly what happened on 2026-09-15 before this assertion existed).
  const clips = page.locator(`${brandHero} [data-hero-video]`).first().locator("..");
  expect(await clips.evaluate((el) => getComputedStyle(el).isolation)).toBe("isolate");
  await expect(page.locator(`${brandHero} .hero-ambient`)).toHaveCount(1);
  // The copy is centred over the footage (owner, 2026-09-17; it used to sit bottom-left), and
  // nothing in the carousel is a control.
  const heroBox = (await hero.boundingBox())!;
  const headline = (await page.locator(`${activeSlide} h1`).boundingBox())!;
  const headlineCentre = headline.x + headline.width / 2;
  expect(Math.abs(headlineCentre - (heroBox.x + heroBox.width / 2))).toBeLessThan(40);
  expect(headline.y).toBeGreaterThan(heroBox.y + heroBox.height * 0.2);
  expect(headline.y + headline.height).toBeLessThan(heroBox.y + heroBox.height * 0.8);
  // No carousel controls. The hero's own chrome (2026-09-21) is one button that is not a control:
  // the hamburger that opens the site drawer.
  await expect(page.locator(`${brandHero} button:not([aria-label="Open site menu"])`)).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: /page animation|service carousel|Next service|Previous service/ }),
  ).toHaveCount(0);
  await noDiscoverCue(page);
  // The former service carousel and the unapproved testimonial carousel are both absent.
  await expect(page.locator("#featured-services")).toHaveCount(0);
  await expect(page.locator('[aria-roledescription="carousel"]')).toHaveCount(1);
  await expect(page.locator('[aria-roledescription="carousel"]').first()).toHaveAttribute("data-brand-hero", "true");
});

test("the hero advances on its own every 4.5 seconds and keeps the h1 in the document", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(activeSlide)).toHaveAttribute("data-hero-slide", "0");
  await expect(page.locator(activeSlide)).toHaveAttribute("data-hero-slide", "1", { timeout: 7000 });
  await expect(page.locator(`${activeSlide} h2`)).toContainText("Transform your enterprise with SAP.");
  await expect(page.locator(activePoster)).toHaveAttribute("src", /hero-frames\/slide-2\/poster\.jpg$/);
  // Slide 1's h1 stays in the document, hidden, and the leaving clip unmounts once the fade ends.
  await expect(page.locator(`${brandHero} h1`)).toHaveCount(1);
  await expect(page.locator(heroVideo)).toHaveCount(2, { timeout: 3000 });
  await expect(page.locator(activeSlide)).toHaveAttribute("data-hero-slide", "2", { timeout: 7000 });
});

test("phones get the narrow frame set and no Discover cue", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await holdOnBrandSlide(page);
  await expect(page.locator(activeClip)).toHaveAttribute("data-frame-sequence", "playing", { timeout: 20000 });
  await expect(page.locator(activeClip)).toHaveAttribute("data-frame-set", "w768");
  // The old Discover cue is gone; the floating scroll-down button in the corner took its job.
  await expect(page.locator('a[aria-label="Scroll to featured services"]')).toBeHidden();
});

test("reduced motion holds the first slide on its poster and never plays a clip", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(activeClip)).toHaveAttribute("data-frame-sequence", "poster");
  // Not one frame is fetched: only the poster JPEG.
  await page.waitForTimeout(1500);
  const frameRequests = await page.evaluate(
    () => performance.getEntriesByType("resource").filter((e) => /\/hero-frames\/.*\.webp$/.test(e.name)).length,
  );
  expect(frameRequests).toBe(0);
  // No rotation under reduced motion: still the brand slide after a full interval and a half.
  await page.waitForTimeout(7000);
  await expect(page.locator(activeSlide)).toHaveAttribute("data-hero-slide", "0");
});

test("the motion-paused flag pauses the active clip and holds the slide", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(activeClip)).toHaveAttribute("data-frame-sequence", "playing", { timeout: 20000 });
  // There is no visible pause control; MotionObserver sets the flag for reduced motion and hidden
  // tabs, and both the clip and the rotation must keep honouring it.
  await page.evaluate(() => (document.documentElement.dataset.motionPaused = "true"));
  await expect(page.locator(activeClip)).toHaveAttribute("data-frame-sequence", "paused");
  await page.waitForTimeout(6000);
  await expect(page.locator(activeSlide)).toHaveAttribute("data-hero-slide", "0");
  await page.evaluate(() => (document.documentElement.dataset.motionPaused = "false"));
  await expect(page.locator(activeClip)).toHaveAttribute("data-frame-sequence", "playing", { timeout: 20000 });
});

test("the brand hero fills the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.screenshot({ path: "test-results/home-brand-hero.png" });
  const heroBox = await page.locator(brandHero).boundingBox();
  expect(heroBox!.height).toBeGreaterThanOrEqual(900);
});

test("inner-page heroes retain the full-screen rhythm", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about/");
  const box = await page.locator("main > section").first().boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(900);
});

test("the brand slide converges on the centre from four directions", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  // Watch every frame from before the entrance starts — it is held back until the loading splash
  // begins to clear, so sampling from load catches the whole travel. Extremes are collected rather
  // than a single early reading, which would be a race against the first stagger step.
  const track = await page.evaluate(async () => {
    const slide = document.querySelector('[data-hero-slide="0"]')!;
    const targets = {
      label: slide.querySelector("p")!,
      line1: slide.querySelector("h1 span:nth-child(1)")!,
      line2: slide.querySelector("h1 span:nth-child(2)")!,
      cta: slide.querySelector('a[href="/contact/"]')!,
      alt: slide.querySelector('a[href="/what-we-do/"]')!,
    };
    const seen: Record<string, { minX: number; maxX: number; minY: number; maxY: number; x: number; y: number }> = {};
    const started = performance.now();
    await new Promise<void>((done) => {
      const sample = () => {
        for (const [name, el] of Object.entries(targets)) {
          const r = el.getBoundingClientRect();
          const at = seen[name];
          seen[name] = at
            ? {
                minX: Math.min(at.minX, r.x),
                maxX: Math.max(at.maxX, r.x),
                minY: Math.min(at.minY, r.y),
                maxY: Math.max(at.maxY, r.y),
                x: r.x,
                y: r.y,
              }
            : { minX: r.x, maxX: r.x, minY: r.y, maxY: r.y, x: r.x, y: r.y };
        }
        if (performance.now() - started > 3200) done();
        else requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
    return seen;
  });

  // Above the resting place: the label and the opening line drop in.
  expect(track.label.minY, "the label should start above where it lands").toBeLessThan(track.label.y - 8);
  expect(track.line1.minY, "the first line should start above where it lands").toBeLessThan(track.line1.y - 8);
  // Left of it: the second line slides across.
  expect(track.line2.minX, "the second line should come in from the left").toBeLessThan(track.line2.x - 8);
  // And the two calls to action close in on the centre from either side.
  expect(track.cta.minX, "the primary call to action should come from the left").toBeLessThan(track.cta.x - 8);
  expect(track.alt.maxX, "the secondary call to action should come from the right").toBeGreaterThan(track.alt.x + 8);

  // Nothing drifts sideways that should not, and the sideways travel is clipped by the section
  // rather than widening the document.
  expect(Math.abs(track.line1.maxX - track.line1.minX)).toBeLessThan(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(
    true,
  );
});

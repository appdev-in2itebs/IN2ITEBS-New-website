# Image task brief — for the AI agent (Antigravity or any other)

Give the agent **this file** and **`docs/FIREFLY_PROMPTS.md`**, and open the folder
`D:\IN2ITEBS-Website-deployment` as its workspace. Everything it needs is in those two files.

---

## The job

1. Generate the 51 images and 5 videos described in `docs/FIREFLY_PROMPTS.md`, one prompt per
   item, at the aspect ratio stated for each item.
2. Save each file into `assets/firefly/` with the exact filename given for its item
   (e.g. `assets/firefly/20-navy-cube-with-steel-core.png`).
3. Fit them into the website (steps below) and show the result on the local site.

## The website

- Code: `web/` (Next.js). Branch: `deployment`. This is the **sub-branch** version of the site,
  not the live site.
- Run it locally: in `web/`, `npx next dev --hostname 127.0.0.1 --port 3117`, then open
  http://127.0.0.1:3117.
- Where each image goes, its measured size and its crop are listed per item in
  `docs/FIREFLY_PROMPTS.md` (the "Where", "Generate" and "Crop" lines).

## Rules — do not break these

1. **Never `git push`, never merge into `main`, never deploy.** This branch is under management
   review. Commit locally only if asked.
2. **Do not touch `web/.env.local`** and do not run anything that writes to the database. It points
   at the live database.
3. **Use the prompts as written.** Only the subject changes between items; the style sentences stay
   identical so the set matches. No people, no text, no logos, brand colours only
   (#121E3B, #3F75A3, #A3CBE6, #CDC8A5, #F7F8FA).
4. **Every image needs a register entry** in `web/content/image-licences.ts` (`imageLicences`):
   `file`, `source: "licensed-generative"`, `provider` (the actual tool and model used),
   `reference` (the generation ID from the tool), `acquired` (date), `depicts` (plain words, never
   "our" or "In2IT"), `aiGenerated: true`, `approvedBy: "Rudra Shatapathy"`. The build fails
   without it.
5. **The provider must be approved.** `APPROVED_PROVIDERS` in the same file lists Adobe Stock,
   Runway, Google AI Pro (Veo) and In2IT Marketing. Rudra Shatapathy approved **Adobe Firefly** for
   one month. If any other tool or model generates the images, stop and get approval first; record
   the exact model on every register line.
6. **Images only, no video wiring** unless told otherwise. The homepage has no video player on
   purpose.

## Fitting steps

1. Convert each PNG to WebP at about 2× the measured size (for example 1200×900 for a 600×450
   hero), using `sharp` (already installed in `web/`). Save the WebP files in a new folder
   `web/public/generated/` (not in `events`, `team`, `logos` or the other folders that are
   reserved for our own photos or third-party marks).
2. Service and industry heroes: set `heroImage` on the page's entry in
   `web/content/legacy-services.ts` / `legacy-industries.ts` to the file's public path, for example
   `heroImage: "/generated/20-navy-cube-with-steel-core.webp"` (see `heroPicture` in
   `components/sections/hero-override.tsx`).
3. Other heroes: replace the `HeroFigure` media on that page with the image.
4. Items marked "slot must be added": add a picture box in the component named in
   `docs/FIREFLY_PROMPTS.md` section 1, matching the measured size.
5. Items 31–35 and 46 have no place on the site: save them in `assets/firefly/`, don't wire them.
6. Run `npm run check` and `npm run build` in `web/`. Both must pass.
7. Take screenshots of each changed page at desktop and phone width and hand them back for
   approval.

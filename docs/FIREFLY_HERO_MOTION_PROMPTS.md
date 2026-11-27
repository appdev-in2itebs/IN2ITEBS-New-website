# Homepage hero: Firefly motion backgrounds, one per message (27 Nov 2026)

Replaces the people-and-office storyboard in `FIREFLY_HERO_VIDEOS.md` for the hero background.
Footage of people in a synthetic office sits behind the headline as noise, and the owner already
moved the homepage away from a generated office picture. These are abstract motion graphics: the
same navy palette as the site, nothing to read, and a calm, dark centre where the words sit.

**Generator settings (Adobe Firefly → Generate video):** model Firefly Video (unlimited on our plan;
Veo/Kling use paid credits), 1080p, 16:9, 24 fps, 5 seconds. The clip loops behind the slide, so
every prompt asks for slow, continuous motion.

**Shared ending for every prompt** (Firefly Video has no separate "avoid" box):
> Deep navy, steel blue and ice blue palette only, soft bloom, subtle depth of field, very slow
> camera motion, premium minimal enterprise technology aesthetic. No text, no letters, no numbers,
> no logos, no people, no faces.

| Slide | Message | Scene |
|---|---|---|
| 1 `brand` | Change with confidence. Run without compromise. | Converged streams |
| 2 `sap` | Transform your enterprise with SAP. | Digital core platform |
| 3 `applications` | Applications built around your business. | Living blueprint |
| 4 `platforms` | Connect people, processes and performance. | Connected orbits |
| 5 `data-ai` | Turn enterprise data into everyday decisions. | Data into insight |

## 1 · brand: Converged streams
Slow, elegant 3D motion graphic for a corporate website background. Dozens of fine luminous
threads of light flow in from the left and right edges of a deep navy space and converge into one
softly glowing core of light at the bottom centre. Tiny points of light travel along the threads
towards the core. The core breathes gently. The centre and upper half of the frame stay dark,
calm and empty. *(+ shared ending)*

## 2 · sap: Digital core platform
Slow, elegant 3D motion graphic for a corporate website background. A vast dark navy-blue glass
platform floor made of fine square tiles stretches to a soft glowing horizon. From a bright
luminous core at the bottom centre, gentle waves of soft sky-blue light ripple outward across the
tiles. On the far left and right edges, translucent glass modules rise slowly from the floor and
dock into the grid, linked to the core by thin flowing streams of light. The centre and upper half
of the frame stay dark, calm and empty. *(+ shared ending)*

## 3 · applications: App constellation (owner's choice, 27 Nov, from four options)
Slow, elegant 3D motion graphic for a corporate website background. A gentle constellation of many
small translucent frosted-glass application cards (blank rounded panels, toggle switches, tiny bar
charts and circular dials, with no writing) floats at different depths in a deep navy space,
drifting very slowly towards the camera with soft bokeh in the distance. The cards gather in the far
left and far right of the frame, small and refined, a few connected by fine glowing lines of light
with tiny pulses moving along them. The centre of the frame and the top left corner stay dark, calm
and empty. *(+ shared ending, plus "no large objects near the camera")*

Source: `assets/firefly/hero-video/ff-hero-applications-a.mp4`. The other options tried (v1–v4 and
b–d) are kept beside it.

## 4 · platforms: Connected orbits
Slow, elegant 3D motion graphic for a corporate website background. Three wide, tilted elliptical
orbits of fine light circle a soft glowing centre low in the frame, on a deep navy background.
Small glowing spheres travel along each orbit at different speeds, and thin lines of light connect
spheres on neighbouring orbits as they pass each other, then fade. The upper half of the frame
stays dark, calm and empty. *(+ shared ending)*

## 5 · data-ai: Data into insight
Slow, elegant 3D motion graphic for a corporate website background. On a deep navy background,
streams of tiny glowing data particles rise from the bottom edge and settle into rows of
translucent glass bar columns along the left and right sides, which grow and shift smoothly. A
single smooth line of light draws a gently rising curve across the lower third. The centre of the
frame stays dark, calm and empty. *(+ shared ending)*

## Placing them
Clips go to `web/public/video/hero/<slide-id>.mp4` (plus a `.webm`), compressed to about 1–2 MB
each, with a poster frame. The hero plays the clip that matches the active slide behind a navy
wash so the words stay first, and keeps the drawn Converged Streams as the fallback (reduced
motion, slow connections, before the video loads).

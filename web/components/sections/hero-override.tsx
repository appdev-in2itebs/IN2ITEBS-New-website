import type { ReactNode } from "react";
import { getCms, type HeroEdit } from "@/lib/cms/content";
import { HeroImage, HeroObject, hasHeroImage } from "./hero-media";

/**
 * Page hero edits made in /admin/pages (title, intro, picture), read while the page renders. A save
 * in the admin refreshes the page on demand, so the edit is live within seconds. Anything not edited
 * keeps the text and picture written in the page's code.
 */
export type { HeroEdit };

export async function heroOverride(route?: string): Promise<HeroEdit | undefined> {
  return route ? (await getCms()).heroes[route] : undefined;
}

/**
 * A chosen picture: a key from the hero image library ("services/agile-devops"), the URL of an
 * image uploaded to the media library, or one of the website's own images
 * ("/services/live/x.png"). Anything else, or nothing, keeps the page's own media.
 */
export function heroPicture(choice: string | undefined, fallback: ReactNode, alt = ""): ReactNode {
  if (!choice) return fallback;
  if (hasHeroImage(choice)) return <HeroObject name={choice} />;
  if (/^https:\/\//.test(choice))
    // A PNG upload is usually a cut-out, shown whole; a photograph gets the soft-edged photo treatment.
    return <HeroImage src={choice} alt={alt} kind={/\.png(\?|$)/i.test(choice) ? "object" : "photo"} />;
  // One of the site's own images: drawn the way the pages draw it (by its file type).
  if (/^\/[\w\-./%]+\.(png|jpe?g|webp|avif|svg)$/i.test(choice)) return <HeroImage src={choice} alt={alt} />;
  return fallback;
}

export function overrideMedia(override: HeroEdit | undefined, fallback: ReactNode): ReactNode {
  return heroPicture(override?.imageKey, fallback);
}

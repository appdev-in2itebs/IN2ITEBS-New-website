import sitemap from "@/app/sitemap";
import { livePagePaths } from "@/lib/builder/store";

/**
 * The pages whose hero can be edited: every page in the sitemap except the homepage (its animated
 * hero is not a title-and-picture hero), the individual articles (they have no hero) and the pages
 * made in the page builder (their hero is a block, edited there).
 */
export async function editablePaths(): Promise<string[]> {
  const built = new Set(await livePagePaths());
  return (await sitemap())
    .map((entry) => new URL(entry.url).pathname)
    .filter(
      (p) =>
        p !== "/" &&
        !/^\/insights\/[^/]+\/$/.test(p) &&
        !/^\/careers\/current-openings\/[^/]+\/$/.test(p) &&
        !built.has(p),
    )
    .sort();
}

/** Every address the website serves today, which a new builder page may not take. */
export async function takenPaths(): Promise<Set<string>> {
  return new Set((await sitemap()).map((entry) => new URL(entry.url).pathname));
}

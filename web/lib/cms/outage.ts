/**
 * WHAT HAPPENS WHEN THE DATABASE IS DOWN — one policy, in one place.
 *
 * ── THE TWO CASES ARE NOT THE SAME, AND THE DIFFERENCE MATTERS ───────────────────────────────
 * The CTO review asked for the content reads to "fail soft" — catch, log, fall back to the text
 * in `content/*.ts`. Half of that was right, and applying it everywhere would have introduced a
 * worse bug than the one it fixed.
 *
 * **At request time the throw is load-bearing.** When Next revalidates a page in the background
 * and the read throws, Next keeps serving the last good render. If it quietly fell back to the
 * shipped text instead, a transient database error would bake the pre-edit content into the
 * cache — an editor's live correction would vanish from the site with nothing failing and nobody
 * told. A page that briefly errors recovers on its own. A page that caches the wrong content
 * stays wrong until a human notices, which on a corporate site can be months.
 *
 * **At build time the throw is only harmful.** The whole deploy stops because a third party is
 * having a bad afternoon. The site renders perfectly well without the database: `content/*.ts`
 * is the base layer and the overlay is an enhancement. Losing the overlay for one deploy is a
 * bad day; being unable to deploy at all — including unable to deploy a fix — is worse.
 *
 * So: at build, log loudly and continue on the shipped text. At request, throw exactly as before.
 *
 * ── WHY IT LIVES IN ITS OWN FILE ─────────────────────────────────────────────────────────────
 * Because the first version of this fix was written inline in `getCms()`, and the build still
 * failed — `lib/builder/store.ts` reaches for the same database on the sitemap path and threw in
 * exactly the same way. The review had named one caller and there were four. Two copies of a
 * failure policy are two policies within a quarter, so there is one, here, and every read that
 * can run during a build goes through it.
 *
 * ── BEFORE YOU CHANGE THIS ───────────────────────────────────────────────────────────────────
 * Making it swallow errors at request time will look like an improvement and will lose an
 * editor's work. Read the first section again.
 */

/** True only while `next build` is generating pages. Next sets this; nothing else does. */
export const isBuildPhase = () => process.env.NEXT_PHASE === "phase-production-build";

/**
 * Run a database read. At request time any failure propagates. During a build it is reported and
 * `fallback` is returned instead.
 *
 * `label` names the read in the build log — it is what somebody greps for at 2am, so make it the
 * table or the thing, not the function.
 */
export async function readOrFallBack<T>(label: string, read: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await read();
  } catch (error) {
    if (!isBuildPhase()) throw error;
    // Loud on purpose, and at error level. A deploy that silently dropped every /admin edit while
    // reporting success is the failure this branch exists to avoid becoming.
    console.error(
      `\n[cms] ${label}: the database was unreachable during the build.\n` +
        "[cms] Falling back to the text in content/*.ts — THIS DEPLOY CONTAINS NO /admin EDITS.\n" +
        "[cms] Re-run the build once the database is back.\n" +
        `[cms] ${error instanceof Error ? error.message : String(error)}\n`,
    );
    return fallback;
  }
}

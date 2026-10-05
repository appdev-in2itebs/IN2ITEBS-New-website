import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
import doShardedTagCache from "@opennextjs/cloudflare/overrides/tag-cache/do-sharded-tag-cache";

/**
 * Instant content editing (blueprint section 6): every page is still prerendered and served from a
 * cache, but the cache is an R2 bucket (NEXT_INC_CACHE_R2_BUCKET) that the Worker can rewrite. When an
 * editor saves in /admin, the server action calls revalidatePath(); the sharded tag cache (a Durable
 * Object) marks those pages stale and the next visit re-renders them from Supabase, so the change is
 * live within seconds. The queue (another Durable Object) runs those re-renders in the background
 * and keeps serving the previous page meanwhile, so a visitor never waits and a failed re-render
 * never takes a page down. `opennextjs-cloudflare deploy` copies the build's pages into R2 first.
 */
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  queue: doQueue,
  tagCache: doShardedTagCache({ baseShardSize: 12 }),
  enableCacheInterception: true,
});

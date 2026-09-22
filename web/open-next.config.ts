import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * Every marketing route is prerendered at build time and there is no ISR in this app, so the
 * default in-Worker cache is enough. If on-demand revalidation is ever added, swap in the R2
 * incremental cache override and give the Worker an R2 bucket binding.
 */
export default defineCloudflareConfig({});

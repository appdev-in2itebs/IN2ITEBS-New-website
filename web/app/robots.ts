import type { MetadataRoute } from "next";
import { INDEXING_ENABLED, SITE_URL } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  if (!INDEXING_ENABLED) return { rules: { userAgent: "*", disallow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/thank-you/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

import { redirects as redirectMap, goneSources } from "./content/redirects.mjs";

const siteEnv = process.env.SITE_ENV;
if (process.env.NODE_ENV === "production" && siteEnv !== "production" && siteEnv !== "preview") {
  throw new Error(
    "SITE_ENV must be set to 'production' or 'preview' for next build and next start. " +
      "It is read at build time and decides robots.txt and the X-Robots-Tag header. See docs/REMEDIATION_RUNBOOK.md.",
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: true,
  async headers() {
    const dev = process.env.NODE_ENV === "development";
    const csp = [
      "default-src 'self'",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
      `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      // Uploaded images live in the Supabase "media" bucket (the admin previews them directly).
      "img-src 'self' data: blob: https://*.supabase.co",
      "font-src 'self' data:",
      `connect-src 'self'${dev ? " ws: wss:" : ""}`,
      // 'self', not 'none': the admin's visual editor and page builder show this site's own pages
      // in a frame. No other site may frame them.
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      ...(dev ? [] : ["upgrade-insecure-requests"]),
    ].join("; ");
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          ...(siteEnv === "production" ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }]),
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Images uploaded in /admin/media: served from the public bucket, resized by next/image.
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/media/**" }],
  },
  async redirects() {
    return redirectMap;
  },
  async rewrites() {
    return { beforeFiles: goneSources.map((source) => ({ source, destination: "/api/gone/" })) };
  },
};

export default nextConfig;

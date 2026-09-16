import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/config";

/**
 * Generates `/robots.txt`:
 * - lets all crawlers index the site,
 * - blocks the private API endpoints,
 * - points crawlers at the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
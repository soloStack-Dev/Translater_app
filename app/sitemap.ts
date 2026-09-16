import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/config";

/**
 * Generates `/sitemap.xml` — tells search engines which pages exist, how
 * often they change and their relative importance. This is one of the key
 * signals for a high SEO score.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/features"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/voice"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
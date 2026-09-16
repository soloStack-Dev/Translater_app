import type { Metadata } from "next";

// =============================================================================
// Site configuration — the single source of truth for all SEO-related values.
//
// Import this from server components (layout, pages, sitemap, robots) and use
// `buildMetadata()` to assemble Next.js Metadata objects with a consistent
// title, description, canonical URL, Open Graph and Twitter card everywhere.
// =============================================================================

/**
 * Public base URL of the site.
 *
 * In production this should be an absolute URL (e.g. "https://auraai.example").
 * A relative "/" fallback keeps local development / preview builds working.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "/";

/**
 * Display name of the product / organization. Used in the Next.js `<title>`,
 * JSON-LD structured data and browser tab.
 */
export const SITE_NAME = "Aura AI";

/**
 * Short tagline shown next to the brand name in document titles.
 */
export const SITE_TAGLINE = "Voice Assistant";

/**
 * One or two sentence summary of the whole site. Used by search engines as
 * the default meta description when a page does not ship its own.
 */
export const SITE_DESCRIPTION =
  "Aura AI is a warm, intelligent voice assistant that speaks Hindi, Tamil, Malayalam and Kannada. Type or talk naturally — Aura understands you and responds in your language.";

/**
 * Search keywords describing the product for assistive metadata.
 */
export const SITE_KEYWORDS = [
  "Aura AI",
  "voice assistant",
  "voice AI",
  "Hindi voice assistant",
  "Tamil voice assistant",
  "Malayalam voice assistant",
  "Kannada voice assistant",
  "multilingual AI",
  "text to speech",
  "speech to text",
];

/**
 * Language attribute of the whole document ("en" = English UI). The *spoken*
 * content is multilingual and handled by the voice page.
 */
export const SITE_LANG = "en";

/**
 * Default Open Graph image (absolute path, resolved against `SITE_URL`).
 * Keep a 1200x630 JPG/PNG at this location for the best social sharing cards.
 */
export const OG_IMAGE = "/og-image.png";

/**
 * Theme color used by mobile browsers for the address-bar tint.
 */
export const THEME_COLOR = "#fdfbf7";

/**
 * Build a fully-qualified URL from a path.
 * Example: `absoluteUrl("/voice")` -> "https://example.com/voice".
 */
export function absoluteUrl(path = ""): string {
  if (SITE_URL === "/") return path || "/";
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Type of the extra metadata a page can pass in to stay consistent with the
 * site-wide defaults (used by `buildMetadata` below).
 */
type PageMetadata = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  openGraphImage?: string;
};

/**
 * Assemble a fully-populated Next.js Metadata object.
 *
 * Every page calls this instead of hand-writing `metadata`, guaranteeing:
 * - a unique, descriptive `<title>` ("Aura AI · Voice Assistant" pattern);
 * - a `<meta name="description">`;
 * - a canonical tag;
 * - Open Graph + Twitter cards with an absolute image URL.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  openGraphImage = OG_IMAGE,
}: PageMetadata): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(openGraphImage);

  return {
    // "Aura AI · Voice Assistant — My Title" style title template suffix.
    title: {
      absolute: `${SITE_NAME} · ${SITE_TAGLINE} — ${title}`,
    },
    description,
    keywords: [...SITE_KEYWORDS, ...keywords],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title: `${SITE_NAME} — ${title}`,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} — ${title}`,
      description,
      images: [imageUrl],
    },
  };
}
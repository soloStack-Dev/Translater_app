import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_URL,
} from "@/lib/config";

import "./globals.css";

// ---------------------------------------------------------------------------
// Google fonts, loaded at build time. `variable` feeds the Tailwind theme so
// the font is applied via CSS custom properties (helps SEO/performance:
// fonts are preloaded and self-hosted, no layout shift).
// ---------------------------------------------------------------------------
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ---------------------------------------------------------------------------
// Site-wide SEO metadata.
//
// `metadataBase` must be an absolute URL — Next resolves relative OG image
// URLs against it. In production set NEXT_PUBLIC_SITE_URL to the real domain.
// ---------------------------------------------------------------------------
const metadataBaseUrl = SITE_URL.startsWith("http")
  ? SITE_URL
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(metadataBaseUrl),
  title: {
    // Every page without its own title gets "<SITE_NAME> · <SITE_TAGLINE>".
    default: "Aura AI · Voice Assistant — Multilingual Voice Companion",
    // Child pages add a suffix, e.g. "... — Features".
    template: "%s",
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "Aura AI · Voice Assistant — Multilingual Voice Companion",
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aura AI · Voice Assistant — Multilingual Voice Companion",
    description: SITE_DESCRIPTION,
  },
};

// ---------------------------------------------------------------------------
// Mobile viewport / theme color (controls the browser address-bar tint).
// ---------------------------------------------------------------------------
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfbf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// ---------------------------------------------------------------------------
// JSON-LD structured data (Organization + WebSite) — helps search engines
// understand brand info and eligibility for rich results.
// ---------------------------------------------------------------------------
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: metadataBaseUrl,
  description: SITE_DESCRIPTION,
  logo: `${metadataBaseUrl}/icon.png`,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: `${metadataBaseUrl}/features`,
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: metadataBaseUrl,
  description: SITE_DESCRIPTION,
  inLanguage: "en",
  potentialAction: {
    "@type": "SearchAction",
    target: `${metadataBaseUrl}/voice`,
    "query-input": "required name=query",
  },
};

/**
 * Renders a JSON-LD script tag for one or more structured-data objects.
 * `dangerouslySetInnerHTML` is safe here: the payload is static JSON we own.
 */
function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Root layout: html shell + fonts + global SEO metadata + structured data.
 * `data-scroll-behavior="smooth"` is required by Next 16 for smooth scroll.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
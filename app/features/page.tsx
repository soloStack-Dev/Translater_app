import type { Metadata } from "next";

import { FeaturesContent } from "@/components/features/FeaturesContent";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, buildMetadata, SITE_NAME } from "@/lib/config";

/**
 * SEO metadata for the features page.
 */
export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Features — Emotional Intelligence & Natural Conversations",
    description:
      "Discover how Aura AI redefines digital interaction: natural multilingual conversations, emotional intelligence, seamless home integration and privacy by design.",
    path: "/features",
  });
}

// Structured data: gives search engines an accessible summary of the feature set.
const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Aura AI — Features",
  url: absoluteUrl("/features"),
  description:
    "Natural conversations, emotional intelligence, seamless integration and privacy-first design.",
  publisher: { "@type": "Organization", name: SITE_NAME },
};

/**
 * Features page — thin server component that owns SEO and renders the
 * interactive client content.
 */
export default function FeaturesPage() {
  return (
    <>
      <JsonLd data={aboutJsonLd} />
      <FeaturesContent />
    </>
  );
}
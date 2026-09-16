import type { Metadata } from "next";

import { VoiceContent } from "@/components/voice/VoiceContent";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, buildMetadata, SITE_NAME } from "@/lib/config";

/**
 * SEO metadata for the voice page — the site's flagship feature.
 */
export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Talk to Aura — Type or Speak in Hindi, Tamil, Malayalam & Kannada",
    description:
      "Type or talk to Aura in your language today. Aura understands English, Hindi, Tamil, Malayalam and Kannada — including romanized mixes — and replies with a natural voice.",
    path: "/voice",
    keywords: [
      "type to speak",
      "speak to AI",
      "voice input",
      "Tamil speech",
      "Malayalam speech",
      "Kannada speech",
    ],
  });
}

// Structured data flags this page to crawlers as the interactive voice demo.
const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: `${SITE_NAME} — Live Voice Demo`,
  applicationCategory: "VoiceAssistant",
  operatingSystem: "Web",
  inLanguage: ["hi", "ta", "ml", "kn", "en"],
  description:
    "Type or speak in Hindi, Tamil, Malayalam or Kannada and hear Aura reply in your language.",
  url: absoluteUrl("/voice"),
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

/**
 * Voice page — thin server component (SEO only); all interactivity lives in
 * `VoiceContent`.
 */
export default function VoicePage() {
  return (
    <>
      <JsonLd data={softwareJsonLd} />
      <VoiceContent />
    </>
  );
}
import type { Metadata } from "next";

import { HomeContent } from "@/components/home/HomeContent";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, buildMetadata, SITE_NAME } from "@/lib/config";

/**
 * SEO metadata for the home page. Rendered server-side so crawlers get a fully
 * populated <head> without executing JavaScript.
 */
export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Multilingual Voice Assistant for Every Home",
    description:
      "Experience warmth in intelligence. Aura AI is a multilingual voice assistant that speaks Hindi, Tamil, Malayalam and Kannada — type or talk, Aura replies in your language.",
    path: "/",
  });
}

// Structured data: SoftwareApplication tells search engines this is an
// installable/intelligent voice app (eligible for rich results).
const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  applicationCategory: "VoiceAssistant",
  operatingSystem: "Web",
  description:
    "Aura AI is a warm, intelligent voice assistant that speaks Hindi, Tamil, Malayalam and Kannada.",
  url: absoluteUrl("/"),
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      name: "Starter",
    },
    {
      "@type": "Offer",
      price: "12",
      priceCurrency: "USD",
      name: "Companion",
    },
    {
      "@type": "Offer",
      price: "24",
      priceCurrency: "USD",
      name: "Family",
    },
  ],
};

/**
 * Home page — thin server component. All the interactive UI lives in
 * `HomeContent`; this file only adds SEO metadata + JSON-LD.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd data={softwareJsonLd} />
      <HomeContent />
    </>
  );
}
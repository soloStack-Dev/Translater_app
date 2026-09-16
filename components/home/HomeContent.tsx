"use client";

import { useRef } from "react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { JournalSection } from "@/components/home/JournalSection";
import { PricingSection } from "@/components/home/PricingSection";
import { useRevealAnimations } from "@/lib/reveal";

/**
 * Client-side home page.
 *
 * This file is the "use client" boundary: everything the user can interact
 * with lives below it, while `app/page.tsx` stays a server component that
 * owns the SEO metadata and structured data.
 */
export function HomeContent() {
  // One ref for the whole page: gsap reveals every [data-*] element inside it.
  const scopeRef = useRef<HTMLDivElement>(null);
  useRevealAnimations(scopeRef);

  return (
    <div ref={scopeRef} className="flex min-h-screen flex-col bg-cream">
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <JournalSection />
        <PricingSection />
      </main>

      <Footer />
    </div>
  );
}
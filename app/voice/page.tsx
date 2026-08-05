"use client";

import { useRef, useState } from "react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useRevealAnimations } from "@/lib/reveal";
import { LANGUAGES, type LanguageCode } from "@/lib/languages";
import { HeroVisual } from "@/components/voice/HeroVisual";
import { LanguageSelector } from "@/components/voice/LanguageSelector";
import { TypeToSpeakPanel } from "@/components/voice/TypeToSpeakPanel";
import { SpeakToAuraPanel } from "@/components/voice/SpeakToAuraPanel";

export default function VoicePage() {
  // One ref for the whole page: gsap reveals every [data-*] element inside it.
  const scopeRef = useRef<HTMLDivElement>(null);
  useRevealAnimations(scopeRef);

  // Selected language, shared by both input modes (type & speak).
  const [languageCode, setLanguageCode] = useState<LanguageCode>(LANGUAGES[0].code);
  const language = LANGUAGES.find((lang) => lang.code === languageCode)!;

  return (
    <div
      ref={scopeRef}
      className="flex flex-col min-h-screen bg-[radial-gradient(ellipse_at_center,#FDF6ED_0%,#F5E6C8_60%,#F0DEC0_100%)]"
    >
      <Navbar />

      <main className="relative flex-1 overflow-hidden">
        {/* Decorative animated background */}
        <HeroVisual />

        <section className="relative z-10 mx-auto max-w-xl px-6 pt-[400px] lg:pt-[420px] pb-20 text-center">
          <h1
            data-hero-fade
            className="text-4xl lg:text-5xl font-bold tracking-[-0.02em] text-[#1A1A1A]"
          >
            Speak in <span className="text-[#7A5C6B]">Your Language</span>
          </h1>
          <p data-hero-fade className="mt-4 text-base text-[#5C5C5C]">
            Type or talk in any language — English, {language.name} or a
            romanized mix like &ldquo;hey enna pandra eppo?&rdquo; — Aura
            replies in the language you choose.
          </p>

          <LanguageSelector selected={languageCode} onSelect={setLanguageCode} />

          {/* key={languageCode} remounts the panels on language change so
              stale results (old audio / old reply) are cleared. */}
          <TypeToSpeakPanel key={languageCode} language={language} />

          <div
            data-hero-fade
            className="mt-6 flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-wider text-[#9CA3AF]"
          >
            <span className="h-px w-10 bg-[#E5E5E5]" /> or speak
            <span className="h-px w-10 bg-[#E5E5E5]" />
          </div>

          <SpeakToAuraPanel key={languageCode} language={language} />
        </section>
      </main>

      <Footer />
    </div>
  );
}

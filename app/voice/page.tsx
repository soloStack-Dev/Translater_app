"use client";

import { useRef, useState } from "react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useRevealAnimations } from "@/lib/reveal";
import { cn } from "@/lib/utils";
import { LANGUAGES, type LanguageCode } from "@/lib/languages";
import { HeroVisual } from "@/components/voice/HeroVisual";
import { LanguageSelector } from "@/components/voice/LanguageSelector";
import { TypeToSpeakPanel } from "@/components/voice/TypeToSpeakPanel";
import { SpeakToAuraPanel } from "@/components/voice/SpeakToAuraPanel";

type InputMode = "type" | "speak";

const INPUT_MODES: { id: InputMode; label: string }[] = [
  { id: "type", label: "Type to Speak" },
  { id: "speak", label: "Speak to Aura" },
];

export default function VoicePage() {
  // One ref for the whole page: gsap reveals every [data-*] element inside it.
  const scopeRef = useRef<HTMLDivElement>(null);
  useRevealAnimations(scopeRef);

  // Selected language, shared by both input modes (type & speak).
  const [languageCode, setLanguageCode] = useState<LanguageCode>(LANGUAGES[0].code);
  const language = LANGUAGES.find((lang) => lang.code === languageCode)!;

  // Only one input block shows at a time — the toggle picks which one.
  const [inputMode, setInputMode] = useState<InputMode>("type");

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

          {/* Segmented control: show one input block at a time */}
          <div
            data-hero-fade
            className="mt-8 inline-flex items-center gap-1 rounded-full border border-[#E5E5E5] bg-white/70 p-1 shadow-sm backdrop-blur"
          >
            {INPUT_MODES.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setInputMode(id)}
                aria-pressed={inputMode === id}
                className={cn(
                  "rounded-full px-6 py-2.5 text-sm font-medium transition-colors",
                  inputMode === id
                    ? "bg-[#7A5C6B] text-white shadow-sm"
                    : "text-[#5C5C5C] hover:text-[#1A1A1A]"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Panels reset themselves when the language changes. */}
          {inputMode === "type" ? (
            <TypeToSpeakPanel language={language} />
          ) : (
            <SpeakToAuraPanel language={language} />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

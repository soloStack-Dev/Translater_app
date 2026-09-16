"use client";

import { useRef, useState } from "react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroVisual } from "@/components/voice/HeroVisual";
import { LanguageSelector } from "@/components/voice/LanguageSelector";
import { TypeToSpeakPanel } from "@/components/voice/TypeToSpeakPanel";
import { SpeakToAuraPanel } from "@/components/voice/SpeakToAuraPanel";
import { useRevealAnimations } from "@/lib/reveal";
import { cn } from "@/lib/utils";
import { LANGUAGES, type LanguageCode } from "@/lib/languages";

// The two ways a user can talk to Aura.
type InputMode = "type" | "speak";

// Labels for the segmented toggle (shown above the input panels).
const INPUT_MODES: { id: InputMode; label: string }[] = [
  { id: "type", label: "Type to Speak" },
  { id: "speak", label: "Speak to Aura" },
];

/**
 * Voice page — the flagship experience.
 *
 * Owns two pieces of shared state:
 *  1. `languageCode`  — which language Aura should reply in.
 *  2. `inputMode`     — "type" shows TypeToSpeakPanel, "speak" the mic panel.
 *
 * Exactly ONE input panel is mounted at a time (see the ternary below).
 */
export function VoiceContent() {
  // One ref for the whole page: gsap reveals every [data-*] element inside it.
  const scopeRef = useRef<HTMLDivElement>(null);
  useRevealAnimations(scopeRef);

  // Default to the first supported language (Hindi).
  const [languageCode, setLanguageCode] = useState<LanguageCode>(LANGUAGES[0].code);
  const language = LANGUAGES.find((lang) => lang.code === languageCode)!;

  // Only one input block shows at a time — the toggle picks which one.
  const [inputMode, setInputMode] = useState<InputMode>("type");

  return (
    <div
      ref={scopeRef}
      className="flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_center,#FDF6ED_0%,#F5E6C8_60%,#F0DEC0_100%)]"
    >
      <Navbar />

      <main className="relative flex-1 overflow-hidden">
        {/* Decorative animated background (sound-wave bars + ripples + orb) */}
        <HeroVisual />

        <section className="relative z-10 mx-auto max-w-xl px-6 pb-20 pt-[400px] text-center lg:pt-[420px]">
          {/* Single H1 per page (SEO) */}
          <h1
            data-hero-fade
            className="text-4xl font-bold tracking-[-0.02em] text-foreground lg:text-5xl"
          >
            Speak in <span className="text-accent-mauve">Your Language</span>
          </h1>

          <p data-hero-fade className="mt-4 text-base leading-relaxed text-warm-text">
            Type or talk in any language — English, {language.name} or a
            romanized mix like &ldquo;hey enna pandra eppo?&rdquo; — Aura
            replies in the language you choose.
          </p>

          {/* Language picker (shared by both input modes) */}
          <LanguageSelector selected={languageCode} onSelect={setLanguageCode} />

          {/* Segmented control: choose how you want to talk */}
          <div
            data-hero-fade
            className="mt-8 inline-flex items-center gap-1 rounded-full border border-line-strong bg-white/70 p-1 shadow-sm backdrop-blur"
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
                    ? "bg-accent-mauve text-white shadow-sm"
                    : "text-warm-text hover:text-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Only ONE panel is mounted. Each panel resets its own state when
              the language changes (see the panels' `prevLanguageCode` logic). */}
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
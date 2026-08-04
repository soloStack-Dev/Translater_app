"use client";

import { useRef, useState } from "react";
import { Loader2, Volume2 } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useRevealAnimations } from "@/lib/reveal";
import { cn } from "@/lib/utils";

const languages = [
  { name: "Hindi", native: "नमस्ते", code: "hi-IN" },
  { name: "Tamil", native: "வணக்கம்", code: "ta-IN" },
  { name: "Malayalam", native: "നമസ്കാരം", code: "ml-IN" },
  { name: "Kannada", native: "ನಮಸ್ಕಾರ", code: "kn-IN" },
];

const waveBars = [16, 28, 36, 28, 16];
const waveDelays = [0, 0.1, 0.2, 0.3, 0.4];

type Status = "idle" | "loading" | "done" | "error";

export default function VoicePage() {
  const scopeRef = useRef<HTMLDivElement>(null);
  useRevealAnimations(scopeRef);

  const [text, setText] = useState("");
  const [language, setLanguage] = useState(languages[0]);
  const [status, setStatus] = useState<Status>("idle");
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!text.trim() || status === "loading") return;

    setStatus("loading");
    setError(null);
    setAudioSrc(null);
    setTranslatedText(null);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: language.code }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      setTranslatedText(data.translatedText);
      setAudioSrc(`data:audio/mp3;base64,${data.audioBase64}`);
      setStatus("done");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Unexpected error.");
    }
  }

  return (
    <div
      ref={scopeRef}
      className="flex flex-col min-h-screen bg-[radial-gradient(ellipse_at_center,#FDF6ED_0%,#F5E6C8_60%,#F0DEC0_100%)]"
    >
      <Navbar />

      <main className="flex-1 relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-10 flex flex-col items-center"
        >
          <div className="flex items-end gap-1.5 mb-10">
            {waveBars.map((height, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-[#7A5C6B] animate-[wavebar_1.2s_ease-in-out_infinite]"
                style={{
                  height,
                  animationDelay: `${waveDelays[i]}s`,
                  transformOrigin: "bottom",
                }}
              />
            ))}
          </div>

          <div className="relative w-44 h-44 lg:w-52 lg:h-52">
            {[0, 1.16, 2.32].map((delay) => (
              <div
                key={delay}
                className="absolute inset-0 m-auto w-40 h-40 rounded-full border border-[#7A5C6B]/20 animate-[ripple_3.5s_linear_infinite]"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
            <div className="absolute inset-0 rounded-full animate-morph bg-gradient-to-br from-[#7A5C6B] to-[#9B7A8A] opacity-80" />
          </div>
        </div>

        <section className="relative z-10 mx-auto max-w-xl px-6 pt-[420px] lg:pt-[440px] pb-20 text-center">
          <h1
            data-hero-fade
            className="text-4xl lg:text-5xl font-bold tracking-[-0.02em] text-[#1A1A1A]"
          >
            Speak in <span className="text-[#7A5C6B]">Your Language</span>
          </h1>
          <p data-hero-fade className="mt-4 text-base text-[#5C5C5C]">
            Type in English, and Aura will translate your words and speak them
            back in the language you choose.
          </p>

          <div
            data-hero-fade
            className="mt-10 grid grid-cols-2 gap-3"
            role="radiogroup"
            aria-label="Choose your language"
          >
            {languages.map((lang) => {
              const selected = lang.code === language.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => {
                    setLanguage(lang);
                    setStatus("idle");
                  }}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A5C6B]",
                    selected
                      ? "bg-[#7A5C6B] text-white shadow-[0_8px_24px_rgba(122,92,107,0.35)]"
                      : "bg-white/80 border border-[#E5E5E5] text-[#5C5C5C] hover:border-[#7A5C6B]/40 hover:shadow-md"
                  )}
                >
                  <span className="block text-sm font-semibold">
                    {lang.name}
                  </span>
                  <span
                    className={cn(
                      "block text-xs mt-0.5",
                      selected ? "text-white/80" : "text-[#9CA3AF]"
                    )}
                  >
                    {lang.native} · {lang.code}
                  </span>
                </button>
              );
            })}
          </div>

          <div data-hero-fade className="mt-6 text-left">
            <label
              htmlFor="voice-text"
              className="block text-sm font-medium text-[#5C5C5C] mb-2"
            >
              What would you like to say?
            </label>
            <textarea
              id="voice-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type something… e.g. 'Good morning! What's the weather like today?'"
              rows={4}
              className="w-full rounded-2xl border border-[#E5E5E5] bg-white/90 px-5 py-4 text-[#1A1A1A] placeholder:text-[#9CA3AF] resize-none transition-shadow focus:outline-none focus:ring-2 focus:ring-[#7A5C6B]/40 focus:border-transparent shadow-sm"
            />
          </div>

          <div data-hero-fade className="mt-6">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!text.trim() || status === "loading"}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-sm font-medium transition-all duration-200",
                text.trim() && status !== "loading"
                  ? "bg-[#7A5C6B] text-white hover:scale-105 hover:shadow-[0_10px_28px_rgba(122,92,107,0.4)]"
                  : "bg-[#7A5C6B]/40 text-white/80 cursor-not-allowed"
              )}
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Preparing your voice…
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  Generate Voice
                </>
              )}
            </button>
          </div>

          {status === "loading" && (
            <p className="mt-6 text-sm font-medium text-[#9B7A8A] animate-pulse">
              Analyzing your words and translating them to {language.name}…
            </p>
          )}

          {status === "error" && error && (
            <p className="mt-6 text-sm font-medium text-[#B4555C]">
              {error}
            </p>
          )}

          {status === "done" && audioSrc && (
            <div
              data-hero-fade
              className="mt-8 rounded-3xl bg-white/90 backdrop-blur border border-[#E5E5E5] p-6 text-left shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-[#7A5C6B]">
                Aura says · {language.name}
              </p>
              <p className="mt-2 text-lg text-[#1A1A1A] leading-relaxed">
                {translatedText}
              </p>
              <audio
                controls
                src={audioSrc}
                className="mt-4 w-full"
                preload="auto"
              />
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

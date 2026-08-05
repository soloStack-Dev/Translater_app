"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/languages";

type Props = { language: Language };

type Status = "idle" | "loading" | "done" | "error";

// Card: type any-language text → the server speaks Aura's reply in the
// selected language. Voice only — the written reply is never shown.
export function TypeToSpeakPanel({ language }: Props) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Tracks the language the current request was made for, so a response that
  // arrives after the user switched language can be safely ignored.
  const activeLanguageRef = useRef(language.code);
  useEffect(() => {
    activeLanguageRef.current = language.code;
  }, [language.code]);

  // Reset the result when the language changes. React's recommended way to
  // reset state from a prop change is to do it DURING render (not in an
  // effect), which keeps the panel mounted and its entrance animation intact.
  const [prevLanguageCode, setPrevLanguageCode] = useState(language.code);
  if (prevLanguageCode !== language.code) {
    setPrevLanguageCode(language.code);
    setStatus("idle");
    setAudioSrc(null);
    setError(null);
  }

  // Send the text to /api/tts and play the returned mp3.
  async function handleGenerate() {
    if (!text.trim() || status === "loading") return;

    const requestLanguage = language.code;
    setStatus("loading");
    setError(null);
    setAudioSrc(null);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: requestLanguage }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      // Drop the result if the user already switched language meanwhile.
      if (requestLanguage !== activeLanguageRef.current) return;
      setAudioSrc(`data:audio/mp3;base64,${data.audioBase64}`);
      setStatus("done");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Unexpected error.");
    }
  }

  const canGenerate = text.trim().length > 0 && status !== "loading";

  return (
    <div
      data-hero-fade
      className="mt-8 rounded-3xl border border-[#E5E5E5] bg-white/80 p-6 text-left shadow-sm backdrop-blur sm:p-8"
    >
      <h2 className="text-lg font-bold text-[#1A1A1A]">Type to Speak</h2>
      <p className="mt-1 text-sm text-[#5C5C5C]">
        Write anything — English, {language.name} or even romanized{" "}
        {language.name} like &ldquo;hey enna pandra eppo?&rdquo; — Aura
        understands it and speaks a reply back in {language.name}. Voice only.
      </p>

      <label
        htmlFor="voice-text"
        className="mt-5 mb-2 block text-sm font-medium text-[#5C5C5C]"
      >
        Your message
      </label>
      <textarea
        id="voice-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type anything… e.g. 'hey enna pandra eppo?' or 'Good morning!'"
        rows={3}
        className="w-full resize-none rounded-2xl border border-[#E5E5E5] bg-white px-5 py-4 text-[#1A1A1A] shadow-sm placeholder:text-[#9CA3AF] transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#7A5C6B]/40"
      />

      <button
        type="button"
        onClick={handleGenerate}
        disabled={!canGenerate}
        className={cn(
          "mt-4 inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-sm font-medium transition-all duration-200",
          canGenerate
            ? "bg-[#7A5C6B] text-white hover:scale-105 hover:shadow-[0_10px_28px_rgba(122,92,107,0.4)]"
            : "cursor-not-allowed bg-[#7A5C6B]/40 text-white/80"
        )}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <Volume2 className="h-4 w-4" />
            Generate Voice
          </>
        )}
      </button>

      {status === "error" && error && (
        <p className="mt-4 text-sm font-medium text-[#B4555C]">{error}</p>
      )}

      {status === "done" && audioSrc && (
        <div className="mt-4 rounded-2xl border border-[#F0E4D5] bg-[#FDF6ED] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7A5C6B]">
            Voice response · {language.name}
          </p>
          <audio controls src={audioSrc} className="mt-3 w-full" preload="auto" />
        </div>
      )}
    </div>
  );
}

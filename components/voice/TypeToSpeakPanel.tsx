"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/languages";

type Props = { language: Language };

/**
 * Panel status — a small state machine for the request lifecycle.
 *   idle    → ready to generate
 *   loading → request in flight
 *   done    → audio is ready to play
 *   error   → last request failed (message in `error`)
 */
type Status = "idle" | "loading" | "done" | "error";

/**
 * Type-to-Speak panel.
 *
 * Flow: user types any-language (or romanized) text → POST /api/tts →
 * server replies with LLM text → TTS audio → we stream the base64 mp3 into
 * an <audio> element. Voice only — the written reply is never shown.
 */
export function TypeToSpeakPanel({ language }: Props) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Tracks the language the LAST request was made for. When a response
  // arrives, we compare against this ref and drop it if the user has already
  // switched language (avoids playing a reply in the wrong language).
  const activeLanguageRef = useRef(language.code);
  useEffect(() => {
    activeLanguageRef.current = language.code;
  }, [language.code]);

  // Reset the panel's result when the language prop changes.
  // This is done DURING render (React's recommended pattern) instead of in an
  // effect — it keeps the panel mounted (so its entrance animation stays) and
  // satisfies the `react-hooks/set-state-in-effect` lint rule.
  const [prevLanguageCode, setPrevLanguageCode] = useState(language.code);
  if (prevLanguageCode !== language.code) {
    setPrevLanguageCode(language.code);
    setStatus("idle");
    setAudioSrc(null);
    setError(null);
  }

  /**
   * Send the typed text to /api/tts and, on success, show the returned audio.
   * Stale responses (after a language switch) are discarded.
   */
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

      // User switched language while the request was in flight — discard.
      if (requestLanguage !== activeLanguageRef.current) return;

      setAudioSrc(`data:audio/mp3;base64,${data.audioBase64}`);
      setStatus("done");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Unexpected error.");
    }
  }

  // Button is disabled until there is text and no request is in flight.
  const canGenerate = text.trim().length > 0 && status !== "loading";

  return (
    <div
      data-hero-fade
      className="mt-8 rounded-3xl border border-line-strong bg-white/80 p-6 text-left shadow-sm backdrop-blur sm:p-8"
    >
      {/* Panel heading */}
      <h2 className="text-lg font-bold text-foreground">Type to Speak</h2>
      <p className="mt-1 text-sm leading-relaxed text-warm-text">
        Write anything — English, {language.name} or even romanized{" "}
        {language.name} like &ldquo;hey enna pandra eppo?&rdquo; — Aura
        understands it and speaks a reply back in {language.name}. Voice only.
      </p>

      {/* Text input (linked label → textarea for accessibility) */}
      <label
        htmlFor="voice-text"
        className="mt-5 mb-2 block text-sm font-medium text-warm-text"
      >
        Your message
      </label>
      <textarea
        id="voice-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type anything… e.g. 'hey enna pandra eppo?' or 'Good morning!'"
        rows={3}
        className="w-full resize-none rounded-2xl border border-line-strong bg-white px-5 py-4 text-foreground shadow-sm transition-shadow placeholder:text-text-muted focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent-mauve/40"
      />

      {/* Generate button */}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={!canGenerate}
        className={cn(
          "mt-4 inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-sm font-medium transition-all duration-200",
          canGenerate
            ? "bg-accent-mauve text-white hover:scale-105 hover:shadow-[0_10px_28px_rgba(122,92,107,0.4)]"
            : "cursor-not-allowed bg-accent-mauve/40 text-white/80"
        )}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Generating…
          </>
        ) : (
          <>
            <Volume2 className="h-4 w-4" aria-hidden="true" />
            Generate Voice
          </>
        )}
      </button>

      {/* Friendly error message */}
      {status === "error" && error && (
        <p role="alert" className="mt-4 text-sm font-medium text-error">
          {error}
        </p>
      )}

      {/* Audio player with the generated reply */}
      {status === "done" && audioSrc && (
        <div className="mt-4 rounded-2xl border border-panel-border bg-panel-bg p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-mauve">
            Voice response · {language.name}
          </p>
          <audio
            controls
            src={audioSrc}
            className="mt-3 w-full"
            preload="auto"
          />
        </div>
      )}
    </div>
  );
}
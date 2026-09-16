"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/languages";
import { useSpeechRecorder } from "@/hooks/useSpeechRecorder";
import { blobToBase64, formatMicError, normalizeMimeType } from "@/lib/audio";

type Props = { language: Language };

/**
 * Panel status — a small state machine for the request lifecycle.
 *   idle    → ready to record / waiting
 *   loading → recording sent; waiting for the LLM's reply
 *   done    → transcript + reply shown
 *   error   → last request failed (message in `error`)
 */
type Status = "idle" | "loading" | "done" | "error";

/**
 * Speak-to-Aura panel.
 *
 * Flow: press mic → record with MediaRecorder → stop → base64 to /api/chat →
 * server transcribes (STT) + replies (LLM) → show "You said / Aura responds".
 */
export function SpeakToAuraPanel({ language }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [transcript, setTranscript] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Tracks the language the last request was made for, so a response arriving
  // after the user switched language is safely ignored.
  const activeLanguageRef = useRef(language.code);
  useEffect(() => {
    activeLanguageRef.current = language.code;
  }, [language.code]);

  // Reset the panel's result when the language prop changes (in-render — see
  // the same pattern in TypeToSpeakPanel for the reasoning).
  const [prevLanguageCode, setPrevLanguageCode] = useState(language.code);
  if (prevLanguageCode !== language.code) {
    setPrevLanguageCode(language.code);
    setStatus("idle");
    setTranscript(null);
    setResponse(null);
    setError(null);
  }

  /**
   * Called by the recorder hook when a recording finishes: upload the audio
   * and show Aura's written reply. Stale responses are discarded.
   */
  async function handleRecording(blob: Blob) {
    const requestLanguage = language.code;
    setStatus("loading");
    setError(null);
    setTranscript(null);
    setResponse(null);

    try {
      // Nothing captured (e.g. tap-stop instantly) — ask instead of sending an
      // empty file to the server.
      if (blob.size === 0) {
        throw new Error("I couldn't hear anything. Please try speaking again.");
      }

      const audioBase64 = await blobToBase64(blob);
      if (!audioBase64) {
        throw new Error("Could not read the recording. Please try again.");
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioBase64,
          // Chrome reports "audio/webm;codecs=opus" — strip the codec params.
          mimeType: normalizeMimeType(blob.type),
          language: requestLanguage,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      // User switched language while the request was in flight — discard.
      if (requestLanguage !== activeLanguageRef.current) return;

      setTranscript(data.transcript);
      setResponse(data.response);
      setStatus("done");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Unexpected error.");
    }
  }

  // MediaRecorder mechanics (mic permission, blob delivery, 30s auto-stop).
  const recorder = useSpeechRecorder(handleRecording);

  /**
   * Toggle the microphone: tap to start, tap again to stop & send.
   * Also shows a friendly message if the mic cannot be accessed.
   */
  async function handleMicClick() {
    if (recorder.isRecording) {
      recorder.stop();
      return;
    }
    if (status === "loading") return;

    setError(null);
    setTranscript(null);
    setResponse(null);

    try {
      await recorder.start();
    } catch (e) {
      setStatus("error");
      setError(
        formatMicError(
          e instanceof Error ? e : new Error("Could not start the microphone.")
        )
      );
    }
  }

  return (
    <div
      data-hero-fade
      className="mt-6 rounded-3xl border border-line-strong bg-white/80 p-6 text-left shadow-sm backdrop-blur sm:p-8"
    >
      {/* Heading + mic button */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Speak to Aura</h2>
          <p className="mt-1 text-sm leading-relaxed text-warm-text">
            Tap the mic, say something in any language — even romanized{" "}
            {language.name} — then tap it again when you are done. Aura replies
            in {language.name}.
          </p>
        </div>

        {/* Mic button doubles as start/stop; shows a spinner while sending */}
        <button
          type="button"
          onClick={handleMicClick}
          disabled={status === "loading"}
          aria-label={
            recorder.isRecording ? "Stop recording" : "Start recording"
          }
          className={cn(
            "inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-mauve",
            recorder.isRecording
              ? "animate-pulse bg-danger text-white shadow-[0_0_0_8px_rgba(192,82,90,0.18)]"
              : "bg-accent-mauve text-white shadow-[0_10px_28px_rgba(122,92,107,0.35)] hover:scale-105",
            status === "loading" && "cursor-not-allowed opacity-60"
          )}
        >
          {recorder.isRecording ? (
            <Square className="h-6 w-6" fill="currentColor" aria-hidden="true" />
          ) : status === "loading" ? (
            <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
          ) : (
            <Mic className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Live listening indicator */}
      {recorder.isRecording && (
        <div className="mt-5 flex items-center gap-2 rounded-2xl border border-panel-border bg-panel-bg px-5 py-4">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-danger" />
          <p className="text-sm font-medium text-dusty-mauve">
            Listening… {recorder.seconds}s — tap the stop button when you
            finish speaking.
          </p>
        </div>
      )}

      {/* Sending state */}
      {status === "loading" && (
        <p className="mt-5 animate-pulse text-sm font-medium text-dusty-mauve">
          Listening to your words and writing an answer in {language.name}…
        </p>
      )}

      {/* Friendly error message */}
      {status === "error" && error && (
        <p role="alert" className="mt-5 text-sm font-medium text-error">
          {error}
        </p>
      )}

      {/* Result: what the user said + Aura's written reply */}
      {status === "done" && response && (
        <div className="mt-5 rounded-2xl border border-panel-border bg-panel-bg p-5">
          {transcript && (
            <p className="text-xs text-text-muted">You said: {transcript}</p>
          )}
          <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-accent-mauve">
            Aura responds · {language.name}
          </p>
          <p className="mt-2 text-base leading-relaxed text-foreground">
            {response}
          </p>
        </div>
      )}
    </div>
  );
}
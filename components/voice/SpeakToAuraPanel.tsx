"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/languages";
import { useSpeechRecorder } from "@/hooks/useSpeechRecorder";

type Props = { language: Language };

type Status = "idle" | "loading" | "done" | "error";

// Convert a recorded Blob into a base64 string so it can be sent as JSON.
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

// Turn a mic error into a friendly message for the user.
function formatMicError(error: Error): string {
  return error.name === "NotAllowedError"
    ? "Microphone access was denied. Allow the microphone and try again."
    : error.message;
}

// Card: hold the mic, speak in any language → the LLM writes a reply in the
// selected language (native script) which is then shown on screen.
export function SpeakToAuraPanel({ language }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [transcript, setTranscript] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
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
    setTranscript(null);
    setResponse(null);
    setError(null);
  }

  // Send the finished recording to /api/chat and show the LLM's reply.
  async function handleRecording(blob: Blob) {
    const requestLanguage = language.code;
    setStatus("loading");
    setError(null);
    setTranscript(null);
    setResponse(null);

    try {
      // Nothing was captured (e.g. recording stopped instantly) — ask again
      // instead of sending an empty file to the server.
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
          mimeType: blob.type || "audio/webm",
          language: requestLanguage,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      // Drop the result if the user already switched language meanwhile.
      if (requestLanguage !== activeLanguageRef.current) return;
      setTranscript(data.transcript);
      setResponse(data.response);
      setStatus("done");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Unexpected error.");
    }
  }

  // MediaRecorder mechanics (mic permission, blobs, 30s auto-stop).
  const recorder = useSpeechRecorder(handleRecording);

  // Toggle: tap to record, tap again to stop & send.
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
        formatMicError(e instanceof Error ? e : new Error("Could not start the microphone."))
      );
    }
  }

  return (
    <div
      data-hero-fade
      className="mt-6 rounded-3xl border border-[#E5E5E5] bg-white/80 p-6 text-left shadow-sm backdrop-blur sm:p-8"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#1A1A1A]">Speak to Aura</h2>
          <p className="mt-1 text-sm text-[#5C5C5C]">
            Tap the mic, say something in any language — even romanized{" "}
            {language.name} — then tap it again when you are done. Aura replies
            in {language.name}.
          </p>
        </div>

        {/* Mic button doubles as start/stop + shows a spinner while sending */}
        <button
          type="button"
          onClick={handleMicClick}
          disabled={status === "loading"}
          aria-label={recorder.isRecording ? "Stop recording" : "Start recording"}
          className={cn(
            "inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A5C6B]",
            recorder.isRecording
              ? "bg-[#C0525A] text-white shadow-[0_0_0_8px_rgba(192,82,90,0.18)] animate-pulse"
              : "bg-[#7A5C6B] text-white shadow-[0_10px_28px_rgba(122,92,107,0.35)] hover:scale-105",
            status === "loading" && "cursor-not-allowed opacity-60"
          )}
        >
          {recorder.isRecording ? (
            <Square className="h-6 w-6" fill="currentColor" />
          ) : status === "loading" ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Listening indicator while recording */}
      {recorder.isRecording && (
        <div className="mt-5 flex items-center gap-2 rounded-2xl border border-[#F0E4D5] bg-[#FDF6ED] px-5 py-4">
          <span className="h-2.5 w-2.5 rounded-full bg-[#C0525A] animate-pulse" />
          <p className="text-sm font-medium text-[#9B7A8A]">
            Listening… {recorder.seconds}s — tap the stop button when you
            finish speaking.
          </p>
        </div>
      )}

      {/* Sending state */}
      {status === "loading" && (
        <p className="mt-5 text-sm font-medium text-[#9B7A8A] animate-pulse">
          Listening to your words and writing an answer in {language.name}…
        </p>
      )}

      {status === "error" && error && (
        <p className="mt-5 text-sm font-medium text-[#B4555C]">{error}</p>
      )}

      {/* Result: what you said + Aura's written reply */}
      {status === "done" && response && (
        <div className="mt-5 rounded-2xl border border-[#F0E4D5] bg-[#FDF6ED] p-5">
          {transcript && (
            <p className="text-xs text-[#9CA3AF]">You said: {transcript}</p>
          )}
          <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[#7A5C6B]">
            Aura responds · {language.name}
          </p>
          <p className="mt-2 text-base leading-relaxed text-[#1A1A1A]">
            {response}
          </p>
        </div>
      )}
    </div>
  );
}

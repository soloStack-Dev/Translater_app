"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Mic, Square, Volume2 } from "lucide-react";

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

const MAX_RECORDING_SECONDS = 30;

type TtsStatus = "idle" | "loading" | "done" | "error";
type SpeechStatus = "idle" | "recording" | "loading" | "done" | "error";

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export default function VoicePage() {
  const scopeRef = useRef<HTMLDivElement>(null);
  useRevealAnimations(scopeRef);

  const [text, setText] = useState("");
  const [language, setLanguage] = useState(languages[0]);

  const [ttsStatus, setTtsStatus] = useState<TtsStatus>("idle");
  const [ttsAudioSrc, setTtsAudioSrc] = useState<string | null>(null);
  const [ttsError, setTtsError] = useState<string | null>(null);

  const [speechStatus, setSpeechStatus] = useState<SpeechStatus>("idle");
  const [transcript, setTranscript] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function handleGenerate() {
    if (!text.trim() || ttsStatus === "loading") return;

    setTtsStatus("loading");
    setTtsError(null);
    setTtsAudioSrc(null);

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
      setTtsAudioSrc(`data:audio/mp3;base64,${data.audioBase64}`);
      setTtsStatus("done");
    } catch (e) {
      setTtsStatus("error");
      setTtsError(e instanceof Error ? e.message : "Unexpected error.");
    }
  }

  const sendSpeechToLlm = useCallback(
    async (blob: Blob) => {
      setSpeechStatus("loading");
      setSpeechError(null);
      setTranscript(null);
      setResponse(null);

      try {
        const audioBase64 = await blobToBase64(blob);
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audioBase64,
            mimeType: blob.type || "audio/webm",
            language: language.code,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong.");
        }
        setTranscript(data.transcript);
        setResponse(data.response);
        setSpeechStatus("done");
      } catch (e) {
        setSpeechStatus("error");
        setSpeechError(e instanceof Error ? e.message : "Unexpected error.");
      }
    },
    [language.code]
  );

  async function startRecording() {
    if (speechStatus === "recording") return;

    setSpeechError(null);
    setTranscript(null);
    setResponse(null);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Microphone is not supported in this browser.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        void sendSpeechToLlm(blob);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;

      setSeconds(0);
      setSpeechStatus("recording");
      timerRef.current = window.setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= MAX_RECORDING_SECONDS) {
            stopRecording();
            return s;
          }
          return s + 1;
        });
      }, 1000);
    } catch (e) {
      setSpeechStatus("error");
      setSpeechError(
        e instanceof Error && e.name === "NotAllowedError"
          ? "Microphone access was denied. Allow the microphone and try again."
          : e instanceof Error
            ? e.message
            : "Could not start the microphone."
      );
    }
  }

  function stopRecording() {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state !== "recording") return;

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    recorder.stop();
    recorder.stream.getTracks().forEach((track) => track.stop());
  }

  const selectLanguage = (lang: (typeof languages)[number]) => {
    setLanguage(lang);
    setTtsStatus("idle");
    setSpeechStatus("idle");
  };

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

        <section className="relative z-10 mx-auto max-w-xl px-6 pt-[400px] lg:pt-[420px] pb-20 text-center">
          <h1
            data-hero-fade
            className="text-4xl lg:text-5xl font-bold tracking-[-0.02em] text-[#1A1A1A]"
          >
            Speak in <span className="text-[#7A5C6B]">Your Language</span>
          </h1>
          <p data-hero-fade className="mt-4 text-base text-[#5C5C5C]">
            Type in English for a voice response, or press the mic and talk —
            Aura replies in the language you choose.
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
                  onClick={() => selectLanguage(lang)}
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

          <div
            data-hero-fade
            className="mt-8 rounded-3xl bg-white/80 backdrop-blur border border-[#E5E5E5] p-6 sm:p-8 text-left shadow-sm"
          >
            <h2 className="text-lg font-bold text-[#1A1A1A]">
              Type to Speak
            </h2>
            <p className="mt-1 text-sm text-[#5C5C5C]">
              Write something in English and Aura will speak it back in{" "}
              {language.name} — voice only.
            </p>

            <label
              htmlFor="voice-text"
              className="block text-sm font-medium text-[#5C5C5C] mt-5 mb-2"
            >
              Your message
            </label>
            <textarea
              id="voice-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type something… e.g. 'Good morning! What's the weather like today?'"
              rows={3}
              className="w-full rounded-2xl border border-[#E5E5E5] bg-white px-5 py-4 text-[#1A1A1A] placeholder:text-[#9CA3AF] resize-none transition-shadow focus:outline-none focus:ring-2 focus:ring-[#7A5C6B]/40 focus:border-transparent shadow-sm"
            />

            <button
              type="button"
              onClick={handleGenerate}
              disabled={!text.trim() || ttsStatus === "loading"}
              className={cn(
                "mt-4 inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-sm font-medium transition-all duration-200",
                text.trim() && ttsStatus !== "loading"
                  ? "bg-[#7A5C6B] text-white hover:scale-105 hover:shadow-[0_10px_28px_rgba(122,92,107,0.4)]"
                  : "bg-[#7A5C6B]/40 text-white/80 cursor-not-allowed"
              )}
            >
              {ttsStatus === "loading" ? (
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

            {ttsStatus === "loading" && (
              <p className="mt-4 text-sm font-medium text-[#9B7A8A] animate-pulse">
                Translating your words and preparing the voice…
              </p>
            )}

            {ttsStatus === "error" && ttsError && (
              <p className="mt-4 text-sm font-medium text-[#B4555C]">
                {ttsError}
              </p>
            )}

            {ttsStatus === "done" && ttsAudioSrc && (
              <div className="mt-4 rounded-2xl bg-[#FDF6ED] border border-[#F0E4D5] p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#7A5C6B]">
                  Voice response · {language.name}
                </p>
                <audio
                  controls
                  src={ttsAudioSrc}
                  className="mt-3 w-full"
                  preload="auto"
                />
              </div>
            )}
          </div>

          <div
            data-hero-fade
            className="mt-6 flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-wider text-[#9CA3AF]"
          >
            <span className="h-px w-10 bg-[#E5E5E5]" />
            or speak
            <span className="h-px w-10 bg-[#E5E5E5]" />
          </div>

          <div
            data-hero-fade
            className="mt-6 rounded-3xl bg-white/80 backdrop-blur border border-[#E5E5E5] p-6 sm:p-8 text-left shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#1A1A1A]">
                  Speak to Aura
                </h2>
                <p className="mt-1 text-sm text-[#5C5C5C]">
                  Tap the mic, say something, then tap it again when you are
                  done. Aura replies in {language.name}.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  speechStatus === "recording"
                    ? stopRecording
                    : startRecording
                }
                aria-label={
                  speechStatus === "recording"
                    ? "Stop recording"
                    : "Start recording"
                }
                className={cn(
                  "shrink-0 inline-flex items-center justify-center w-16 h-16 rounded-full transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A5C6B]",
                  speechStatus === "recording"
                    ? "bg-[#C0525A] text-white shadow-[0_0_0_8px_rgba(192,82,90,0.18)] animate-pulse"
                    : "bg-[#7A5C6B] text-white shadow-[0_10px_28px_rgba(122,92,107,0.35)] hover:scale-105"
                )}
              >
                {speechStatus === "recording" ? (
                  <Square className="w-6 h-6" fill="currentColor" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </button>
            </div>

            {speechStatus === "recording" && (
              <div className="mt-5 flex items-center gap-2 rounded-2xl bg-[#FDF6ED] border border-[#F0E4D5] px-5 py-4">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C0525A] animate-pulse" />
                <p className="text-sm font-medium text-[#9B7A8A]">
                  Listening… {seconds}s — tap the stop button when you finish
                  speaking.
                </p>
              </div>
            )}

            {speechStatus === "loading" && (
              <p className="mt-5 text-sm font-medium text-[#9B7A8A] animate-pulse">
                Listening to your words and writing an answer in{" "}
                {language.name}…
              </p>
            )}

            {speechStatus === "error" && speechError && (
              <p className="mt-5 text-sm font-medium text-[#B4555C]">
                {speechError}
              </p>
            )}

            {speechStatus === "done" && response && (
              <div className="mt-5 rounded-2xl bg-[#FDF6ED] border border-[#F0E4D5] p-5">
                {transcript && (
                  <p className="text-xs text-[#9CA3AF]">
                    You said: {transcript}
                  </p>
                )}
                <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-[#7A5C6B]">
                  Aura responds · {language.name}
                </p>
                <p className="mt-2 text-base text-[#1A1A1A] leading-relaxed">
                  {response}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

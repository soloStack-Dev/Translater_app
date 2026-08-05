"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Recordings are auto-stopped after this many seconds to keep files small.
const MAX_RECORDING_SECONDS = 30;

// Thin wrapper around MediaRecorder.
// - start() asks for mic permission and begins recording (throws on failure).
// - stop() stops and hands the finished audio Blob to onStop().
// The caller owns all UI state; this hook only exposes isRecording + seconds.
export function useSpeechRecorder(onStop: (blob: Blob) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Mutable values the interval/event handlers need without re-creating them.
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const secondsRef = useRef(0);

  // Cleanup on unmount: clear the timer and release the microphone.
  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      recorderRef.current?.stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // Stop recording. MediaRecorder's onstop event then delivers the blob.
  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state !== "recording") return;

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    recorder.stop();
    recorder.stream.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
  }, []);

  // Ask for mic permission and start recording. Rejects if the mic is
  // unavailable or permission is denied, so the caller can show an error.
  const start = useCallback(async () => {
    if (recorderRef.current?.state === "recording") return;
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Microphone is not supported in this browser.");
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    // Collect audio chunks as they arrive.
    chunksRef.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    // When stopped, bundle the chunks into one Blob and hand it to the caller.
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: recorder.mimeType || "audio/webm",
      });
      onStop(blob);
    };

    recorder.start();
    recorderRef.current = recorder;
    setIsRecording(true);

    // Count up each second and auto-stop at the limit.
    secondsRef.current = 0;
    setSeconds(0);
    timerRef.current = window.setInterval(() => {
      secondsRef.current += 1;
      setSeconds(secondsRef.current);
      if (secondsRef.current >= MAX_RECORDING_SECONDS) {
        stop();
      }
    }, 1000);
  }, [onStop, stop]);

  return { isRecording, seconds, start, stop };
}

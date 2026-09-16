"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Recordings are auto-stopped after this many seconds so audio files stay
 * small and the STT API never receives a giant file.
 */
const MAX_RECORDING_SECONDS = 30;

/** What the hook exposes to the caller. */
type SpeechRecorder = {
  isRecording: boolean;
  seconds: number;
  start: () => Promise<void>;
  stop: () => void;
};

/**
 * Thin wrapper around MediaRecorder.
 *
 * - `start()`  — asks for mic permission and begins recording (throws on
 *                failure so the caller can show an error).
 * - `stop()`   — stops and hands the finished audio Blob to `onStop()`.
 * - `seconds`  — elapsed recording time; auto-stops at 30s.
 *
 * The caller owns ALL UI state; this hook only reports `isRecording`/`seconds`
 * and calls `onStop(blob)` once a recording is complete.
 */
export function useSpeechRecorder(onStop: (blob: Blob) => void): SpeechRecorder {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Mutable values the event handlers need without re-creating them on every
  // render (refs survive re-renders and are not part of the render output).
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

  /**
   * Stop recording. MediaRecorder fires `onstop` afterwards, which is where
   * the audio Blob is built — and where the mic tracks are released.
   *
   * NOTE: never call `track.stop()` here. Releasing the tracks synchronously
   * right after `recorder.stop()` can cut the final chunk off and produce an
   * EMPTY Blob (verified Chrome behavior).
   */
  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state !== "recording") return;

    // Stop the elapsed-seconds counter.
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    recorder.stop();
    setIsRecording(false);
  }, []);

  /**
   * Request microphone permission and begin recording.
   *
   * @throws {Error} if the browser has no mic API or permission is denied.
   */
  const start = useCallback(async () => {
    if (recorderRef.current?.state === "recording") return;
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Microphone is not supported in this browser.");
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    // Collect audio chunks as they arrive from the encoder.
    chunksRef.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    // When stopped: bundle chunks into one Blob, release the mic (only now,
    // after the encoder flushed) and hand the recording to the caller.
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: recorder.mimeType || "audio/webm",
      });
      recorder.stream.getTracks().forEach((track) => track.stop());
      onStop(blob);
    };

    recorder.start();
    recorderRef.current = recorder;
    setIsRecording(true);

    // Count up every second and auto-stop when the limit is reached.
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
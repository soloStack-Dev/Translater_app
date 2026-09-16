import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useSpeechRecorder } from "@/hooks/useSpeechRecorder";

// ---------------------------------------------------------------------------
// Fake MediaRecorder + fake mic stream, since jsdom implements neither.
// ---------------------------------------------------------------------------
type FakeRecorder = {
  state: string;
  stream: FakeStream;
  ondataavailable: ((e: { data: Blob }) => void) | null;
  onstop: (() => void) | null;
  mimeType: string;
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
};

type FakeStream = { getTracks: () => { stop: ReturnType<typeof vi.fn> }[] };

const fakeTracks = () => [{ stop: vi.fn() }];
const fakeStream: FakeStream = { getTracks: () => fakeTracks() };

let recorderInstances: FakeRecorder[] = [];
let getUserMediaMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  recorderInstances = [];

  // MediaRecorder class replacement.
  class FakeMediaRecorder {
    static mimeType = "audio/webm";
    state = "inactive";
    ondataavailable: ((e: { data: Blob }) => void) | null = null;
    onstop: (() => void) | null = null;
    constructor(public stream: FakeStream) {
      recorderInstances.push(this as unknown as FakeRecorder);
    }
    start() {
      this.state = "recording";
    }
    stop() {
      this.state = "inactive";
      // MediaRecorder fires onstop asynchronously — flush microtasks.
      queueMicrotask(() => this.onstop?.());
    }
  }

  // Expose the fake on window (and globalThis for safety).
  Object.defineProperty(window, "MediaRecorder", {
    writable: true,
    configurable: true,
    value: FakeMediaRecorder,
  });
  (globalThis as Record<string, unknown>).MediaRecorder = FakeMediaRecorder;

  // Mic permission returns instantly with a fake stream.
  getUserMediaMock = vi.fn().mockResolvedValue(fakeStream);
  Object.defineProperty(window.navigator, "mediaDevices", {
    writable: true,
    configurable: true,
    value: { getUserMedia: getUserMediaMock },
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("useSpeechRecorder", () => {
  it("starts a recording and flips isRecording on/off", async () => {
    const onStop = vi.fn();
    const { result } = renderHook(() => useSpeechRecorder(onStop));

    expect(result.current.isRecording).toBe(false);

    await act(async () => {
      await result.current.start();
    });

    expect(getUserMediaMock).toHaveBeenCalledWith({ audio: true });
    expect(recorderInstances).toHaveLength(1);
    expect(recorderInstances[0].state).toBe("recording");
    expect(result.current.isRecording).toBe(true);

    // Push one chunk of audio data then stop.
    act(() => {
      recorderInstances[0].ondataavailable?.({ data: new Blob(["aa"]) });
      result.current.stop();
    });

    expect(result.current.isRecording).toBe(false);
    // onStop is delivered asynchronously (after the encoder flush).
    await waitFor(() => expect(onStop).toHaveBeenCalledTimes(1));
    expect(onStop.mock.calls[0][0]).toBeInstanceOf(Blob);
  });

  it("releases microphone tracks after stopping (in onstop)", async () => {
    // Capture ONE stop spy: getTracks() may be called from both the hook and
    // this test, so `getTracks()[0].stop` must resolve to the same vi.fn.
    const stopTrack = vi.fn();
    const stream = { getTracks: () => [{ stop: stopTrack }] };
    getUserMediaMock.mockResolvedValue(stream);

    const onStop = vi.fn();
    const { result } = renderHook(() => useSpeechRecorder(onStop));

    await act(async () => {
      await result.current.start();
    });
    act(() => result.current.stop());

    await waitFor(() => expect(onStop).toHaveBeenCalled());
    // Tracks must be stopped AFTER the blob is produced (empty-blob guard).
    expect(stopTrack).toHaveBeenCalled();
  });

  it("throws a readable error when the mic API is unavailable", async () => {
    Object.defineProperty(window.navigator, "mediaDevices", {
      writable: true,
      configurable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useSpeechRecorder(vi.fn()));
    await expect(result.current.start()).rejects.toThrow(
      "Microphone is not supported"
    );
  });

  it("counts elapsed seconds and auto-stops at 30s", async () => {
    vi.useFakeTimers();
    const onStop = vi.fn();
    const { result } = renderHook(() => useSpeechRecorder(onStop));

    await act(async () => {
      await result.current.start();
    });

    // Advance 3 seconds.
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.seconds).toBe(3);
    expect(onStop).not.toHaveBeenCalled();

    // Advance to the 30s auto-stop boundary. The async `act` also flushes the
    // microtask in which the fake MediaRecorder fires `onstop`, so the blob is
    // produced and delivered before we assert.
    await act(async () => {
      vi.advanceTimersByTime(27_000);
    });
    expect(onStop).toHaveBeenCalledTimes(1);
    expect(result.current.isRecording).toBe(false);
  });
});
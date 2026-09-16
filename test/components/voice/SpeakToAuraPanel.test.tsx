import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the recorder hook so the panel test drives it like a real user would:
// the hook object's start/stop are wired to our fake, and we hold on to the
// `onStop` callback the panel passes in to simulate a finished recording.
const recorderStart = vi.fn();
const recorderStop = vi.fn();
let capturedOnStop: ((blob: Blob) => void) | null = null;

vi.mock("@/hooks/useSpeechRecorder", () => ({
  useSpeechRecorder: (onStop: (blob: Blob) => void) => {
    capturedOnStop = onStop;
    return {
      isRecording: false,
      seconds: 0,
      start: recorderStart,
      stop: recorderStop,
    };
  },
}));

import { SpeakToAuraPanel } from "@/components/voice/SpeakToAuraPanel";
import { LANGUAGES } from "@/lib/languages";

const ta = LANGUAGES[1];
const fetchMock = vi.fn();

beforeEach(() => {
  recorderStart.mockReset();
  recorderStop.mockReset();
  capturedOnStop = null;
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("SpeakToAuraPanel", () => {
  it("starts the microphone when the mic button is pressed", async () => {
    const user = userEvent.setup();
    render(<SpeakToAuraPanel language={ta} />);

    await user.click(
      screen.getByRole("button", { name: "Start recording" })
    );

    expect(recorderStart).toHaveBeenCalledTimes(1);
  });

  it("uploads the recording and shows Aura's reply", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        transcript: "vanakkam",
        response: "வணக்கம்! நலமா?",
      }),
    });

    const user = userEvent.setup();
    render(<SpeakToAuraPanel language={ta} />);

    // Simulate a complete recording: the hook calls the panel's onStop.
    await user.click(
      screen.getByRole("button", { name: "Start recording" })
    );
    capturedOnStop?.(new Blob(["audio"], { type: "audio/webm;codecs=opus" }));

    // The audio base64 + normalized MIME type are posted to /api/chat.
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/chat",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"mimeType":"audio/webm"'),
        })
      );
    });

    // Both the user's transcript and Aura's reply are rendered.
    expect(await screen.findByText("You said: vanakkam")).toBeInTheDocument();
    expect(screen.getByText("வணக்கம்! நலமா?")).toBeInTheDocument();
  });

  it("ignores empty recordings with a friendly message", async () => {
    const user = userEvent.setup();
    render(<SpeakToAuraPanel language={ta} />);

    await user.click(
      screen.getByRole("button", { name: "Start recording" })
    );
    // A 0-byte blob means nothing was captured.
    capturedOnStop?.(new Blob([], { type: "audio/webm" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "I couldn't hear anything"
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows a friendly explanation when the mic is denied", async () => {
    recorderStart.mockRejectedValue(
      Object.assign(new Error("not allowed"), { name: "NotAllowedError" })
    );

    const user = userEvent.setup();
    render(<SpeakToAuraPanel language={ta} />);
    await user.click(
      screen.getByRole("button", { name: "Start recording" })
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Microphone access was denied"
    );
  });
});
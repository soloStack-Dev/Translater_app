import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TypeToSpeakPanel } from "@/components/voice/TypeToSpeakPanel";
import { LANGUAGES } from "@/lib/languages";

const hi = LANGUAGES[0];

// fetch stub: return the JSON the caller expects per test.
const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("TypeToSpeakPanel", () => {
  it("sends the text + language to /api/tts and plays the audio", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ audioBase64: "QUJD" }),
    });

    const user = userEvent.setup();
    render(<TypeToSpeakPanel language={hi} />);

    const textarea = screen.getByLabelText("Your message");
    await user.type(textarea, "good morning");

    await user.click(screen.getByRole("button", { name: /Generate Voice/ }));

    // Correct request payload.
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/tts",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ text: "good morning", language: "hi-IN" }),
        })
      )
    );

    // Audio player appears with the data-URL stream.
    // (jsdom exposes no implicit ARIA role for `<audio>`, so assert on the
    // element directly instead of `getByRole("audio")`.)
    await waitFor(() => {
      expect(document.querySelector("audio")).toHaveAttribute(
        "src",
        "data:audio/mp3;base64,QUJD"
      );
    });
  });

  it("does not submit empty text", async () => {
    const user = userEvent.setup();
    render(<TypeToSpeakPanel language={hi} />);

    const button = screen.getByRole("button", { name: /Generate Voice/ });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows the server error message on failure", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "TTS unavailable" }),
    });

    const user = userEvent.setup();
    render(<TypeToSpeakPanel language={hi} />);
    await user.type(screen.getByLabelText("Your message"), "hi");
    await user.click(screen.getByRole("button", { name: /Generate Voice/ }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "TTS unavailable"
    );
  });

  it("resets its result when the language changes", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ audioBase64: "QUJD" }),
    });
    const user = userEvent.setup();

    const { rerender } = render(<TypeToSpeakPanel language={hi} />);
    await user.type(screen.getByLabelText("Your message"), "namaste");
    await user.click(screen.getByRole("button", { name: /Generate Voice/ }));
    await waitFor(() => expect(document.querySelector("audio")).not.toBeNull());

    // Switch to Tamil → the old audio must disappear and text clears? (Text is
    // NOT reset — the user keeps their typing; only the result is reset.)
    rerender(<TypeToSpeakPanel language={LANGUAGES[1]} />);
    await waitFor(() => expect(document.querySelector("audio")).toBeNull());
  });
});
// =============================================================================
// Global test setup — runs before every test file.
//
// 1. Registers the jest-dom matchers (toBeInTheDocument, toHaveTextContent, …)
//    onto Vitest's `expect`.
// 2. Cleans up the React DOM tree between tests. @testing-library/react only
//    auto-registers this when global `afterEach` hooks exist (Vitest `globals:
//    true`); with `globals: false` we must register it ourselves or rendered
//    components accumulate and break queries with "multiple elements" errors.
// 3. Polyfills browser APIs jsdom does not implement, guarded so the file also
//    runs in the `node` environment used by the API route tests.
// =============================================================================
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

// jsdom does not implement `window.matchMedia`, which our GSAP reveal hook
// calls to respect the user's reduced-motion preference. Stub it so the hook
// reports "no reduced motion" and animations run normally in tests.
if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });

  // jsdom does not implement `scrollIntoView` (used internally by some UI libs).
  Element.prototype.scrollIntoView = () => undefined;

  // jsdom does not implement `HTMLMediaElement.load/play/pause` reliably.
  // Guard against "Not implemented" warnings from any <audio> element rendered.
  if (!window.HTMLMediaElement) {
    Object.defineProperty(HTMLMediaElement.prototype, "play", {
      configurable: true,
      value: () => Promise.resolve(),
    });
    Object.defineProperty(HTMLMediaElement.prototype, "load", {
      configurable: true,
      value: () => undefined,
    });
  }
}
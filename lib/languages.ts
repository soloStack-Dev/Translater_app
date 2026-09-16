// =============================================================================
// Supported languages — shared metadata for the voice page.
//
// This module is CLIENT-SAFE (no server-only imports), so the React UI and the
// API routes read from the SAME single source of truth. Changing a language's
// display name or greeting here updates every page that uses it.
// =============================================================================

/**
 * Every language the voice page supports, plus the details we show in the UI
 * and the "native script" the LLM must reply in:
 *  - `code`     → Sarvam API language code (also used for routing).
 *  - `name`     → English display name.
 *  - `script`   → native writing system (used by the LLM system prompt).
 *  - `greeting` → "hello" written in that script (shown on the selector).
 */
export const LANGUAGES = [
  { code: "hi-IN", name: "Hindi", script: "Devanagari", greeting: "नमस्ते" },
  { code: "ta-IN", name: "Tamil", script: "Tamil script", greeting: "வணக்கம்" },
  { code: "ml-IN", name: "Malayalam", script: "Malayalam script", greeting: "നമസ്കാരം" },
  { code: "kn-IN", name: "Kannada", script: "Kannada script", greeting: "ನಮಸ್ಕಾರ" },
] as const;

/** A single language entry, e.g. { code: "hi-IN", name: "Hindi", ... }. */
export type Language = (typeof LANGUAGES)[number];

/** The accepted language codes, e.g. "hi-IN" | "ta-IN" | "ml-IN" | "kn-IN". */
export type LanguageCode = Language["code"];

/**
 * Type guard: narrows an arbitrary string to `LanguageCode` when it is one of
 * the supported codes. Used by the API routes to validate request input.
 */
export function isLanguageCode(value: string): value is LanguageCode {
  return LANGUAGES.some((lang) => lang.code === value);
}
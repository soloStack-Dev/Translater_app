// =============================================================================
// Supported languages — shared metadata for the voice page.
// This module is CLIENT-SAFE (no server imports), so the React UI and the API
// routes can read from the same single source of truth.
// =============================================================================

export const LANGUAGES = [
  { code: "hi-IN", name: "Hindi", script: "Devanagari", greeting: "नमस्ते" },
  { code: "ta-IN", name: "Tamil", script: "Tamil script", greeting: "வணக்கம்" },
  { code: "ml-IN", name: "Malayalam", script: "Malayalam script", greeting: "നമസ്കാരം" },
  { code: "kn-IN", name: "Kannada", script: "Kannada script", greeting: "ನಮಸ್ಕಾರ" },
] as const;

// A single language entry, e.g. { code: "hi-IN", name: "Hindi", ... }.
export type Language = (typeof LANGUAGES)[number];

// The four accepted language codes, e.g. "hi-IN".
export type LanguageCode = Language["code"];

// Type guard: narrows an arbitrary string to LanguageCode if it is supported.
export function isLanguageCode(value: string): value is LanguageCode {
  return LANGUAGES.some((lang) => lang.code === value);
}

// =============================================================================
// Vitest configuration.
//
// - `css: false` — skip CSS processing (Tailwind is compiled at build time).
// - `environment: "jsdom"` — a DOM for React component tests.
// - The `@/` alias mirrors the Next.js `tsconfig.json` path alias so imports
//   like `@/lib/utils` work inside tests.
// =============================================================================
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Keep test imports in sync with the app's `@/*` alias.
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: false, // explicit imports from "vitest" keep types simple
    setupFiles: ["./test/setup.ts"],
    // `lib/config.ts` reads NEXT_PUBLIC_SITE_URL at module load; without a
    // value `absoluteUrl()` stays relative and the sitemap/SEO output isn't
    // verifiable. A stable base URL makes canonical/OG assertions deterministic.
    env: {
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    },
    include: ["**/*.{test,spec}.{ts,tsx}"],
    // Fast, deterministic unit tests — isolate each file's mocks.
    isolate: true,
    css: false,
    restoreMocks: true,
    clearMocks: true,
  },
});
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Mirrors the "@/*" -> "./src/*" path alias from tsconfig.json so unit
// tests can import source files the same way the app does, without pulling
// in Next.js's own build pipeline.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});

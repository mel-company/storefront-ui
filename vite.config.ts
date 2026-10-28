import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Package build: the core only (src/package.ts) plus the demo data, as ESM
 * and CommonJS, and the core stylesheet. Components and sections are not in
 * it: projects copy them in with `storefront-ui add`. React, react-dom and
 * every dependency stay external, so the host's React version is the one used.
 */
export default defineConfig({
  plugins: [react()],
  css: {
    modules: { generateScopedName: "msu-[local]-[hash:base64:5]" },
  },
  build: {
    lib: {
      entry: { "storefront-ui": resolve(__dirname, "src/package.ts"), demo: resolve(__dirname, "src/demo/index.ts") },
      // ESM for bundlers, CommonJS for Node hosts that still `require` (a
      // NestJS server rendering a store page, a Jest suite).
      formats: ["es", "cjs"],
      fileName: (format, entry) => `${entry}.${format === "es" ? "js" : "cjs"}`,
    },
    cssCodeSplit: false,
    sourcemap: true,
    rollupOptions: {
      external: [/^react(-dom)?(\/.*)?$/, "zod", "zod-to-json-schema", "html-to-image", /^@radix-ui\//],
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    // Copied files (tests/registry-copy) import the package by name.
    alias: [
      { find: /^@mel-company\/storefront-ui\/demo$/, replacement: resolve(__dirname, "src/demo/index.ts") },
      { find: /^@mel-company\/storefront-ui$/, replacement: resolve(__dirname, "src/package.ts") },
    ],
    css: { modules: { classNameStrategy: "non-scoped" } },
  },
});

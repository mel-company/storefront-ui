import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/** Library build: ESM bundle + one stylesheet. React, react-dom (including /server) and every dependency stay external, so the host's React version is the one used. */
export default defineConfig({
  plugins: [react()],
  css: {
    modules: { generateScopedName: "msu-[local]-[hash:base64:5]" },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      // ESM for bundlers, CommonJS for Node hosts that still `require` (a
      // NestJS server rendering a store page, a Jest suite).
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "storefront-ui.js" : "storefront-ui.cjs"),
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
    css: { modules: { classNameStrategy: "non-scoped" } },
  },
});

import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/** Library build: ESM bundle + one stylesheet. React and zod stay external. */
export default defineConfig({
  plugins: [react()],
  css: {
    modules: { generateScopedName: "msu-[local]-[hash:base64:5]" },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: () => "storefront-ui.js",
    },
    cssCodeSplit: false,
    sourcemap: true,
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "zod", "html-to-image", /^@radix-ui\//],
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    css: { modules: { classNameStrategy: "non-scoped" } },
  },
});

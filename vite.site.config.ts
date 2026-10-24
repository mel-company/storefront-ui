import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/** The landing page and live gallery, served from `site/`. */
export default defineConfig({
  root: "site",
  // Absolute, so assets load on nested routes such as /components/product.card.
  base: "/",
  plugins: [react()],
  css: {
    modules: { generateScopedName: "msu-[local]-[hash:base64:5]" },
  },
  build: { outDir: "../dist-site", emptyOutDir: true },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: "/",
  plugins: [react()],
  publicDir: "public",
  css: { postcss: { plugins: [] } },
  build: {
    outDir: fileURLToPath(new URL("../public-mirror-dist", import.meta.url)),
    emptyOutDir: true,
    sourcemap: false,
  },
});

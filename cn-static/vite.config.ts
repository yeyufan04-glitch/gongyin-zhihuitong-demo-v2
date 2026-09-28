import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: "./",
  publicDir: "../public",
  plugins: [react()],
  build: { outDir: "../dist-cn", emptyOutDir: true },
  server: {
    fs: { allow: [".."] },
    proxy: { "/backend": { target: "http://127.0.0.1:3001", changeOrigin: true, rewrite: (path) => path.replace(/^\/backend/, "") } },
  },
});

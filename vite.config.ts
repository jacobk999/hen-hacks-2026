import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ["**/*.woff2"],
  server: {
    allowedHosts: ["a81d-2600-4040-7c57-1800-00-168f.ngrok-free.app"],
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
    },
  },
});

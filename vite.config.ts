import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Three.js ładuje się osobno (lazy), więc duży chunk tła nie blokuje startu strony.
  build: { chunkSizeWarningLimit: 1000 },
});

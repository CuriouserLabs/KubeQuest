import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              // Keep the Firebase SDK (and its browser-only deps) in its own
              // long-cacheable chunk, separate from app code.
              name: "firebase",
              test: /node_modules[\\/](firebase|@firebase|idb|tslib)[\\/]/,
            },
          ],
        },
      },
    },
  },
});

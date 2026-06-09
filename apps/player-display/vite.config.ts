import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 4104,
    strictPort: true,
    // Allow importing the shared design tokens from the repo root.
    fs: {
      allow: ["../.."],
    },
  },
});

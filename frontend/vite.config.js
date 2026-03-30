import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      events: "events", // 👈 fix for EventEmitter
    },
  },
  define: {
    global: "window",
  },
  optimizeDeps: {
    include: ["parse"],
  },
});
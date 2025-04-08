// --- START OF FILE vite.config.ts ---

import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Keep the original proxy configuration using '/offapi'
      '/offapi': { // <--- CORRECT: Use original '/offapi'
        target: 'https://world.openfoodfacts.org',
        changeOrigin: true,
        // Rewrite the path to remove '/offapi' before forwarding
        rewrite: (path) => path.replace(/^\/offapi/, ''), // <--- CORRECT: Rewrite '/offapi'
        secure: false,
      },
    },
  },
})
// --- END OF FILE vite.config.ts ---
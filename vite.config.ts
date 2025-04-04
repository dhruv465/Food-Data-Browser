// vite.config.ts
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // ADD THIS SERVER CONFIGURATION BLOCK
  server: {
    proxy: {
      // String shorthand for simple proxy rules: http://localhost:5173/offapi -> https://world.openfoodfacts.org
      '/offapi': {
        target: 'https://world.openfoodfacts.org',
        changeOrigin: true, // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/offapi/, ''), // Remove the '/offapi' prefix before forwarding
        secure: false, // Often needed if the target API uses HTTPS
      },
    }
  }
})
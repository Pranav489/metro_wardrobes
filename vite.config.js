import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Return the module name to put it in a separate chunk
            return 'vendor';
          }
        },
        // Increase the chunk size warning limit (default is 500kB)
        chunkSizeWarningLimit: 1500, // 1000 kB
      }
    }
  }
});
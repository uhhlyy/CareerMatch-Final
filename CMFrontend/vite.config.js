import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';  // Add this import for Tailwind v4

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],  // Add tailwindcss() to the plugins array
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:80',  // Replace with your backend's URL/port (e.g., http://localhost:8000 if on port 8000)
        changeOrigin: true,  // Ensures the origin header is set correctly for CORS
        secure: false,  // Set to true if your backend uses HTTPS
      },
    },
  },
});
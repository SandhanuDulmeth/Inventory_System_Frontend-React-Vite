import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: {}, // Required by some libraries like 'stompjs'
  },
  server: {
    proxy: {
      '/ws': {
        target: 'http://localhost:8080', // HTTP protocol
        changeOrigin: true,
        ws: true, // WebSocket support
        secure: false
      }
    }
  }
});

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // En desarrollo, /api se redirige al backend: el navegador ve un solo origen,
    // igual que en producción, y las cookies funcionan sin problemas de CORS.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})

import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// URL pública del sitio, para las etiquetas OpenGraph de index.html (las redes
// sociales exigen URLs absolutas). Prioridad: VITE_SITE_URL > RENDER_EXTERNAL_URL
// (Render la define sola en cada deploy) > localhost.
function siteUrlPlugin(mode) {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || env.RENDER_EXTERNAL_URL || 'http://localhost:5173').replace(/\/+$/, '')
  return {
    name: 'site-url',
    transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl),
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), siteUrlPlugin(mode)],
  server: {
    // En desarrollo, /api se redirige al backend: el navegador ve un solo origen,
    // igual que en producción, y las cookies funcionan sin problemas de CORS.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
}))

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AuthProvider from './context/AuthProvider.jsx'

// BrowserRouter: URLs normales (/bots, /login). En producción Express devuelve
// index.html para cualquier ruta que no sea /api, así que recargar la página funciona.
// AuthProvider: la sesión queda disponible en toda la app con useAuth().
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

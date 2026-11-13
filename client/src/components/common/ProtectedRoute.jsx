// Ruta que exige sesión (Brandon).
//   - Mientras se pregunta al backend si hay sesión: muestra "Cargando…" (sin parpadeo del login).
//   - Sin sesión: manda a /login y recuerda a dónde quería ir, para volver después de entrar.
//   - Con sesión: muestra la ruta hija (<Outlet />) o los children.
//
// Ojo: esto solo mejora la experiencia. La seguridad real está en el backend
// (requireAuth): aunque alguien saltee esta pantalla, la API responde 401.

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth.js'
import PageState from '../../pages/bots/PageState.jsx'
import '../../pages/bots/theme.css'

export default function ProtectedRoute({ children }) {
  const { status, isAuthenticated } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <main className="bots-area">
        <PageState title="Cargando…" />
      </main>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children ?? <Outlet />
}

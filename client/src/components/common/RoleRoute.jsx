// Ruta que exige un rol (Brandon). Va DENTRO de ProtectedRoute: acá ya hay sesión.
// Uso: <Route element={<RoleRoute roles={['ADMIN']} />}> ... </Route>
//
// Con el rol equivocado muestra "Sin acceso" en vez de redirigir: así queda claro
// por qué no puede entrar. La seguridad real está en el backend (requireRole → 403).

import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth.js'
import PageState from '../../pages/bots/PageState.jsx'
import '../../pages/bots/theme.css'

export default function RoleRoute({ roles, children }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user || !roles.includes(user.role)) {
    return (
      <main className="bots-area">
        <PageState
          isError
          title="No tenés acceso a esta sección"
          text="Esta parte de EasyBot es solo para administradores."
          actionLabel="Volver a Mis bots"
          onAction={() => navigate('/bots')}
        />
      </main>
    )
  }

  return children ?? <Outlet />
}

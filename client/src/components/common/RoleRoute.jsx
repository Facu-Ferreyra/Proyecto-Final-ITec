// Ruta que exige un rol (Brandon). Va DENTRO de ProtectedRoute: acá ya hay sesión.
// Uso: <Route element={<RoleRoute roles={['ADMIN']} />}> ... </Route>
//
// Con el rol equivocado muestra la página de error 403 en vez de redirigir: así
// queda claro por qué no puede entrar. La seguridad real está en el backend
// (requireRole → 403): esto solo mejora la experiencia.

import { Outlet } from 'react-router-dom'
import { useAuth } from '../../context/useAuth.js'
import ErrorPage from './ErrorPage.jsx'

export default function RoleRoute({ roles, children }) {
  const { user } = useAuth()

  if (!user || !roles.includes(user.role)) {
    return (
      <ErrorPage
        code="403"
        title="No tenés acceso a esta sección."
        text="Esta parte de EasyBot es solo para administradores. Si creés que es un error, pedile acceso al administrador."
        actions={[
          { to: '/bots', label: 'Ir a Mis bots' },
          { to: '/', label: 'Volver al inicio' },
        ]}
        withHeader={false} // ya está adentro de la barra de la app (AppLayout)
      />
    )
  }

  return children ?? <Outlet />
}

// Página 404: cualquier ruta que no existe (App.jsx, path="*").
// Usa la página de error común (estilo devff.tech/404).

import ErrorPage from '../../components/common/ErrorPage.jsx'
import { useAuth } from '../../context/useAuth.js'

export default function NotFoundPage() {
  const { isAuthenticated } = useAuth()

  return (
    <ErrorPage
      code="404"
      title="Esta página no existe."
      text="Puede que el link esté mal escrito o que la página se haya movido."
      actions={[
        { to: '/', label: 'Volver al inicio' },
        isAuthenticated ? { to: '/bots', label: 'Ir a Mis bots' } : { to: '/login', label: 'Iniciar sesión' },
      ]}
    />
  )
}

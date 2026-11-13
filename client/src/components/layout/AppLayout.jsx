// Barra superior de las pantallas privadas (Brandon): navegación, usuario y "Salir".
// Nicole puede cambiarle el diseño; lo importante es que use useAuth() para el usuario y el logout.

import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth.js'
import './app-layout.css'

export default function AppLayout() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [leaving, setLeaving] = useState(false)

  async function handleLogout() {
    setLeaving(true)
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <header className="app-bar">
        <NavLink to="/bots" className="app-bar-brand">
          EasyBot
        </NavLink>
        <nav aria-label="Principal" className="app-bar-nav">
          <NavLink to="/bots">Mis bots</NavLink>
          <NavLink to="/panel">Panel</NavLink>
          {/* El link de admin solo se muestra a admins; igual la ruta y la API están protegidas. */}
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="app-bar-user">
          <span title={user?.email}>{user?.name}</span>
          <button type="button" className="app-bar-logout" onClick={handleLogout} disabled={leaving}>
            {leaving ? 'Saliendo…' : 'Salir'}
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  )
}

// Barra superior de las pantallas privadas (Brandon): navegación, usuario y "Salir".
// Usa useAuth() para mostrar el usuario y cerrar la sesión.

import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth.js'
import MobileMenu from './MobileMenu.jsx'
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

  // Los mismos links para la barra de escritorio y el menú de celular.
  const links = [
    <NavLink key="bots" to="/bots">Mis bots</NavLink>,
    <NavLink key="panel" to="/panel">Panel</NavLink>,
    // El link de admin solo se muestra a admins; igual la ruta y la API están protegidas.
    isAdmin && <NavLink key="admin" to="/admin">Admin</NavLink>,
  ].filter(Boolean)

  return (
    <div className="app-shell">
      <header className="app-bar">
        <NavLink to="/bots" className="app-bar-brand">
          <img src="/favicon.svg" alt="" width="28" height="28" className="brand-mark" />
          EasyBot
        </NavLink>
        {/* Escritorio: links y usuario en la barra. */}
        <nav aria-label="Principal" className="app-bar-nav">
          {links}
        </nav>
        <div className="app-bar-user">
          <span title={user?.email}>{user?.name}</span>
          <button type="button" className="app-bar-logout" onClick={handleLogout} disabled={leaving}>
            {leaving ? 'Saliendo…' : 'Salir'}
          </button>
        </div>

        {/* Celular: todo eso adentro del menú lateral. */}
        <MobileMenu title="EasyBot" buttonClassName="app-bar-menu-toggle">
          <nav aria-label="Principal">
            <ul className="mobile-menu-links">
              {links.map((link) => (
                <li key={link.key}>{link}</li>
              ))}
            </ul>
          </nav>
          <div className="mobile-menu-footer">
            <div className="mobile-menu-user">
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>
            <button type="button" className="mobile-menu-btn" data-close-menu onClick={handleLogout} disabled={leaving}>
              {leaving ? 'Saliendo…' : 'Salir'}
            </button>
          </div>
        </MobileMenu>
      </header>
      <Outlet />
    </div>
  )
}

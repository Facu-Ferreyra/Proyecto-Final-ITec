// Barra superior de las pantallas privadas (Brandon): navegación y menú del usuario.
// Usa useAuth() para mostrar el usuario y cerrar la sesión.
// Cerrar sesión pide confirmación siempre (desde el menú de escritorio y el de celular).

import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import ConfirmDialog from '../common/ConfirmDialog.jsx'
import { useAuth } from '../../context/useAuth.js'
import MobileMenu from './MobileMenu.jsx'
import UserMenu from './UserMenu.jsx'
import './app-layout.css'

export default function AppLayout() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [confirmingLogout, setConfirmingLogout] = useState(false)
  const [leaving, setLeaving] = useState(false)

  async function handleLogout() {
    setLeaving(true)
    await logout()
    setConfirmingLogout(false)
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
        {/* Escritorio: links y menú del usuario en la barra. */}
        <nav aria-label="Principal" className="app-bar-nav">
          {links}
        </nav>
        <div className="app-bar-user">
          <UserMenu user={user} isAdmin={isAdmin} onLogout={() => setConfirmingLogout(true)} />
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
              <strong>
                Hola, {user?.name}
              </strong>
              <span>{user?.email}</span>
              {isAdmin && <span>Administrador</span>}
            </div>
            <button type="button" className="mobile-menu-btn" data-close-menu onClick={() => setConfirmingLogout(true)}>
              Cerrar sesión
            </button>
          </div>
        </MobileMenu>
      </header>

      <ConfirmDialog
        open={confirmingLogout}
        title="¿Cerrar sesión?"
        confirmLabel={leaving ? 'Cerrando sesión…' : 'Cerrar sesión'}
        tone="primary"
        onConfirm={handleLogout}
        onCancel={() => !leaving && setConfirmingLogout(false)}
      >
        <p>Vas a tener que volver a ingresar con tu email y contraseña.</p>
      </ConfirmDialog>

      <Outlet />
    </div>
  )
}

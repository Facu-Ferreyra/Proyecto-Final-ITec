// Menú del usuario en la barra: círculo con la inicial + "Hola, José 👋".
// Al tocarlo se despliega un menú distinto según el rol (el admin ve su sección).
//
// Sigue el patrón "menu button" de la W3C (WAI-ARIA APG):
//   - El botón tiene aria-haspopup="menu" y aria-expanded.
//   - Enter / Espacio / ↓ abren y enfocan la primera opción; ↑ abre en la última.
//   - Dentro del menú: ↑ ↓ recorren (dan la vuelta), Inicio / Fin van a los extremos.
//   - Esc cierra y devuelve el foco al botón; Tab o un clic afuera también cierran.
// Mostrar u ocultar opciones es solo experiencia: los permisos los controla el backend.

import { useEffect, useId, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import './user-menu.css'

const firstName = (name = '') => name.trim().split(/\s+/)[0] || 'de nuevo'

export default function UserMenu({ user, isAdmin, onLogout }) {
  const [open, setOpen] = useState(false)
  const [focusIndex, setFocusIndex] = useState(0) // opción a enfocar al abrir (-1 = última)
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const menuRef = useRef(null)
  const buttonId = useId()
  const menuId = useId()

  const items = () => [...(menuRef.current?.querySelectorAll('[role="menuitem"]') ?? [])]

  // Al abrir, enfoca la opción pedida (sincroniza el foco del navegador con el estado).
  useEffect(() => {
    if (!open) return
    const list = items()
    list.at(focusIndex)?.focus()
  }, [open, focusIndex])

  // Clic fuera del menú: se cierra. Es una suscripción a un evento del navegador,
  // por eso va en un efecto y se limpia al cerrar.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  function openAt(index) {
    setFocusIndex(index)
    setOpen(true)
  }

  function close({ returnFocus = true } = {}) {
    setOpen(false)
    if (returnFocus) buttonRef.current?.focus()
  }

  function handleButtonKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      openAt(0)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      openAt(-1)
    }
  }

  function handleMenuKeyDown(event) {
    const list = items()
    const current = list.indexOf(document.activeElement)
    const moves = {
      ArrowDown: (current + 1) % list.length,
      ArrowUp: (current - 1 + list.length) % list.length,
      Home: 0,
      End: list.length - 1,
    }
    if (event.key in moves) {
      event.preventDefault()
      list[moves[event.key]]?.focus()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      close()
    } else if (event.key === 'Tab') {
      close({ returnFocus: false })
    }
  }

  const initial = (user?.name?.trim()[0] ?? '?').toUpperCase()

  return (
    <div ref={rootRef} className={`user-menu ${isAdmin ? 'user-menu-admin' : ''}`}>
      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        className="user-menu-button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => (open ? close() : openAt(0))}
        onKeyDown={handleButtonKeyDown}
      >
        <span className="user-menu-avatar" aria-hidden="true">
          {initial}
        </span>
        <span className="user-menu-greeting">
          Hola, {firstName(user?.name)} <span aria-hidden="true">👋</span>
        </span>
        <span className="user-menu-sr-only"> (menú de la cuenta)</span>
      </button>

      {open && (
        <div className="user-menu-popover">
          <div className="user-menu-header">
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
            {isAdmin && <span className="user-menu-role">Administrador</span>}
          </div>

          <ul ref={menuRef} id={menuId} role="menu" aria-labelledby={buttonId} className="user-menu-list" onKeyDown={handleMenuKeyDown}>
            <li role="none">
              <NavLink role="menuitem" to="/bots" onClick={() => close({ returnFocus: false })}>
                Mis bots
              </NavLink>
            </li>
            <li role="none">
              <NavLink role="menuitem" to="/panel" onClick={() => close({ returnFocus: false })}>
                Panel
              </NavLink>
            </li>
            {isAdmin && (
              <>
                <li role="separator" className="user-menu-separator" />
                <li role="none" className="user-menu-section" aria-hidden="true">
                  Administración
                </li>
                <li role="none">
                  <NavLink role="menuitem" to="/admin" onClick={() => close({ returnFocus: false })}>
                    Plantillas y usuarios
                  </NavLink>
                </li>
              </>
            )}
            <li role="separator" className="user-menu-separator" />
            <li role="none">
              <button
                role="menuitem"
                type="button"
                className="user-menu-logout"
                onClick={() => {
                  close({ returnFocus: false })
                  onLogout()
                }}
              >
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

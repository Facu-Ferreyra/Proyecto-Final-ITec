// Menú lateral para celular: botón hamburguesa + panel que entra desde la derecha.
//
// Usa <dialog> nativo con showModal(), que ya resuelve lo difícil:
//   - Esc lo cierra.
//   - El foco queda atrapado adentro y, al cerrar, vuelve al botón hamburguesa.
//   - El resto de la página queda inerte (no se puede tocar ni leer con lector de pantalla).
// Se cierra también al tocar el fondo oscuro o cualquier link/botón de adentro.
//
// El botón solo se ve por debajo del ancho que defina el CSS de cada barra
// (se le pasa buttonClassName); en pantallas grandes la barra muestra todo.

import { useId, useRef } from 'react'
import './mobile-menu.css'

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function MobileMenu({ title = 'Menú', buttonClassName = '', children }) {
  const dialogRef = useRef(null)
  const id = useId()

  const open = () => dialogRef.current?.showModal()
  const close = () => dialogRef.current?.close()

  function handleClick(event) {
    // Tocar el fondo: el click cae en el <dialog> mismo, no en su contenido.
    if (event.target === dialogRef.current) return close()
    // Tocar un link o botón de adentro: se navega/ejecuta y el menú se cierra.
    if (event.target.closest('a, button[data-close-menu]')) close()
  }

  return (
    <>
      <button
        type="button"
        className={`mobile-menu-toggle ${buttonClassName}`}
        aria-label="Abrir menú"
        aria-haspopup="dialog"
        aria-controls={id}
        onClick={open}
      >
        <MenuIcon />
      </button>

      <dialog ref={dialogRef} id={id} className="mobile-menu" aria-label={title} onClick={handleClick}>
        <div className="mobile-menu-panel">
          <div className="mobile-menu-head">
            <span className="mobile-menu-title">{title}</span>
            <button type="button" className="mobile-menu-close" aria-label="Cerrar menú" onClick={close}>
              <CloseIcon />
            </button>
          </div>
          {children}
        </div>
      </dialog>
    </>
  )
}

// Diálogo de confirmación propio (reemplaza a window.confirm, que no se puede
// diseñar y cada navegador muestra distinto).
//
// Con requireText, el botón de confirmar recién se habilita al escribir ese texto
// exacto (ej.: el nombre del bot). Es el patrón de GitHub/Vercel para acciones que
// no se pueden deshacer: obliga a leer qué se está borrando.
//
// Usa <dialog> nativo con showModal(): Esc lo cierra, el foco queda adentro y el
// resto de la página queda inerte. El estado "abierto" lo maneja quien lo usa (open).

import { useEffect, useId, useRef, useState } from 'react'
import './confirm-dialog.css'

// El contenido se monta recién al abrir: así el texto escrito arranca vacío cada vez.
function ConfirmBody({ titleId, title, children, confirmLabel, requireText, onConfirm, onCancel }) {
  const [typed, setTyped] = useState('')
  const inputId = useId()
  const canConfirm = !requireText || typed.trim() === requireText.trim()

  function handleSubmit(event) {
    event.preventDefault()
    if (canConfirm) onConfirm()
  }

  return (
    <form className="confirm-dialog-body" onSubmit={handleSubmit}>
      <h2 id={titleId} className="confirm-dialog-title">
        {title}
      </h2>
      <div className="confirm-dialog-text">{children}</div>

      {requireText && (
        <div className="confirm-dialog-field">
          <label htmlFor={inputId}>
            Para confirmar, escribí <strong className="confirm-dialog-name">{requireText}</strong>
          </label>
          <input
            id={inputId}
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            data-autofocus
          />
        </div>
      )}

      <div className="confirm-dialog-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} data-autofocus={requireText ? undefined : true}>
          Cancelar
        </button>
        <button type="submit" className="btn confirm-dialog-danger" disabled={!canConfirm}>
          {confirmLabel}
        </button>
      </div>
    </form>
  )
}

export default function ConfirmDialog({ open, onCancel, ...bodyProps }) {
  const dialogRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      // Foco inicial: el campo de texto si hay que escribir; si no, "Cancelar"
      // (la opción segura, para que un Enter apurado no borre nada).
      dialog.querySelector('[data-autofocus]')?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      aria-labelledby={titleId}
      // Esc o dialog.close(): avisa para que el estado de afuera quede cerrado.
      onClose={onCancel}
      // Tocar el fondo oscuro (fuera del contenido) cancela.
      onClick={(event) => event.target === dialogRef.current && onCancel()}
    >
      {open && <ConfirmBody titleId={titleId} onCancel={onCancel} {...bodyProps} />}
    </dialog>
  )
}

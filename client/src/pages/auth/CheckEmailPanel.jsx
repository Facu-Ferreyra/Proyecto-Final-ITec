// "Revisá tu email": después de pedir el link de recuperación.
// Sigue el patrón "Confirm an email address" del GOV.UK Design System:
//   - Dice a qué email se mandó (sin confirmar si la cuenta existe).
//   - Permite reenviar el link, con una espera visible de 60 s para no chocar
//     con el límite del servidor (5 pedidos por hora).
//   - Permite volver y corregir el email si se escribió mal.

import { useEffect, useRef, useState } from 'react'
import { forgotPassword } from '../../api/auth.js'

const RESEND_SECONDS = 60

const formatWait = (seconds) => `0:${String(seconds).padStart(2, '0')}`

export default function CheckEmailPanel({ email, onChangeEmail }) {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState(null) // { type: 'success' | 'error', text }
  const panelRef = useRef(null)

  // Al aparecer, el foco pasa a este mensaje: quien usa teclado o lector de
  // pantalla se entera de que el formulario se envió.
  useEffect(() => {
    panelRef.current?.focus()
  }, [])

  // Cuenta regresiva: baja un segundo por vez hasta llegar a 0.
  useEffect(() => {
    if (secondsLeft <= 0) return
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [secondsLeft])

  async function resend() {
    setSending(true)
    setStatus(null)
    try {
      await forgotPassword({ email })
      setStatus({ type: 'success', text: 'Te enviamos otro link. Usá el más reciente: el anterior ya no sirve.' })
      setSecondsLeft(RESEND_SECONDS)
    } catch (error) {
      setStatus({ type: 'error', text: error.message })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="check-email">
      <p ref={panelRef} tabIndex={-1} className="check-email-lead">
        Si hay una cuenta con <strong>{email}</strong>, te enviamos un link para elegir una contraseña nueva.
      </p>
      <ul className="check-email-tips">
        <li>El link vence en 30 minutos y se puede usar una sola vez.</li>
        <li>Si no lo ves en unos minutos, revisá la carpeta de spam o correo no deseado.</li>
      </ul>

      {/* aria-live: el lector de pantalla anuncia "Te enviamos otro link" o el error. */}
      <div aria-live="polite">
        {status && <p className={`notice notice-${status.type}`}>{status.text}</p>}
      </div>

      <button type="button" className="btn btn-secondary btn-block" onClick={resend} disabled={sending || secondsLeft > 0}>
        {sending ? 'Enviando…' : secondsLeft > 0 ? `Reenviar link en ${formatWait(secondsLeft)}` : 'Reenviar link'}
      </button>

      <p className="check-email-change">
        ¿Escribiste mal el email?{' '}
        <button type="button" className="link-button" onClick={onChangeEmail}>
          Cambiarlo
        </button>
      </p>
    </div>
  )
}

// Paso 4: bot publicado, con el link para compartir (prototipo, pantalla 8).

import { useId, useState } from 'react'
import './PublishedStep.css'

export default function PublishedStep({ titleRef, bot, onExit }) {
  const linkId = useId()
  const [copyMessage, setCopyMessage] = useState('')
  // Link completo = dominio donde corre la app + publicPath que manda el backend.
  const publicUrl = `${window.location.origin}${bot.publicPath}`

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopyMessage('¡Link copiado!')
    } catch {
      // El portapapeles puede estar bloqueado (permisos o sitio sin HTTPS).
      setCopyMessage('No pudimos copiarlo. Seleccioná el link y copialo a mano.')
    }
  }

  return (
    <section className="card" aria-labelledby="published-step-title">
      <h2 id="published-step-title" className="step-title" ref={titleRef} tabIndex={-1}>
        Tu bot está publicado
      </h2>
      <p className="step-hint">Compartí este link con tus clientes: ponelo en Instagram, en un QR o en un mensaje.</p>

      <label htmlFor={linkId} className="field-label">
        Link público
      </label>
      <div className="link-row">
        <input id={linkId} value={publicUrl} readOnly onFocus={(e) => e.target.select()} />
        <button type="button" className="btn btn-primary" onClick={copyLink}>
          Copiar link
        </button>
      </div>
      <p className="copy-message" role="status">
        {copyMessage}
      </p>

      <div className="step-actions step-actions-start">
        <a className="btn btn-secondary" href={bot.publicPath} target="_blank" rel="noopener noreferrer">
          Ver el chat
        </a>
        <button type="button" className="btn btn-primary" onClick={onExit}>
          Ir a Mis bots
        </button>
      </div>
    </section>
  )
}

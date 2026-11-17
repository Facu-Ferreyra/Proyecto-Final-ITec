// Vista previa del bot (prototipo, pantalla 6, panel derecho).
// PROVISORIO: cuando Nicole tenga el chat en components/chat/, se reemplaza
// por ese componente y se le pasan messages, options y los manejadores.

import { useState } from 'react'
import { usePreviewChat } from './usePreviewChat.js'
import './PreviewChat.css'

export default function PreviewChat({ botId, reloadKey }) {
  const { messages, options, input, status, error, chooseOption, sendText } = usePreviewChat(botId, reloadKey)
  const [text, setText] = useState('')
  const busy = status === 'sending'

  function handleSubmit(event) {
    event.preventDefault()
    if (!text.trim()) return
    sendText(text.trim())
    setText('')
  }

  return (
    <aside className="preview" aria-label="Vista previa del bot">
      <h2 className="preview-header">Vista previa</h2>

      {/* aria-live: el lector de pantalla anuncia los mensajes nuevos del bot. */}
      <div className="preview-body" aria-live="polite">
        {status === 'loading' && <p className="preview-status">Cargando vista previa…</p>}

        {messages.map((message, index) => (
          <p key={index} className={`bubble bubble-${message.from}`}>
            {message.text}
          </p>
        ))}

        {status === 'error' && (
          <p className="preview-status preview-error" role="alert">
            {error}
          </p>
        )}

        {status !== 'loading' && options.length > 0 && (
          <div className="preview-options">
            {options.map((option) => (
              <button key={option.id} type="button" className="btn btn-secondary btn-small" disabled={busy} onClick={() => chooseOption(option)}>
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {input && (
        <form className="preview-input" onSubmit={handleSubmit}>
          <input
            type={input.type === 'phone' ? 'tel' : 'text'}
            value={text}
            maxLength={input.maxLength ?? 500}
            placeholder={input.placeholder ?? 'Escribí tu respuesta'}
            aria-label="Tu respuesta"
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-small" disabled={busy}>
            Enviar
          </button>
        </form>
      )}
    </aside>
  )
}

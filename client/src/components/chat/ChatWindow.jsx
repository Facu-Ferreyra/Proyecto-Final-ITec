// Ventana de chat: burbujas, botones de opciones y campo de texto.
// Solo muestra: la lógica está en useChat. Recibe lo que devuelve useChat
// (se puede pasar con {...chat}) más un título y un subtítulo.

import { useEffect, useRef } from 'react'
import ChatInput from './ChatInput.jsx'
import './chat.css'

export default function ChatWindow({
  title,
  subtitle,
  className = '',
  headingLevel = 'h2', // 'h1' cuando el chat es toda la página (chat público)
  messages,
  options,
  input,
  status,
  error,
  chooseOption,
  sendText,
  retry,
}) {
  const bodyRef = useRef(null)
  const busy = status === 'sending'
  const Heading = headingLevel

  // Cada vez que llega un mensaje, baja hasta el final de la conversación.
  useEffect(() => {
    const body = bodyRef.current
    if (body) body.scrollTop = body.scrollHeight
  }, [messages, options, status])

  return (
    <section className={`chat ${className}`} aria-label={title || 'Chat'}>
      <header className="chat-header">
        <Heading className="chat-title">{title || 'Chat'}</Heading>
        {subtitle && <p className="chat-subtitle">{subtitle}</p>}
      </header>

      {/* aria-live: el lector de pantalla anuncia los mensajes nuevos. */}
      <div ref={bodyRef} className="chat-body" aria-live="polite">
        {status === 'loading' && <p className="chat-status">Cargando…</p>}

        {status === 'failed' && (
          <div className="chat-status chat-error" role="alert">
            <p>{error?.message ?? 'No pudimos cargar el chat.'}</p>
            <button type="button" className="chat-option" onClick={retry}>
              Reintentar
            </button>
          </div>
        )}

        {messages.map((message, index) => (
          // El índice como key alcanza: los mensajes solo se agregan al final.
          <p key={index} className={`chat-bubble chat-bubble-${message.from}`}>
            {message.text}
          </p>
        ))}

        {busy && <p className="chat-status">Escribiendo…</p>}

        {status === 'ready' && error && (
          <p className="chat-status chat-error" role="alert">
            {error.message} Probá de nuevo.
          </p>
        )}

        {status !== 'loading' && options.length > 0 && (
          <div className="chat-options">
            {options.map((option) => (
              <button key={option.id} type="button" className="chat-option" disabled={busy} onClick={() => chooseOption(option)}>
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {input && <ChatInput input={input} disabled={busy} onSend={sendText} />}
    </section>
  )
}

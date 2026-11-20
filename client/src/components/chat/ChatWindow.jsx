// Ventana de chat: burbujas, botones de opciones y campo de texto.
// Solo muestra: la lógica está en useChat. Recibe lo que devuelve useChat
// (se puede pasar con {...chat}) más un título y un subtítulo.

import { useEffect, useRef, useState } from 'react'
import BotAvatar from '../common/BotAvatar.jsx'
import ChatInput from './ChatInput.jsx'
import './chat.css'
import { Bone, ChatSkeleton } from '../common/Skeleton.jsx'

export default function ChatWindow({
  title,
  avatarName,
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
  const [showTop, setShowTop] = useState(false)
  const busy = status === 'sending'
  const Heading = headingLevel

  // Cada vez que llega un mensaje, baja hasta el final de la conversación.
  useEffect(() => {
    const body = bodyRef.current
    if (body) body.scrollTop = body.scrollHeight
  }, [messages, options, status])

  // Botón "volver arriba": aparece cuando la conversación ya bajó más de una
  // pantalla de mensajes, para no tener que scrollear todo a mano.
  function handleScroll() {
    const body = bodyRef.current
    if (body) setShowTop(body.scrollTop > body.clientHeight)
  }

  function scrollToTop() {
    const reduce = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    bodyRef.current?.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section className={`chat ${className}`} aria-label={title || 'Chat'}>
      <header className="chat-header">
        {/* El logo del bot (iniciales) le da identidad al chat de cada negocio.
            avatarName: si el título no es el nombre del bot (ej. "Vista previa"). */}
        {(avatarName ?? title) && <BotAvatar name={avatarName ?? title} size={40} />}
        {/* Mientras carga el chat público todavía no hay nombre: silueta en vez de "Chat". */}
        {!title && status === 'loading' ? (
          <div className="chat-header-text sk-row" aria-hidden="true">
            <Bone w={40} h={40} r={11} className="sk-on-dark" />
            <span className="sk-stack" style={{ gap: 8 }}>
              <Bone w={150} h={16} className="sk-on-dark" />
              <Bone w={110} h={11} className="sk-on-dark" />
            </span>
          </div>
        ) : (
          <div className="chat-header-text">
            <Heading className="chat-title">{title || 'Chat'}</Heading>
            {subtitle && <p className="chat-subtitle">{subtitle}</p>}
          </div>
        )}
      </header>

      {/* El área de mensajes scrollea por dentro; el botón circular queda fijo abajo
          a la derecha de esa área (no se va con el scroll). */}
      <div className="chat-body-wrap">
      {/* aria-live: el lector de pantalla anuncia los mensajes nuevos. */}
      <div ref={bodyRef} className="chat-body" aria-live="polite" onScroll={handleScroll}>
        {status === 'loading' && <ChatSkeleton />}

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

        {/* Tres puntos, como en cualquier chat; el texto queda para lectores de pantalla. */}
        {busy && (
          <p className="chat-typing">
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span className="visually-hidden">Escribiendo…</span>
          </p>
        )}

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
      {showTop && (
        <button type="button" className="chat-to-top" onClick={scrollToTop} aria-label="Volver al inicio de la conversación">
          <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
            <path d="M10 16V4M4.5 9.5 10 4l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      </div>

      {input &&<ChatInput input={input} disabled={busy} onSend={sendText} />}
    </section>
  )
}

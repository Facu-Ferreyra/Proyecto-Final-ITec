// Campo de texto del chat. Solo aparece cuando el bot espera una respuesta
// escrita (input no es null): un nombre, un teléfono, una dirección, etc.

import { useState } from 'react'

export default function ChatInput({ input, disabled, onSend }) {
  const [text, setText] = useState('')
  const isPhone = input.type === 'phone'

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText('')
  }

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        type={isPhone ? 'tel' : 'text'}
        inputMode={isPhone ? 'tel' : undefined}
        autoComplete={isPhone ? 'tel' : 'off'}
        value={text}
        maxLength={input.maxLength ?? 500}
        placeholder={input.placeholder ?? 'Escribí tu respuesta'}
        aria-label="Tu respuesta"
        onChange={(event) => setText(event.target.value)}
      />
      <button type="submit" className="chat-send" disabled={disabled || !text.trim()}>
        Enviar
      </button>
    </form>
  )
}

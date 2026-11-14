// Chat público: lo que ve el cliente del negocio al abrir el link del bot.
// No necesita login. Recibe el slug por props (lo lee App.jsx de la URL).

import { useCallback, useRef } from 'react'
import { getPublicBot, sendPublicMessage } from '../../api/public.js'
import ChatWindow from '../../components/chat/ChatWindow.jsx'
import { useChat } from '../../components/chat/useChat.js'
import { getVisitorId, saveVisitorId } from './visitorId.js'
import './public.css'

function NotAvailable() {
  return (
    <div className="public-chat-missing" role="alert">
      <h1>Este bot no está disponible</h1>
      <p>Puede que el link esté mal escrito o que el negocio lo haya pausado.</p>
    </div>
  )
}

export default function PublicChatPage({ slug }) {
  // La conversación la crea el backend en el primer mensaje; se guarda acá para
  // mandarla en los siguientes. useRef: cambiarla no necesita volver a dibujar.
  const conversationId = useRef(undefined)

  const start = useCallback(() => getPublicBot(slug), [slug])

  const send = useCallback(
    async (message) => {
      const data = await sendPublicMessage(slug, {
        ...message,
        visitorId: getVisitorId(),
        conversationId: conversationId.current,
      })
      conversationId.current = data.conversationId
      saveVisitorId(data.visitorId)
      return data
    },
    [slug],
  )

  const chat = useChat({ start, send })
  const notFound = chat.status === 'failed' && chat.error?.code === 'BOT_NOT_FOUND'

  return (
    <main className="public-chat">
      {notFound ? (
        <NotAvailable />
      ) : (
        <ChatWindow {...chat} subtitle="Respuestas automáticas" className="chat-full" headingLevel="h1" />
      )}
      <p className="public-chat-footer">Hecho con EasyBot</p>
    </main>
  )
}

// Vista previa del bot en el paso 2 del asistente. Usa el mismo chat que la
// página pública (components/chat), pero con los endpoints de vista previa,
// que funcionan con borradores y no guardan nada.

import { useCallback } from 'react'
import { sendPreviewMessage, startPreview } from '../../api/bots.js'
import ChatWindow from '../chat/ChatWindow.jsx'
import { useChat } from '../chat/useChat.js'

// reloadKey cambia cada vez que se guarda el formulario: el chat vuelve a
// empezar con los datos nuevos.
export default function PreviewChat({ botId, reloadKey }) {
  const start = useCallback(() => startPreview(botId), [botId])
  const send = useCallback((message) => sendPreviewMessage(botId, message), [botId])
  const chat = useChat({ start, send, resetKey: reloadKey })

  return <ChatWindow {...chat} title="Vista previa" subtitle="Así lo van a ver tus clientes" />
}

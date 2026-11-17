// Lógica de una conversación con el bot. No sabe de qué API viene: la usan el
// chat público y la vista previa del asistente, cada uno con sus funciones.
//
//   start()        → { replies, options, title? }      (saludo y menú)
//   send(message)  → { replies, options, input, state } (respuesta del bot)
//
// start y send tienen que venir de useCallback: si cambian, el chat empieza de nuevo.
// resetKey (opcional) también reinicia el chat cuando cambia.

import { useEffect, useState } from 'react'

const toBotMessages = (replies = []) => replies.map((text) => ({ from: 'bot', text }))

export function useChat({ start, send, resetKey }) {
  const [messages, setMessages] = useState([]) // [{ from: 'bot' | 'visitor', text }]
  const [options, setOptions] = useState([])
  const [input, setInput] = useState(null) // si no es null, el bot espera texto libre
  const [flowState, setFlowState] = useState(null) // "state" del backend: se devuelve tal cual
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'sending' | 'failed'
  const [error, setError] = useState(null) // ApiError del último pedido que falló
  const [attempt, setAttempt] = useState(0) // sube con "Reintentar"

  useEffect(() => {
    let ignore = false // evita mostrar la respuesta de un chat que ya se reinició

    // El estado solo se actualiza cuando llega la respuesta (no al empezar el
    // efecto): así lo recomienda la documentación de React.
    start()
      .then((data) => {
        if (ignore) return
        setError(null)
        setTitle(data.title ?? '')
        setMessages(toBotMessages(data.replies))
        setOptions(data.options ?? [])
        setInput(null)
        setFlowState(null)
        setStatus('ready')
      })
      .catch((err) => {
        if (ignore) return
        setError(err)
        setStatus('failed')
      })

    return () => {
      ignore = true
    }
  }, [start, resetKey, attempt])

  // message = { optionId } o { text }; visitorText = lo que se muestra en la burbuja.
  async function reply(message, visitorText) {
    setMessages((current) => [...current, { from: 'visitor', text: visitorText }])
    setStatus('sending')
    setError(null)
    try {
      const data = await send({ ...message, state: flowState })
      setMessages((current) => [...current, ...toBotMessages(data.replies)])
      setOptions(data.options ?? [])
      setInput(data.input ?? null)
      setFlowState(data.state ?? null)
    } catch (err) {
      // El chat sigue usable: el visitante puede volver a elegir o escribir.
      setError(err)
    } finally {
      setStatus('ready')
    }
  }

  return {
    title,
    messages,
    options,
    input,
    status,
    error,
    chooseOption: (option) => reply({ optionId: option.id }, option.label),
    sendText: (text) => reply({ text }, text),
    retry: () => {
      setStatus('loading')
      setError(null)
      setAttempt((n) => n + 1)
    },
  }
}

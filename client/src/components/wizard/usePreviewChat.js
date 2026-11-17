// Lógica de la vista previa: arranca la conversación y manda lo que elige o
// escribe el "visitante". Usa los endpoints de vista previa, que no guardan nada.

import { useEffect, useState } from 'react'
import { sendPreviewMessage, startPreview } from '../../api/bots.js'

// reloadKey cambia cada vez que se guarda el formulario: el chat vuelve a empezar
// con los datos nuevos.
export function usePreviewChat(botId, reloadKey) {
  const [messages, setMessages] = useState([]) // [{ from: 'bot' | 'visitor', text }]
  const [options, setOptions] = useState([])
  const [input, setInput] = useState(null) // si no es null, el bot espera texto libre
  const [flowState, setFlowState] = useState(null) // "state" del backend, se devuelve tal cual
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'sending' | 'error'
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function start() {
      try {
        const data = await startPreview(botId)
        if (ignore) return
        setMessages(data.replies.map((text) => ({ from: 'bot', text })))
        setOptions(data.options)
        setInput(null)
        setFlowState(null)
        setStatus('ready')
      } catch (err) {
        if (ignore) return
        setError(err.message)
        setStatus('error')
      }
    }

    start()
    return () => {
      ignore = true
    }
  }, [botId, reloadKey])

  // message = { optionId } o { text }; visitorText = lo que se muestra en la burbuja.
  async function send(message, visitorText) {
    setMessages((current) => [...current, { from: 'visitor', text: visitorText }])
    setStatus('sending')
    try {
      const data = await sendPreviewMessage(botId, { ...message, state: flowState })
      setMessages((current) => [...current, ...data.replies.map((text) => ({ from: 'bot', text }))])
      setOptions(data.options)
      setInput(data.input)
      setFlowState(data.state)
      setStatus('ready')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  const chooseOption = (option) => send({ optionId: option.id }, option.label)
  const sendText = (text) => send({ text }, text)

  return { messages, options, input, status, error, chooseOption, sendText }
}

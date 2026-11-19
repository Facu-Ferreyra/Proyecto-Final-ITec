// Carga inicial del asistente: las plantillas y, si se está editando, el bot.

import { useEffect, useState } from 'react'
import { getBot, getTemplates } from '../../api/bots.js'

export function useWizardData(botId) {
  const [templates, setTemplates] = useState([])
  const [initialBot, setInitialBot] = useState(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  // "ignore" evita usar una respuesta vieja (patrón de la doc de React).
  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        // Los dos pedidos salen a la vez; si no hay botId, no se pide el bot.
        const [items, bot] = await Promise.all([getTemplates(), botId ? getBot(botId) : null])
        if (ignore) return
        setTemplates(items)
        setInitialBot(bot)
        setStatus('ready')
      } catch (err) {
        if (ignore) return
        setError(err.message)
        setStatus('error')
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [botId, reloadKey])

  function retry() {
    setStatus('loading')
    setReloadKey((key) => key + 1)
  }

  return { templates, initialBot, status, error, retry }
}

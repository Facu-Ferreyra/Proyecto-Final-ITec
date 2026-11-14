// Lógica de "Mis bots": cargar la lista y las acciones (eliminar, publicar,
// despublicar). La pantalla (MyBotsPage.jsx) solo se ocupa de mostrar.

import { useEffect, useState } from 'react'
import { deleteBot, listBots, publishBot, unpublishBot } from '../../api/bots.js'
import { errorText } from './errorText.js'

export function useMyBots() {
  const [bots, setBots] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [loadError, setLoadError] = useState('')
  const [reloadKey, setReloadKey] = useState(0) // cambia para volver a cargar
  const [busyId, setBusyId] = useState(null) // bot con una acción en curso
  const [notice, setNotice] = useState(null) // { type: 'error' | 'success', text }

  // Carga la lista. "ignore" evita usar una respuesta vieja si la pantalla se
  // cierra o se vuelve a cargar antes de que llegue (patrón de la doc de React).
  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        const items = await listBots()
        if (!ignore) {
          setBots(items)
          setStatus('ready')
        }
      } catch (error) {
        if (!ignore) {
          setLoadError(error.message)
          setStatus('error')
        }
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [reloadKey])

  function retry() {
    setStatus('loading')
    setReloadKey((key) => key + 1)
  }

  // Ejecuta una acción sobre un bot mostrando carga, error o confirmación.
  async function runAction(bot, action, successText) {
    setBusyId(bot.id)
    setNotice(null)
    try {
      await action()
      setNotice({ type: 'success', text: successText })
    } catch (error) {
      setNotice({ type: 'error', text: errorText(error) })
    } finally {
      setBusyId(null)
    }
  }

  function remove(bot) {
    const confirmed = window.confirm(
      `¿Eliminar "${bot.name}"? También se borran sus conversaciones y contactos. No se puede deshacer.`,
    )
    if (!confirmed) return
    return runAction(
      bot,
      async () => {
        await deleteBot(bot.id)
        setBots((current) => current.filter((b) => b.id !== bot.id))
      },
      `Eliminaste "${bot.name}".`,
    )
  }

  // Reemplaza el bot en la lista por la versión nueva que devuelve la API.
  const replaceBot = (updated) => setBots((current) => current.map((b) => (b.id === updated.id ? updated : b)))

  function publish(bot) {
    return runAction(bot, async () => replaceBot(await publishBot(bot.id)), `"${bot.name}" está publicado.`)
  }

  function unpublish(bot) {
    return runAction(
      bot,
      async () => replaceBot(await unpublishBot(bot.id)),
      `"${bot.name}" volvió a borrador. Su link ya no funciona.`,
    )
  }

  return { bots, status, loadError, retry, busyId, notice, remove, publish, unpublish }
}

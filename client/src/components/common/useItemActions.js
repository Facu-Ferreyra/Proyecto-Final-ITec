// Acciones sobre un elemento de una lista (activar, borrar, cambiar rol…):
// marca cuál está ocupado y deja un aviso de éxito o de error para mostrar.

import { useState } from 'react'

export function useItemActions() {
  const [busyId, setBusyId] = useState(null)
  const [notice, setNotice] = useState(null) // { type: 'error' | 'success', text }

  async function run(id, action, successText) {
    setBusyId(id)
    setNotice(null)
    try {
      await action()
      setNotice({ type: 'success', text: successText })
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setBusyId(null)
    }
  }

  return { busyId, notice, run }
}

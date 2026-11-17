// Carga datos de la API con sus estados: 'loading' | 'ready' | 'error'.
// load tiene que venir de useCallback: cuando cambia (otra página, otro bot),
// se vuelve a cargar. "ignore" evita usar una respuesta vieja (patrón de la doc de React).

import { useEffect, useState } from 'react'

export function useApiData(load) {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0) // sube con "Reintentar"

  useEffect(() => {
    let ignore = false
    load()
      .then((result) => {
        if (ignore) return
        setData(result)
        setError(null)
        setStatus('ready')
      })
      .catch((err) => {
        if (ignore) return
        setError(err)
        setStatus('error')
      })
    return () => {
      ignore = true
    }
  }, [load, attempt])

  function retry() {
    setStatus('loading')
    setAttempt((n) => n + 1)
  }

  // setData: para actualizar un elemento sin volver a pedir todo (ej.: cambiar un estado).
  return { data, setData, status, error, retry }
}

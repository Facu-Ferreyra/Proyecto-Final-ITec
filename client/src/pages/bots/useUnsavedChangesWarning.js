// Si hay cambios sin guardar, el navegador pregunta antes de cerrar o recargar
// la pestaña. El texto del aviso lo pone el navegador (no se puede cambiar).

import { useEffect } from 'react'

export function useUnsavedChangesWarning(hasUnsavedChanges) {
  useEffect(() => {
    if (!hasUnsavedChanges) return

    function handleBeforeUnload(event) {
      event.preventDefault() // pide al navegador que muestre el aviso
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    // Limpieza: cuando se guarda (o se sale del asistente) se deja de avisar.
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])
}

// Avisa una vez cuando el elemento entra en pantalla (para arrancar un gesto de
// movimiento, como trazar las líneas de los pasos o girar sus números).
// Separado de los componentes para que la recarga en caliente de Vite funcione.

import { useEffect, useRef, useState } from 'react'

export default function useSeenOnce(threshold = 0.3) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, seen]
}

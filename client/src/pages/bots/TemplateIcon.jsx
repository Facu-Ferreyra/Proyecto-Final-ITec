// Ícono de cada plantilla para la tarjeta de "Mis bots" (SVG, sin librerías).
// Decorativo: el nombre de la plantilla ya aparece escrito en la tarjeta.

const PATHS = {
  // Globo de chat: preguntas frecuentes
  faq: (
    <>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5M12 16.5h.01" />
    </>
  ),
  // Calendario: turnos
  turnos: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4M8 14h2M14 14h2M8 17h2" />
    </>
  ),
  // Bolsa: pedidos
  pedidos: (
    <>
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
}

// Tacho de basura para el botón "Eliminar" de la tarjeta.
export function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
    </svg>
  )
}

export default function TemplateIcon({ templateKey }) {
  return (
    <span className="bot-card-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
        {PATHS[templateKey] ?? PATHS.faq}
      </svg>
    </span>
  )
}

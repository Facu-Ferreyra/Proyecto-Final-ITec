// Aviso de éxito o de error después de una acción. Usa .notice de pages/bots/theme.css.
// role="alert" anuncia los errores enseguida; role="status", lo demás sin interrumpir.

export default function Notice({ notice }) {
  if (!notice) return null
  return (
    <p className={`notice notice-${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>
      {notice.text}
    </p>
  )
}

// Bloque para los estados de una pantalla: carga, vacío o error.
// Así nunca queda una pantalla en blanco.

export default function PageState({ title, text, actionLabel, onAction, isError = false }) {
  return (
    // role="alert" hace que un lector de pantalla anuncie el error enseguida;
    // role="status" anuncia los demás estados sin interrumpir.
    <div className="page-state" role={isError ? 'alert' : 'status'}>
      <h2 className="page-state-title">{title}</h2>
      {text && <p className="page-state-text">{text}</p>}
      {actionLabel && (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}

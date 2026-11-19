// Bloque para los estados de una pantalla: carga, vacío o error.
// Así nunca queda una pantalla en blanco.

// illustration: imagen decorativa opcional (ej. el estado vacío de "Mis bots").
export default function PageState({ title, text, actionLabel, onAction, isError = false, isLoading = false, illustration }) {
  return (
    // role="alert" hace que un lector de pantalla anuncie el error enseguida;
    // role="status" anuncia los demás estados sin interrumpir.
    <div className="page-state" role={isError ? 'alert' : 'status'}>
      {illustration && <img className="page-state-art" src={illustration} alt="" width="480" height="360" />}
      {isLoading && <span className="eb-spinner" aria-hidden="true" />}
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

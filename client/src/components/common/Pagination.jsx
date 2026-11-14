// "Anterior / Página X de Y / Siguiente" para las listas paginadas de la API
// ({ page, totalPages }). No se muestra si hay una sola página.

import './common.css'

export default function Pagination({ page, totalPages, onChange, disabled = false }) {
  if (!totalPages || totalPages <= 1) return null

  return (
    <nav className="pagination" aria-label="Páginas">
      <button type="button" className="btn btn-secondary btn-small" disabled={disabled || page <= 1} onClick={() => onChange(page - 1)}>
        Anterior
      </button>
      <span>
        Página {page} de {totalPages}
      </span>
      <button
        type="button"
        className="btn btn-secondary btn-small"
        disabled={disabled || page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Siguiente
      </button>
    </nav>
  )
}

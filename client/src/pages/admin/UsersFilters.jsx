// Barra de búsqueda y filtro por estado de Admin → Usuarios.

import { useId } from 'react'
import { STATUS_FILTERS } from './usersFilter.js'

export default function UsersFilters({ query, status, counts, onQueryChange, onStatusChange }) {
  const searchId = useId()
  const statusId = useId()

  return (
    <div className="users-filters" role="search">
      <label className="users-search" htmlFor={searchId}>
        <span className="visually-hidden">Buscar usuarios</span>
        <input
          id={searchId}
          type="search"
          placeholder="Buscar por nombre o email"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>
      <label className="inline-select" htmlFor={statusId}>
        Estado
        <select id={statusId} value={status} onChange={(event) => onStatusChange(event.target.value)}>
          {STATUS_FILTERS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} ({counts[option.value]})
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

// Búsqueda y filtros de Admin → Usuarios (en el navegador: la lista ya está cargada).

// "José Pérez" → "jose perez": la búsqueda no distingue mayúsculas ni tildes.
const normalize = (text = '') =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

export const STATUS_FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 'active', label: 'Activas' },
  { value: 'inactive', label: 'Desactivadas' },
]

const matchesStatus = (user, status) =>
  status === 'all' || (status === 'active' ? user.isActive : !user.isActive)

// users filtrados por texto (nombre o email) y por estado.
export function filterUsers(users, { query, status }) {
  const search = normalize(query)
  return users.filter(
    (user) => matchesStatus(user, status) && (!search || normalize(`${user.name} ${user.email}`).includes(search)),
  )
}

// Cantidad de cuentas por estado, para mostrar en el filtro: { all: 3, active: 2, inactive: 1 }.
export function countByStatus(users) {
  const active = users.filter((user) => user.isActive).length
  return { all: users.length, active, inactive: users.length - active }
}

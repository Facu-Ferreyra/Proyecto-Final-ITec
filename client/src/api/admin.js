// Funciones de administración (solo rol ADMIN; el backend responde 403 a los demás).
// Plantillas: docs/endpoints.md (Santiago). Usuarios: /api/admin/users (Brandon).

import { request } from './http.js'

export { ApiError } from './http.js'

// ---- Plantillas ----

// Todas, también las inactivas, con isActive y botCount.
export async function listAdminTemplates() {
  const data = await request('/admin/templates')
  return data.items
}

// changes = { isActive } (también acepta name, description o config).
export function updateTemplate(id, changes) {
  return request(`/admin/templates/${id}`, { method: 'PUT', body: changes })
}

// 409 TEMPLATE_IN_USE si hay bots que la usan: en ese caso, desactivarla.
export function deleteTemplate(id) {
  return request(`/admin/templates/${id}`, { method: 'DELETE' })
}

// ---- Usuarios ----

// [{ id, email, name, role, isActive, createdAt, botsCount }]
export async function listUsers() {
  const data = await request('/admin/users')
  return data.items
}

// changes = { role } y/o { isActive }. 403 CANNOT_MODIFY_SELF si es la propia cuenta.
export async function updateUser(id, changes) {
  const data = await request(`/admin/users/${id}`, { method: 'PATCH', body: changes })
  return data.user
}

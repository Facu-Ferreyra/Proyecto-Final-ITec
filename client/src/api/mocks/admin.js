// Administración simulada: plantillas y usuarios. Devuelve null si la ruta no es de admin.
// El usuario de ejemplo logueado es "demo" (ver api/auth.js): no se puede modificar a sí mismo.

import { bots } from './botsData.js'
import { fail, ok } from './helpers.js'
import { templates } from './templates.js'

const inactive = new Set() // ids de plantillas desactivadas

const users = [
  { id: 'demo', email: 'demo@easybot.com', name: 'Usuario demo', role: 'ADMIN', isActive: true, createdAt: '2026-11-01T12:00:00.000Z' },
  { id: 'user-2', email: 'lola@peluqueria.com', name: 'Lola Fernández', role: 'USER', isActive: true, createdAt: '2026-11-05T15:30:00.000Z' },
  { id: 'user-3', email: 'pepe@viandas.com', name: 'José Pérez', role: 'USER', isActive: false, createdAt: '2026-11-08T10:15:00.000Z' },
]

function toAdminTemplate(template) {
  const { id, key, name, description, config } = template
  const botCount = bots.filter((b) => b.templateId === id).length
  return { id, key, name, description, config, isActive: !inactive.has(id), botCount }
}

const toAdminUser = (user) => ({ ...user, botsCount: user.id === 'demo' ? bots.length : 0 })

function handleTemplate(id, method, body) {
  const template = templates.find((t) => t.id === id)
  if (!template) return fail(404, 'TEMPLATE_NOT_FOUND', 'La plantilla no existe')
  if (method === 'PUT') {
    if (body?.isActive === false) inactive.add(id)
    if (body?.isActive === true) inactive.delete(id)
    return ok(toAdminTemplate(template))
  }
  if (method === 'DELETE') {
    if (bots.some((b) => b.templateId === id)) {
      return fail(409, 'TEMPLATE_IN_USE', 'Hay bots que usan esta plantilla. Podés desactivarla en lugar de borrarla.')
    }
    templates.splice(templates.indexOf(template), 1)
    return ok(null, 204)
  }
  return fail(404, 'NOT_FOUND', 'No encontramos lo que buscás')
}

function handleUser(id, body) {
  if (id === 'demo') return fail(403, 'CANNOT_MODIFY_SELF', 'No podés cambiar tu propio rol ni desactivar tu propia cuenta')
  const user = users.find((u) => u.id === id)
  if (!user) return fail(404, 'USER_NOT_FOUND', 'El usuario no existe')
  if (body?.role) user.role = body.role
  if (typeof body?.isActive === 'boolean') user.isActive = body.isActive
  return ok({ user: toAdminUser(user) })
}

export function handleAdmin(path, method, body) {
  if (path === '/admin/templates' && method === 'GET') return ok({ items: templates.map(toAdminTemplate) })
  if (path === '/admin/users' && method === 'GET') return ok({ items: users.map(toAdminUser) })

  const template = path.match(/^\/admin\/templates\/([^/]+)$/)
  if (template) return handleTemplate(template[1], method, body)

  const user = path.match(/^\/admin\/users\/([^/]+)$/)
  if (user && method === 'PATCH') return handleUser(user[1], body)

  return null
}

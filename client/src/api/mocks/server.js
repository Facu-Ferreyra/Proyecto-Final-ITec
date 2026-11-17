// Servidor de ejemplo (mock). Se usa solo con VITE_USE_MOCKS=true, mientras no
// está el login. Imita al backend real: recibe la misma ruta y devuelve
// { status, data } con la forma que documenta docs/endpoints.md.
// Cuando la API real esté lista, se puede borrar la carpeta mocks/ entera
// (y su import en http.js).

import { bots } from './botsData.js'
import { fail, makeSlug, missingFieldsOf, nameError, ok, toBotResponse, wait } from './helpers.js'
import { previewMessage, previewStart } from './preview.js'
import { handleAdmin } from './admin.js'
import { handlePanel } from './panel.js'
import { handlePublic } from './publicChat.js'
import { findTemplate, templates } from './templates.js'

let nextId = bots.length + 1

// GET /templates, GET /bots y POST /bots
function handleCollection(path, method, body) {
  if (path === '/templates' && method === 'GET') {
    return ok({ items: templates })
  }

  if (path === '/bots' && method === 'GET') {
    const sorted = [...bots].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    return ok({ items: sorted.map(toBotResponse) })
  }

  if (path === '/bots' && method === 'POST') {
    const error = nameError(body?.name)
    if (error) return error
    if (!findTemplate(body?.templateId)) {
      return fail(400, 'TEMPLATE_NOT_FOUND', 'La plantilla no existe')
    }
    const now = new Date().toISOString()
    const bot = {
      id: `bot-${nextId++}`,
      name: body.name.trim(),
      slug: makeSlug(body.name),
      status: 'DRAFT',
      publishedAt: null,
      templateId: body.templateId,
      config: body.config ?? {},
      createdAt: now,
      updatedAt: now,
    }
    bots.push(bot)
    return ok(toBotResponse(bot), 201)
  }

  return null // no es una de estas rutas
}

// PUT /bots/:id
function updateBot(bot, body) {
  if (body?.name !== undefined) {
    const error = nameError(body.name)
    if (error) return error
  }
  const newConfig = body?.config ?? bot.config
  // Igual que el backend: un bot publicado no puede quedar incompleto.
  const missing = missingFieldsOf(bot.templateId, newConfig)
  if (bot.status === 'PUBLISHED' && missing.length > 0) {
    return fail(422, 'BOT_INCOMPLETE', 'Faltan datos obligatorios para que el bot siga publicado', missing)
  }
  if (body?.name !== undefined) bot.name = body.name.trim()
  bot.config = newConfig
  bot.updatedAt = new Date().toISOString()
  return ok(toBotResponse(bot))
}

// POST /bots/:id/publish
function publishBot(bot) {
  const missing = missingFieldsOf(bot.templateId, bot.config)
  if (missing.length > 0) {
    return fail(422, 'BOT_INCOMPLETE', 'Faltan datos obligatorios para publicar el bot', missing)
  }
  bot.status = 'PUBLISHED'
  bot.publishedAt = new Date().toISOString()
  bot.updatedAt = bot.publishedAt
  return ok(toBotResponse(bot))
}

// Rutas de un bot puntual: /bots/:id, /bots/:id/publish, etc.
function handleBot(path, method, body) {
  const match = path.match(/^\/bots\/([^/]+)(\/.*)?$/)
  if (!match) return fail(404, 'NOT_FOUND', 'No encontramos lo que buscás')

  const bot = bots.find((b) => b.id === match[1])
  if (!bot) return fail(404, 'BOT_NOT_FOUND', 'No encontramos el bot')

  const action = `${method} ${match[2] ?? ''}` // ej.: "POST /publish"

  switch (action) {
    case 'GET ':
      return ok(toBotResponse(bot))
    case 'PUT ':
      return updateBot(bot, body)
    case 'DELETE ':
      bots.splice(bots.indexOf(bot), 1) // lo saca del arreglo
      return ok(null, 204)
    case 'POST /publish':
      return publishBot(bot)
    case 'POST /unpublish':
      bot.status = 'DRAFT'
      bot.updatedAt = new Date().toISOString()
      return ok(toBotResponse(bot))
    case 'GET /preview':
      return previewStart(bot)
    case 'POST /preview/messages':
      return previewMessage(bot, body)
    default:
      return fail(404, 'NOT_FOUND', 'No encontramos lo que buscás')
  }
}

export async function mockServer(path, { method = 'GET', body } = {}) {
  await wait(400)
  return (
    handlePublic(path, method, body) ??
    handlePanel(path, method, body) ??
    handleAdmin(path, method, body) ??
    handleCollection(path, method, body) ??
    handleBot(path, method, body)
  )
}

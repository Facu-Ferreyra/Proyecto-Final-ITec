// Chat público simulado: GET /public/bots/:slug y POST /public/bots/:slug/messages.
// Reutiliza la vista previa de ejemplo y agrega lo que devuelve el endpoint real
// (visitorId y conversationId). Solo responde bots publicados, igual que el backend.

import { bots } from './botsData.js'
import { fail, ok } from './helpers.js'
import { previewMessage, previewStart } from './preview.js'
import { findTemplate } from './templates.js'

let lastConversation = 0

// Devuelve null si la ruta no es del chat público.
export function handlePublic(path, method, body) {
  const match = path.match(/^\/public\/bots\/([^/]+)(\/messages)?$/)
  if (!match) return null

  const slug = decodeURIComponent(match[1])
  const bot = bots.find((b) => b.slug === slug && b.status === 'PUBLISHED')
  if (!bot) return fail(404, 'BOT_NOT_FOUND', 'No encontramos el bot')

  if (method === 'GET' && !match[2]) {
    const { data } = previewStart(bot)
    return ok({ slug: bot.slug, templateKey: findTemplate(bot.templateId).key, ...data })
  }

  if (method === 'POST' && match[2]) {
    const { data } = previewMessage(bot, body)
    return ok({
      replies: data.replies,
      options: data.options,
      input: data.input,
      state: data.state,
      visitorId: body?.visitorId ?? `visitor-${Date.now()}`,
      conversationId: body?.conversationId ?? `conv-${++lastConversation}`,
      lead: null,
    })
  }

  return fail(404, 'NOT_FOUND', 'No encontramos lo que buscás')
}

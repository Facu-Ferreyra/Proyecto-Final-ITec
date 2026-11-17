// Funciones para el chat público (sin login, solo bots publicados).
// Ver "Chat público" en docs/endpoints.md.

import { request } from './http.js'

export { ApiError } from './http.js'

// Saludo y menú del bot: { slug, title, templateKey, replies, options }.
// 404 BOT_NOT_FOUND si no existe o no está publicado.
export function getPublicBot(slug) {
  return request(`/public/bots/${encodeURIComponent(slug)}`)
}

// message = { optionId } o { text }, más visitorId, conversationId y state.
// Devuelve { visitorId, conversationId, replies, options, input, state, lead }.
export function sendPublicMessage(slug, message) {
  return request(`/public/bots/${encodeURIComponent(slug)}/messages`, { method: 'POST', body: message })
}

// Funciones para hablar con la API de bots y plantillas (ver docs/endpoints.md).
// Las pantallas solo usan estas funciones: no llaman a fetch directamente.

import { request } from './http.js'

export { ApiError } from './http.js'

// ---- Plantillas ----

export async function getTemplates() {
  const data = await request('/templates')
  return data.items
}

// ---- Bots ----

export async function listBots() {
  const data = await request('/bots')
  return data.items
}

export function getBot(id) {
  return request(`/bots/${id}`)
}

// { templateId, name, config } → el bot creado (como borrador)
export function createBot(bot) {
  return request('/bots', { method: 'POST', body: bot })
}

// changes = { name }, { config } o ambos. Ojo: config REEMPLAZA la anterior completa.
export function updateBot(id, changes) {
  return request(`/bots/${id}`, { method: 'PUT', body: changes })
}

export function deleteBot(id) {
  return request(`/bots/${id}`, { method: 'DELETE' })
}

export function publishBot(id) {
  return request(`/bots/${id}/publish`, { method: 'POST' })
}

export function unpublishBot(id) {
  return request(`/bots/${id}/unpublish`, { method: 'POST' })
}

// ---- Vista previa (funciona con borradores y no guarda nada) ----

export function startPreview(id) {
  return request(`/bots/${id}/preview`)
}

// message = { optionId } o { text }, más el state que devolvió la respuesta anterior.
export function sendPreviewMessage(id, message) {
  return request(`/bots/${id}/preview/messages`, { method: 'POST', body: message })
}

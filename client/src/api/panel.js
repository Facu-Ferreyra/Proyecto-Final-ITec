// Funciones del panel del dueño: conversaciones y leads (contactos, turnos y
// pedidos) de sus bots. Ver "Panel" en docs/endpoints.md.
// Las listas son paginadas: { items, page, limit, total, totalPages }.

import { request } from './http.js'

export { ApiError } from './http.js'

// Arma "?page=1&type=ORDER" sacando los filtros vacíos.
function toQuery(params) {
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  return entries.length ? `?${new URLSearchParams(entries)}` : ''
}

export function listConversations(botId, { page = 1 } = {}) {
  return request(`/bots/${botId}/conversations${toQuery({ page })}`)
}

// { conversation: { id, bot, leads, … }, items: [{ sender, content, createdAt }] }
export function getConversationMessages(conversationId) {
  return request(`/conversations/${conversationId}/messages`)
}

// type: 'CONTACT' | 'APPOINTMENT' | 'ORDER'; status: opcional (filtro).
export function listLeads(botId, { type, status, page = 1 } = {}) {
  return request(`/bots/${botId}/leads${toQuery({ type, status, page })}`)
}

// Devuelve el lead actualizado. 400 INVALID_STATUS si el estado no corresponde al tipo.
export function updateLeadStatus(leadId, status) {
  return request(`/leads/${leadId}`, { method: 'PATCH', body: { status } })
}

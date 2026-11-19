// Panel simulado: conversaciones, mensajes y leads, con paginación y filtros
// como el backend real. Devuelve null si la ruta no es del panel.

import { bots } from './botsData.js'
import { fail, ok } from './helpers.js'
import { conversations, leads } from './panelData.js'

const LEAD_STATUSES = {
  CONTACT: ['NEW', 'CONTACTED'],
  APPOINTMENT: ['PENDING', 'CONFIRMED', 'CANCELLED'],
  ORDER: ['NEW', 'IN_PROGRESS', 'DELIVERED', 'CANCELLED'],
}

const newestFirst = (key) => (a, b) => b[key].localeCompare(a[key])

function paginate(items, query) {
  const page = Math.max(1, Number(query.get('page')) || 1)
  const limit = Math.min(100, Number(query.get('limit')) || 20)
  const totalPages = Math.max(1, Math.ceil(items.length / limit))
  return { items: items.slice((page - 1) * limit, page * limit), page, limit, total: items.length, totalPages }
}

function toSummary({ messages, ...conversation }) {
  const [sender, content] = messages.at(-1)
  return { ...conversation, messageCount: messages.length, lastMessage: { sender, content, createdAt: conversation.updatedAt } }
}

// GET /bots/:id/conversations y GET /bots/:id/leads
function listForBot(botId, list, query) {
  if (!bots.some((b) => b.id === botId)) return fail(404, 'BOT_NOT_FOUND', 'No encontramos el bot')
  if (list === 'conversations') {
    const items = conversations.filter((c) => c.botId === botId).sort(newestFirst('updatedAt')).map(toSummary)
    return ok(paginate(items, query))
  }
  const type = query.get('type')
  const status = query.get('status')
  const items = leads
    .filter((l) => l.botId === botId && (!type || l.type === type) && (!status || l.status === status))
    .sort(newestFirst('createdAt'))
  return ok(paginate(items, query))
}

// GET /conversations/:id/messages
function conversationMessages(id) {
  const conversation = conversations.find((c) => c.id === id)
  if (!conversation) return fail(404, 'CONVERSATION_NOT_FOUND', 'No encontramos la conversación')
  const { messages, botId, ...rest } = conversation
  const bot = bots.find((b) => b.id === botId)
  return ok({
    conversation: { ...rest, bot: { id: bot.id, name: bot.name }, leads: leads.filter((l) => l.conversationId === id) },
    items: messages.map(([sender, content], index) => ({ id: `${id}-${index}`, sender, content, createdAt: rest.createdAt })),
  })
}

// PATCH /leads/:id
function updateLead(id, body) {
  const lead = leads.find((l) => l.id === id)
  if (!lead) return fail(404, 'LEAD_NOT_FOUND', 'No encontramos el registro')
  if (!LEAD_STATUSES[lead.type].includes(body?.status)) {
    return fail(400, 'INVALID_STATUS', 'Ese estado no corresponde a este tipo de registro')
  }
  lead.status = body.status
  return ok(lead)
}

export function handlePanel(fullPath, method, body) {
  const [path, queryString = ''] = fullPath.split('?')
  const query = new URLSearchParams(queryString)

  const botList = path.match(/^\/bots\/([^/]+)\/(conversations|leads)$/)
  if (botList && method === 'GET') return listForBot(botList[1], botList[2], query)

  const messages = path.match(/^\/conversations\/([^/]+)\/messages$/)
  if (messages && method === 'GET') return conversationMessages(messages[1])

  const lead = path.match(/^\/leads\/([^/]+)$/)
  if (lead && method === 'PATCH') return updateLead(lead[1], body)

  return null
}

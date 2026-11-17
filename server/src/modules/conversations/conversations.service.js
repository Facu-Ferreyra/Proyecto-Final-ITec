import { prisma } from '../../db/prisma.js';
import { badRequest, notFound } from '../../utils/httpError.js';
import { LEAD_STATUSES } from '../../engine/index.js';
import { findOwnedBot } from '../bots/bots.service.js';

// Panel del dueño. Igual que en bots: todo se filtra por el dueño del bot.

const pageInfo = (page, limit, total) => ({ page, limit, total, totalPages: Math.ceil(total / limit) });

function toLeadResponse(lead) {
  const { status, ...data } = lead.data ?? {};
  return {
    id: lead.id,
    botId: lead.botId,
    conversationId: lead.conversationId,
    type: lead.type,
    status: status ?? null,
    contactName: lead.contactName,
    contactPhone: lead.contactPhone,
    data,
    createdAt: lead.createdAt,
  };
}

export async function listConversations(ownerId, botId, { page, limit }) {
  await findOwnedBot(ownerId, botId);
  const where = { botId };
  const [total, conversations] = await Promise.all([
    prisma.conversation.count({ where }),
    prisma.conversation.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: { select: { messages: true } },
        messages: { orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: 1 },
        leads: { orderBy: { createdAt: 'asc' }, select: { type: true, contactName: true } },
      },
    }),
  ]);

  const items = conversations.map((c) => ({
    id: c.id,
    visitorId: c.visitorId,
    // Nombre del visitante si dejó sus datos en algún flujo; si no, null ("Visitante").
    contactName: c.leads[0]?.contactName ?? null,
    leadTypes: [...new Set(c.leads.map((l) => l.type))],
    messageCount: c._count.messages,
    lastMessage: c.messages[0]
      ? { sender: c.messages[0].sender, content: c.messages[0].content, createdAt: c.messages[0].createdAt }
      : null,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));
  return { items, ...pageInfo(page, limit, total) };
}

export async function getConversationMessages(ownerId, conversationId) {
  // El filtro bot.ownerId hace que una conversación de otro dueño dé 404.
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, bot: { ownerId } },
    include: {
      bot: { select: { id: true, name: true } },
      messages: {
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        select: { id: true, sender: true, content: true, createdAt: true },
      },
      leads: { orderBy: { createdAt: 'asc' } },
    },
  });
  if (!conversation) throw notFound('CONVERSATION_NOT_FOUND', 'La conversación no existe');

  return {
    conversation: {
      id: conversation.id,
      bot: conversation.bot,
      visitorId: conversation.visitorId,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      leads: conversation.leads.map(toLeadResponse),
    },
    items: conversation.messages,
  };
}

export async function listLeads(ownerId, botId, { page, limit, type, status }) {
  await findOwnedBot(ownerId, botId);
  const where = { botId };
  if (type) where.type = type;
  if (status) where.data = { path: ['status'], equals: status };

  const [total, leads] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);
  return { items: leads.map(toLeadResponse), ...pageInfo(page, limit, total) };
}

export async function updateLeadStatus(ownerId, leadId, status) {
  const lead = await prisma.lead.findFirst({ where: { id: leadId, bot: { ownerId } } });
  if (!lead) throw notFound('LEAD_NOT_FOUND', 'El contacto, turno o pedido no existe');

  const allowed = LEAD_STATUSES[lead.type];
  if (!allowed.includes(status)) {
    throw badRequest('INVALID_STATUS', `Estado inválido para ${lead.type}. Valores posibles: ${allowed.join(', ')}`);
  }
  const updated = await prisma.lead.update({
    where: { id: lead.id },
    data: { data: { ...lead.data, status } },
  });
  return toLeadResponse(updated);
}

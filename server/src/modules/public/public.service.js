import { randomUUID } from 'node:crypto';
import { prisma } from '../../db/prisma.js';
import { notFound } from '../../utils/httpError.js';
import { handleMessage, startChat } from '../../engine/index.js';

// Chat público: cualquiera puede usarlo, pero solo con bots PUBLICADOS.

async function findPublishedBot(slug) {
  const bot = await prisma.bot.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: { template: { select: { key: true, config: true } } },
  });
  if (!bot) throw notFound('BOT_NOT_FOUND', 'Este bot no existe o no está publicado');
  return bot;
}

/** GET /api/public/bots/:slug → saludo y menú. No expone ids internos ni el dueño. */
export async function getPublicBot(slug) {
  const bot = await findPublishedBot(slug);
  const chat = startChat(bot.template, bot.config);
  return {
    slug: bot.slug,
    title: chat.title ?? bot.name,
    templateKey: bot.template.key,
    replies: chat.replies,
    options: chat.options,
  };
}

/** POST /api/public/bots/:slug/messages → respuesta del bot. Guarda conversación, mensajes y lead. */
export async function sendPublicMessage(slug, body) {
  const bot = await findPublishedBot(slug);
  const result = handleMessage({
    template: bot.template,
    config: bot.config,
    state: body.state,
    optionId: body.optionId,
    text: body.text,
  });
  const visitorId = body.visitorId ?? randomUUID();

  const saved = await prisma.$transaction(async (tx) => {
    // Se reutiliza la conversación solo si es de este bot y de este visitante.
    // Si no coincide (o no mandó id), se empieza una nueva.
    let conversation = body.conversationId
      ? await tx.conversation.findFirst({ where: { id: body.conversationId, botId: bot.id, visitorId } })
      : null;

    // Los mensajes se guardan con 1 ms de diferencia para que el orden sea exacto.
    const base = Date.now();
    const messages = [];
    if (!conversation) {
      conversation = await tx.conversation.create({ data: { botId: bot.id, visitorId } });
      // El saludo inicial también queda en el historial que ve el dueño.
      for (const reply of startChat(bot.template, bot.config).replies) {
        messages.push({ sender: 'BOT', content: reply });
      }
    }
    messages.push({ sender: 'VISITOR', content: result.visitorMessage });
    for (const reply of result.replies) messages.push({ sender: 'BOT', content: reply });

    await tx.message.createMany({
      data: messages.map((m, i) => ({ ...m, conversationId: conversation.id, createdAt: new Date(base + i) })),
    });

    let lead = null;
    if (result.lead) {
      lead = await tx.lead.create({
        data: { ...result.lead, botId: bot.id, conversationId: conversation.id },
        select: { id: true, type: true },
      });
    }

    await tx.conversation.update({ where: { id: conversation.id }, data: { updatedAt: new Date() } });
    return { conversationId: conversation.id, lead };
  });

  return {
    visitorId,
    conversationId: saved.conversationId,
    replies: result.replies,
    options: result.options,
    input: result.input,
    state: result.state,
    lead: saved.lead,
  };
}

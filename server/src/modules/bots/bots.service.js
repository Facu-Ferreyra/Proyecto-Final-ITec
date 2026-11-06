import { prisma } from '../../db/prisma.js';
import { badRequest, notFound, unprocessable } from '../../utils/httpError.js';
import { buildConfigSchema, getMissingFields, handleMessage, startChat } from '../../engine/index.js';
import { generateSlug } from './slug.js';

// Regla de oro de este módulo: TODA consulta de bots filtra por ownerId.
// Si el bot existe pero es de otro usuario, respondemos 404 (igual que si no
// existiera) para no revelar qué ids existen.

const botInclude = {
  template: { select: { id: true, key: true, name: true, config: true } },
  _count: { select: { conversations: true, leads: true } },
};

const botNotFound = () => notFound('BOT_NOT_FOUND', 'El bot no existe');

export const publicPathFor = (slug) => `/chat/${slug}`;

function toBotResponse(bot) {
  const missingFields = getMissingFields(bot.template.config, bot.config);
  return {
    id: bot.id,
    name: bot.name,
    slug: bot.slug,
    status: bot.status,
    publishedAt: bot.publishedAt,
    publicPath: publicPathFor(bot.slug),
    template: { id: bot.template.id, key: bot.template.key, name: bot.template.name },
    config: bot.config,
    missingFields,
    canPublish: missingFields.length === 0,
    stats: { conversations: bot._count.conversations, leads: bot._count.leads },
    createdAt: bot.createdAt,
    updatedAt: bot.updatedAt,
  };
}

/**
 * Busca un bot del usuario. Si no existe o es de otro, tira 404.
 * La usan también los endpoints del panel (conversaciones y leads).
 */
export async function findOwnedBot(ownerId, botId) {
  const bot = await prisma.bot.findFirst({ where: { id: botId, ownerId }, include: botInclude });
  if (!bot) throw botNotFound();
  return bot;
}

// Valida config contra los campos de la plantilla. Los datos desconocidos se descartan.
function parseConfig(template, config) {
  return buildConfigSchema(template.config).parse(config);
}

// Zod pone el error de config en "path: services.0.name"; le agregamos "config."
// para que el frontend sepa que es un campo del formulario del negocio.
function withConfigPath(fn) {
  try {
    return fn();
  } catch (err) {
    if (err?.issues) err.issues.forEach((issue) => issue.path.unshift('config'));
    throw err;
  }
}

export async function listBots(ownerId) {
  const bots = await prisma.bot.findMany({
    where: { ownerId },
    orderBy: { updatedAt: 'desc' },
    include: botInclude,
  });
  return bots.map(toBotResponse);
}

export async function getBot(ownerId, botId) {
  return toBotResponse(await findOwnedBot(ownerId, botId));
}

export async function createBot(ownerId, { templateId, name, config }) {
  const template = await prisma.template.findFirst({ where: { id: templateId, isActive: true } });
  if (!template) throw badRequest('TEMPLATE_NOT_FOUND', 'La plantilla elegida no existe o no está disponible');

  const parsedConfig = withConfigPath(() => parseConfig(template, config));

  // El slug es único en la base. Si justo se repite (casi imposible), se reintenta.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const bot = await prisma.bot.create({
        data: { ownerId, templateId, name, slug: generateSlug(name), config: parsedConfig },
        include: botInclude,
      });
      return toBotResponse(bot);
    } catch (err) {
      if (err.code !== 'P2002') throw err;
    }
  }
  throw new Error('No se pudo generar un slug único');
}

export async function updateBot(ownerId, botId, { name, config }) {
  const bot = await findOwnedBot(ownerId, botId);
  const data = {};
  if (name !== undefined) data.name = name;
  if (config !== undefined) {
    data.config = withConfigPath(() => parseConfig(bot.template, config));
    // Un bot publicado no puede quedar con datos obligatorios vacíos.
    const missing = getMissingFields(bot.template.config, data.config);
    if (bot.status === 'PUBLISHED' && missing.length > 0) {
      throw unprocessable('BOT_INCOMPLETE', 'Un bot publicado no puede quedar con campos obligatorios vacíos', missing);
    }
  }
  const updated = await prisma.bot.update({ where: { id: bot.id }, data, include: botInclude });
  return toBotResponse(updated);
}

export async function deleteBot(ownerId, botId) {
  const bot = await findOwnedBot(ownerId, botId);
  // Borra en cascada sus conversaciones, mensajes y leads (ver schema.prisma).
  await prisma.bot.delete({ where: { id: bot.id } });
}

export async function publishBot(ownerId, botId) {
  const bot = await findOwnedBot(ownerId, botId);
  const missing = getMissingFields(bot.template.config, bot.config);
  if (missing.length > 0) {
    throw unprocessable('BOT_INCOMPLETE', 'Faltan completar datos obligatorios para publicar el bot', missing);
  }
  const updated = await prisma.bot.update({
    where: { id: bot.id },
    data: { status: 'PUBLISHED', publishedAt: bot.publishedAt ?? new Date() },
    include: botInclude,
  });
  return toBotResponse(updated);
}

export async function unpublishBot(ownerId, botId) {
  const bot = await findOwnedBot(ownerId, botId);
  const updated = await prisma.bot.update({ where: { id: bot.id }, data: { status: 'DRAFT' }, include: botInclude });
  return toBotResponse(updated);
}

// ── Vista previa: el mismo motor, pero sin guardar nada y aunque sea borrador ──

export async function previewStart(ownerId, botId) {
  const bot = await findOwnedBot(ownerId, botId);
  return startChat(bot.template, bot.config);
}

export async function previewMessage(ownerId, botId, message) {
  const bot = await findOwnedBot(ownerId, botId);
  const result = handleMessage({ template: bot.template, config: bot.config, ...message });
  const { lead, ...rest } = result;
  // En la vista previa el lead no se guarda: se devuelve para que el dueño vea qué llegaría.
  return { ...rest, leadPreview: lead };
}

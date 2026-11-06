import { prisma } from '../../db/prisma.js';
import { conflict, notFound } from '../../utils/httpError.js';

const templateNotFound = () => notFound('TEMPLATE_NOT_FOUND', 'La plantilla no existe');

const fullSelect = {
  id: true,
  key: true,
  name: true,
  description: true,
  config: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

// ── Usuario y admin ──────────────────────────────────────────────────────────

export function listActiveTemplates() {
  return prisma.template.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
    select: { id: true, key: true, name: true, description: true, config: true },
  });
}

export async function getActiveTemplate(id) {
  const template = await prisma.template.findFirst({
    where: { id, isActive: true },
    select: { id: true, key: true, name: true, description: true, config: true },
  });
  if (!template) throw templateNotFound();
  return template;
}

// ── Solo admin ───────────────────────────────────────────────────────────────

export async function listAllTemplates() {
  const templates = await prisma.template.findMany({
    orderBy: { createdAt: 'asc' },
    select: { ...fullSelect, _count: { select: { bots: true } } },
  });
  return templates.map(({ _count, ...t }) => ({ ...t, botCount: _count.bots }));
}

export async function createTemplate(data) {
  const existing = await prisma.template.findUnique({ where: { key: data.key }, select: { id: true } });
  if (existing) throw conflict('TEMPLATE_KEY_TAKEN', `Ya existe una plantilla con la key "${data.key}"`);
  return prisma.template.create({ data, select: fullSelect });
}

export async function updateTemplate(id, data) {
  const existing = await prisma.template.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw templateNotFound();
  return prisma.template.update({ where: { id }, data, select: fullSelect });
}

export async function deleteTemplate(id) {
  const template = await prisma.template.findUnique({
    where: { id },
    select: { id: true, _count: { select: { bots: true } } },
  });
  if (!template) throw templateNotFound();
  // La relación Bot → Template es Restrict: no se puede borrar una plantilla en uso.
  if (template._count.bots > 0) {
    throw conflict(
      'TEMPLATE_IN_USE',
      `Hay ${template._count.bots} bot(s) usando esta plantilla. Desactivala (isActive: false) en lugar de borrarla.`,
    );
  }
  await prisma.template.delete({ where: { id } });
}

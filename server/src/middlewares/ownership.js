// Verificación de pertenencia (Brandon).
//
// Regla del equipo: si un usuario pide un recurso que NO es suyo, respondemos
// 404 (igual que si no existiera), nunca 403. Así no se revela que ese ID existe.
//
// Forma recomendada (la que ya usan bots y conversaciones): filtrar por dueño en
// la misma consulta, así el recurso ajeno directamente "no aparece":
//   prisma.bot.findFirst({ where: { id, ownerId: userId } })
//
// Cuando el recurso ya se buscó sin filtrar (o el dueño está en una relación),
// usar assertOwner para cortar con 404:
//   const bot = await prisma.bot.findUnique({ where: { id } });
//   assertOwner(bot, req.user.id, { code: 'BOT_NOT_FOUND', message: 'El bot no existe' });
//
//   const conv = await prisma.conversation.findUnique({ where: { id }, include: { bot: true } });
//   assertOwner(conv, req.user.id, { getOwnerId: (c) => c.bot.ownerId });
import { notFound } from '../utils/httpError.js';

/** Condición de Prisma para filtrar por dueño: where: { id, ...ownedBy(userId) } */
export const ownedBy = (userId) => ({ ownerId: userId });

/**
 * Lanza 404 si el recurso no existe o no pertenece al usuario.
 * Devuelve el mismo recurso para poder encadenar.
 */
export function assertOwner(
  resource,
  userId,
  { getOwnerId = (r) => r.ownerId, code = 'NOT_FOUND', message = 'No se encontró el recurso' } = {},
) {
  if (!resource || !userId || getOwnerId(resource) !== userId) {
    throw notFound(code, message);
  }
  return resource;
}

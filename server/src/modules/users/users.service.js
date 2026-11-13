import { prisma } from '../../db/prisma.js';
import { HttpError, notFound } from '../../utils/httpError.js';

// Administración de usuarios (Brandon). Solo la usan los admins: el control de
// rol lo hace requireRole('ADMIN') en users.routes.js.

// Lo que ve el admin de cada usuario. passwordHash nunca sale de la base.
const adminUserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  createdAt: true,
  _count: { select: { bots: true } },
};

const toAdminUser = ({ _count, ...user }) => ({ ...user, botsCount: _count.bots });

/** Todos los usuarios, los más nuevos primero, con la cantidad de bots de cada uno. */
export async function listUsers() {
  const users = await prisma.user.findMany({ select: adminUserSelect, orderBy: { createdAt: 'desc' } });
  return users.map(toAdminUser);
}

/**
 * Cambia el rol o activa/desactiva una cuenta.
 * Un admin no puede modificarse a sí mismo: así nadie se queda afuera por error
 * y siempre queda al menos un admin (el que hace los cambios).
 */
export async function updateUser(adminId, userId, data) {
  if (adminId === userId) {
    throw new HttpError(403, 'CANNOT_MODIFY_SELF', 'No podés cambiar tu propio rol ni desactivar tu propia cuenta');
  }

  const exists = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!exists) throw notFound('USER_NOT_FOUND', 'El usuario no existe');

  // No hace falta "cerrar" la sesión del usuario desactivado: requireAuth consulta
  // la base en cada pedido, así que el cambio se aplica en su próximo pedido.
  const user = await prisma.user.update({ where: { id: userId }, data, select: adminUserSelect });
  return toAdminUser(user);
}

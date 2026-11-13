import bcrypt from 'bcryptjs';
import { prisma } from '../../db/prisma.js';
import { ROLES } from '../../middlewares/auth.js';
import { conflict, HttpError } from '../../utils/httpError.js';

// Lógica de registro, login y sesión actual (Brandon). No sabe nada de cookies
// ni de HTTP: eso lo hace auth.routes.js. Acá solo se habla con la base.

// Costo de bcrypt: 2^10 vueltas. Es el valor recomendado por defecto: un hash
// tarda unos milisegundos para el servidor pero hace muy lento probar millones
// de contraseñas si alguien se roba la base.
const BCRYPT_ROUNDS = 10;

// Hash de una contraseña cualquiera. Se usa cuando el email no existe, para
// comparar igual y que la respuesta tarde lo mismo: si no, midiendo el tiempo
// se podría averiguar qué emails están registrados.
const DUMMY_HASH = bcrypt.hashSync('easybot-dummy-password', BCRYPT_ROUNDS);

const invalidCredentials = () => new HttpError(401, 'INVALID_CREDENTIALS', 'El email o la contraseña no son correctos');

// Campos del usuario que se pueden mandar al frontend. passwordHash nunca sale de acá.
const publicUserSelect = { id: true, email: true, name: true, role: true, createdAt: true };

const toPublicUser = ({ id, email, name, role, createdAt }) => ({ id, email, name, role, createdAt });

/** Crea un usuario nuevo. El rol es SIEMPRE USER: los admins se crean por seed o los asigna otro admin. */
export async function register({ name, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) throw conflict('EMAIL_TAKEN', 'Ya hay una cuenta con ese email');

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  try {
    return await prisma.user.create({
      data: { name, email, passwordHash, role: ROLES.USER },
      select: publicUserSelect,
    });
  } catch (err) {
    // Dos registros con el mismo email al mismo tiempo: el @unique de la base frena al segundo.
    if (err.code === 'P2002') throw conflict('EMAIL_TAKEN', 'Ya hay una cuenta con ese email');
    throw err;
  }
}

/** Valida email y contraseña. Devuelve el usuario (sin hash) o lanza 401/403. */
export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });

  // Mismo mensaje y mismo tiempo si el email no existe o si la contraseña está mal.
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) throw invalidCredentials();

  // Recién después de comprobar la contraseña se dice que la cuenta está desactivada:
  // así ese dato solo lo ve el dueño de la cuenta, no cualquiera que pruebe emails.
  if (!user.isActive) throw new HttpError(403, 'ACCOUNT_DISABLED', 'Tu cuenta está desactivada. Contactá a un administrador.');

  return toPublicUser(user);
}

/** Datos del usuario logueado (para GET /api/auth/me). */
export async function getCurrentUser(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: publicUserSelect });
  // requireAuth ya comprobó que existe; esto cubre el caso de que lo borren justo en el medio.
  if (!user) throw new HttpError(401, 'UNAUTHORIZED', 'Tenés que iniciar sesión');
  return user;
}

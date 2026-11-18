// Recuperar contraseña con un link por mail (guía de OWASP Forgot Password):
//   - El token es aleatorio y largo (32 bytes) y en la base se guarda SOLO su hash
//     (SHA-256): si alguien lee la tabla, no puede usar los links.
//   - Vence a los 30 minutos y se usa una sola vez.
//   - Pedir el link responde siempre igual, exista o no el email, y el mail se manda
//     en segundo plano para que la respuesta tarde lo mismo: así no se revela qué
//     emails están registrados.
//   - Al cambiar la contraseña se cierran las sesiones abiertas (passwordChangedAt)
//     y se avisa por mail, por si no fue el dueño de la cuenta.

import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { env } from '../../config/env.js';
import { prisma } from '../../db/prisma.js';
import { badRequest } from '../../utils/httpError.js';
import { sendMail } from '../../utils/mailer.js';
import { passwordChangedEmail, resetLinkEmail } from './passwordReset.emails.js';

const TOKEN_TTL_MINUTES = 30;
const BCRYPT_ROUNDS = 10; // mismo costo que auth.service.js

const hashToken = (token) => createHash('sha256').update(token).digest('hex');

// Manda el mail sin esperar la respuesta del servidor de correo; si falla, queda en el log.
function sendInBackground(mail) {
  sendMail(mail).catch((error) => console.error('No se pudo enviar el mail:', error.message));
}

/** Si el email es de una cuenta activa, le manda el link. No devuelve nada (a propósito). */
export async function requestPasswordReset(email) {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, name: true, isActive: true } });
  if (!user || !user.isActive) return;

  const token = randomBytes(32).toString('base64url');
  await prisma.$transaction([
    // Un link nuevo invalida los anteriores que no se usaron.
    prisma.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } }),
    prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + TOKEN_TTL_MINUTES * 60_000) },
    }),
  ]);

  const link = `${env.CLIENT_URL}/reset-password?token=${token}`;
  sendInBackground({ to: email, ...resetLinkEmail({ name: user.name, link, minutes: TOKEN_TTL_MINUTES }) });
}

/** Cambia la contraseña si el token es válido. Si no, 400 INVALID_RESET_TOKEN. */
export async function resetPassword({ token, password }) {
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { select: { id: true, email: true, name: true, isActive: true } } },
  });
  if (!record || record.usedAt || record.expiresAt < new Date() || !record.user.isActive) {
    throw badRequest('INVALID_RESET_TOKEN', 'El link no es válido o ya venció. Pedí uno nuevo.');
  }

  const now = new Date();
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash, passwordChangedAt: now }, select: { id: true } }),
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: now } }),
    prisma.passwordResetToken.deleteMany({ where: { userId: record.userId, usedAt: null } }),
  ]);

  sendInBackground({ to: record.user.email, ...passwordChangedEmail({ name: record.user.name }) });
}

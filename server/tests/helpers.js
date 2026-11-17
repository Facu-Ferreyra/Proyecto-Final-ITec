// Ayudas compartidas por auth.test.js y permissions.test.js (Brandon).
//
// Hay dos tipos de tests:
//   - SIN base: prueban lo que se corta antes de llegar a la base (sin cookie,
//     token falso, cabeceras, rate limit). Corren siempre, también en CI.
//   - CON base: flujos completos contra la base de server/.env. Si no hay
//     DATABASE_URL se saltean, igual que los tests de Santiago.
import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const hasDb = Boolean(process.env.DATABASE_URL && process.env.JWT_SECRET);
export const SKIP_WITHOUT_DB = !hasDb && 'Sin DATABASE_URL: se saltean los tests con base';

// config/env.js no deja arrancar la app sin estas variables. En los tests sin base
// se usan valores de mentira: esos tests nunca llegan a consultar la base.
process.env.DATABASE_URL ||= 'postgresql://sin-base:x@127.0.0.1:1/sin-base';
process.env.JWT_SECRET ||= 'secreto-solo-para-tests';

// Sufijo único por corrida: los datos de prueba no chocan con otros y se borran al final.
export const runId = String(Date.now());
export const testEmail = (name) => `${name}-${runId}@test.local`;
export const TEST_EMAIL_SUFFIX = `-${runId}@test.local`;

/** Carga la app y Prisma (después de preparar las variables de entorno). */
export async function loadApp() {
  const [{ default: supertest }, { app }, { prisma }] = await Promise.all([
    import('supertest'),
    import('../src/app.js'),
    import('../src/db/prisma.js'),
  ]);
  return { app, api: supertest(app), prisma };
}

/** Cookie de sesión válida para un usuario, igual a la que pone el login. */
export function sessionCookie(user, { secret = process.env.JWT_SECRET, expiresIn = '1h' } = {}) {
  const token = jwt.sign({ sub: user.id, role: user.role }, secret, { algorithm: 'HS256', expiresIn });
  return `token=${token}`;
}

/** Token "sin firma" (alg: none): un ataque clásico contra JWT. */
export function unsignedCookie(payload) {
  const part = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  return `token=${part({ alg: 'none', typ: 'JWT' })}.${part(payload)}.`;
}

/** Primera cookie que manda el servidor en una respuesta (o undefined). */
export const setCookieOf = (res) => res.headers['set-cookie']?.[0];

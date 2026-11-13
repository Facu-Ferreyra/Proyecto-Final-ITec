// Autenticación y roles (Brandon).
//
// Contrato que usa el resto del backend:
//   - requireAuth            → sin sesión válida responde 401; con sesión deja req.user = { id, role }
//   - requireRole('ADMIN')   → si el rol no está permitido responde 403
//
// La sesión es un JWT firmado con JWT_SECRET, guardado en una cookie httpOnly
// (el JavaScript del navegador no la puede leer, así que un XSS no puede robarla).
// Payload del token: { sub: <id del usuario>, role: 'USER' | 'ADMIN' }.
import jwt from 'jsonwebtoken';
import { env, isProduction } from '../config/env.js';
import { prisma } from '../db/prisma.js';
import { HttpError } from '../utils/httpError.js';

export const AUTH_COOKIE_NAME = 'token';
export const ROLES = Object.freeze({ USER: 'USER', ADMIN: 'ADMIN' });

const JWT_ALGORITHM = 'HS256';

// Opciones de la cookie. Se usan IGUAL al crearla y al borrarla:
// si no coinciden (path, sameSite, secure), el navegador no la borra.
//   - httpOnly: JS no puede leerla.
//   - secure: solo viaja por HTTPS (en desarrollo es http://localhost, por eso solo en producción).
//   - sameSite 'lax': no se manda en pedidos POST desde otros sitios (protege de CSRF).
//     Alcanza con 'lax' porque Express sirve el frontend desde el mismo origen.
export const sessionCookieOptions = Object.freeze({
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax',
  path: '/',
});

const unauthorized = (message = 'Tenés que iniciar sesión') => new HttpError(401, 'UNAUTHORIZED', message);
const forbidden = () => new HttpError(403, 'FORBIDDEN', 'No tenés permiso para hacer esto');

/** Firma el JWT de sesión de un usuario. */
export function signSessionToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

/** Crea el token y lo guarda en la cookie. La cookie vence junto con el token. */
export function setSessionCookie(res, user) {
  const token = signSessionToken(user);
  const { exp } = jwt.decode(token);
  res.cookie(AUTH_COOKIE_NAME, token, { ...sessionCookieOptions, maxAge: exp * 1000 - Date.now() });
  return token;
}

/** Borra la cookie de sesión (logout o token inválido). */
export function clearSessionCookie(res) {
  res.clearCookie(AUTH_COOKIE_NAME, sessionCookieOptions);
}

/**
 * Exige una sesión válida. Verifica la firma y el vencimiento del JWT y además
 * consulta la base: si el usuario fue borrado o desactivado, la sesión deja de
 * valer al instante (sin esperar a que venza el token). El rol también se toma
 * de la base, así un cambio de rol hecho por un admin se aplica enseguida.
 */
export async function requireAuth(req, res, next) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  if (!token) throw unauthorized();

  let payload;
  try {
    // algorithms fijo: evita que acepten tokens firmados con otro algoritmo (por ejemplo "none").
    payload = jwt.verify(token, env.JWT_SECRET, { algorithms: [JWT_ALGORITHM] });
  } catch (err) {
    clearSessionCookie(res);
    const expired = err instanceof jwt.TokenExpiredError;
    throw unauthorized(expired ? 'Tu sesión venció. Volvé a iniciar sesión.' : 'La sesión no es válida. Volvé a iniciar sesión.');
  }

  if (typeof payload.sub !== 'string') {
    clearSessionCookie(res);
    throw unauthorized('La sesión no es válida. Volvé a iniciar sesión.');
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, role: true, isActive: true },
  });
  if (!user || !user.isActive) {
    clearSessionCookie(res);
    throw unauthorized('Tu cuenta no está disponible. Volvé a iniciar sesión.');
  }

  req.user = { id: user.id, role: user.role };
  next();
}

/**
 * Restringe la ruta a ciertos roles. Va siempre DESPUÉS de requireAuth.
 * Ejemplo: router.use(requireAuth, requireRole('ADMIN'));
 */
export function requireRole(...roles) {
  const unknown = roles.filter((role) => !Object.values(ROLES).includes(role));
  if (roles.length === 0 || unknown.length > 0) {
    // Error de programación: se detecta al arrancar el servidor, no en producción.
    throw new Error(`requireRole: roles inválidos (${unknown.join(', ') || 'ninguno'})`);
  }

  return (req, res, next) => {
    if (!req.user) throw unauthorized();
    if (!roles.includes(req.user.role)) throw forbidden();
    next();
  };
}

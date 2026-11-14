// ⚠️ VERSIÓN PROVISORIA (Santiago) — la versión final es de Brandon.
// Existe solo para poder probar los endpoints de bots mientras no está el módulo
// de auth. Cuando Brandon suba la suya, se reemplaza este archivo entero.
// Lo único que usan los módulos de Santiago es el contrato:
//   - requireAuth  → si no hay sesión válida responde 401; si hay, deja req.user = { id, role }
//   - requireRole('ADMIN') → si el rol no coincide responde 403
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';

export const AUTH_COOKIE_NAME = 'token'; // a definir por Brandon

export function requireAuth(req, res, next) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  if (!token) throw new HttpError(401, 'UNAUTHORIZED', 'Tenés que iniciar sesión');

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
  } catch {
    throw new HttpError(401, 'UNAUTHORIZED', 'La sesión venció o no es válida');
  }
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) throw new HttpError(401, 'UNAUTHORIZED', 'Tenés que iniciar sesión');
    if (!roles.includes(req.user.role)) throw new HttpError(403, 'FORBIDDEN', 'No tenés permiso para hacer esto');
    next();
  };
}

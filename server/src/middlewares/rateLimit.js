// Límite de pedidos por IP (Brandon). Frena ataques de fuerza bruta contra el
// login y el abuso general de la API. Cuando se supera, responde 429 con el
// formato de error de siempre: { error: { code: 'TOO_MANY_REQUESTS', message } }.
//
// Uso:
//   authRouter.post('/login', loginLimiter, ...)
//   authRouter.post('/register', registerLimiter, ...)
//   app.use('/api', apiLimiter)
//
// Importante en Render: el servicio está detrás de un proxy, así que en app.js
// hace falta app.set('trust proxy', 1). Si no, todos los pedidos parecen venir
// de la misma IP (la del proxy) y el límite se comparte entre todos los usuarios.
import { rateLimit } from 'express-rate-limit';
import { HttpError } from '../utils/httpError.js';

const MINUTE = 60 * 1000;

const tooManyRequests = (message) => (req, res, next) => next(new HttpError(429, 'TOO_MANY_REQUESTS', message));

const baseOptions = {
  standardHeaders: 'draft-8', // header RateLimit con el límite y lo que falta para que se libere
  legacyHeaders: false, // sin los viejos X-RateLimit-*
};

// Login: 10 intentos FALLIDOS cada 15 minutos por IP. Los logins exitosos no
// cuentan, así un usuario legítimo no se bloquea por entrar varias veces.
export const loginLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * MINUTE,
  limit: 10,
  skipSuccessfulRequests: true,
  handler: tooManyRequests('Demasiados intentos de inicio de sesión. Esperá 15 minutos y probá de nuevo.'),
});

// Registro: 10 cuentas por hora por IP (evita la creación masiva de cuentas).
export const registerLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * MINUTE,
  limit: 10,
  handler: tooManyRequests('Se crearon demasiadas cuentas desde esta conexión. Probá de nuevo más tarde.'),
});

// Resto de la API: 300 pedidos por minuto por IP. Es generoso a propósito
// (el chat y el panel hacen varios pedidos seguidos), solo corta abusos.
export const apiLimiter = rateLimit({
  ...baseOptions,
  windowMs: MINUTE,
  limit: 300,
  handler: tooManyRequests('Estás haciendo demasiados pedidos. Esperá un minuto y probá de nuevo.'),
});

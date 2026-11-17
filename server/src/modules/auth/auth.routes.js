import { Router } from 'express';
import { clearSessionCookie, requireAuth, setSessionCookie } from '../../middlewares/auth.js';
import { loginLimiter, registerLimiter } from '../../middlewares/rateLimit.js';
import * as service from './auth.service.js';
import { loginSchema, registerSchema } from './auth.schemas.js';

// /api/auth — registro, login, logout y sesión actual (Brandon).
// Todas las respuestas con usuario tienen la forma { user: { id, email, name, role, createdAt } }.
export const authRouter = Router();

// Las respuestas de auth tienen datos personales: que ningún navegador ni proxy las guarde en caché.
authRouter.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Crea la cuenta (rol USER) y deja la sesión iniciada.
authRouter.post('/register', registerLimiter, async (req, res) => {
  const data = registerSchema.parse(req.body);
  const user = await service.register(data);
  setSessionCookie(res, user);
  res.status(201).json({ user });
});

// Inicia sesión: guarda el JWT en la cookie httpOnly.
authRouter.post('/login', loginLimiter, async (req, res) => {
  const data = loginSchema.parse(req.body);
  const user = await service.login(data);
  setSessionCookie(res, user);
  res.json({ user });
});

// Cierra la sesión. No exige estar logueado: borrar una cookie que no existe no hace daño,
// y así el frontend puede llamarlo siempre (por ejemplo con la sesión ya vencida).
authRouter.post('/logout', (req, res) => {
  clearSessionCookie(res);
  res.status(204).end();
});

// Sesión actual: el frontend lo llama al cargar para saber si hay alguien logueado.
authRouter.get('/me', requireAuth, async (req, res) => {
  res.json({ user: await service.getCurrentUser(req.user.id) });
});

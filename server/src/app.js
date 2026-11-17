import path from 'node:path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { corsOptions } from './config/cors.js';
import { isProduction } from './config/env.js';
import { prisma } from './db/prisma.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { apiLimiter } from './middlewares/rateLimit.js';
import { templatesRouter, adminTemplatesRouter } from './modules/templates/templates.routes.js';
import { botsRouter } from './modules/bots/bots.routes.js';
import { conversationsRouter } from './modules/conversations/conversations.routes.js';
import { publicRouter } from './modules/public/public.routes.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { adminUsersRouter } from './modules/users/users.routes.js';

export const app = express();

// En Render los pedidos llegan a través de un proxy (1 salto). Sin esto, req.ip
// sería la IP del proxy para todos y el rate limit bloquearía a todos juntos.
// Solo en producción: en desarrollo no hay proxy y confiar en X-Forwarded-For
// permitiría falsear la IP para saltear el límite.
if (isProduction) app.set('trust proxy', 1);

// Cabeceras de seguridad (Content-Security-Policy, X-Content-Type-Options,
// X-Frame-Options, Strict-Transport-Security, etc.) y quita X-Powered-By.
// La CSP por defecto alcanza porque el frontend no carga nada de otros dominios.
app.use(helmet());
app.use(cors(corsOptions));

// Límite general por IP para toda la API (login y registro tienen además los suyos).
// Va antes de express.json: así cuenta todos los pedidos (incluso los de JSON roto)
// y a un cliente bloqueado se lo corta sin gastar trabajo en leer su body.
app.use('/api', apiLimiter);

app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

// Sirve para "despertar" el servicio y comprobar que la base responde.
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'ok' });
  } catch {
    res.status(503).json({ status: 'error', db: 'unreachable' });
  }
});

// Acá se montan las rutas de cada módulo.
app.use('/api/auth', authRouter);
app.use('/api/admin/users', adminUsersRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/admin/templates', adminTemplatesRouter);
app.use('/api/bots', botsRouter);
app.use('/api/public', publicRouter);
app.use('/api', conversationsRouter); // /bots/:id/conversations, /conversations/:id/messages, /bots/:id/leads, /leads/:id

// Cualquier /api que no exista responde JSON, no el index.html del frontend.
app.use('/api', (req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'La ruta no existe' } });
});

// En producción Express sirve el frontend compilado (client/dist).
if (isProduction) {
  const clientDist = path.resolve(import.meta.dirname, '../../client/dist');
  app.use(express.static(clientDist));
  // Fallback para React Router: cualquier otra ruta devuelve index.html.
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Siempre al final: convierte cualquier error en { error: { code, message } }.
app.use(errorHandler);

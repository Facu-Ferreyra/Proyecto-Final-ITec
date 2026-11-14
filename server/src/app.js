import path from 'node:path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/cors.js';
import { isProduction } from './config/env.js';
import { prisma } from './db/prisma.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { templatesRouter, adminTemplatesRouter } from './modules/templates/templates.routes.js';
import { botsRouter } from './modules/bots/bots.routes.js';
import { conversationsRouter } from './modules/conversations/conversations.routes.js';
import { publicRouter } from './modules/public/public.routes.js';

export const app = express();

app.use(cors(corsOptions));
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

// Acá se montan las rutas de cada módulo, por ejemplo:
// app.use('/api/auth', authRoutes);
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

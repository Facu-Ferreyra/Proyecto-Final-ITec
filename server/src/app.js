import path from 'node:path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/cors.js';
import { isProduction } from './config/env.js';
import { prisma } from './db/prisma.js';

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

// Cualquier /api que no exista responde JSON, no el index.html del frontend.
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
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

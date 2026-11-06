import { Router } from 'express';
import * as service from './public.service.js';
import { publicMessageSchema, slugParams } from './public.schemas.js';

// /api/public — sin login. El límite de pedidos por IP lo agrega Brandon
// (express-rate-limit) al montar este router en app.js.
export const publicRouter = Router();

publicRouter.get('/bots/:slug', async (req, res) => {
  const { slug } = slugParams.parse(req.params);
  res.json(await service.getPublicBot(slug));
});

publicRouter.post('/bots/:slug/messages', async (req, res) => {
  const { slug } = slugParams.parse(req.params);
  const body = publicMessageSchema.parse(req.body);
  res.json(await service.sendPublicMessage(slug, body));
});

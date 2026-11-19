import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.js';
import * as service from './bots.service.js';
import { botIdParams, chatMessageSchema, createBotSchema, updateBotSchema } from './bots.schemas.js';

// /api/bots — solo el dueño, solo sobre sus bots (cada service filtra por req.user.id).
export const botsRouter = Router();
botsRouter.use(requireAuth);

botsRouter.get('/', async (req, res) => {
  res.json({ items: await service.listBots(req.user.id) });
});

botsRouter.post('/', async (req, res) => {
  const data = createBotSchema.parse(req.body);
  res.status(201).json(await service.createBot(req.user.id, data));
});

botsRouter.get('/:id', async (req, res) => {
  const { id } = botIdParams.parse(req.params);
  res.json(await service.getBot(req.user.id, id));
});

botsRouter.put('/:id', async (req, res) => {
  const { id } = botIdParams.parse(req.params);
  const data = updateBotSchema.parse(req.body);
  res.json(await service.updateBot(req.user.id, id, data));
});

botsRouter.delete('/:id', async (req, res) => {
  const { id } = botIdParams.parse(req.params);
  await service.deleteBot(req.user.id, id);
  res.status(204).end();
});

botsRouter.post('/:id/publish', async (req, res) => {
  const { id } = botIdParams.parse(req.params);
  res.json(await service.publishBot(req.user.id, id));
});

botsRouter.post('/:id/unpublish', async (req, res) => {
  const { id } = botIdParams.parse(req.params);
  res.json(await service.unpublishBot(req.user.id, id));
});

// Vista previa del asistente (funciona con borradores y no guarda nada).
botsRouter.get('/:id/preview', async (req, res) => {
  const { id } = botIdParams.parse(req.params);
  res.json(await service.previewStart(req.user.id, id));
});

botsRouter.post('/:id/preview/messages', async (req, res) => {
  const { id } = botIdParams.parse(req.params);
  const message = chatMessageSchema.parse(req.body);
  res.json(await service.previewMessage(req.user.id, id, message));
});

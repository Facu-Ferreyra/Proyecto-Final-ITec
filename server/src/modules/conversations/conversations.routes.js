import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.js';
import * as service from './conversations.service.js';
import { idParams, listConversationsQuery, listLeadsQuery, updateLeadSchema } from './conversations.schemas.js';

// Se monta en /api. requireAuth va en cada ruta (y no con router.use) para no
// afectar a otras rutas de /api, como las públicas del chat.
export const conversationsRouter = Router();

conversationsRouter.get('/bots/:id/conversations', requireAuth, async (req, res) => {
  const { id } = idParams.parse(req.params);
  const query = listConversationsQuery.parse(req.query);
  res.json(await service.listConversations(req.user.id, id, query));
});

conversationsRouter.get('/conversations/:id/messages', requireAuth, async (req, res) => {
  const { id } = idParams.parse(req.params);
  res.json(await service.getConversationMessages(req.user.id, id));
});

conversationsRouter.get('/bots/:id/leads', requireAuth, async (req, res) => {
  const { id } = idParams.parse(req.params);
  const query = listLeadsQuery.parse(req.query);
  res.json(await service.listLeads(req.user.id, id, query));
});

conversationsRouter.patch('/leads/:id', requireAuth, async (req, res) => {
  const { id } = idParams.parse(req.params);
  const { status } = updateLeadSchema.parse(req.body);
  res.json(await service.updateLeadStatus(req.user.id, id, status));
});

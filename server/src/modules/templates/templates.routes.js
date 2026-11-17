import { Router } from 'express';
import { requireAuth, requireRole } from '../../middlewares/auth.js';
import * as service from './templates.service.js';
import { createTemplateSchema, templateIdParams, updateTemplateSchema } from './templates.schemas.js';

// /api/templates — usuario y admin (para el paso 1 del asistente)
export const templatesRouter = Router();
templatesRouter.use(requireAuth);

templatesRouter.get('/', async (req, res) => {
  res.json({ items: await service.listActiveTemplates() });
});

templatesRouter.get('/:id', async (req, res) => {
  const { id } = templateIdParams.parse(req.params);
  res.json(await service.getActiveTemplate(id));
});

// /api/admin/templates — solo admin
export const adminTemplatesRouter = Router();
adminTemplatesRouter.use(requireAuth, requireRole('ADMIN'));

adminTemplatesRouter.get('/', async (req, res) => {
  res.json({ items: await service.listAllTemplates() });
});

adminTemplatesRouter.post('/', async (req, res) => {
  const data = createTemplateSchema.parse(req.body);
  res.status(201).json(await service.createTemplate(data));
});

adminTemplatesRouter.put('/:id', async (req, res) => {
  const { id } = templateIdParams.parse(req.params);
  const data = updateTemplateSchema.parse(req.body);
  res.json(await service.updateTemplate(id, data));
});

adminTemplatesRouter.delete('/:id', async (req, res) => {
  const { id } = templateIdParams.parse(req.params);
  await service.deleteTemplate(id);
  res.status(204).end();
});

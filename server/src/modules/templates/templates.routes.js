import { Router } from 'express';
import { requireAuth, requireRole } from '../../middlewares/auth.js';
import { logAdminAction } from '../../utils/auditLog.js';
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
  const template = await service.createTemplate(data);
  logAdminAction({ adminId: req.user.id, action: 'template.create', targetType: 'template', targetId: template.id, details: { key: data.key } });
  res.status(201).json(template);
});

adminTemplatesRouter.put('/:id', async (req, res) => {
  const { id } = templateIdParams.parse(req.params);
  const data = updateTemplateSchema.parse(req.body);
  const template = await service.updateTemplate(id, data);
  // Se anotan qué campos cambiaron (y el estado), no la config entera.
  logAdminAction({
    adminId: req.user.id,
    action: 'template.update',
    targetType: 'template',
    targetId: id,
    details: { fields: Object.keys(data), isActive: data.isActive },
  });
  res.json(template);
});

adminTemplatesRouter.delete('/:id', async (req, res) => {
  const { id } = templateIdParams.parse(req.params);
  await service.deleteTemplate(id);
  logAdminAction({ adminId: req.user.id, action: 'template.delete', targetType: 'template', targetId: id });
  res.status(204).end();
});

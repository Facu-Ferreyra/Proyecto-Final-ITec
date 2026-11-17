import { Router } from 'express';
import { requireAuth, requireRole } from '../../middlewares/auth.js';
import * as service from './users.service.js';
import { updateUserSchema, userIdParams } from './users.schemas.js';

// /api/admin/users — solo admin (Brandon).
//   sin sesión → 401 · con sesión de USER → 403
export const adminUsersRouter = Router();
adminUsersRouter.use(requireAuth, requireRole('ADMIN'));

adminUsersRouter.get('/', async (req, res) => {
  res.json({ items: await service.listUsers() });
});

adminUsersRouter.patch('/:id', async (req, res) => {
  const { id } = userIdParams.parse(req.params);
  const data = updateUserSchema.parse(req.body);
  res.json({ user: await service.updateUser(req.user.id, id, data) });
});

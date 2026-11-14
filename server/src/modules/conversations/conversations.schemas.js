import { z } from '../../utils/zod.js';

export const idParams = z.object({ id: z.string().min(1).max(50) });

const pagination = {
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
};

export const listConversationsQuery = z.object(pagination);

export const listLeadsQuery = z.object({
  ...pagination,
  type: z.enum(['CONTACT', 'APPOINTMENT', 'ORDER']).optional(),
  status: z.string().max(20).optional(),
});

export const updateLeadSchema = z.object({
  status: z.string().min(1).max(20),
});

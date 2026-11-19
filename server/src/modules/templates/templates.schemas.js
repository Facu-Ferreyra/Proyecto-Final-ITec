import { z } from '../../utils/zod.js';
import { templateConfigSchema } from '../../engine/index.js';

export const templateIdParams = z.object({ id: z.string().min(1).max(50) });

export const createTemplateSchema = z.object({
  key: z.string().regex(/^[a-z][a-z0-9-]{1,29}$/, 'Usá minúsculas, números y guiones'),
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().min(1).max(300),
  isActive: z.boolean().optional(),
  config: templateConfigSchema,
});

// La key no se puede cambiar: los bots y el seed la usan para identificar la plantilla.
export const updateTemplateSchema = createTemplateSchema
  .omit({ key: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: 'No mandaste ningún dato para cambiar' });

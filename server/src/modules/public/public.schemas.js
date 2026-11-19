import { z } from '../../utils/zod.js';
import { flowStateSchema } from '../bots/bots.schemas.js';

export const slugParams = z.object({
  slug: z.string().regex(/^[a-z0-9-]{3,60}$/, 'Link inválido'),
});

export const publicMessageSchema = z
  .object({
    // Id anónimo del visitante. El frontend lo genera una vez (crypto.randomUUID)
    // y lo guarda en localStorage. Si no lo manda, el backend crea uno y lo devuelve.
    visitorId: z.string().regex(/^[A-Za-z0-9_-]{8,64}$/, 'visitorId inválido').optional(),
    conversationId: z.string().min(1).max(50).optional(),
    optionId: z.string().min(1).max(40).optional(),
    text: z.string().trim().min(1).max(500).optional(), // largo máximo del mensaje
    state: flowStateSchema.nullable().optional(),
  })
  .refine((data) => data.optionId || data.text, {
    message: 'Mandá optionId o text',
    path: ['optionId'],
  });

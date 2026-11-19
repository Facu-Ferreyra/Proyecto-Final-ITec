import { z } from '../../utils/zod.js';

export const botIdParams = z.object({ id: z.string().min(1).max(50) });

const name = z.string().trim().min(2).max(60);
// La forma exacta de config depende de la plantilla: se valida en el service con
// buildConfigSchema(template.config). Acá solo se exige que sea un objeto.
const config = z.record(z.string(), z.unknown());

export const createBotSchema = z.object({
  templateId: z.string().min(1).max(50),
  name,
  config: config.default({}),
});

export const updateBotSchema = z
  .object({ name, config })
  .partial()
  .refine((data) => data.name !== undefined || data.config !== undefined, {
    message: 'Mandá name o config',
  });

// Estado del flujo que devuelve el motor y el cliente manda de vuelta tal cual.
export const flowStateSchema = z.object({
  flow: z.string().max(40),
  step: z.number().int().min(0).max(50),
  answers: z.record(z.string().max(40), z.unknown()),
});

// Mensaje del chat (público y vista previa): el visitante toca un botón (optionId)
// o escribe texto (text).
export const chatMessageSchema = z
  .object({
    optionId: z.string().min(1).max(40).optional(),
    text: z.string().trim().min(1).max(500).optional(),
    state: flowStateSchema.nullable().optional(),
  })
  .refine((data) => data.optionId || data.text, {
    message: 'Mandá optionId o text',
    path: ['optionId'],
  });

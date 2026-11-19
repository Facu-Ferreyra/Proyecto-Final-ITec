// Nombre del bot: misma regla que el backend (bots.schemas.js): de 2 a 60 caracteres.

import { z } from './zod.js'

export const botNameSchema = z
  .string({ error: 'Completá el nombre del bot' })
  .trim()
  .min(2, { error: 'El nombre tiene que tener al menos 2 caracteres' })
  .max(60, { error: 'El nombre puede tener hasta 60 caracteres' })

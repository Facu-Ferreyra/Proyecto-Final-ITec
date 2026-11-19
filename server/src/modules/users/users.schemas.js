import { z } from '../../utils/zod.js';
import { ROLES } from '../../middlewares/auth.js';

// Validaciones de la administración de usuarios (Brandon).

export const userIdParams = z.object({ id: z.string().min(1).max(50) });

// El admin solo puede cambiar el rol y si la cuenta está activa.
// Email, nombre y contraseña no se tocan desde acá (z.object descarta cualquier otro campo).
//
// Un solo administrador: el que crea el seed (admin@easybot.com). Por eso el rol
// solo se puede pasar a USER; nadie puede ser nombrado ADMIN desde la API.
// Ocultar el botón en el frontend no alcanza: la regla vive acá.
export const updateUserSchema = z
  .object({
    role: z.literal(ROLES.USER, { error: 'Solo puede haber un administrador: no se puede nombrar a otro' }),
    isActive: z.boolean(),
  })
  .partial()
  .refine((data) => data.role !== undefined || data.isActive !== undefined, {
    message: 'Mandá role o isActive',
  });

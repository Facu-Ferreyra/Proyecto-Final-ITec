import { z } from '../../utils/zod.js';
import { ROLES } from '../../middlewares/auth.js';

// Validaciones de la administración de usuarios (Brandon).

export const userIdParams = z.object({ id: z.string().min(1).max(50) });

// El admin solo puede cambiar el rol y si la cuenta está activa.
// Email, nombre y contraseña no se tocan desde acá (z.object descarta cualquier otro campo).
export const updateUserSchema = z
  .object({
    role: z.enum([ROLES.USER, ROLES.ADMIN]),
    isActive: z.boolean(),
  })
  .partial()
  .refine((data) => data.role !== undefined || data.isActive !== undefined, {
    message: 'Mandá role o isActive',
  });

import { PrismaClient } from '@prisma/client';

// Una sola instancia para toda la app.
// `omit` asegura que el hash de la contraseña nunca salga en una respuesta (R7).
// Si un módulo lo necesita (login), lo pide explícitamente con `omit: { passwordHash: false }`.
export const prisma = new PrismaClient({
  omit: {
    user: { passwordHash: true },
  },
});

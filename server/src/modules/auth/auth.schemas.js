import { z } from '../../utils/zod.js';

// Validaciones del módulo de auth (Brandon).
//
// z.object() descarta las claves que no están en el schema. Por eso, si alguien
// manda { role: 'ADMIN' } en el registro, ese campo ni siquiera llega al service.

// Email normalizado: sin espacios y en minúsculas, así "Ana@Mail.com " y
// "ana@mail.com" son la misma cuenta.
const email = z.string().trim().toLowerCase().pipe(z.email().max(254));

// Política de contraseñas (solo al crearla):
//   - 8 caracteres como mínimo.
//   - Al menos una letra y un número.
//   - 72 bytes como máximo: bcrypt ignora lo que pasa de 72 bytes, así que una
//     contraseña más larga daría una falsa sensación de seguridad.
const newPassword = z
  .string()
  .min(8)
  .refine((value) => Buffer.byteLength(value, 'utf8') <= 72, { message: 'La contraseña es demasiado larga (máximo 72 caracteres)' })
  .refine((value) => /\p{L}/u.test(value) && /\d/.test(value), { message: 'La contraseña tiene que tener al menos una letra y un número' });

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email,
  password: newPassword,
});

// En el login no se aplica la política (solo se compara contra el hash guardado),
// pero sí un tope de largo para que nadie mande textos enormes a bcrypt.
export const loginSchema = z.object({
  email,
  password: z.string().min(1).max(200),
});

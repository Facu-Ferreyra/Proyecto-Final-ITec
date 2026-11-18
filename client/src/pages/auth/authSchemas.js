// Validaciones de login y registro (Brandon). Son las MISMAS reglas que el backend
// (server/src/modules/auth/auth.schemas.js): el front valida para avisar rápido,
// pero el que manda es el backend, que valida de nuevo siempre.

import { z } from '../../schemas/zod.js'

const email = z.string().trim().toLowerCase().min(1, 'Ingresá tu email').pipe(z.email('Ingresá un email válido'))

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Ingresá tu contraseña'),
})

export const PASSWORD_HINT = 'Mínimo 8 caracteres, con al menos una letra y un número.'

// Política de contraseñas: la usan el registro y "Nueva contraseña".
const newPassword = z
  .string()
  .min(8, 'La contraseña tiene que tener al menos 8 caracteres')
  .refine((value) => new TextEncoder().encode(value).length <= 72, 'La contraseña es demasiado larga (máximo 72 caracteres)')
  .refine((value) => /\p{L}/u.test(value) && /\d/.test(value), 'Tiene que tener al menos una letra y un número')

const passwordsMatch = {
  check: (data) => data.password === data.confirmPassword,
  error: { message: 'Las contraseñas no coinciden', path: ['confirmPassword'] },
}

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Ingresá tu nombre (mínimo 2 letras)').max(60, 'Máximo 60 caracteres'),
    email,
    password: newPassword,
    confirmPassword: z.string().min(1, 'Repetí la contraseña'),
  })
  .refine(passwordsMatch.check, passwordsMatch.error)

// "Olvidé mi contraseña"
export const forgotPasswordSchema = z.object({ email })

// "Nueva contraseña" (el token sale del link, no del formulario)
export const resetPasswordSchema = z
  .object({
    password: newPassword,
    confirmPassword: z.string().min(1, 'Repetí la contraseña'),
  })
  .refine(passwordsMatch.check, passwordsMatch.error)

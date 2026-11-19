// Convierte un error de la API de auth en lo que muestra el formulario (Brandon):
//   { form: 'mensaje general' } o { fields: { email: '...' } }

import { apiDetailsToFieldErrors } from '../../schemas/fieldErrors.js'

export function authErrorToFormErrors(error) {
  switch (error?.code) {
    // El email ya está registrado: se marca en el campo email.
    case 'EMAIL_TAKEN':
      return { fields: { email: error.message } }
    // El backend rechazó algún campo: cada mensaje va a su campo.
    case 'VALIDATION_ERROR':
      return { fields: apiDetailsToFieldErrors(error.details), form: error.details?.length ? undefined : error.message }
    // INVALID_CREDENTIALS, ACCOUNT_DISABLED, TOO_MANY_REQUESTS, NETWORK_ERROR...:
    // el backend ya manda un mensaje pensado para el usuario.
    default:
      return { form: error?.message ?? 'Ocurrió un error inesperado. Probá de nuevo.' }
  }
}

// Convierte errores (de Zod o del backend) a un objeto fácil de usar en el
// formulario: { "businessPhone": "Teléfono inválido", "services.0.name": "Completá este campo" }.
// La clave es la ruta del campo con puntos, la misma que usa el backend.

// Errores de Zod: cada issue tiene path = ['services', 0, 'name'].
export function zodErrorToFieldErrors(error) {
  const errors = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.')
    // Si un campo tiene varios errores, se muestra solo el primero.
    if (!(key in errors)) errors[key] = issue.message
  }
  return errors
}

// Errores del backend (VALIDATION_ERROR): details = [{ path: 'config.services.0.name', message }].
// Se saca el prefijo "config." para que coincida con las claves del formulario.
export function apiDetailsToFieldErrors(details = []) {
  const errors = {}
  for (const { path, message } of details) {
    const key = path.replace(/^config\./, '')
    if (!(key in errors)) errors[key] = message
  }
  return errors
}

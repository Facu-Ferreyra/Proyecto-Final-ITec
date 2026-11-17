// Reglas sobre los datos del negocio (bot.config).
// Son una copia de las del backend (server/src/engine/render.js y configSchema.js):
// el front las usa para avisarle al usuario antes de mandar, pero el que decide
// siempre es el backend, que vuelve a validar todo.

import { buildConfigSchema } from './configSchema.js'
import { zodErrorToFieldErrors } from './fieldErrors.js'

// Saca las filas en blanco de listas e ítems antes de validar y guardar.
// Ej.: timeSlots ['10:00', ''] → ['10:00']; services [{ name: '' }] → [].
// Así una fila vacía (la que el formulario muestra siempre en los obligatorios)
// no impide guardar el borrador.
export function removeEmptyRows(fields, config) {
  const cleaned = { ...config }
  for (const field of fields) {
    const value = config[field.key]
    if (!Array.isArray(value)) continue
    if (field.type === 'list') {
      cleaned[field.key] = value.filter((item) => !isEmpty(item))
    }
    if (field.type === 'items') {
      cleaned[field.key] = value.filter((item) => field.itemFields.some((f) => !isEmpty(item[f.key])))
    }
  }
  return cleaned
}

// Valida los datos del formulario. Devuelve {} si está todo bien, o los errores
// por campo: { "businessPhone": "Teléfono inválido. Ejemplo: 11 5555 0000" }.
export function validateConfig(fields, config) {
  const result = buildConfigSchema(fields).safeParse(config)
  return result.success ? {} : zodErrorToFieldErrors(result.error)
}

// Un dato "vacío" cuenta como "no cargado".
export function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    value === false ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0)
  )
}

// Campos obligatorios que todavía no se completaron: [{ key, label }].
// Es lo que el paso "Revisar" marca en rojo y lo que impide publicar.
export function getMissingFields(fields, config) {
  return fields
    .filter((field) => field.required && isEmpty(config?.[field.key]))
    .map((field) => ({ key: field.key, label: field.label }))
}

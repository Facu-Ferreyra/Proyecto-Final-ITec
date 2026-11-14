// Arma, a partir de los "fields" de una plantilla, el esquema Zod que valida los
// datos del negocio (bot.config). Es la misma lógica que el backend
// (server/src/engine/configSchema.js), pero con mensajes pensados para el formulario.

import { z } from './zod.js'

// Mismo regex que el backend.
export const PHONE_REGEX = /^\+?[0-9\s()-]{6,20}$/

const MAX_PRICE = 100_000_000
const REQUIRED = 'Completá este campo'
const maxChars = (max) => ({ error: `Máximo ${max} caracteres` })
const maxEntries = (max) => ({ error: `Podés cargar hasta ${max}` })

// Un texto vacío cuenta como "no cargado": así se puede guardar un borrador
// con campos sin completar.
const emptyToUndefined = (schema) =>
  z.preprocess((value) => (typeof value === 'string' && value.trim() === '' ? undefined : value), schema)

// Una columna dentro de una fila de "items" (ej.: nombre y precio de un servicio).
function itemFieldSchema(field) {
  let schema
  if (field.type === 'price') {
    const priceError = { error: 'Poné un precio entre 0 y 100.000.000' }
    schema = z.number(priceError).min(0, priceError).max(MAX_PRICE, priceError)
  } else {
    // Mismos máximos por defecto que el backend: 500 para textarea, 100 para texto.
    const max = field.maxLength ?? (field.type === 'textarea' ? 500 : 100)
    schema = z.string({ error: REQUIRED }).trim().min(1, { error: REQUIRED }).max(max, maxChars(max))
  }
  return field.required ? schema : emptyToUndefined(schema.optional())
}

// Un campo del formulario, según su tipo.
function fieldSchema(field) {
  switch (field.type) {
    case 'text': {
      const max = field.maxLength ?? 200
      return z.string().trim().max(max, maxChars(max))
    }
    case 'textarea': {
      const max = field.maxLength ?? 1000
      return z.string().trim().max(max, maxChars(max))
    }
    case 'phone':
      return z.string().trim().regex(PHONE_REGEX, { error: 'Teléfono inválido. Ejemplo: 11 5555 0000' })
    case 'boolean':
      return z.boolean()
    case 'weekdays':
      return z.array(z.number().int().min(0).max(6)).max(7)
    case 'list': {
      const itemMax = field.itemMaxLength ?? 100
      const item = z.string().trim().min(1, { error: REQUIRED }).max(itemMax, maxChars(itemMax))
      return z.array(item).max(field.maxItems ?? 20, maxEntries(field.maxItems ?? 20))
    }
    case 'items': {
      const shape = Object.fromEntries(field.itemFields.map((f) => [f.key, itemFieldSchema(f)]))
      return z.array(z.object(shape)).max(field.maxItems ?? 30, maxEntries(field.maxItems ?? 30))
    }
    default:
      throw new Error(`Tipo de campo desconocido: ${field.type}`)
  }
}

// Todos los campos son opcionales al guardar (borrador). Los obligatorios se
// exigen recién al publicar, con getMissingFields (ver botConfig.js).
export function buildConfigSchema(fields) {
  const shape = Object.fromEntries(
    fields.map((field) => [field.key, emptyToUndefined(fieldSchema(field).optional())]),
  )
  return z.object(shape)
}

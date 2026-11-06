import { z } from '../utils/zod.js';
import { isEmpty } from './render.js';

// Arma, a partir de los "fields" de una plantilla, el esquema Zod que valida
// los datos del negocio (bot.config). Así cada plantilla define sus propios
// campos en el JSON y no hace falta escribir un esquema a mano por plantilla.

export const PHONE_REGEX = /^\+?[0-9\s()-]{6,20}$/;

// Un string vacío cuenta como "no cargado", para que el asistente pueda guardar
// un borrador con campos sin completar.
const emptyToUndefined = (schema) =>
  z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? undefined : v), schema);

function itemFieldSchema(field) {
  let schema;
  if (field.type === 'price') {
    schema = z.number().min(0).max(100_000_000);
  } else {
    const max = field.maxLength ?? (field.type === 'textarea' ? 500 : 100);
    schema = z.string().trim().min(1).max(max);
  }
  return field.required ? schema : emptyToUndefined(schema.optional());
}

function fieldSchema(field) {
  switch (field.type) {
    case 'text':
      return z.string().trim().max(field.maxLength ?? 200);
    case 'textarea':
      return z.string().trim().max(field.maxLength ?? 1000);
    case 'phone':
      return z.string().trim().regex(PHONE_REGEX, 'Teléfono inválido');
    case 'boolean':
      return z.boolean();
    case 'weekdays':
      return z
        .array(z.number().int().min(0).max(6))
        .max(7)
        .transform((days) => [...new Set(days)].sort());
    case 'list':
      return z.array(z.string().trim().min(1).max(field.itemMaxLength ?? 100)).max(field.maxItems ?? 20);
    case 'items': {
      const shape = Object.fromEntries(field.itemFields.map((f) => [f.key, itemFieldSchema(f)]));
      return z.array(z.object(shape)).max(field.maxItems ?? 30);
    }
    default:
      throw new Error(`Tipo de campo desconocido: ${field.type}`);
  }
}

// Todos los campos son opcionales al guardar (borrador). Los obligatorios se
// exigen recién al publicar, con getMissingFields.
export function buildConfigSchema(definition) {
  const shape = Object.fromEntries(
    definition.fields.map((field) => [field.key, emptyToUndefined(fieldSchema(field).optional())]),
  );
  return z.object(shape);
}

// Campos obligatorios que todavía no se completaron: [{ key, label }]
export function getMissingFields(definition, config) {
  return definition.fields
    .filter((field) => field.required && isEmpty(config?.[field.key]))
    .map((field) => ({ key: field.key, label: field.label }));
}

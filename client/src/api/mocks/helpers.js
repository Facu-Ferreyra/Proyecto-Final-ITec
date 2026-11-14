// Funciones de apoyo del servidor de ejemplo.

import { getMissingFields } from '../../schemas/botConfig.js'
import { findTemplate } from './templates.js'

// Espera un rato para que se vean los estados de carga, como con un servidor real.
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Respuestas con la misma forma que el backend.
export const ok = (data, status = 200) => ({ status, data })
export const fail = (status, code, message, details) => ({ status, data: { error: { code, message, details } } })

// Campos obligatorios que le faltan a un bot según su plantilla.
export const missingFieldsOf = (templateId, config) => getMissingFields(findTemplate(templateId).config.fields, config)

// Arma el bot con la misma forma que devuelve el backend.
export function toBotResponse(bot) {
  const template = findTemplate(bot.templateId)
  const missingFields = missingFieldsOf(bot.templateId, bot.config)
  return {
    id: bot.id,
    name: bot.name,
    slug: bot.slug,
    status: bot.status,
    publishedAt: bot.publishedAt,
    publicPath: `/chat/${bot.slug}`,
    template: { id: template.id, key: template.key, name: template.name },
    config: bot.config,
    missingFields,
    canPublish: missingFields.length === 0,
    stats: { conversations: 0, leads: 0 },
    createdAt: bot.createdAt,
    updatedAt: bot.updatedAt,
  }
}

// "Peluquería Lola" → "peluqueria-lola-x7k2mz" (versión simple del slug del backend).
export function makeSlug(name) {
  const base = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // saca tildes
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  const suffix = Math.random().toString(36).slice(2, 8)
  return `${base || 'bot'}-${suffix}`
}

// Misma regla que el backend: el nombre del bot tiene de 2 a 60 caracteres.
export function nameError(name) {
  const trimmed = typeof name === 'string' ? name.trim() : ''
  if (trimmed.length >= 2 && trimmed.length <= 60) return null
  return fail(400, 'VALIDATION_ERROR', 'Hay datos inválidos en el pedido', [
    { path: 'name', message: 'El nombre tiene que tener entre 2 y 60 caracteres' },
  ])
}

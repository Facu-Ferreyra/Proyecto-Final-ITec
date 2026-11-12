// Vista previa simulada: muestra el saludo y los botones del menú.
// Las respuestas reales y los flujos (turnos, pedidos) los resuelve el motor
// del backend; acá solo se avisa que es un ejemplo.

import { isEmpty } from '../../schemas/botConfig.js'
import { ok } from './helpers.js'
import { findTemplate } from './templates.js'

// Botones del menú: se ocultan los que necesitan un dato que no está cargado.
function previewMenu(bot) {
  return findTemplate(bot.templateId)
    .config.menu.filter((item) => item.requires.every((key) => !isEmpty(bot.config[key])))
    .map((item) => ({ id: item.id, label: item.label }))
}

export function previewStart(bot) {
  const name = bot.config.businessName || 'tu negocio'
  return ok({
    title: bot.config.businessName || bot.name,
    replies: [`¡Hola! Soy el asistente de ${name}. ¿En qué te puedo ayudar?`],
    options: previewMenu(bot),
  })
}

export function previewMessage(bot, body) {
  const option = previewMenu(bot).find((o) => o.id === body?.optionId)
  const reply = option
    ? `(Vista previa de ejemplo) Elegiste "${option.label}". Con la API real acá aparece la respuesta del bot.`
    : 'No entendí tu mensaje. Elegí una de las opciones 👇'
  return ok({
    replies: [reply, '¿Te ayudo con algo más?'],
    options: previewMenu(bot),
    input: null,
    state: null,
    leadPreview: null,
  })
}

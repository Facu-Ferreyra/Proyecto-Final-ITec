// Lógica del asistente de 4 pasos: crear el borrador, guardar los datos,
// validar y publicar. Las pantallas de cada paso solo muestran.

import { useState } from 'react'
import { createBot, publishBot, updateBot } from '../../api/bots.js'
import { removeEmptyRows, validateConfig } from '../../schemas/botConfig.js'
import { botNameSchema } from '../../schemas/botName.js'
import { apiDetailsToFieldErrors } from '../../schemas/fieldErrors.js'
import { errorText } from './errorText.js'
import { useUnsavedChangesWarning } from './useUnsavedChangesWarning.js'

// Nombre provisorio del borrador: en el paso 1 todavía no hay nombre del negocio.
const DRAFT_NAME = 'EasyBot'

// El nombre del bot sale del "Nombre del negocio". El backend acepta hasta 60
// caracteres (el nombre del negocio, hasta 80), por eso se recorta.
function botNameFrom(config, currentName) {
  const name = (config.businessName ?? '').trim().slice(0, 60)
  return botNameSchema.safeParse(name).success ? name : currentName
}

// Saca los errores de un campo y de sus partes (ej.: "services" y "services.0.name").
function withoutErrorsOf(errors, key) {
  return Object.fromEntries(Object.entries(errors).filter(([path]) => path !== key && !path.startsWith(`${key}.`)))
}

// initialBot = bot a editar (o null si se crea uno nuevo); templates = plantillas activas.
export function useBotWizard(initialBot, templates) {
  const [step, setStep] = useState(initialBot ? 2 : 1) // al editar se arranca en el paso 2
  const [bot, setBot] = useState(initialBot)
  const [templateId, setTemplateId] = useState(initialBot?.template.id ?? null)
  const [config, setConfig] = useState(initialBot?.config ?? {})
  const [errors, setErrors] = useState({}) // { "services.0.name": "Completá este campo" }
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('') // error general (no de un campo)
  const [previewKey, setPreviewKey] = useState(0) // cambia para recargar la vista previa
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useUnsavedChangesWarning(hasUnsavedChanges)

  const template = templates.find((t) => t.id === templateId) ?? null

  // Hace un pedido mostrando "ocupado" y el error si falla. Devuelve null si falló.
  async function run(action) {
    setBusy(true)
    setNotice('')
    try {
      return await action()
    } catch (error) {
      if (error.code === 'VALIDATION_ERROR') setErrors(apiDetailsToFieldErrors(error.details))
      setNotice(errorText(error))
      return null
    } finally {
      setBusy(false)
    }
  }

  // Paso 1 → 2: crea el borrador (si todavía no existe).
  async function createDraft() {
    if (bot) return setStep(2)
    const created = await run(() => createBot({ templateId, name: DRAFT_NAME, config: {} }))
    if (!created) return
    setBot(created)
    setConfig(created.config)
    setStep(2)
  }

  function changeField(key, value) {
    setConfig((current) => ({ ...current, [key]: value }))
    setErrors((current) => withoutErrorsOf(current, key))
    setHasUnsavedChanges(true)
  }

  // Valida en el front y guarda. PUT reemplaza la config completa: se manda todo.
  // Devuelve el bot guardado, o null si hubo errores.
  async function save() {
    const cleanConfig = removeEmptyRows(template.config.fields, config)
    setConfig(cleanConfig) // así los errores ("services.1.name") coinciden con las filas que se ven
    const found = validateConfig(template.config.fields, cleanConfig)
    setErrors(found)
    if (Object.keys(found).length > 0) return null

    const saved = await run(() =>
      updateBot(bot.id, { name: botNameFrom(cleanConfig, bot.name), config: cleanConfig }),
    )
    if (!saved) return null
    setBot(saved)
    setConfig(saved.config)
    setHasUnsavedChanges(false)
    setPreviewKey((key) => key + 1)
    return saved
  }

  async function saveAndContinue() {
    if (await save()) setStep(3)
  }

  // Paso 3 → 4. Si ya estaba publicado, los cambios ya se guardaron en el paso 2.
  async function publish() {
    if (bot.status === 'PUBLISHED') return setStep(4)
    const published = await run(() => publishBot(bot.id))
    if (!published) return
    setBot(published)
    setStep(4)
  }

  const goTo = (number) => {
    setNotice('')
    setStep(number)
  }

  return {
    step, bot, template, templateId, config, errors, busy, notice, previewKey, hasUnsavedChanges,
    selectTemplate: setTemplateId, createDraft, changeField, save, saveAndContinue, publish, goTo,
  }
}

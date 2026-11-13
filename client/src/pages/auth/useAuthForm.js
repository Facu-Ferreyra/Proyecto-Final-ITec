// Estado y envío de un formulario de auth (Brandon), compartido por login y registro.
// Valida con Zod antes de mandar; si el backend rechaza, muestra su mensaje.

import { useState } from 'react'
import { zodErrorToFieldErrors } from '../../schemas/fieldErrors.js'
import { authErrorToFormErrors } from './authErrors.js'

export function useAuthForm({ initialValues, schema, onSubmit }) {
  const [values, setValues] = useState(initialValues)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Al escribir en un campo se borra su error (el resto queda hasta el próximo envío).
  function setField(name, value) {
    setValues((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) => (current[name] ? { ...current, [name]: undefined } : current))
    setFormError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting) return // evita el doble envío

    const parsed = schema.safeParse(values)
    if (!parsed.success) {
      setFieldErrors(zodErrorToFieldErrors(parsed.error))
      return
    }

    setSubmitting(true)
    setFormError('')
    try {
      await onSubmit(parsed.data)
      // Si salió bien, el contexto ya tiene el usuario y la página redirige sola.
    } catch (error) {
      const { form, fields } = authErrorToFormErrors(error)
      setFieldErrors(fields ?? {})
      setFormError(form ?? '')
      setSubmitting(false)
    }
  }

  return { values, fieldErrors, formError, submitting, setField, handleSubmit }
}

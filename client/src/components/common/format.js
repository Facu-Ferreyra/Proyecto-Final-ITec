// Formatos para mostrar datos de la API en español (Argentina).

const priceFormatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
const dateFormatter = new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'short' })

// 18000 → "$ 18.000"
export const formatPrice = (value) => priceFormatter.format(value ?? 0)

// "2026-11-12T15:00:00.000Z" → "12/11/26, 12:00" (en la hora del navegador)
export const formatDate = (iso) => (iso ? dateFormatter.format(new Date(iso)) : '')

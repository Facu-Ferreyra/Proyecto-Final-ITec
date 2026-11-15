// Formatos para mostrar datos de la API en español (Argentina).

const priceFormatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
const dayFormatter = new Intl.DateTimeFormat('es-AR', { dateStyle: 'short' })

// 18000 → "$ 18.000"
export const formatPrice = (value) => priceFormatter.format(value ?? 0)

// Hora de 24 h a AM / PM (así se muestra en toda la app):
// "09:00" → "9:00 AM" · "15:00" → "3:00 PM" · "00:30" → "12:30 AM"
// Sin puntos ("p. m."), porque el bot agrega un punto al final de la frase.
export function to12h(time) {
  const [hours, minutes] = time.split(':').map(Number)
  const suffix = hours < 12 ? 'AM' : 'PM'
  return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${suffix}`
}

// Igual que to12h, pero si el texto no es una hora "HH:MM" lo deja como está.
export const formatTime = (value) => (/^\d{1,2}:\d{2}$/.test(value ?? '') ? to12h(value) : value)

// "2026-11-12T18:00:00.000Z" → "12/11/26, 3:00 PM" (en la hora del navegador)
export function formatDate(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  const time = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
  return `${dayFormatter.format(date)}, ${to12h(time)}`
}

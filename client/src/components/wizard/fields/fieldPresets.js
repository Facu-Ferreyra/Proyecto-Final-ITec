// Opciones predefinidas para campos que antes eran texto libre (evitan errores de
// tipeo). Los datos se guardan con la MISMA forma que espera el backend:
//   - hours: un texto ("lunes a viernes de 09:00 a 18:00 y sábado de 09:00 a 13:00")
//   - paymentMethods y timeSlots: listas de textos

import { to12h } from '../../common/format.js'

export const PAYMENT_METHODS = ['Efectivo', 'Transferencia', 'Mercado Pago', 'Tarjeta de débito', 'Tarjeta de crédito']

// Días de lunes a domingo, en minúscula porque van dentro de una oración.
export const DAYS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']

// "06:00", "06:30" … "23:30"
function timesEvery30(fromHour, toHour) {
  const times = []
  for (let hour = fromHour; hour <= toHour; hour++) {
    const hh = String(hour).padStart(2, '0')
    times.push(`${hh}:00`, `${hh}:30`)
  }
  return times
}

export const OPENING_TIMES = timesEvery30(0, 23) // atención: cualquier hora (hay negocios nocturnos)
export const SLOT_TIMES = timesEvery30(7, 21) // turnos: 07:00 a 21:30

// ---- Horarios de atención: bloques ⇄ texto ----
// Un bloque: { from: 'lunes', to: 'viernes', open: '09:00', close: '18:00' }

// Las horas se guardan internamente en 24 h ("18:00") y se muestran con AM / PM
// (to12h, compartida con el panel en components/common/format.js).
export { to12h }

// Lo inverso de to12h. También acepta "09:00" (24 h) por si el texto se guardó así.
function from12h(text) {
  const [, h, m, suffix] = text.match(/^(\d{1,2}):(\d{2})(?: ([AP])M)?$/)
  let hours = Number(h)
  if (suffix === 'A' && hours === 12) hours = 0
  if (suffix === 'P' && hours < 12) hours += 12
  return `${String(hours).padStart(2, '0')}:${m}`
}

const isComplete = (block) => block.from && block.to && block.open && block.close

function blockText({ from, to, open, close }) {
  const days = from === to ? from : `${from} a ${to}`
  return `${days} de ${to12h(open)} a ${to12h(close)}`
}

// [bloque, bloque] → "lunes a viernes de 9:00 AM a 6:00 PM y sábado de 9:00 AM a 1:00 PM".
// Los bloques a medio completar no se incluyen.
export function hoursToText(blocks) {
  const parts = blocks.filter(isComplete).map(blockText)
  if (parts.length <= 1) return parts[0] ?? ''
  return `${parts.slice(0, -1).join(', ')} y ${parts.at(-1)}`
}

const DAY = `(${DAYS.join('|')})`
const TIME = '(\\d{1,2}:\\d{2}(?: [AP]M)?)'
const BLOCK_REGEX = new RegExp(`^${DAY}(?: a ${DAY})? de ${TIME} a ${TIME}$`)

// Lo inverso, para poder editar un bot ya guardado. Devuelve null si el texto
// no tiene este formato (por ejemplo, si se escribió a mano antes de este cambio).
export function textToHours(text) {
  const parts = text.split(/, | y /)
  const blocks = parts.map((part) => {
    const match = part.match(BLOCK_REGEX)
    return match && { from: match[1], to: match[2] ?? match[1], open: from12h(match[3]), close: from12h(match[4]) }
  })
  return blocks.every(Boolean) ? blocks : null
}

export const EMPTY_BLOCK = { from: '', to: '', open: '', close: '' }

// ---- Precios (plantilla de preguntas frecuentes): filas ⇄ texto ----
// Una fila: { name: 'Corte de pelo', price: 8000 }. El texto: una por línea,
// "Corte de pelo: $ 8.000". El bot lo muestra tal cual al tocar "Precios".

const formatAmount = (price) => price.toLocaleString('es-AR', { maximumFractionDigits: 2 })

export function pricesToText(rows) {
  return rows
    .filter((row) => row.name.trim() && row.price !== '')
    .map((row) => `${row.name.trim()}: $ ${formatAmount(row.price)}`)
    .join('\n')
}

// El nombre no puede tener "$": así un texto viejo en una línea
// ("Corte: $ 8.000 · Color: $ 20.000") no se confunde con un solo producto.
const PRICE_LINE = /^([^$]+): \$ ([\d.]+(?:,\d+)?)$/

// Lo inverso, para editar un bot guardado. null si no tiene este formato.
export function textToPrices(text) {
  const rows = text.split('\n').map((line) => {
    const match = line.match(PRICE_LINE)
    return match && { name: match[1], price: Number(match[2].replaceAll('.', '').replace(',', '.')) }
  })
  return rows.every(Boolean) ? rows : null
}

export const EMPTY_PRICE_ROW = { name: '', price: '' }

// Convierte un dato del negocio en texto para el resumen del paso 3.
// Devuelve '' si el dato no está cargado (ahí se muestra "Sin cargar").

import { isEmpty } from '../../schemas/botConfig.js'

const WEEKDAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const priceFormatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

// Un ítem en una línea: "Corte de pelo — $ 8.000"
function formatItem(field, item) {
  return field.itemFields
    .filter((f) => !isEmpty(item[f.key]))
    .map((f) => (f.type === 'price' ? priceFormatter.format(item[f.key]) : item[f.key]))
    .join(' — ')
}

export function formatValue(field, value) {
  if (isEmpty(value)) return ''
  switch (field.type) {
    case 'boolean':
      return value ? 'Sí' : 'No'
    case 'weekdays':
      // Ordenados de lunes a domingo.
      return [1, 2, 3, 4, 5, 6, 0].filter((d) => value.includes(d)).map((d) => WEEKDAY_NAMES[d]).join(', ')
    case 'list':
      return value.join(', ')
    case 'items':
      return value.map((item) => formatItem(field, item)).join('\n')
    default:
      return String(value)
  }
}

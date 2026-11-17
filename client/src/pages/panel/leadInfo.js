// Textos en español de los leads (contactos, turnos y pedidos) y cómo mostrar
// sus datos. Los estados válidos son los de docs/endpoints.md (PATCH /api/leads/:id).

import { formatPrice, formatTime } from '../../components/common/format.js'

export const LEAD_TYPES = {
  CONTACT: { tab: 'Contactos', name: 'Contacto', statuses: { NEW: 'Nuevo', CONTACTED: 'Contactado' } },
  APPOINTMENT: {
    tab: 'Turnos',
    name: 'Turno',
    statuses: { PENDING: 'Pendiente', CONFIRMED: 'Confirmado', CANCELLED: 'Cancelado' },
  },
  ORDER: {
    tab: 'Pedidos',
    name: 'Pedido',
    statuses: { NEW: 'Nuevo', IN_PROGRESS: 'En preparación', DELIVERED: 'Entregado', CANCELLED: 'Cancelado' },
  },
}

// Qué tipo de lead deja cada plantilla. Si es otra (creada por un admin), se muestran todos.
const TEMPLATE_LEADS = { faq: ['CONTACT'], turnos: ['APPOINTMENT'], pedidos: ['ORDER'] }

export const leadTypesFor = (templateKey) => TEMPLATE_LEADS[templateKey] ?? Object.keys(LEAD_TYPES)

export const statusLabel = (lead) => LEAD_TYPES[lead.type]?.statuses[lead.status] ?? lead.status

// Títulos de las secciones del panel (en plural), una por estado.
export const SECTION_TITLES = {
  NEW: 'Nuevos',
  CONTACTED: 'Contactados',
  PENDING: 'Pendientes',
  CONFIRMED: 'Confirmados',
  IN_PROGRESS: 'En preparación',
  DELIVERED: 'Entregados',
  CANCELLED: 'Cancelados',
}

// Agrupa los leads por estado, en el orden de LEAD_TYPES (ej.: Pendientes,
// Confirmados, Cancelados). Las secciones vacías no se devuelven.
export function groupByStatus(leads, type) {
  return Object.keys(LEAD_TYPES[type].statuses)
    .map((status) => ({ status, title: SECTION_TITLES[status] ?? status, leads: leads.filter((l) => l.status === status) }))
    .filter((section) => section.leads.length > 0)
}

// Datos del lead en filas [etiqueta, valor], sin las que están vacías.
export function leadDetails(lead) {
  const data = lead.data ?? {}
  let rows

  if (lead.type === 'APPOINTMENT') {
    rows = [
      ['Servicio', data.service],
      ['Día', data.date],
      ['Horario', formatTime(data.time)],
    ]
  } else if (lead.type === 'ORDER') {
    const items = (data.items ?? []).map((item) => `${item.quantity} × ${item.name} (${formatPrice(item.subtotal)})`)
    rows = [
      ['Productos', items.join('\n')],
      ['Total', data.total !== undefined ? formatPrice(data.total) : ''],
      ['Entrega', data.delivery],
      ['Dirección', data.deliveryAddress],
      ['Notas', data.notes],
    ]
  } else {
    rows = [['Mensaje', data.message]]
  }

  return rows.filter(([, value]) => value)
}

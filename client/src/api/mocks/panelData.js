// Datos de ejemplo del panel: conversaciones y leads de los bots de botsData.js.
// Misma forma que guarda el backend (ver "Qué guarda cada tipo de lead" en docs/endpoints.md).

const ago = (minutes) => new Date(Date.now() - minutes * 60_000).toISOString()
const LOLA_GREETING = '¡Hola! Soy el asistente de Peluquería Lola. ¿En qué te puedo ayudar?'

// messages: [sender, content]
export const conversations = [
  {
    id: 'conv-a',
    botId: 'bot-1',
    visitorId: 'visitor-ana',
    contactName: 'Ana Pérez',
    leadTypes: ['APPOINTMENT'],
    createdAt: ago(95),
    updatedAt: ago(90),
    messages: [
      ['BOT', LOLA_GREETING],
      ['VISITOR', 'Sacar un turno'],
      ['BOT', '¿Qué servicio querés?'],
      ['VISITOR', 'Corte de pelo'],
      ['BOT', '¿Qué día te queda bien?'],
      ['VISITOR', 'Jue 19 nov'],
      ['BOT', '¿En qué horario?'],
      ['VISITOR', '15:00'],
      ['BOT', '¿A nombre de quién?'],
      ['VISITOR', 'Ana Pérez'],
      ['BOT', '¿A qué teléfono te contactamos?'],
      ['VISITOR', '11 5555 0101'],
      ['BOT', '¡Listo, Ana Pérez! Pedimos tu turno:\nCorte de pelo — Jue 19 nov a las 15:00.\nEl negocio te va a confirmar.'],
    ],
  },
  {
    id: 'conv-b',
    botId: 'bot-1',
    visitorId: 'visitor-anon',
    contactName: null,
    leadTypes: [],
    createdAt: ago(40),
    updatedAt: ago(38),
    messages: [
      ['BOT', LOLA_GREETING],
      ['VISITOR', 'Horarios'],
      ['BOT', 'Atendemos martes a sábado, 9 a 19 h.'],
    ],
  },
  {
    id: 'conv-c',
    botId: 'bot-2',
    visitorId: 'visitor-juan',
    contactName: 'Juan Gómez',
    leadTypes: ['ORDER'],
    createdAt: ago(30),
    updatedAt: ago(25),
    messages: [
      ['BOT', '¡Hola! Soy el asistente de Viandas Don Pepe. ¿En qué te puedo ayudar?'],
      ['VISITOR', 'Hacer un pedido'],
      ['BOT', '¿Qué querés pedir?'],
      ['VISITOR', 'Confirmar pedido'],
      ['BOT', '¡Gracias, Juan Gómez! Recibimos tu pedido por $ 18.000.\nEl negocio te va a contactar para confirmarlo.'],
    ],
  },
]

export const leads = [
  {
    id: 'lead-1',
    botId: 'bot-1',
    conversationId: 'conv-a',
    type: 'APPOINTMENT',
    status: 'PENDING',
    contactName: 'Ana Pérez',
    contactPhone: '11 5555 0101',
    data: { service: 'Corte de pelo', date: 'Jue 19 nov', dateValue: '2026-11-19', time: '15:00' },
    createdAt: ago(90),
  },
  {
    id: 'lead-2',
    botId: 'bot-1',
    conversationId: null,
    type: 'APPOINTMENT',
    status: 'CONFIRMED',
    contactName: 'Lucía Díaz',
    contactPhone: '11 4444 3030',
    data: { service: 'Color', date: 'Sáb 21 nov', dateValue: '2026-11-21', time: '11:00' },
    createdAt: ago(300),
  },
  {
    id: 'lead-3',
    botId: 'bot-2',
    conversationId: 'conv-c',
    type: 'ORDER',
    status: 'NEW',
    contactName: 'Juan Gómez',
    contactPhone: '11 6666 2020',
    data: {
      items: [
        { name: 'Vianda de pollo', quantity: 2, unitPrice: 6500, subtotal: 13000 },
        { name: 'Tarta de verdura', quantity: 1, unitPrice: 5000, subtotal: 5000 },
      ],
      total: 18000,
      delivery: 'Envío a domicilio',
      deliveryValue: 'delivery',
      deliveryAddress: 'Av. Siempreviva 742',
      notes: 'Tocar timbre 2B',
    },
    createdAt: ago(25),
  },
]

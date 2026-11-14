// Textos de las 3 plantillas para la home.
// Los datos que pide y las opciones del bot coinciden con las plantillas del
// servidor (server/src/engine/templates/*.json): si cambian allá, actualizar acá.

export const TEMPLATES_INFO = [
  {
    title: 'Preguntas frecuentes',
    summary: 'Un menú con preguntas predefinidas: horarios, precios, ubicación y formas de pago.',
    idealFor: 'casi cualquier comercio',
    asks: 'Nombre del negocio, horarios, dirección, precios, formas de pago, teléfono y tus propias preguntas con sus respuestas.',
    options: ['Horarios', 'Precios', 'Ubicación', 'Formas de pago', 'Teléfono', 'Tus preguntas', 'Dejar mis datos'],
    flow: null,
    panel: 'las conversaciones y los contactos que te dejaron.',
  },
  {
    title: 'Turnos simples',
    summary: 'Guía al visitante para pedir servicio, día, horario y datos de contacto.',
    idealFor: 'peluquerías, consultorios y talleres',
    asks: 'Nombre del negocio, horarios, dirección, tus servicios con precio, los días y horarios en que das turnos y tu teléfono.',
    options: ['Horarios', 'Precios', 'Ubicación', 'Sacar un turno'],
    flow: 'El cliente elige servicio, día y horario, y deja su nombre y teléfono.',
    panel: 'las solicitudes de turno, para marcarlas como pendientes, confirmadas o canceladas.',
    featured: true,
  },
  {
    title: 'Toma de pedidos',
    summary: 'Muestra tu catálogo, arma el pedido y pide los datos de entrega.',
    idealFor: 'gastronomía y venta de productos',
    asks: 'Nombre del negocio, horarios, dirección, tus productos con precio y descripción, si hacés envíos, formas de pago y tu teléfono.',
    options: ['Hacer un pedido', 'Ver productos y precios', 'Envíos', 'Horarios', 'Ubicación', 'Formas de pago'],
    flow: 'El cliente arma su pedido, elige retiro o envío y deja sus datos.',
    panel: 'los pedidos con sus ítems, el total y los datos de contacto y entrega.',
  },
]

export const BUSINESS_TYPES = [
  'Peluquerías y centros de estética',
  'Locales de ropa y accesorios',
  'Viandas y panaderías',
  'Talleres y servicios a domicilio',
  'Emprendimientos que venden por redes sociales',
]

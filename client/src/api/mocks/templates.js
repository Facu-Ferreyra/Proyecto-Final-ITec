// Plantillas de ejemplo: copia simplificada de server/src/engine/templates/*.json.
// "fields" es igual al del backend (lo que pide el asistente en el paso 2).
// "menu" está resumido: solo lo necesario para la vista previa de ejemplo.

const businessName = { key: 'businessName', label: 'Nombre del negocio', type: 'text', required: true, maxLength: 80, placeholder: 'Peluquería Lola' }
const hours = { key: 'hours', label: 'Horarios de atención', type: 'text', required: true, maxLength: 200, placeholder: 'Martes a sábado, 9 a 19 h' }
const address = { key: 'address', label: 'Dirección', type: 'text', maxLength: 200, placeholder: 'Calle y número' }
const paymentMethods = { key: 'paymentMethods', label: 'Formas de pago', type: 'list', maxItems: 10, itemMaxLength: 50, placeholder: 'Efectivo' }
const businessPhone = { key: 'businessPhone', label: 'Teléfono o WhatsApp del negocio', type: 'phone', placeholder: '11 5555 0000' }

const faq = {
  id: 'tpl-faq',
  key: 'faq',
  name: 'Preguntas frecuentes',
  description: 'Menú con preguntas predefinidas: horarios, precios, ubicación y formas de pago.',
  config: {
    idealFor: 'Casi cualquier comercio',
    fields: [
      businessName,
      hours,
      address,
      { key: 'prices', label: 'Precios', type: 'textarea', maxLength: 1000, placeholder: 'Corte: $ 8.000 · Color: $ 20.000' },
      paymentMethods,
      businessPhone,
      {
        key: 'faqs', label: 'Otras preguntas', type: 'items', maxItems: 10,
        itemFields: [
          { key: 'question', label: 'Pregunta', type: 'text', required: true, maxLength: 60 },
          { key: 'answer', label: 'Respuesta', type: 'textarea', required: true, maxLength: 500 },
        ],
      },
    ],
    menu: [
      { id: 'hours', label: 'Horarios', requires: ['hours'] },
      { id: 'prices', label: 'Precios', requires: ['prices'] },
      { id: 'location', label: 'Ubicación', requires: ['address'] },
      { id: 'payment', label: 'Formas de pago', requires: ['paymentMethods'] },
      { id: 'phone', label: 'Teléfono', requires: ['businessPhone'] },
      { id: 'contact', label: 'Dejar mis datos', requires: [] },
    ],
  },
}

const turnos = {
  id: 'tpl-turnos',
  key: 'turnos',
  name: 'Turnos simples',
  description: 'Guía al visitante para pedir servicio, día, horario y contacto.',
  config: {
    idealFor: 'Peluquerías, consultorios y talleres',
    fields: [
      businessName,
      hours,
      address,
      {
        key: 'services', label: 'Servicios', type: 'items', required: true, maxItems: 15,
        itemFields: [
          { key: 'name', label: 'Servicio', type: 'text', required: true, maxLength: 40 },
          { key: 'price', label: 'Precio', type: 'price' },
        ],
      },
      { key: 'workingDays', label: 'Días que das turnos', type: 'weekdays', required: true },
      { key: 'timeSlots', label: 'Horarios de los turnos', type: 'list', required: true, maxItems: 24, itemMaxLength: 20, placeholder: '10:00' },
      businessPhone,
    ],
    menu: [
      { id: 'hours', label: 'Horarios', requires: ['hours'] },
      { id: 'prices', label: 'Precios', requires: ['services'] },
      { id: 'location', label: 'Ubicación', requires: ['address'] },
      { id: 'book', label: 'Sacar un turno', requires: [] },
    ],
  },
}

const pedidos = {
  id: 'tpl-pedidos',
  key: 'pedidos',
  name: 'Toma de pedidos',
  description: 'Muestra tu catálogo, arma el pedido y pide los datos de entrega.',
  config: {
    idealFor: 'Gastronomía y venta de productos',
    fields: [
      { ...businessName, placeholder: 'Viandas Don Pepe' },
      { ...hours, placeholder: 'Lunes a viernes, 11 a 21 h' },
      address,
      {
        key: 'catalog', label: 'Productos', type: 'items', required: true, maxItems: 30,
        itemFields: [
          { key: 'name', label: 'Producto', type: 'text', required: true, maxLength: 40 },
          { key: 'price', label: 'Precio', type: 'price', required: true },
          { key: 'description', label: 'Descripción', type: 'text', maxLength: 120 },
        ],
      },
      { key: 'offersDelivery', label: '¿Hacés envíos a domicilio?', type: 'boolean' },
      { key: 'deliveryInfo', label: 'Información de envíos', type: 'text', maxLength: 200, placeholder: 'Envío sin cargo en zona centro' },
      paymentMethods,
      businessPhone,
    ],
    menu: [
      { id: 'order', label: 'Hacer un pedido', requires: [] },
      { id: 'catalog', label: 'Ver productos y precios', requires: ['catalog'] },
      { id: 'delivery', label: 'Envíos', requires: ['offersDelivery', 'deliveryInfo'] },
      { id: 'hours', label: 'Horarios', requires: ['hours'] },
      { id: 'location', label: 'Ubicación', requires: ['address'] },
      { id: 'payment', label: 'Formas de pago', requires: ['paymentMethods'] },
    ],
  },
}

export const templates = [faq, turnos, pedidos]

export const findTemplate = (id) => templates.find((t) => t.id === id)

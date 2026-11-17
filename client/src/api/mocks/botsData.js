// Bots de ejemplo (los mismos del prototipo). Viven en memoria: el servidor de
// ejemplo los modifica, y al recargar la página vuelven a estos valores.
// Es "const" porque el arreglo no se reemplaza: se le agregan o sacan bots.

export const bots = [
  {
    id: 'bot-1',
    name: 'Peluquería Lola',
    slug: 'peluqueria-lola-k3m9xa',
    status: 'PUBLISHED',
    publishedAt: '2026-11-06T15:00:00.000Z',
    templateId: 'tpl-turnos',
    config: {
      businessName: 'Peluquería Lola',
      hours: 'Martes a sábado, 9 a 19 h',
      services: [
        { name: 'Corte de pelo', price: 8000 },
        { name: 'Color', price: 20000 },
        { name: 'Barba', price: 5000 },
      ],
      workingDays: [2, 3, 4, 5, 6],
      timeSlots: ['10:00', '11:00', '15:00', '16:00'],
      businessPhone: '11 5555 0000',
    },
    createdAt: '2026-11-05T12:00:00.000Z',
    updatedAt: '2026-11-06T15:00:00.000Z',
  },
  {
    id: 'bot-2',
    name: 'Viandas Don Pepe',
    slug: 'viandas-don-pepe-p7r2tw',
    status: 'PUBLISHED',
    publishedAt: '2026-11-07T10:00:00.000Z',
    templateId: 'tpl-pedidos',
    config: {
      businessName: 'Viandas Don Pepe',
      hours: 'Lunes a viernes, 11 a 21 h',
      catalog: [
        { name: 'Vianda de pollo', price: 6500 },
        { name: 'Vianda vegetariana', price: 6000 },
        { name: 'Postre del día', price: 2500 },
      ],
      offersDelivery: true,
      deliveryInfo: 'Envío sin cargo en zona centro',
      paymentMethods: ['Efectivo', 'Transferencia'],
    },
    createdAt: '2026-11-06T12:00:00.000Z',
    updatedAt: '2026-11-07T10:00:00.000Z',
  },
  {
    id: 'bot-3',
    name: 'Taller Ruiz',
    slug: 'taller-ruiz-h4n8qe',
    status: 'DRAFT',
    publishedAt: null,
    templateId: 'tpl-faq',
    config: { businessName: 'Taller Ruiz' },
    createdAt: '2026-11-08T12:00:00.000Z',
    updatedAt: '2026-11-08T12:00:00.000Z',
  },
]

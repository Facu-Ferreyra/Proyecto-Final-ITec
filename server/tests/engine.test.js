// Tests del motor del bot (Santiago). No usan la base de datos.
// Correr con: npm test -w server
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  baseTemplates,
  buildConfigSchema,
  getMissingFields,
  handleMessage,
  startChat,
  templateConfigSchema,
} from '../src/engine/index.js';
import { generateSlug, slugify } from '../src/modules/bots/slug.js';

const byKey = Object.fromEntries(baseTemplates.map((t) => [t.key, t]));
const NOW = new Date('2026-11-06T15:00:00Z'); // viernes

// Simula un chat: manda cada paso y va pasando el state.
function chat(template, config, steps) {
  let state = null;
  let last;
  for (const step of steps) {
    last = handleMessage({ template, config, state, now: NOW, ...step });
    state = last.state;
  }
  return last;
}

const turnosConfig = {
  businessName: 'Peluquería Lola',
  hours: 'martes a sábado de 9 a 19 h',
  services: [{ name: 'Corte de pelo', price: 8000 }, { name: 'Color' }],
  workingDays: [2, 3, 4, 5, 6],
  timeSlots: ['10:00', '15:00'],
};

const pedidosConfig = {
  businessName: 'Viandas Don Pepe',
  hours: 'Lunes a viernes',
  catalog: [
    { name: 'Vianda de pollo', price: 4500 },
    { name: 'Postre del día', price: 1500 },
  ],
  offersDelivery: false,
};

describe('plantillas base', () => {
  for (const template of baseTemplates) {
    it(`${template.key}.json cumple el formato de plantilla`, () => {
      const result = templateConfigSchema.safeParse(template.config);
      assert.ok(result.success, JSON.stringify(result.error?.issues));
    });
  }
});

describe('config del bot', () => {
  it('acepta un borrador incompleto y avisa qué falta', () => {
    const def = byKey.turnos.config;
    const config = buildConfigSchema(def).parse({ businessName: 'Lola', address: '   ' });
    assert.equal(config.address, undefined);
    const missing = getMissingFields(def, config).map((f) => f.key);
    assert.deepEqual(missing, ['hours', 'services', 'workingDays', 'timeSlots']);
  });

  it('rechaza tipos incorrectos', () => {
    const schema = buildConfigSchema(byKey.pedidos.config);
    assert.throws(() => schema.parse({ catalog: [{ name: 'Pollo', price: 'caro' }] }));
    assert.throws(() => schema.parse({ businessPhone: 'llamame' }));
  });

  it('descarta campos que la plantilla no conoce', () => {
    const config = buildConfigSchema(byKey.faq.config).parse({ businessName: 'X', hacker: true });
    assert.equal('hacker' in config, false);
  });
});

describe('motor de conversación', () => {
  it('saluda con el nombre del negocio y oculta opciones sin datos', () => {
    const start = startChat(byKey.turnos, turnosConfig);
    assert.match(start.replies[0], /Peluquería Lola/);
    assert.deepEqual(start.options.map((o) => o.id), ['hours', 'prices', 'book']); // sin dirección → sin "Ubicación"
  });

  it('responde una pregunta por id o por texto', () => {
    const byId = handleMessage({ template: byKey.turnos, config: turnosConfig, optionId: 'hours' });
    const byText = handleMessage({ template: byKey.turnos, config: turnosConfig, text: 'horarios' });
    assert.equal(byId.replies[0], 'Atendemos martes a sábado de 9 a 19 h.');
    assert.deepEqual(byText.replies, byId.replies);
    assert.deepEqual(byId.options.map((o) => o.id), ['book', 'menu']);
  });

  it('opción desconocida → mensaje de ayuda y menú', () => {
    const r = handleMessage({ template: byKey.faq, config: { businessName: 'X', hours: '9 a 18' }, text: 'hola' });
    assert.match(r.replies[0], /No entendí/);
    assert.equal(r.visitorMessage, 'hola');
  });

  it('turnos: completa el flujo y arma el lead', () => {
    const r = chat(byKey.turnos, turnosConfig, [
      { optionId: 'book' },
      { optionId: '0' },
      { optionId: '2026-11-12' },
      { text: '15:00' },
      { text: 'Ana Pérez' },
      { text: '11 5555 0101' },
    ]);
    assert.equal(r.state, null);
    assert.deepEqual(r.lead, {
      type: 'APPOINTMENT',
      contactName: 'Ana Pérez',
      contactPhone: '11 5555 0101',
      data: { service: 'Corte de pelo', date: 'Jue 12 nov', dateValue: '2026-11-12', time: '15:00', status: 'PENDING' },
    });
    assert.match(r.replies.at(-1), /Ana Pérez.*Corte de pelo.*Jue 12 nov.*15:00/);
  });

  it('turnos: un teléfono inválido repite la pregunta', () => {
    const r = chat(byKey.turnos, turnosConfig, [
      { optionId: 'book' }, { optionId: '0' }, { optionId: '2026-11-12' }, { optionId: '0' }, { text: 'Ana' },
      { text: 'no tengo' },
    ]);
    assert.equal(r.lead, null);
    assert.equal(r.state.step, 4);
    assert.equal(r.input.type, 'phone');
  });

  it('cancelar vuelve al menú sin guardar nada', () => {
    const r = chat(byKey.turnos, turnosConfig, [{ optionId: 'book' }, { optionId: 'cancel' }]);
    assert.equal(r.state, null);
    assert.equal(r.lead, null);
    assert.match(r.replies[0], /cancelé/);
  });

  it('pedidos: suma productos, saltea la entrega si no hay envíos y calcula el total', () => {
    const r = chat(byKey.pedidos, pedidosConfig, [
      { optionId: 'order' },
      { optionId: '0' },
      { optionId: 'cart-more' },
      { optionId: '0' },
      { optionId: '1' },
      { optionId: 'cart-done' }, // solo "Retiro en el local" → se elige solo
      { text: 'Sofía' },
      { text: '1155550104' },
      { optionId: 'skip' },
    ]);
    assert.equal(r.lead.type, 'ORDER');
    assert.equal(r.lead.data.total, 10500);
    assert.equal(r.lead.data.delivery, 'Retiro en el local');
    assert.deepEqual(r.lead.data.items[0], { name: 'Vianda de pollo', quantity: 2, unitPrice: 4500, subtotal: 9000 });
    assert.equal('deliveryAddress' in r.lead.data, false);
    assert.match(r.replies.at(-1), /\$\s?10\.500/);
  });

  it('no confía en el state del cliente: respuestas inventadas no generan lead', () => {
    const forged = {
      flow: 'appointment',
      step: 4,
      answers: { service: { value: 'Gratis', label: 'Gratis' }, name: { value: 'X', label: 'X' } },
    };
    const r = handleMessage({ template: byKey.turnos, config: turnosConfig, state: forged, text: '1155550101', now: NOW });
    assert.equal(r.lead, null);
    assert.match(r.replies[0], /problema/);
  });

  it('pedidos: cantidades manipuladas en el state no generan lead', () => {
    // El cliente manda el state del último paso con 999 viandas (el máximo es 20).
    const forged = {
      flow: 'order',
      step: 5,
      answers: {
        items: { items: [{ index: 0, qty: 999 }] },
        delivery: { value: 'pickup', label: 'Retiro en el local' },
        name: { value: 'Sofía', label: 'Sofía' },
        phone: { value: '1155550104', label: '1155550104' },
      },
    };
    const r = handleMessage({ template: byKey.pedidos, config: pedidosConfig, state: forged, optionId: 'skip', now: NOW });
    assert.equal(r.lead, null);
  });

  it('pedidos: el precio sale siempre de la config del bot', () => {
    const state = {
      flow: 'order',
      step: 5,
      answers: {
        items: { items: [{ index: 1, qty: 2, price: 1 }] }, // "price" del cliente se ignora
        delivery: { value: 'pickup', label: 'Retiro en el local' },
        name: { value: 'Sofía', label: 'Sofía' },
        phone: { value: '1155550104', label: '1155550104' },
      },
    };
    const r = handleMessage({ template: byKey.pedidos, config: pedidosConfig, state, optionId: 'skip', now: NOW });
    assert.equal(r.lead.data.total, 3000);
  });
});

describe('slug público', () => {
  it('sale del nombre sin tildes y con sufijo aleatorio', () => {
    assert.equal(slugify('  Peluquería Lola!! '), 'peluqueria-lola');
    assert.match(generateSlug('Peluquería Lola'), /^peluqueria-lola-[a-z2-9]{6}$/);
    assert.notEqual(generateSlug('A'), generateSlug('A'));
    assert.equal(slugify('???'), 'bot');
  });
});

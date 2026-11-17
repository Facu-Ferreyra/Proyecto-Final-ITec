import { z } from '../utils/zod.js';

// Esquema de la configuración de una plantilla (template.config).
// Lo usan el admin al crear o editar plantillas y los tests, que verifican
// que faq.json, turnos.json y pedidos.json sean válidos.
// La explicación de cada propiedad está en docs/endpoints.md.

const key = z.string().regex(/^[a-zA-Z][a-zA-Z0-9]{0,39}$/, 'Usá solo letras y números, empezando con una letra');
const optionId = z.string().regex(/^[a-z0-9-]{1,30}$/, 'Usá minúsculas, números y guiones');
const text = (max) => z.string().trim().min(1).max(max);

const itemField = z.object({
  key,
  label: text(60),
  type: z.enum(['text', 'textarea', 'price']),
  required: z.boolean().optional(),
  maxLength: z.number().int().min(1).max(2000).optional(),
});

const field = z
  .object({
    key,
    label: text(80),
    type: z.enum(['text', 'textarea', 'phone', 'boolean', 'weekdays', 'list', 'items']),
    required: z.boolean().optional(),
    maxLength: z.number().int().min(1).max(5000).optional(),
    maxItems: z.number().int().min(1).max(100).optional(),
    itemMaxLength: z.number().int().min(1).max(500).optional(),
    placeholder: z.string().max(100).optional(),
    help: z.string().max(200).optional(),
    itemFields: z.array(itemField).min(1).max(10).optional(),
  })
  .refine((f) => f.type !== 'items' || (f.itemFields && f.itemFields.some((i) => i.type === 'text')), {
    message: 'Un campo "items" necesita itemFields con al menos un campo de texto',
    path: ['itemFields'],
  });

const listSource = z.object({ field: key, labelKey: key.optional(), priceKey: key.optional() });
const datesSource = z.object({
  type: z.literal('nextDates'),
  field: key,
  count: z.number().int().min(1).max(14).optional(),
});

const step = z.object({
  key,
  prompt: text(300),
  input: z.enum(['text', 'phone', 'choice', 'cart']),
  maxLength: z.number().int().min(1).max(500).optional(),
  optional: z.boolean().optional(),
  saveAs: z.enum(['contactName', 'contactPhone']).optional(),
  placeholder: z.string().max(100).optional(),
  choices: z
    .array(z.object({ id: optionId, label: text(40), requires: key.optional() }))
    .min(1)
    .max(20)
    .optional(),
  source: z.union([datesSource, listSource]).optional(),
  autoSelectSingle: z.boolean().optional(),
  when: z.object({ step: key, equals: z.string().min(1).max(40) }).optional(),
  addedPrompt: text(300).optional(),
});

const flow = z.object({
  leadType: z.enum(['CONTACT', 'APPOINTMENT', 'ORDER']),
  steps: z.array(step).min(1).max(15),
  success: text(500),
});

const menuItem = z.discriminatedUnion('type', [
  z.object({ id: optionId, type: z.literal('answer'), label: text(40), answer: text(1000), requires: z.array(key).optional() }),
  z.object({ id: optionId, type: z.literal('flow'), label: text(40), flow: key, requires: z.array(key).optional() }),
  z.object({ id: optionId, type: z.literal('answerList'), source: key, labelKey: key, answerKey: key }),
]);

// Variables que agrega el motor y que no pueden usarse como nombre de campo o de paso.
const RESERVED_KEYS = ['item', 'cart', 'total'];
const RESERVED_OPTION_IDS = ['menu', 'cancel', 'skip'];

export const templateConfigSchema = z
  .object({
    idealFor: z.string().max(120).optional(),
    fields: z.array(field).min(1).max(30),
    messages: z.object({
      welcome: text(300),
      fallback: text(300),
      backToMenu: text(300).optional(),
    }),
    menu: z.array(menuItem).min(1).max(20),
    flows: z.record(key, flow).default({}),
  })
  .superRefine((config, ctx) => {
    const issue = (path, message) => ctx.addIssue({ code: 'custom', path, message });
    const fieldsByKey = new Map(config.fields.map((f) => [f.key, f]));

    if (fieldsByKey.size !== config.fields.length) issue(['fields'], 'Hay campos con la misma key');
    if (!fieldsByKey.has('businessName')) issue(['fields'], 'Falta el campo businessName');
    config.fields.forEach((f, i) => {
      if (RESERVED_KEYS.includes(f.key)) issue(['fields', i, 'key'], `"${f.key}" es una key reservada`);
    });

    const menuIds = new Set();
    config.menu.forEach((item, i) => {
      if (menuIds.has(item.id)) issue(['menu', i, 'id'], `id repetido: ${item.id}`);
      if (RESERVED_OPTION_IDS.includes(item.id)) issue(['menu', i, 'id'], `"${item.id}" es un id reservado`);
      menuIds.add(item.id);
      if (item.type === 'flow' && !config.flows[item.flow]) issue(['menu', i, 'flow'], `No existe el flujo "${item.flow}"`);
      if (item.type === 'answerList' && fieldsByKey.get(item.source)?.type !== 'items') {
        issue(['menu', i, 'source'], 'source tiene que ser un campo de tipo "items"');
      }
      for (const req of item.requires ?? []) {
        if (!fieldsByKey.has(req)) issue(['menu', i, 'requires'], `No existe el campo "${req}"`);
      }
    });

    for (const [flowId, f] of Object.entries(config.flows)) {
      const stepKeys = new Set();
      f.steps.forEach((s, i) => {
        const path = ['flows', flowId, 'steps', i];
        if (stepKeys.has(s.key)) issue([...path, 'key'], `key repetida: ${s.key}`);
        if (fieldsByKey.has(s.key) || RESERVED_KEYS.includes(s.key)) {
          issue([...path, 'key'], `"${s.key}" choca con un campo del negocio o una key reservada`);
        }
        if (s.when && !stepKeys.has(s.when.step)) issue([...path, 'when'], 'when tiene que apuntar a un paso anterior');
        stepKeys.add(s.key);

        if (s.input === 'choice' && !s.choices && !s.source) issue(path, 'Un paso "choice" necesita choices o source');
        if (s.input === 'cart' && (!s.source || s.source.type)) issue(path, 'Un paso "cart" necesita source con un campo "items"');
        if (s.source) {
          const src = fieldsByKey.get(s.source.field);
          const expected = s.source.type === 'nextDates' ? ['weekdays'] : ['list', 'items'];
          if (!src || !expected.includes(src.type)) issue([...path, 'source'], `source.field tiene que ser de tipo ${expected.join(' o ')}`);
          if (src?.type === 'items' && !s.source.labelKey) issue([...path, 'source'], 'Falta source.labelKey');
        }
        if (s.saveAs && s.optional) issue(path, 'Un paso con saveAs no puede ser opcional');
      });
      // La tabla leads exige contact_name: todo flujo tiene que pedir el nombre.
      if (!f.steps.some((s) => s.saveAs === 'contactName')) {
        issue(['flows', flowId], 'El flujo necesita un paso con saveAs: "contactName"');
      }
    }
  });

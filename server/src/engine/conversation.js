import { buildConfigVars, formatPrice, isEmpty, render } from './render.js';
import { nextDates } from './dates.js';
import { PHONE_REGEX } from './configSchema.js';
import { initialStatus } from './leadStatuses.js';

// ─────────────────────────────────────────────────────────────────────────────
// Motor del bot. Son funciones puras: no tocan la base de datos.
//
// Entrada: la plantilla (menú y flujos), la config del bot (datos del negocio)
// y lo que mandó el visitante (optionId o text, más el "state" del flujo).
// Salida: lo que el bot responde (replies), los botones a mostrar (options),
// si espera texto libre (input), el nuevo state y, al terminar un flujo, el
// lead para guardar.
//
// El "state" lo guarda el cliente y lo devuelve en cada mensaje. Así la base no
// necesita guardar en qué paso está cada visitante. Como el cliente lo puede
// modificar, al terminar el flujo se vuelven a validar TODAS las respuestas.
// ─────────────────────────────────────────────────────────────────────────────

const MENU_OPTION = { id: 'menu', label: 'Volver al menú' };
const CANCEL_OPTION = { id: 'cancel', label: 'Cancelar' };
const SKIP_OPTION = { id: 'skip', label: 'Omitir' };
const CART_MORE_OPTION = { id: 'cart-more', label: 'Agregar otra cosa' };
const CART_DONE_OPTION = { id: 'cart-done', label: 'Confirmar pedido' };

const MAX_QUANTITY_PER_PRODUCT = 20;
const MAX_CART_LINES = 30;
const DEFAULT_TEXT_MAX = 200;

const toOption = ({ id, label }) => ({ id, label });

// Compara textos sin importar mayúsculas ni tildes: "ubicacion" == "Ubicación".
const normalize = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase();

// Busca la opción elegida: primero por id (botón), si no por el texto escrito.
function findOption(options, optionId, text) {
  if (optionId) return options.find((o) => o.id === optionId) ?? null;
  if (text) return options.find((o) => normalize(o.label) === normalize(text)) ?? null;
  return null;
}

function createContext(template, config, now) {
  const definition = template.config;
  const safeConfig = config && typeof config === 'object' ? config : {};
  return {
    definition,
    config: safeConfig,
    vars: buildConfigVars(definition, safeConfig),
    now: now ?? new Date(),
  };
}

// ── Menú ─────────────────────────────────────────────────────────────────────

// Ítems visibles del menú. Se ocultan los que dependen de un dato que el dueño
// no cargó ("requires") y se expanden las preguntas propias del dueño (answerList).
function getMenuItems(ctx) {
  const items = [];
  for (const item of ctx.definition.menu) {
    if (item.type === 'answerList') {
      const entries = ctx.config[item.source];
      if (Array.isArray(entries)) {
        entries.forEach((entry, i) => {
          if (entry?.[item.labelKey] && entry?.[item.answerKey]) {
            items.push({ id: `${item.id}-${i}`, type: 'answer', label: entry[item.labelKey], answerText: entry[item.answerKey] });
          }
        });
      }
      continue;
    }
    if (item.requires?.some((key) => isEmpty(ctx.config[key]))) continue;
    if (item.type === 'flow' && !ctx.definition.flows[item.flow]) continue;
    items.push(item);
  }
  return items;
}

function menuResponse(ctx, menu, firstReply) {
  const replies = [];
  if (firstReply) replies.push(firstReply);
  replies.push(render(ctx.definition.messages.backToMenu ?? '¿Te ayudo con algo más?', ctx.vars));
  return { replies, options: menu.map(toOption), input: null, state: null, lead: null };
}

// ── Opciones de cada paso ────────────────────────────────────────────────────

// Opciones de un paso "choice". Cada una: { id, value, label }.
// "value" es lo que se guarda como dato y "label" lo que ve el visitante.
function getChoiceOptions(ctx, step, { extraDays = 0 } = {}) {
  if (step.choices) {
    return step.choices
      .filter((c) => !c.requires || !isEmpty(ctx.config[c.requires]))
      .map((c) => ({ id: c.id, value: c.id, label: c.label }));
  }
  const { source } = step;
  if (source.type === 'nextDates') {
    return nextDates(ctx.now, ctx.config[source.field], (source.count ?? 6) + extraDays);
  }
  const list = Array.isArray(ctx.config[source.field]) ? ctx.config[source.field] : [];
  return list
    .map((entry, i) => {
      const label = typeof entry === 'string' ? entry : entry?.[source.labelKey];
      return { id: String(i), value: label, label };
    })
    .filter((o) => typeof o.label === 'string' && o.label.length > 0);
}

// Productos de un paso "cart": { id, index, name, price, label }
function getCartProducts(ctx, step) {
  const { field, labelKey, priceKey } = step.source;
  const list = Array.isArray(ctx.config[field]) ? ctx.config[field] : [];
  return list.map((product, index) => {
    const name = product?.[labelKey];
    const price = priceKey ? product?.[priceKey] : undefined;
    const label = typeof price === 'number' ? `${name} (${formatPrice(price)})` : name;
    return { id: String(index), index, name, price, label };
  });
}

// Arma las líneas del pedido a partir de [{ index, qty }]. Devuelve null si algo no cierra.
function buildCartLines(ctx, step, cartItems) {
  if (!Array.isArray(cartItems) || cartItems.length === 0 || cartItems.length > MAX_CART_LINES) return null;
  const products = getCartProducts(ctx, step);
  const lines = [];
  for (const entry of cartItems) {
    const product = products[entry?.index];
    const qty = entry?.qty;
    if (!product || !Number.isInteger(qty) || qty < 1 || qty > MAX_QUANTITY_PER_PRODUCT) return null;
    const unitPrice = typeof product.price === 'number' ? product.price : null;
    lines.push({
      name: product.name,
      quantity: qty,
      unitPrice,
      subtotal: unitPrice === null ? null : unitPrice * qty,
    });
  }
  return lines;
}

const cartSummary = (lines) => lines.map((l) => `${l.quantity} × ${l.name}`).join('\n');

function cartTotal(lines) {
  if (lines.some((l) => l.subtotal === null)) return null;
  return lines.reduce((sum, l) => sum + l.subtotal, 0);
}

// ── Validación de texto libre ────────────────────────────────────────────────

function validateText(step, raw) {
  const value = String(raw ?? '').trim();
  const max = step.maxLength ?? (step.input === 'phone' ? 20 : DEFAULT_TEXT_MAX);
  if (!value) return { error: 'Escribí tu respuesta en el cuadro de texto.' };
  if (value.length > max) return { error: `Usá como máximo ${max} caracteres.` };
  if (step.input === 'phone') {
    const digits = value.replace(/\D/g, '');
    if (!PHONE_REGEX.test(value) || digits.length < 6) {
      return { error: 'Ese teléfono no parece válido. Escribilo con números, por ejemplo 11 5555 0101.' };
    }
  }
  return { value };
}

// ── Flujos (turnos, pedidos, contacto) ───────────────────────────────────────

// Revisa que el state que mandó el cliente tenga la forma esperada.
function parseState(ctx, state) {
  if (!state || typeof state !== 'object') return null;
  const flow = ctx.definition.flows[state.flow];
  if (!flow) return null;
  if (!Number.isInteger(state.step) || state.step < 0 || state.step >= flow.steps.length) return null;
  const answers = state.answers && typeof state.answers === 'object' && !Array.isArray(state.answers) ? state.answers : {};
  return { flow: state.flow, step: state.step, answers };
}

const answerValue = (answer) => (answer && typeof answer === 'object' ? answer.value : undefined);

// Variables con las respuestas del visitante, para usar en los textos ({{name}}, {{date}}...).
function answerVars(flow, answers) {
  const vars = {};
  for (const step of flow.steps) {
    const answer = answers[step.key];
    if (answer && typeof answer.label === 'string') vars[step.key] = answer.label;
  }
  return vars;
}

// Mensaje del bot para el paso actual, con sus botones.
function promptStep(ctx, state, replies, errorMessage) {
  const flow = ctx.definition.flows[state.flow];
  const step = flow.steps[state.step];
  const vars = { ...ctx.vars, ...answerVars(flow, state.answers) };
  const out = [...replies];
  if (errorMessage) out.push(errorMessage);

  if (step.input === 'choice') {
    const options = getChoiceOptions(ctx, step);
    if (options.length === 0) {
      return menuResponse(ctx, getMenuItems(ctx), 'Por ahora no hay opciones disponibles para esto. Probá más tarde.');
    }
    out.push(render(step.prompt, vars));
    return { replies: out, options: [...options.map(toOption), CANCEL_OPTION], input: null, state, lead: null };
  }

  if (step.input === 'cart') {
    const products = getCartProducts(ctx, step);
    const hasItems = Array.isArray(state.answers[step.key]?.items) && state.answers[step.key].items.length > 0;
    out.push(render(step.prompt, vars));
    const options = [...products.map(toOption)];
    if (hasItems) options.push(CART_DONE_OPTION);
    options.push(CANCEL_OPTION);
    return { replies: out, options, input: null, state, lead: null };
  }

  // text o phone
  out.push(render(step.prompt, vars));
  const options = step.optional ? [SKIP_OPTION, CANCEL_OPTION] : [CANCEL_OPTION];
  return {
    replies: out,
    options,
    input: {
      type: step.input,
      maxLength: step.maxLength ?? (step.input === 'phone' ? 20 : DEFAULT_TEXT_MAX),
      placeholder: step.placeholder ?? null,
      optional: Boolean(step.optional),
    },
    state,
    lead: null,
  };
}

// Pasa al siguiente paso que corresponda (saltea los que no aplican por "when").
function advance(ctx, state, replies = []) {
  const flow = ctx.definition.flows[state.flow];
  const answers = { ...state.answers };
  let i = state.step + 1;

  while (i < flow.steps.length) {
    const step = flow.steps[i];
    if (step.when && answerValue(answers[step.when.step]) !== step.when.equals) {
      i++;
      continue;
    }
    if (step.input === 'choice' && step.autoSelectSingle) {
      const options = getChoiceOptions(ctx, step);
      if (options.length === 1) {
        answers[step.key] = { value: options[0].value, label: options[0].label };
        i++;
        continue;
      }
    }
    break;
  }

  const next = { flow: state.flow, step: i, answers };
  if (i >= flow.steps.length) return finishFlow(ctx, next, replies);
  return promptStep(ctx, next, replies);
}

// Revisa de nuevo todas las respuestas contra los datos actuales del negocio.
// Devuelve el lead listo para guardar, o null si algo no es válido.
function buildLead(ctx, flowId, answers) {
  const flow = ctx.definition.flows[flowId];
  const lead = { type: flow.leadType, contactName: null, contactPhone: null, data: {} };
  const vars = {};

  for (const step of flow.steps) {
    if (step.when && answerValue(answers[step.when.step]) !== step.when.equals) continue;
    const answer = answers[step.key];

    if (step.input === 'cart') {
      const lines = buildCartLines(ctx, step, answer?.items);
      if (!lines) return null;
      const total = cartTotal(lines);
      lead.data[step.key] = lines;
      lead.data.total = total;
      vars[step.key] = cartSummary(lines);
      vars.total = total === null ? 'a confirmar' : formatPrice(total);
      continue;
    }

    if (step.input === 'choice') {
      // Para las fechas se aceptan unos días más por si el visitante cruzó la medianoche.
      const options = getChoiceOptions(ctx, step, { extraDays: 7 });
      const match = options.find((o) => o.value === answerValue(answer));
      if (!match) return null;
      lead.data[step.key] = match.label;
      if (match.value !== match.label) lead.data[`${step.key}Value`] = match.value;
      vars[step.key] = match.label;
      continue;
    }

    // text o phone
    if (answer === null || answer === undefined) {
      if (step.optional) continue;
      return null;
    }
    const result = validateText(step, answerValue(answer));
    if (result.error) return null;
    vars[step.key] = result.value;
    if (step.saveAs) lead[step.saveAs] = result.value;
    else lead.data[step.key] = result.value;
  }

  if (!lead.contactName) return null;
  lead.data.status = initialStatus(flow.leadType);
  return { lead, vars };
}

function finishFlow(ctx, state, replies) {
  const flow = ctx.definition.flows[state.flow];
  const menu = getMenuItems(ctx);
  const built = buildLead(ctx, state.flow, state.answers);
  if (!built) {
    return menuResponse(ctx, menu, 'Hubo un problema con los datos y no pude registrar la solicitud. Empecemos de nuevo.');
  }
  const success = render(flow.success, { ...ctx.vars, ...built.vars });
  return {
    replies: [...replies, success],
    options: menu.map(toOption),
    input: null,
    state: null,
    lead: built.lead,
  };
}

// Procesa la respuesta del visitante al paso en el que está.
function continueFlow(ctx, state, optionId, text) {
  const flow = ctx.definition.flows[state.flow];
  const step = flow.steps[state.step];

  if (step.input === 'choice') {
    const match = findOption(getChoiceOptions(ctx, step), optionId, text);
    if (!match) {
      return { visitorMessage: text ?? optionId, ...promptStep(ctx, state, [], 'Elegí una de las opciones 👇') };
    }
    const answers = { ...state.answers, [step.key]: { value: match.value, label: match.label } };
    return { visitorMessage: match.label, ...advance(ctx, { ...state, answers }) };
  }

  if (step.input === 'cart') {
    const items = Array.isArray(state.answers[step.key]?.items) ? state.answers[step.key].items : [];

    if (optionId === CART_DONE_OPTION.id) {
      if (items.length === 0) {
        return { visitorMessage: CART_DONE_OPTION.label, ...promptStep(ctx, state, [], 'Todavía no agregaste ningún producto.') };
      }
      return { visitorMessage: CART_DONE_OPTION.label, ...advance(ctx, state) };
    }
    if (optionId === CART_MORE_OPTION.id) {
      return { visitorMessage: CART_MORE_OPTION.label, ...promptStep(ctx, state, []) };
    }

    const products = getCartProducts(ctx, step);
    const product =
      findOption(products, optionId, null) ??
      (text ? products.find((p) => normalize(p.name) === normalize(text)) : null);
    if (!product) {
      return { visitorMessage: text ?? optionId, ...promptStep(ctx, state, [], 'Elegí un producto de la lista 👇') };
    }

    // Suma 1 unidad del producto elegido.
    const nextItems = items.map((i) => ({ ...i }));
    const existing = nextItems.find((i) => i.index === product.index);
    if (existing) existing.qty = Math.min(existing.qty + 1, MAX_QUANTITY_PER_PRODUCT);
    else if (nextItems.length < MAX_CART_LINES) nextItems.push({ index: product.index, qty: 1 });

    const nextState = { ...state, answers: { ...state.answers, [step.key]: { items: nextItems } } };
    const lines = buildCartLines(ctx, step, nextItems) ?? [];
    const vars = { ...ctx.vars, item: product.name, cart: cartSummary(lines) };
    return {
      visitorMessage: product.name,
      replies: [render(step.addedPrompt ?? 'Anotado: {{item}}. ¿Querés agregar algo más?', vars)],
      options: [CART_MORE_OPTION, CART_DONE_OPTION, CANCEL_OPTION],
      input: null,
      state: nextState,
      lead: null,
    };
  }

  // text o phone
  if (optionId === SKIP_OPTION.id && step.optional) {
    const answers = { ...state.answers, [step.key]: null };
    return { visitorMessage: SKIP_OPTION.label, ...advance(ctx, { ...state, answers }) };
  }
  if (!text) {
    return { visitorMessage: optionId, ...promptStep(ctx, state, [], 'Escribí tu respuesta en el cuadro de texto.') };
  }
  const result = validateText(step, text);
  if (result.error) {
    return { visitorMessage: text, ...promptStep(ctx, state, [], result.error) };
  }
  const answers = { ...state.answers, [step.key]: { value: result.value, label: result.value } };
  return { visitorMessage: result.value, ...advance(ctx, { ...state, answers }) };
}

// ── API pública del motor ────────────────────────────────────────────────────

/** Primer mensaje del chat: saludo y menú. */
export function startChat(template, config) {
  const ctx = createContext(template, config);
  return {
    title: ctx.config.businessName || null,
    replies: [render(ctx.definition.messages.welcome, ctx.vars)],
    options: getMenuItems(ctx).map(toOption),
  };
}

/**
 * Procesa un mensaje del visitante.
 * @param {object} params
 * @param {{ config: object }} params.template  plantilla (template.config tiene menú y flujos)
 * @param {object} params.config   datos del negocio (bot.config)
 * @param {object|null} params.state  state que devolvió la respuesta anterior
 * @param {string} [params.optionId]  id del botón que tocó
 * @param {string} [params.text]      texto que escribió
 * @param {Date} [params.now]
 * @returns {{ visitorMessage: string, replies: string[], options: {id,label}[],
 *             input: object|null, state: object|null, lead: object|null }}
 */
export function handleMessage({ template, config, state, optionId, text, now }) {
  const ctx = createContext(template, config, now);
  const menu = getMenuItems(ctx);
  const flowState = parseState(ctx, state);

  // "Volver al menú" y "Cancelar" funcionan en cualquier momento.
  if (optionId === MENU_OPTION.id || optionId === CANCEL_OPTION.id) {
    const cancelled = optionId === CANCEL_OPTION.id && flowState;
    const label = optionId === MENU_OPTION.id ? MENU_OPTION.label : CANCEL_OPTION.label;
    return { visitorMessage: label, ...menuResponse(ctx, menu, cancelled ? 'Listo, lo cancelé.' : null) };
  }

  if (flowState) return continueFlow(ctx, flowState, optionId, text);

  const item = findOption(menu, optionId, text);
  if (!item) {
    return {
      visitorMessage: text ?? optionId,
      replies: [render(ctx.definition.messages.fallback, ctx.vars)],
      options: menu.map(toOption),
      input: null,
      state: null,
      lead: null,
    };
  }

  if (item.type === 'answer') {
    const answer = render(item.answerText ?? item.answer, ctx.vars);
    const flowOptions = menu.filter((m) => m.type === 'flow').map(toOption);
    return {
      visitorMessage: item.label,
      replies: [answer],
      options: [...flowOptions, MENU_OPTION],
      input: null,
      state: null,
      lead: null,
    };
  }

  // item.type === 'flow': arranca el flujo en el primer paso.
  return { visitorMessage: item.label, ...advance(ctx, { flow: item.flow, step: -1, answers: {} }) };
}

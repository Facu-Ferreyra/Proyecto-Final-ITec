// Convierte los datos del negocio en texto y completa los {{marcadores}} de las respuestas.

const priceFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

const WEEKDAY_NAMES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

export const formatPrice = (value) => priceFormatter.format(value);

// Un dato "vacío" no se muestra en el menú (ver "requires" en las plantillas).
export function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    value === false ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0)
  );
}

// Una línea por ítem: "• Corte de pelo — $ 8.000"
function formatItems(field, items) {
  const labelField = field.itemFields.find((f) => f.type === 'text');
  const priceField = field.itemFields.find((f) => f.type === 'price');
  return items
    .map((item) => {
      let line = `• ${item[labelField.key]}`;
      if (priceField && typeof item[priceField.key] === 'number') {
        line += ` — ${formatPrice(item[priceField.key])}`;
      }
      return line;
    })
    .join('\n');
}

export function formatFieldValue(field, value) {
  if (isEmpty(value)) return '';
  switch (field.type) {
    case 'list':
      return value.join(', ');
    case 'weekdays':
      return [...value].sort().map((d) => WEEKDAY_NAMES[d]).join(', ');
    case 'items':
      return formatItems(field, value);
    case 'boolean':
      return value ? 'Sí' : 'No';
    default:
      return String(value);
  }
}

// Variables disponibles en los textos de la plantilla: una por campo del negocio.
export function buildConfigVars(definition, config) {
  const vars = {};
  for (const field of definition.fields) {
    vars[field.key] = formatFieldValue(field, config?.[field.key]);
  }
  return vars;
}

// render('Atendemos {{hours}}.', { hours: '9 a 18' }) → 'Atendemos 9 a 18.'
export function render(text, vars) {
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => vars[key] ?? '').trim();
}

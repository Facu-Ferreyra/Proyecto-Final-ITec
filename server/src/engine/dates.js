// Fechas para la plantilla de turnos: los próximos días en que el negocio atiende.
// Se calculan en la hora de Argentina para que "mañana" sea el mismo día para todos.

const TIME_ZONE = 'America/Argentina/Buenos_Aires';
const DAY_MS = 24 * 60 * 60 * 1000;

const ymdFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const labelFormatter = new Intl.DateTimeFormat('es-AR', {
  timeZone: 'UTC',
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

// "jue, 12 nov" → "Jue 12 nov"
function toLabel(date) {
  const text = labelFormatter.format(date).replace(/[.,]/g, '');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Devuelve hasta `count` fechas a partir de mañana que caigan en `weekdays`
 * (0 = domingo ... 6 = sábado), buscando como máximo `maxDaysAhead` días.
 * Cada fecha: { id: '2026-11-12', value: '2026-11-12', label: 'Jue 12 nov' }
 */
export function nextDates(now, weekdays, count = 6, maxDaysAhead = 30) {
  if (!Array.isArray(weekdays) || weekdays.length === 0) return [];

  const today = new Date(`${ymdFormatter.format(now)}T00:00:00Z`);
  const dates = [];
  for (let offset = 1; offset <= maxDaysAhead && dates.length < count; offset++) {
    const day = new Date(today.getTime() + offset * DAY_MS);
    if (weekdays.includes(day.getUTCDay())) {
      const iso = day.toISOString().slice(0, 10);
      dates.push({ id: iso, value: iso, label: toLabel(day) });
    }
  }
  return dates;
}

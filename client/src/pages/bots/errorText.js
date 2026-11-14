// Texto para mostrar cuando falla un pedido a la API (lo usan Mis bots y el asistente).

export function errorText(error) {
  // 422 BOT_INCOMPLETE: el backend manda en "details" los campos que faltan.
  if (error.code === 'BOT_INCOMPLETE' && error.details?.length) {
    const labels = error.details.map((field) => field.label).join(', ')
    return `Faltan datos obligatorios: ${labels}.`
  }
  return error.message
}

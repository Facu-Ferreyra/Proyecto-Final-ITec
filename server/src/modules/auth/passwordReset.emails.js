// Contenido de los mails de "Olvidé mi contraseña". Separado de la lógica para poder
// verlos o probarlos sin base de datos. Cada función devuelve { subject, text, html }:
// text para clientes de correo sin HTML, html para el resto.

// El nombre lo escribe el usuario: se escapa antes de ponerlo en el HTML del mail.
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

const wrap = (content) =>
  `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#0b1f4b;max-width:480px">${content}<p style="color:#55607a;font-size:13px">— EasyBot</p></div>`;

/** Mail con el link para elegir una contraseña nueva. */
export function resetLinkEmail({ name, link, minutes }) {
  return {
    subject: 'Restablecé tu contraseña de EasyBot',
    text: [
      `Hola, ${name}:`,
      '',
      `Recibimos un pedido para cambiar la contraseña de tu cuenta de EasyBot. Para elegir una nueva, entrá a este link (vence en ${minutes} minutos y se puede usar una sola vez):`,
      link,
      '',
      'Si no lo pediste vos, ignorá este mail: tu contraseña no cambia.',
    ].join('\n'),
    html: wrap(
      `<p>Hola, ${escapeHtml(name)}:</p>` +
        '<p>Recibimos un pedido para cambiar la contraseña de tu cuenta de EasyBot.</p>' +
        `<p><a href="${link}" style="display:inline-block;padding:12px 20px;background:#1d4ed8;color:#ffffff;border-radius:999px;text-decoration:none;font-weight:bold">Elegir contraseña nueva</a></p>` +
        `<p>El link vence en ${minutes} minutos y se puede usar una sola vez.</p>` +
        '<p>Si no lo pediste vos, ignorá este mail: tu contraseña no cambia.</p>',
    ),
  };
}

/** Aviso de que la contraseña se cambió (por si no fue el dueño de la cuenta). */
export function passwordChangedEmail({ name }) {
  return {
    subject: 'Tu contraseña de EasyBot se cambió',
    text: [
      `Hola, ${name}:`,
      '',
      'La contraseña de tu cuenta de EasyBot se acaba de cambiar y cerramos las sesiones que tenías abiertas.',
      'Si no fuiste vos, pedí un link nuevo desde "¿Olvidaste tu contraseña?" en la pantalla de inicio de sesión.',
    ].join('\n'),
    html: wrap(
      `<p>Hola, ${escapeHtml(name)}:</p>` +
        '<p>La contraseña de tu cuenta de EasyBot se acaba de cambiar y cerramos las sesiones que tenías abiertas.</p>' +
        '<p>Si no fuiste vos, pedí un link nuevo desde <strong>"¿Olvidaste tu contraseña?"</strong> en la pantalla de inicio de sesión.</p>',
    ),
  };
}

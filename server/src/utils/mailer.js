// Envío de mails con Nodemailer y una cuenta de Gmail (contraseña de aplicación).
// Las credenciales salen de las variables de entorno: nunca del código.
//
// Sin GMAIL_USER / GMAIL_APP_PASSWORD:
//   - En desarrollo, el mail se muestra en la terminal (así se puede probar igual).
//   - En producción, se lanza un error (quien llama decide cómo manejarlo).
//
// Para cambiar a otro proveedor (por ejemplo Resend con dominio propio), alcanza con
// cambiar este archivo: el resto del backend solo usa sendMail().

import nodemailer from 'nodemailer';
import { env, isProduction } from '../config/env.js';

const isConfigured = Boolean(env.GMAIL_USER && env.GMAIL_APP_PASSWORD);

// Un solo transporte para toda la app. service: 'gmail' ya configura servidor,
// puerto y cifrado TLS (guía de Nodemailer para Gmail).
const transporter = isConfigured
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: { user: env.GMAIL_USER, pass: env.GMAIL_APP_PASSWORD },
    })
  : null;

/** Envía un mail. { to, subject, text, html } */
export async function sendMail({ to, subject, text, html }) {
  if (!transporter) {
    if (isProduction) throw new Error('El envío de mails no está configurado (faltan GMAIL_USER y GMAIL_APP_PASSWORD)');
    console.info(`\n[mail de desarrollo] Para: ${to}\nAsunto: ${subject}\n${text}\n`);
    return;
  }
  await transporter.sendMail({ from: `"EasyBot" <${env.GMAIL_USER}>`, to, subject, text, html });
}

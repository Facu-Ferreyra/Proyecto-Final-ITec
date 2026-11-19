// Envío de mails. Hay dos proveedores, y se usa el primero que esté configurado:
//
//   1. Brevo (API HTTPS): BREVO_API_KEY + MAIL_FROM. Es el que se usa en Render,
//      porque el plan gratuito de Render bloquea las conexiones SMTP salientes
//      (puertos 25, 465 y 587) y Gmail por SMTP da "Connection timeout".
//   2. Gmail por SMTP con Nodemailer: GMAIL_USER + GMAIL_APP_PASSWORD. Sirve en local.
//
// Sin ninguno de los dos:
//   - En desarrollo, el mail se muestra en la terminal (así se puede probar igual).
//   - En producción, se lanza un error (quien llama decide cómo manejarlo).
//
// Las credenciales salen de las variables de entorno: nunca del código.
// El resto del backend solo usa sendMail().

import nodemailer from 'nodemailer';
import { env, isProduction } from '../config/env.js';

const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';
const SENDER_NAME = 'EasyBot';

const useBrevo = Boolean(env.BREVO_API_KEY && env.MAIL_FROM);
const useGmail = !useBrevo && Boolean(env.GMAIL_USER && env.GMAIL_APP_PASSWORD);

// Un solo transporte para toda la app. service: 'gmail' ya configura servidor,
// puerto y cifrado TLS (guía de Nodemailer para Gmail).
const transporter = useGmail
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: { user: env.GMAIL_USER, pass: env.GMAIL_APP_PASSWORD },
    })
  : null;

async function sendWithBrevo({ to, subject, text, html }) {
  const response = await fetch(BREVO_URL, {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: env.MAIL_FROM },
      to: [{ email: to }],
      subject,
      textContent: text,
      htmlContent: html ?? undefined,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    // Brevo responde { code, message }; no incluye la clave, así que se puede loguear.
    const detail = await response.text().catch(() => '');
    throw new Error(`Brevo respondió ${response.status}: ${detail}`);
  }
}

/** Envía un mail. { to, subject, text, html } */
export async function sendMail({ to, subject, text, html }) {
  if (useBrevo) return sendWithBrevo({ to, subject, text, html });

  if (transporter) {
    await transporter.sendMail({ from: `"${SENDER_NAME}" <${env.GMAIL_USER}>`, to, subject, text, html });
    return;
  }

  if (isProduction) {
    throw new Error('El envío de mails no está configurado (faltan BREVO_API_KEY y MAIL_FROM)');
  }
  console.info(`\n[mail de desarrollo] Para: ${to}\nAsunto: ${subject}\n${text}\n`);
}

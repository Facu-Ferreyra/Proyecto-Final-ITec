import 'dotenv/config';

// Variables sin las cuales el servidor no puede arrancar.
const required = ['DATABASE_URL', 'JWT_SECRET'];
const missing = required.filter((name) => !process.env[name]);

if (missing.length > 0) {
  throw new Error(`Faltan variables de entorno: ${missing.join(', ')}`);
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 3000),
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1d',
  CLIENT_URL: process.env.CLIENT_URL ?? 'http://localhost:5173',
  // Envío de mails (recuperar contraseña) con una cuenta de Gmail y su "contraseña
  // de aplicación". Opcionales: sin ellas, en desarrollo el mail se muestra en la terminal.
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD,
  // En Render se usa Brevo (API HTTPS) porque el plan gratuito bloquea SMTP.
  // MAIL_FROM tiene que ser un remitente verificado en Brevo.
  BREVO_API_KEY: process.env.BREVO_API_KEY,
  MAIL_FROM: process.env.MAIL_FROM,
};

export const isProduction = env.NODE_ENV === 'production';

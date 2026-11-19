import { env } from './env.js';

// Solo se acepta el origen del frontend (nunca '*', porque usamos cookies).
// En producción el frontend lo sirve el mismo Express, así que es el mismo origen.
export const corsOptions = {
  origin: env.CLIENT_URL,
  credentials: true,
};

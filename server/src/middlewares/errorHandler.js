import { ZodError } from 'zod';
import { HttpError } from '../utils/httpError.js';

// Todas las respuestas de error de la API tienen la misma forma:
//   { "error": { "code": "VALIDATION_ERROR", "message": "texto para el usuario", "details": [...] } }
// "details" aparece solo en errores de validación. Nunca se devuelven datos internos
// (stack, SQL, mensajes de Prisma): eso solo se loguea en el servidor.

const send = (res, status, code, message, details) =>
  res.status(status).json({ error: { code, message, ...(details ? { details } : {}) } });

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err instanceof HttpError) {
    return send(res, err.status, err.code, err.message, err.details);
  }

  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }));
    return send(res, 400, 'VALIDATION_ERROR', 'Hay datos inválidos en el pedido', details);
  }

  // Errores de express.json()
  if (err.type === 'entity.parse.failed') return send(res, 400, 'INVALID_JSON', 'El cuerpo del pedido no es un JSON válido');
  if (err.type === 'entity.too.large') return send(res, 413, 'PAYLOAD_TOO_LARGE', 'El pedido es demasiado grande');

  // Prisma: registro no encontrado
  if (err.code === 'P2025') return send(res, 404, 'NOT_FOUND', 'No se encontró el recurso');

  console.error(err);
  return send(res, 500, 'INTERNAL_ERROR', 'Ocurrió un error inesperado. Probá de nuevo en un rato.');
}

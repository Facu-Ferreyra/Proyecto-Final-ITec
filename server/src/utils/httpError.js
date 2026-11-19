// Error "esperado" de la API. El errorHandler lo convierte en:
//   { "error": { "code": "BOT_NOT_FOUND", "message": "...", "details": [...] } }
// Ver docs/endpoints.md (Formato de errores).
export class HttpError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const badRequest = (code, message, details) => new HttpError(400, code, message, details);
export const notFound = (code, message) => new HttpError(404, code, message);
export const conflict = (code, message) => new HttpError(409, code, message);
export const unprocessable = (code, message, details) => new HttpError(422, code, message, details);

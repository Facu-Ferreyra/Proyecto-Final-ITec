// Base para hablar con la API: hace el pedido y convierte los errores del
// backend en un ApiError. Las funciones de cada recurso (bots.js) usan request().

import { mockServer } from './mocks/server.js'

// Con VITE_USE_MOCKS=true (en client/.env.local, que no se sube a git) se usan
// datos de ejemplo en lugar del servidor. Sirve mientras no esté el login.
// Si la variable no está, se usa la API real: así el deploy nunca usa mocks.
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

// Error con la misma forma que manda el backend: { error: { code, message, details } }.
export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message)
    this.status = status // 400, 401, 404, 422...
    this.code = code // 'VALIDATION_ERROR', 'BOT_INCOMPLETE'...
    this.details = details // campos con problemas, si los hay
  }
}

// Pedido real al servidor. Devuelve { status, data } (data = JSON de la respuesta).
async function httpRequest(path, { method = 'GET', body } = {}) {
  let response
  try {
    response = await fetch(`/api${path}`, {
      method,
      credentials: 'include', // manda la cookie de sesión
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    // fetch solo falla así cuando no hay conexión o el servidor no responde.
    return {
      status: 0,
      data: { error: { code: 'NETWORK_ERROR', message: 'No pudimos conectarnos con el servidor. Revisá tu conexión.' } },
    }
  }

  // 204 = sin contenido (por ejemplo, al eliminar).
  const data = response.status === 204 ? null : await response.json().catch(() => null)
  return { status: response.status, data }
}

// Evento que se dispara cuando el backend responde 401 (sin sesión o sesión vencida).
// Lo escucha AuthProvider para borrar el usuario y mandar al login (Brandon).
export const UNAUTHORIZED_EVENT = 'easybot:unauthorized'

// Hace el pedido (real o de ejemplo) y, si salió mal, lanza un ApiError.
export async function request(path, options) {
  const { status, data } = USE_MOCKS ? await mockServer(path, options) : await httpRequest(path, options)

  if (status === 401) window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))

  if (status === 0 || status >= 400) {
    const error = data?.error
    throw new ApiError(
      status,
      error?.code ?? 'UNKNOWN_ERROR',
      error?.message ?? 'Ocurrió un error inesperado. Probá de nuevo.',
      error?.details,
    )
  }
  return data
}

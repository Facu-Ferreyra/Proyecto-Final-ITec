// Funciones para hablar con la API de autenticación (Brandon). Ver docs/endpoints.md.
// La sesión vive en una cookie httpOnly que pone el backend: el frontend nunca
// ve ni guarda el token, solo los datos del usuario que devuelve la API.

import { ApiError, request } from './http.js'

export { ApiError }

// Con VITE_USE_MOCKS=true no hay backend: se simula la sesión. Arranca SIN sesión,
// como la app real, y cualquier login o registro entra como el usuario demo (ADMIN,
// para poder probar todas las pantallas). Se guarda en sessionStorage para que
// recargar la página no cierre la sesión (como la cookie real).
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'
const MOCK_KEY = 'easybot:mockUser'
const DEMO_USER = { id: 'demo', email: 'demo@easybot.com', name: 'Usuario demo', role: 'ADMIN', createdAt: new Date().toISOString() }

function readMockUser() {
  try {
    return JSON.parse(sessionStorage.getItem(MOCK_KEY))
  } catch {
    return null
  }
}

function saveMockUser(user) {
  try {
    if (user) sessionStorage.setItem(MOCK_KEY, JSON.stringify(user))
    else sessionStorage.removeItem(MOCK_KEY)
  } catch {
    // Sin almacenamiento: la sesión de prueba dura hasta recargar.
  }
  return user
}

/** Usuario logueado, o null si no hay sesión. */
export async function getCurrentUser() {
  if (USE_MOCKS) return readMockUser()
  try {
    const data = await request('/auth/me')
    return data.user
  } catch (error) {
    // 401 = no hay sesión (o venció): no es un error, simplemente no hay nadie logueado.
    if (error instanceof ApiError && error.status === 401) return null
    throw error
  }
}

export async function login({ email, password }) {
  if (USE_MOCKS) return saveMockUser({ ...DEMO_USER, email })
  const data = await request('/auth/login', { method: 'POST', body: { email, password } })
  return data.user
}

export async function register({ name, email, password }) {
  if (USE_MOCKS) return saveMockUser({ ...DEMO_USER, name, email })
  const data = await request('/auth/register', { method: 'POST', body: { name, email, password } })
  return data.user
}

export async function logout() {
  if (USE_MOCKS) {
    saveMockUser(null)
    return
  }
  await request('/auth/logout', { method: 'POST' })
}

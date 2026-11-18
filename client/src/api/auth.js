// Funciones para hablar con la API de autenticación (Brandon). Ver docs/endpoints.md.
// La sesión vive en una cookie httpOnly que pone el backend: el frontend nunca
// ve ni guarda el token, solo los datos del usuario que devuelve la API.

import { ApiError, request } from './http.js'
import { mockForgotPassword, mockGetCurrentUser, mockLogin, mockLogout, mockRegister, mockResetPassword } from './mocks/auth.js'

export { ApiError }

// Con VITE_USE_MOCKS=true no hay backend: la sesión se simula en mocks/auth.js,
// con las mismas reglas que la API real.
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

/** Usuario logueado, o null si no hay sesión. */
export async function getCurrentUser() {
  if (USE_MOCKS) return mockGetCurrentUser()
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
  if (USE_MOCKS) return mockLogin({ email })
  const data = await request('/auth/login', { method: 'POST', body: { email, password } })
  return data.user
}

export async function register({ name, email, password }) {
  if (USE_MOCKS) return mockRegister({ name, email })
  const data = await request('/auth/register', { method: 'POST', body: { name, email, password } })
  return data.user
}

export async function logout() {
  if (USE_MOCKS) return mockLogout()
  await request('/auth/logout', { method: 'POST' })
}

// "Olvidé mi contraseña": responde siempre igual, exista o no el email.
export async function forgotPassword({ email }) {
  if (USE_MOCKS) return mockForgotPassword({ email })
  const data = await request('/auth/forgot-password', { method: 'POST', body: { email } })
  return data.message
}

// "Nueva contraseña" con el token del link. No inicia sesión.
export async function resetPassword({ token, password }) {
  if (USE_MOCKS) return mockResetPassword({ token })
  await request('/auth/reset-password', { method: 'POST', body: { token, password } })
}

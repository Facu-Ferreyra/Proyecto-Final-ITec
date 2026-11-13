// Funciones para hablar con la API de autenticación (Brandon). Ver docs/endpoints.md.
// La sesión vive en una cookie httpOnly que pone el backend: el frontend nunca
// ve ni guarda el token, solo los datos del usuario que devuelve la API.

import { ApiError, request } from './http.js'

export { ApiError }

// Con VITE_USE_MOCKS=true no hay backend: se simula una sesión de ejemplo para
// que se puedan seguir usando las pantallas con datos de prueba.
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'
let mockUser = { id: 'demo', email: 'demo@easybot.com', name: 'Usuario demo', role: 'ADMIN', createdAt: new Date().toISOString() }

/** Usuario logueado, o null si no hay sesión. */
export async function getCurrentUser() {
  if (USE_MOCKS) return mockUser
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
  if (USE_MOCKS) return (mockUser = { ...mockUser, email })
  const data = await request('/auth/login', { method: 'POST', body: { email, password } })
  return data.user
}

export async function register({ name, email, password }) {
  if (USE_MOCKS) return (mockUser = { ...mockUser, name, email })
  const data = await request('/auth/register', { method: 'POST', body: { name, email, password } })
  return data.user
}

export async function logout() {
  if (USE_MOCKS) return
  await request('/auth/logout', { method: 'POST' })
}

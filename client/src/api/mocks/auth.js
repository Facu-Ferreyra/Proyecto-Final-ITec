// Sesión simulada (solo con VITE_USE_MOCKS=true), con las mismas reglas que el backend:
//   - Arranca SIN sesión.
//   - Solo entran los emails registrados: los dos de prueba del seed y los que se
//     crean con "Crear cuenta". Un email desconocido recibe el MISMO error que la API
//     real ("El email o la contraseña no son correctos"): no se revela qué emails existen.
//   - admin@easybot.com es ADMIN; registrarse SIEMPRE crea un usuario común.
// La contraseña no se verifica ni se guarda: no tiene sentido guardar contraseñas
// en el navegador. Eso lo hace el backend real, con bcrypt.

import { ApiError } from '../http.js'

const SESSION_KEY = 'easybot:mockUser' // sesión actual (como la cookie): se borra al cerrar la pestaña
const ACCOUNTS_KEY = 'easybot:mockAccounts' // cuentas creadas con "Crear cuenta" (como la base de datos)

const SEED_ACCOUNTS = [
  { id: 'demo', email: 'admin@easybot.com', name: 'Admin EasyBot', role: 'ADMIN' },
  { id: 'demo-user', email: 'usuario@easybot.com', name: 'Usuario de prueba', role: 'USER' },
]

function read(storage, key, fallback) {
  try {
    return JSON.parse(storage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

function write(storage, key, value) {
  try {
    if (value === null) storage.removeItem(key)
    else storage.setItem(key, JSON.stringify(value))
  } catch {
    // Sin almacenamiento: los datos de prueba duran hasta recargar.
  }
  return value
}

const normalize = (email) => email.trim().toLowerCase()
const allAccounts = () => [...SEED_ACCOUNTS, ...read(localStorage, ACCOUNTS_KEY, [])]
const findAccount = (email) => allAccounts().find((account) => account.email === normalize(email))
const startSession = (account) => write(sessionStorage, SESSION_KEY, { ...account, createdAt: new Date().toISOString() })

export const mockGetCurrentUser = () => read(sessionStorage, SESSION_KEY, null)

export function mockLogin({ email }) {
  const account = findAccount(email)
  if (!account) throw new ApiError(401, 'INVALID_CREDENTIALS', 'El email o la contraseña no son correctos')
  return startSession(account)
}

export function mockRegister({ name, email }) {
  if (findAccount(email)) throw new ApiError(409, 'EMAIL_TAKEN', 'Ya hay una cuenta con ese email')
  const account = { id: `user-${Date.now()}`, email: normalize(email), name, role: 'USER' }
  write(localStorage, ACCOUNTS_KEY, [...read(localStorage, ACCOUNTS_KEY, []), account])
  return startSession(account)
}

export function mockLogout() {
  write(sessionStorage, SESSION_KEY, null)
}

// Guarda la sesión de forma global (Brandon).
// Al cargar la app pregunta al backend quién está logueado (GET /api/auth/me).
// El token NUNCA pasa por acá: vive en una cookie httpOnly que JavaScript no puede leer.

import { useCallback, useEffect, useMemo, useState } from 'react'
import * as authApi from '../api/auth.js'
import { UNAUTHORIZED_EVENT } from '../api/http.js'
import { AuthContext } from './AuthContext.js'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'ready'

  // Pregunta al backend quién está logueado. Si falla (sin conexión, error del
  // servidor) se trata como "sin sesión": las rutas protegidas mandan al login y
  // ahí se ve el error real al intentar entrar.
  const fetchUser = useCallback(() => authApi.getCurrentUser().catch(() => null), [])

  const refresh = useCallback(async () => {
    setUser(await fetchUser())
    setStatus('ready')
  }, [fetchUser])

  // Al cargar la app. "active" evita actualizar el estado si el componente ya se desmontó.
  useEffect(() => {
    let active = true
    fetchUser().then((currentUser) => {
      if (!active) return
      setUser(currentUser)
      setStatus('ready')
    })
    return () => {
      active = false
    }
  }, [fetchUser])

  // Si cualquier pedido a la API responde 401 (sesión vencida, cuenta desactivada),
  // se borra el usuario y las rutas protegidas mandan al login.
  useEffect(() => {
    const onUnauthorized = () => setUser(null)
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
  }, [])

  const login = useCallback(async (credentials) => {
    const loggedUser = await authApi.login(credentials)
    setUser(loggedUser)
    return loggedUser
  }, [])

  const register = useCallback(async (data) => {
    const newUser = await authApi.register(data)
    setUser(newUser)
    return newUser
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      // Aunque falle la red, en esta pestaña la sesión se da por cerrada.
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'ADMIN',
      login,
      register,
      logout,
      refresh,
    }),
    [user, status, login, register, logout, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

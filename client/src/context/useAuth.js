import { useContext } from 'react'
import { AuthContext } from './AuthContext.js'

/**
 * Datos y acciones de la sesión:
 *   { user, status, isAuthenticated, isAdmin, login, register, logout, refresh }
 * status: 'loading' (todavía se está preguntando al backend) | 'ready'
 */
export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth tiene que usarse dentro de <AuthProvider>')
  return value
}

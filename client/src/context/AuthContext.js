// Contexto de la sesión (Brandon). El valor lo provee <AuthProvider> y se lee con useAuth().
// Está en un archivo aparte porque la regla de Vite (react-refresh) pide que un
// archivo .jsx exporte solo componentes.

import { createContext } from 'react'

export const AuthContext = createContext(null)

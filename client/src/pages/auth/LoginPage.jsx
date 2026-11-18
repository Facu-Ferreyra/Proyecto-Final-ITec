// Pantalla de inicio de sesión (Brandon).

import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth.js'
import AuthField from './AuthField.jsx'
import AuthLayout from './AuthLayout.jsx'
import { loginSchema } from './authSchemas.js'
import { useAuthForm } from './useAuthForm.js'
import './password-reset.css'

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const location = useLocation()
  const form = useAuthForm({ initialValues: { email: '', password: '' }, schema: loginSchema, onSubmit: login })

  // Ya logueado (o recién logueado): vuelve a la página que quería ver, o a Mis bots.
  if (isAuthenticated) {
    const from = location.state?.from
    const to = from ? `${from.pathname}${from.search ?? ''}` : '/bots'
    return <Navigate to={to} replace />
  }

  return (
    <AuthLayout
      title="Iniciar sesión"
      subtitle="Entrá para administrar tus bots."
      footer={
        <>
          ¿No tenés cuenta? <Link to="/register" state={location.state}>Crear cuenta</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={form.handleSubmit} noValidate>
        {/* 401: llegó acá desde una página privada sin sesión (ProtectedRoute guarda
            a dónde iba en state.from). Después de entrar, vuelve a esa página. */}
        {location.state?.from && !form.formError && (
          <p className="notice auth-notice" role="status">
            {location.state.reason === 'session-ended'
              ? 'Tu sesión terminó: venció o se cerró desde otro lado. Iniciá sesión de nuevo y te llevamos a donde estabas.'
              : 'Iniciá sesión para ver esa página. Después de entrar te llevamos de vuelta.'}
          </p>
        )}
        {form.formError && (
          <p className="notice notice-error" role="alert">
            {form.formError}
            {/* No se dice si el email existe (así nadie puede averiguar quién tiene
                cuenta), pero se guía a quien todavía no se registró. */}
            {form.formErrorCode === 'INVALID_CREDENTIALS' && (
              <>
                {' '}
                ¿No tenés cuenta?{' '}
                <Link to="/register" state={location.state}>
                  Creá una
                </Link>
              </>
            )}
          </p>
        )}
        <AuthField
          label="Email"
          name="email"
          type="email"
          placeholder="tu@email.com"
          autoComplete="email"
          autoFocus
          value={form.values.email}
          onChange={form.setField}
          error={form.fieldErrors.email}
        />
        <AuthField
          label="Contraseña"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={form.values.password}
          onChange={form.setField}
          error={form.fieldErrors.password}
        />
        <p className="auth-forgot">
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
        </p>
        <button type="submit" className="btn btn-primary btn-block" disabled={form.submitting}>
          {form.submitting ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </AuthLayout>
  )
}

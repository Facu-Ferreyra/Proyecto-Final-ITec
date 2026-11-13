// Pantalla de inicio de sesión (Brandon).

import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth.js'
import AuthField from './AuthField.jsx'
import AuthLayout from './AuthLayout.jsx'
import { loginSchema } from './authSchemas.js'
import { useAuthForm } from './useAuthForm.js'

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
          ¿No tenés cuenta? <Link to="/register" state={location.state}>Registrate gratis</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={form.handleSubmit} noValidate>
        {form.formError && (
          <p className="notice notice-error" role="alert">
            {form.formError}
          </p>
        )}
        <AuthField
          label="Email"
          name="email"
          type="email"
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
          autoComplete="current-password"
          value={form.values.password}
          onChange={form.setField}
          error={form.fieldErrors.password}
        />
        <button type="submit" className="btn btn-primary btn-block" disabled={form.submitting}>
          {form.submitting ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </AuthLayout>
  )
}

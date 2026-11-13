// Pantalla de registro (Brandon). Al crear la cuenta la sesión queda iniciada.

import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth.js'
import AuthField from './AuthField.jsx'
import AuthLayout from './AuthLayout.jsx'
import { PASSWORD_HINT, registerSchema } from './authSchemas.js'
import { useAuthForm } from './useAuthForm.js'

export default function RegisterPage() {
  const { isAuthenticated, register } = useAuth()
  const location = useLocation()
  const form = useAuthForm({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    schema: registerSchema,
    // confirmPassword solo se valida acá: al backend no se manda.
    onSubmit: ({ name, email, password }) => register({ name, email, password }),
  })

  if (isAuthenticated) {
    const from = location.state?.from
    return <Navigate to={from ? `${from.pathname}${from.search ?? ''}` : '/bots'} replace />
  }

  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Armá el bot de tu negocio en minutos."
      footer={
        <>
          ¿Ya tenés cuenta? <Link to="/login" state={location.state}>Iniciá sesión</Link>
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
          label="Nombre"
          name="name"
          autoComplete="name"
          autoFocus
          value={form.values.name}
          onChange={form.setField}
          error={form.fieldErrors.name}
        />
        <AuthField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.values.email}
          onChange={form.setField}
          error={form.fieldErrors.email}
        />
        <AuthField
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="new-password"
          hint={PASSWORD_HINT}
          value={form.values.password}
          onChange={form.setField}
          error={form.fieldErrors.password}
        />
        <AuthField
          label="Repetí la contraseña"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={form.values.confirmPassword}
          onChange={form.setField}
          error={form.fieldErrors.confirmPassword}
        />
        <button type="submit" className="btn btn-primary btn-block" disabled={form.submitting}>
          {form.submitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>
    </AuthLayout>
  )
}

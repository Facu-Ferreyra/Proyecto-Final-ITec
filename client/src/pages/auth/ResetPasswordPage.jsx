// "Nueva contraseña": se llega desde el link del mail (/reset-password?token=…).
// El token lo valida el backend (que exista, no esté usado y no haya vencido).
// No inicia sesión: al terminar, se entra con la contraseña nueva.

import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../../api/auth.js'
import AuthField from './AuthField.jsx'
import AuthLayout from './AuthLayout.jsx'
import { PASSWORD_HINT, resetPasswordSchema } from './authSchemas.js'
import { useAuthForm } from './useAuthForm.js'
import './password-reset.css'

const footer = (
  <>
    <Link to="/login">Volver a iniciar sesión</Link>
  </>
)

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [done, setDone] = useState(false)
  const form = useAuthForm({
    initialValues: { password: '', confirmPassword: '' },
    schema: resetPasswordSchema,
    onSubmit: async ({ password }) => {
      await resetPassword({ token, password })
      setDone(true)
    },
  })

  if (done) {
    return (
      <AuthLayout title="Listo, ya cambiaste tu contraseña" subtitle="Por seguridad, cerramos las sesiones que tenías abiertas.">
        <Link className="btn btn-primary btn-block" to="/login">
          Iniciar sesión
        </Link>
      </AuthLayout>
    )
  }

  if (!token) {
    return (
      <AuthLayout title="Este link no es válido" subtitle="Puede que esté incompleto. Pedí uno nuevo." footer={footer}>
        <Link className="btn btn-primary btn-block" to="/forgot-password">
          Pedir un link nuevo
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Elegí tu contraseña nueva" footer={footer}>
      <form className="auth-form" onSubmit={form.handleSubmit} noValidate>
        {form.formError && (
          <p className="notice notice-error" role="alert">
            {form.formError}
            {form.formErrorCode === 'INVALID_RESET_TOKEN' && (
              <>
                {' '}
                <Link to="/forgot-password">Pedir un link nuevo</Link>
              </>
            )}
          </p>
        )}
        <AuthField
          label="Contraseña nueva"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          autoFocus
          hint={PASSWORD_HINT}
          value={form.values.password}
          onChange={form.setField}
          error={form.fieldErrors.password}
        />
        <AuthField
          label="Repetí la contraseña"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          value={form.values.confirmPassword}
          onChange={form.setField}
          error={form.fieldErrors.confirmPassword}
        />
        <button type="submit" className="btn btn-primary btn-block" disabled={form.submitting}>
          {form.submitting ? 'Guardando…' : 'Guardar contraseña nueva'}
        </button>
      </form>
    </AuthLayout>
  )
}

// "Olvidé mi contraseña": se pide el email y se manda un link para elegir una nueva.
// Después se muestra "Revisá tu email" (CheckEmailPanel), con reenviar y corregir el email.
// El mensaje es el mismo exista o no la cuenta (no revela qué emails existen).

import { useState } from 'react'
import { forgotPassword } from '../../api/auth.js'
import AuthField from './AuthField.jsx'
import AuthLayout from './AuthLayout.jsx'
import { forgotPasswordSchema } from './authSchemas.js'
import CheckEmailPanel from './CheckEmailPanel.jsx'
import { useAuthForm } from './useAuthForm.js'
import './password-reset.css'

// El formulario se monta de nuevo cada vez que se muestra: así, si la persona vuelve
// a corregir el email, arranca limpio (con el email que había escrito).
function ForgotForm({ initialEmail, onSent }) {
  const form = useAuthForm({
    initialValues: { email: initialEmail },
    schema: forgotPasswordSchema,
    onSubmit: async ({ email }) => {
      await forgotPassword({ email })
      onSent(email)
    },
  })

  return (
    <form className="auth-form" onSubmit={form.handleSubmit} noValidate>
      {form.formError && (
        <p className="notice notice-error" role="alert">
          {form.formError}
        </p>
      )}
      <AuthField
        label="Email de tu cuenta"
        name="email"
        type="email"
        placeholder="tu@email.com"
        autoComplete="email"
        autoFocus
        value={form.values.email}
        onChange={form.setField}
        error={form.fieldErrors.email}
      />
      <button type="submit" className="btn btn-primary btn-block" disabled={form.submitting}>
        {form.submitting ? 'Enviando…' : 'Enviar link'}
      </button>
    </form>
  )
}

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState('') // email al que se mandó el link
  const [lastEmail, setLastEmail] = useState('') // para volver a corregirlo

  return (
    <AuthLayout
      title={sentTo ? 'Revisá tu email' : 'Recuperar contraseña'}
      subtitle={sentTo ? undefined : 'Escribí el email de tu cuenta y te mandamos un link para elegir una contraseña nueva.'}
    >
      {sentTo ? (
        <CheckEmailPanel
          email={sentTo}
          onChangeEmail={() => {
            setLastEmail(sentTo)
            setSentTo('')
          }}
        />
      ) : (
        <ForgotForm initialEmail={lastEmail} onSent={setSentTo} />
      )}
    </AuthLayout>
  )
}

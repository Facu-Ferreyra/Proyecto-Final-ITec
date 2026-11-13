// Campo de formulario de login/registro (Brandon): etiqueta, input, ayuda y error.
// Accesible: el error se asocia al input con aria-describedby y aria-invalid.

import { useId, useState } from 'react'

export default function AuthField({ label, name, type = 'text', value, onChange, error, hint, autoComplete, autoFocus }) {
  const id = useId()
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined

  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <div className="auth-input-wrap">
        <input
          id={id}
          name={name}
          type={isPassword && showPassword ? 'text' : type}
          value={value}
          onChange={(event) => onChange(name, event.target.value)}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
        />
        {isPassword && (
          <button
            type="button"
            className="auth-toggle"
            onClick={() => setShowPassword((shown) => !shown)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={showPassword}
          >
            {showPassword ? 'Ocultar' : 'Ver'}
          </button>
        )}
      </div>
      {hint && !error && (
        <p id={`${id}-hint`} className="auth-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="auth-error">
          {error}
        </p>
      )}
    </div>
  )
}

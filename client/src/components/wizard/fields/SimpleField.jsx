// Campos de un solo valor: text, textarea, phone y boolean.

import { useId } from 'react'
import FieldWrapper from './FieldWrapper.jsx'

export default function SimpleField({ field, value, error, onChange }) {
  const id = useId()

  if (field.type === 'boolean') {
    return (
      <div className="field field-checkbox">
        <input id={id} type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} />
        <label htmlFor={id}>{field.label}</label>
      </div>
    )
  }

  const common = {
    id,
    value: value ?? '',
    placeholder: field.placeholder,
    maxLength: field.maxLength,
    onChange: (e) => onChange(e.target.value),
  }

  return (
    <FieldWrapper id={id} label={field.label} required={field.required} error={error}>
      {(errorId) =>
        field.type === 'textarea' ? (
          <textarea {...common} rows={4} aria-invalid={Boolean(error)} aria-describedby={errorId} />
        ) : (
          <input
            {...common}
            type={field.type === 'phone' ? 'tel' : 'text'}
            aria-invalid={Boolean(error)}
            aria-describedby={errorId}
          />
        )
      }
    </FieldWrapper>
  )
}

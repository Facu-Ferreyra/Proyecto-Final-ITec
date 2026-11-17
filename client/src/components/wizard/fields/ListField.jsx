// Lista de textos (ej.: formas de pago, horarios de turnos): un input por
// elemento, con botones para agregar y quitar.

import { useId } from 'react'
import FieldWrapper from './FieldWrapper.jsx'

export default function ListField({ field, value = [], errors, onChange }) {
  const id = useId()
  const maxItems = field.maxItems ?? 20
  // Un campo obligatorio siempre muestra al menos una fila, y esa primera fila
  // no se puede quitar (sin ella el bot no tendría ese dato).
  const rows = field.required && value.length === 0 ? [''] : value
  const canRemove = (index) => !field.required || index > 0

  const update = (index, text) => onChange(rows.map((item, i) => (i === index ? text : item)))
  const remove = (index) => onChange(rows.filter((_, i) => i !== index))
  const add = () => onChange([...rows, ''])

  return (
    <FieldWrapper id={id} label={field.label} required={field.required} error={errors[field.key]} asGroup>
      {() => (
        <div className="list-field">
          {rows.map((item, index) => {
            const error = errors[`${field.key}.${index}`]
            return (
              // El índice como key alcanza: los elementos no se reordenan.
              <div key={index} className="list-row">
                <input
                  value={item}
                  placeholder={field.placeholder}
                  maxLength={field.itemMaxLength}
                  aria-label={`${field.label} ${index + 1}`}
                  aria-invalid={Boolean(error)}
                  onChange={(e) => update(index, e.target.value)}
                />
                {canRemove(index) && (
                  <button type="button" className="btn btn-secondary btn-small" onClick={() => remove(index)} aria-label={`Quitar ${field.label} ${index + 1}`}>
                    Quitar
                  </button>
                )}
                {error && <p className="field-error">{error}</p>}
              </div>
            )
          })}
          {rows.length < maxItems && (
            <button type="button" className="btn btn-secondary btn-small" onClick={add}>
              + Agregar
            </button>
          )}
        </div>
      )}
    </FieldWrapper>
  )
}

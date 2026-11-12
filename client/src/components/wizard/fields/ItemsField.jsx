// Tabla de ítems (ej.: servicios, productos, preguntas): una fila por ítem y
// una columna por cada "itemField" de la plantilla.

import { useId } from 'react'
import FieldWrapper from './FieldWrapper.jsx'

// Los precios se guardan como número; un input vacío queda como '' (no cargado).
const toValue = (itemField, text) => (itemField.type === 'price' && text !== '' ? Number(text) : text)

export default function ItemsField({ field, value = [], errors, onChange }) {
  const id = useId()
  const maxItems = field.maxItems ?? 30
  // Un campo obligatorio siempre muestra al menos una fila, y esa primera fila
  // no se puede quitar (sin ella el bot no tendría ese dato).
  const rows = field.required && value.length === 0 ? [{}] : value
  const canRemove = (index) => !field.required || index > 0

  const update = (index, key, newValue) =>
    onChange(rows.map((item, i) => (i === index ? { ...item, [key]: newValue } : item)))
  const remove = (index) => onChange(rows.filter((_, i) => i !== index))
  const add = () => onChange([...rows, {}])

  return (
    <FieldWrapper id={id} label={field.label} required={field.required} error={errors[field.key]} asGroup>
      {() => (
        <div className="items-field">
          {rows.map((item, index) => (
            <div key={index} className="items-row">
              {field.itemFields.map((itemField) => {
                const error = errors[`${field.key}.${index}.${itemField.key}`]
                const inputProps = {
                  value: item[itemField.key] ?? '',
                  'aria-label': `${itemField.label} ${index + 1}`,
                  'aria-invalid': Boolean(error),
                  onChange: (e) => update(index, itemField.key, toValue(itemField, e.target.value)),
                }
                return (
                  <div key={itemField.key} className="items-cell">
                    <span className="items-cell-label" aria-hidden="true">
                      {itemField.label}
                    </span>
                    {itemField.type === 'textarea' ? (
                      <textarea {...inputProps} rows={2} maxLength={itemField.maxLength} />
                    ) : itemField.type === 'price' ? (
                      <input {...inputProps} type="number" min="0" max="100000000" step="1" inputMode="numeric" />
                    ) : (
                      <input {...inputProps} maxLength={itemField.maxLength} />
                    )}
                    {error && <p className="field-error">{error}</p>}
                  </div>
                )
              })}
              {canRemove(index) && (
                <button type="button" className="btn btn-secondary btn-small" onClick={() => remove(index)} aria-label={`Quitar fila ${index + 1} de ${field.label}`}>
                  Quitar
                </button>
              )}
            </div>
          ))}
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

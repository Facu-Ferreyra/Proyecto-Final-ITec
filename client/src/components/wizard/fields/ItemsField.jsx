// Tabla de ítems (ej.: servicios, productos, preguntas): una fila por ítem y
// una columna por cada "itemField" de la plantilla.

import { useId } from 'react'
import FieldWrapper from './FieldWrapper.jsx'
import PriceInput from './PriceInput.jsx'

export default function ItemsField({ field, value = [], errors, onChange }) {
  const id = useId()
  const maxItems = field.maxItems ?? 30
  // Un campo obligatorio siempre muestra al menos una fila, y esa primera fila
  // no se puede quitar (sin ella el bot no tendría ese dato).
  const rows = field.required && value.length === 0 ? [{}] : value
  const canRemove = (index) => !field.required || index > 0
  const hasLongText = field.itemFields.some((itemField) => itemField.type === 'textarea')

  const update = (index, key, newValue) =>
    onChange(rows.map((item, i) => (i === index ? { ...item, [key]: newValue } : item)))
  const remove = (index) => onChange(rows.filter((_, i) => i !== index))
  const add = () => onChange([...rows, {}])

  return (
    <FieldWrapper id={id} label={field.label} required={field.required} error={errors[field.key]} asGroup>
      {() => (
        <div className="items-field">
          {rows.map((item, index) => (
            // Si la fila tiene un texto largo (ej.: la respuesta de una pregunta),
            // los cuadros van uno debajo del otro, a todo el ancho.
            <div key={index} className={hasLongText ? 'items-row items-row-stacked' : 'items-row'}>
              {field.itemFields.map((itemField) => {
                const error = errors[`${field.key}.${index}.${itemField.key}`]
                const inputProps = {
                  value: item[itemField.key] ?? '',
                  'aria-label': `${itemField.label} ${index + 1}`,
                  'aria-invalid': Boolean(error),
                  onChange: (e) => update(index, itemField.key, e.target.value),
                }
                return (
                  <div key={itemField.key} className="items-cell">
                    <span className="items-cell-label" aria-hidden="true">
                      {itemField.label}
                    </span>
                    {itemField.type === 'textarea' ? (
                      <textarea {...inputProps} rows={3} maxLength={itemField.maxLength} />
                    ) : itemField.type === 'price' ? (
                      // Precio: número (o '' si está vacío), con flechas de a 1.000.
                      <PriceInput {...inputProps} onChange={(price) => update(index, itemField.key, price)} />
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

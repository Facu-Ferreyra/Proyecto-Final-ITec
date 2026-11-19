// Formas de pago: casillas con las más comunes y una lista "Otras" para las que
// no estén. Se guarda como lista de textos, igual que antes: las marcadas primero
// y después las otras. Las que no están en la lista (bots viejos) van a "Otras".

import { useId } from 'react'
import FieldWrapper from './FieldWrapper.jsx'
import { PAYMENT_METHODS } from './fieldPresets.js'
import ListField from './ListField.jsx'

export default function PaymentMethodsField({ field, value = [], errors, onChange }) {
  const id = useId()
  const checked = PAYMENT_METHODS.filter((method) => value.includes(method))
  const others = value.filter((method) => !PAYMENT_METHODS.includes(method))

  function toggle(method, isChecked) {
    const nextChecked = PAYMENT_METHODS.filter((m) => (m === method ? isChecked : checked.includes(m)))
    onChange([...nextChecked, ...others])
  }

  // "Otras" usa la misma lista de siempre, con el lugar que dejan las marcadas.
  const othersField = {
    ...field,
    key: `${field.key}-others`,
    label: 'Otras formas de pago',
    required: false,
    maxItems: Math.max(0, (field.maxItems ?? 10) - checked.length),
  }

  return (
    <FieldWrapper id={id} label={field.label} required={field.required} error={errors[field.key]} asGroup>
      {() => (
        <div className="payment-field">
          <div className="weekdays">
            {PAYMENT_METHODS.map((method) => (
              <label key={method} className="weekday">
                <input type="checkbox" checked={checked.includes(method)} onChange={(e) => toggle(method, e.target.checked)} />
                {method}
              </label>
            ))}
          </div>
          <ListField field={othersField} value={others} errors={{}} onChange={(next) => onChange([...checked, ...next])} />
        </div>
      )}
    </FieldWrapper>
  )
}

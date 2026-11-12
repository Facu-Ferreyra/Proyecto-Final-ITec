// Días de la semana: 7 casillas. Se guarda como números, igual que el backend:
// 0 = domingo, 1 = lunes … 6 = sábado. Se muestran de lunes a domingo.

import { useId } from 'react'
import FieldWrapper from './FieldWrapper.jsx'

const DAYS = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' },
]

export default function WeekdaysField({ field, value = [], error, onChange }) {
  const id = useId()

  function toggle(day, checked) {
    const next = checked ? [...value, day] : value.filter((d) => d !== day)
    onChange(next.sort((a, b) => a - b))
  }

  return (
    <FieldWrapper id={id} label={field.label} required={field.required} error={error} asGroup>
      {() => (
        <div className="weekdays">
          {DAYS.map((day) => (
            <label key={day.value} className="weekday">
              <input type="checkbox" checked={value.includes(day.value)} onChange={(e) => toggle(day.value, e.target.checked)} />
              {day.label}
            </label>
          ))}
        </div>
      )}
    </FieldWrapper>
  )
}

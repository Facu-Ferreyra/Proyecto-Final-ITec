// Horarios de los turnos: se marcan tocando cada horario (cada 30 minutos), sin
// escribir. Se guarda como lista de textos ordenada ("10:00", "10:30"…), igual que
// antes. Si un bot viejo tiene horarios escritos a mano, aparecen también marcados.

import { useId } from 'react'
import { formatTime } from '../../common/format.js'
import FieldWrapper from './FieldWrapper.jsx'
import { SLOT_TIMES } from './fieldPresets.js'

export default function TimeSlotsField({ field, value = [], error, onChange }) {
  const id = useId()
  const maxItems = field.maxItems ?? 24
  const options = [...new Set([...SLOT_TIMES, ...value])].sort()
  const isFull = value.length >= maxItems

  function toggle(time, isChecked) {
    const next = isChecked ? [...value, time] : value.filter((t) => t !== time)
    onChange(next.sort())
  }

  return (
    <FieldWrapper id={id} label={field.label} required={field.required} error={error} asGroup>
      {() => (
        <>
          <p className="field-hint">
            Tocá los horarios en los que das turnos ({value.length} de {maxItems} como máximo).
          </p>
          <div className="time-slots">
            {options.map((time) => {
              const isChecked = value.includes(time)
              return (
                <label key={time} className={isChecked ? 'time-slot time-slot-checked' : 'time-slot'}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={!isChecked && isFull}
                    onChange={(e) => toggle(time, e.target.checked)}
                  />
                  {formatTime(time)}
                </label>
              )
            })}
          </div>
        </>
      )}
    </FieldWrapper>
  )
}

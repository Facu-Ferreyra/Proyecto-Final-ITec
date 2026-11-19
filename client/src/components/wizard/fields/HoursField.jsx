// Horarios de atención con selectores: "de [lunes] a [viernes], de [09:00] a [18:00]".
// Se pueden agregar varios bloques (ej.: sábados con otro horario). El texto que
// se guarda lo arma hoursToText, con el formato que usa el bot: "Atendemos …".
// Si el horario guardado se escribió a mano (formato viejo), se muestra tal cual
// y se puede pasar al selector.

import { useId, useState } from 'react'
import FieldWrapper from './FieldWrapper.jsx'
import TimeSelect from './TimeSelect.jsx'
import { DAYS, EMPTY_BLOCK, hoursToText, OPENING_TIMES, textToHours, to12h } from './fieldPresets.js'

const MAX_BLOCKS = 4

// format: cómo se muestra cada opción (el valor guardado no cambia).
function Select({ label, value, options, onChange, format = (option) => option }) {
  return (
    <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">—</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {format(option)}
        </option>
      ))}
    </select>
  )
}

export default function HoursField({ field, value = '', error, onChange }) {
  const id = useId()
  // null = el texto guardado no tiene el formato del selector (se escribió a mano).
  const [blocks, setBlocks] = useState(() => (value ? textToHours(value) : [{ ...EMPTY_BLOCK }]))

  function update(next) {
    setBlocks(next)
    onChange(hoursToText(next))
  }

  const change = (index, key, newValue) => update(blocks.map((b, i) => (i === index ? { ...b, [key]: newValue } : b)))

  return (
    <FieldWrapper id={id} label={field.label} required={field.required} error={error} asGroup>
      {() =>
        blocks === null ? (
          <div className="hours-legacy">
            <p className="field-hint">Horario guardado: “{value}”</p>
            <button type="button" className="btn btn-secondary btn-small" onClick={() => update([{ ...EMPTY_BLOCK }])}>
              Cargarlo con el selector
            </button>
          </div>
        ) : (
          <div className="hours-field">
            {blocks.map((block, index) => (
              <div key={index} className="hours-row">
                {/* Cada grupo corta de línea entero: "De [día] a [día]" / "de [hora] a [hora]". */}
                <span className="hours-group">
                  <span>De</span>
                  <Select label={`Desde el día, horario ${index + 1}`} value={block.from} options={DAYS} onChange={(v) => change(index, 'from', v)} />
                  <span>a</span>
                  <Select label={`Hasta el día, horario ${index + 1}`} value={block.to} options={DAYS} onChange={(v) => change(index, 'to', v)} />
                </span>
                <span className="hours-group">
                  <span>de</span>
                  {/* Horas: selector propio con lista corta (48 opciones no entran en un <select> nativo). */}
                  <TimeSelect label={`Abre, horario ${index + 1}`} value={block.open} options={OPENING_TIMES} format={to12h} onChange={(v) => change(index, 'open', v)} />
                  <span>a</span>
                  <TimeSelect label={`Cierra, horario ${index + 1}`} value={block.close} options={OPENING_TIMES} format={to12h} onChange={(v) => change(index, 'close', v)} />
                </span>
                {index > 0 && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-small"
                    aria-label={`Quitar horario ${index + 1}`}
                    onClick={() => update(blocks.filter((_, i) => i !== index))}
                  >
                    Quitar
                  </button>
                )}
              </div>
            ))}
            {blocks.length < MAX_BLOCKS && (
              <button type="button" className="btn btn-secondary btn-small" onClick={() => setBlocks([...blocks, { ...EMPTY_BLOCK }])}>
                + Agregar otro horario
              </button>
            )}
            {value && <p className="field-hint">Tu bot va a decir: “Atendemos {value}.”</p>}
          </div>
        )
      }
    </FieldWrapper>
  )
}

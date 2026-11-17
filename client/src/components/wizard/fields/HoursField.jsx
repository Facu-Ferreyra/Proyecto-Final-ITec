// Horarios de atención con selectores: "de [lunes] a [viernes], de [09:00] a [18:00]".
// Se pueden agregar varios bloques (ej.: sábados con otro horario). El texto que
// se guarda lo arma hoursToText, con el formato que usa el bot: "Atendemos …".
// Si el horario guardado se escribió a mano (formato viejo), se muestra tal cual
// y se puede pasar al selector.

import { useId, useState } from 'react'
import FieldWrapper from './FieldWrapper.jsx'
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
                <span>De</span>
                <Select label={`Desde el día, horario ${index + 1}`} value={block.from} options={DAYS} onChange={(v) => change(index, 'from', v)} />
                <span>a</span>
                <Select label={`Hasta el día, horario ${index + 1}`} value={block.to} options={DAYS} onChange={(v) => change(index, 'to', v)} />
                <span>de</span>
                <Select label={`Abre, horario ${index + 1}`} value={block.open} options={OPENING_TIMES} format={to12h} onChange={(v) => change(index, 'open', v)} />
                <span>a</span>
                <Select label={`Cierra, horario ${index + 1}`} value={block.close} options={OPENING_TIMES} format={to12h} onChange={(v) => change(index, 'close', v)} />
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

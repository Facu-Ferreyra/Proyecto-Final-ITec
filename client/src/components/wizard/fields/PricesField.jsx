// "Precios" de la plantilla de preguntas frecuentes: filas de producto + precio
// en lugar de texto libre. Se guarda como texto (lo arma pricesToText), igual
// que antes, así el backend y el bot no cambian. Si los precios guardados se
// escribieron a mano (formato viejo), se muestran tal cual.

import { useId, useState } from 'react'
import FieldWrapper from './FieldWrapper.jsx'
import { EMPTY_PRICE_ROW, pricesToText, textToPrices } from './fieldPresets.js'
import PriceInput from './PriceInput.jsx'

const MAX_ROWS = 20

export default function PricesField({ field, value = '', error, onChange }) {
  const id = useId()
  // null = el texto guardado no tiene el formato de las filas (se escribió a mano).
  const [rows, setRows] = useState(() => (value ? textToPrices(value) : [{ ...EMPTY_PRICE_ROW }]))

  function update(next) {
    setRows(next)
    onChange(pricesToText(next))
  }

  const change = (index, key, newValue) => update(rows.map((row, i) => (i === index ? { ...row, [key]: newValue } : row)))

  return (
    <FieldWrapper id={id} label={field.label} required={field.required} error={error} asGroup>
      {() =>
        rows === null ? (
          <div className="hours-legacy">
            <p className="field-hint prices-legacy">Precios guardados: “{value}”</p>
            <button type="button" className="btn btn-secondary btn-small" onClick={() => update([{ ...EMPTY_PRICE_ROW }])}>
              Cargarlos con el formulario
            </button>
          </div>
        ) : (
          <div className="hours-field">
            {rows.map((row, index) => (
              <div key={index} className="price-row">
                <input
                  value={row.name}
                  maxLength={60}
                  placeholder="Producto o servicio"
                  aria-label={`Producto ${index + 1}`}
                  onChange={(e) => change(index, 'name', e.target.value)}
                />
                <PriceInput aria-label={`Precio ${index + 1}`} value={row.price} onChange={(price) => change(index, 'price', price)} />
                {index > 0 ? (
                  <button
                    type="button"
                    className="btn btn-secondary btn-small"
                    aria-label={`Quitar producto ${index + 1}`}
                    onClick={() => update(rows.filter((_, i) => i !== index))}
                  >
                    Quitar
                  </button>
                ) : (
                  <span aria-hidden="true" /> // ocupa el lugar del botón, así las filas quedan alineadas
                )}
              </div>
            ))}
            {rows.length < MAX_ROWS && (
              <button type="button" className="btn btn-secondary btn-small" onClick={() => setRows([...rows, { ...EMPTY_PRICE_ROW }])}>
                + Agregar
              </button>
            )}
            <p className="field-hint">Con las flechas el precio sube o baja de a $ 1.000; también podés escribirlo.</p>
          </div>
        )
      }
    </FieldWrapper>
  )
}

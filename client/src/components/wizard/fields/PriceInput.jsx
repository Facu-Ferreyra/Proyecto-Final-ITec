// Campo de precio: "$" + número. Las flechas (o las teclas ↑ ↓) suben y bajan de
// a 1.000, y también se puede escribir un precio exacto (ej.: 8.500).
// No hay <form>, así que el navegador no rechaza un precio que no sea múltiplo de 1.000.
// Un campo vacío queda como '' (no cargado); si no, se guarda como número.

export const MAX_PRICE = 100_000_000

export default function PriceInput({ value, onChange, ...props }) {
  return (
    <span className="price-input">
      <span aria-hidden="true">$</span>
      <input
        {...props}
        type="number"
        min="0"
        max={MAX_PRICE}
        step="1000"
        inputMode="decimal"
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value === '' ? '' : Number(event.target.value))}
      />
    </span>
  )
}

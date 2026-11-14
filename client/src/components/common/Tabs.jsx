// Botones para cambiar de sección dentro de una pantalla (panel y admin).
// aria-pressed indica cuál está activa; se usan con Tab y Enter como cualquier botón.

import './common.css'

export default function Tabs({ tabs, active, onChange, label }) {
  return (
    <div className="tabs" role="group" aria-label={label}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className="tab"
          aria-pressed={tab.id === active}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

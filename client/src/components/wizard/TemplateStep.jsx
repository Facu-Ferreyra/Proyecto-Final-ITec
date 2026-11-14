// Paso 1: elegir plantilla (prototipo, pantalla 5).
// "locked" = el bot ya existe y su plantilla no se puede cambiar.

export default function TemplateStep({ titleRef, templates, selectedId, locked, busy, onSelect, onNext }) {
  return (
    <section aria-labelledby="template-step-title">
      <h2 id="template-step-title" className="step-title" ref={titleRef} tabIndex={-1}>
        Elegí una plantilla
      </h2>
      {locked && <p className="step-hint">La plantilla de un bot ya creado no se puede cambiar.</p>}

      <div className="template-grid">
        {templates.map((template) => {
          const selected = template.id === selectedId
          return (
            <article key={template.id} className={`template-card ${selected ? 'template-card-selected' : ''}`}>
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              <p className="template-ideal">Ideal para: {template.config.idealFor}</p>
              <button
                type="button"
                className={`btn ${selected ? 'btn-primary' : 'btn-secondary'} btn-block`}
                aria-pressed={selected}
                disabled={locked && !selected}
                onClick={() => onSelect(template.id)}
              >
                {selected ? 'Elegida' : 'Elegir'}
              </button>
            </article>
          )
        })}
      </div>

      <div className="step-actions step-actions-end">
        <button type="button" className="btn btn-primary" disabled={!selectedId || busy} onClick={onNext}>
          {busy ? 'Creando borrador…' : 'Siguiente'}
        </button>
      </div>
    </section>
  )
}

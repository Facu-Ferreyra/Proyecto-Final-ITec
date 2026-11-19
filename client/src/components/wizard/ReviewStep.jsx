// Paso 3: resumen del bot antes de publicar (prototipo, pantalla 7).
// "Sin cargar" para lo vacío; los obligatorios que faltan, en rojo.

import { isEmpty } from '../../schemas/botConfig.js'
import { formatValue } from './formatValue.js'
import './ReviewStep.css'

export default function ReviewStep({ titleRef, bot, template, publishing, onBack, onPublish }) {
  const missingKeys = new Set(bot.missingFields.map((f) => f.key))
  const isPublished = bot.status === 'PUBLISHED'
  // Botones que va a ver el visitante: igual que el backend, se ocultan los que
  // necesitan un dato sin cargar ("requires"). Los ítems sin "label" se arman
  // a partir de otros datos (ej.: las preguntas propias en faq).
  const menuLabels = (template.config.menu ?? [])
    .filter((item) => item.label && (item.requires ?? []).every((key) => !isEmpty(bot.config[key])))
    .map((item) => item.label)

  return (
    <section className="card review" aria-labelledby="review-step-title">
      <h2 id="review-step-title" className="step-title" ref={titleRef} tabIndex={-1}>
        Revisá tu bot
      </h2>

      <dl className="review-list">
        <div className="review-row">
          <dt>Plantilla</dt>
          <dd className="review-value">{template.name}</dd>
        </div>
        {template.config.fields.map((field) => {
          const text = formatValue(field, bot.config[field.key])
          const missing = missingKeys.has(field.key)
          return (
            <div key={field.key} className="review-row">
              <dt>{field.label}</dt>
              <dd className={text ? 'review-value' : missing ? 'review-missing' : 'review-empty'}>
                {text || (missing ? 'Sin cargar (obligatorio)' : 'Sin cargar')}
              </dd>
            </div>
          )
        })}
      </dl>

      {menuLabels.length > 0 && (
        <>
          <h3 className="review-subtitle">Preguntas del menú</h3>
          <ul className="chip-list">
            {menuLabels.map((label) => (
              <li key={label} className="chip">
                {label}
              </li>
            ))}
          </ul>
        </>
      )}

      {!bot.canPublish && (
        <p className="notice notice-error" role="alert">
          Para publicar falta completar: {bot.missingFields.map((f) => f.label).join(', ')}. Volvé con “Atrás”.
        </p>
      )}

      <div className="step-actions">
        <button type="button" className="btn btn-secondary" disabled={publishing} onClick={onBack}>
          Atrás
        </button>
        <button type="button" className="btn btn-primary" disabled={!bot.canPublish || publishing} onClick={onPublish}>
          {publishing ? 'Publicando…' : isPublished ? 'Continuar' : 'Publicar bot'}
        </button>
      </div>
    </section>
  )
}

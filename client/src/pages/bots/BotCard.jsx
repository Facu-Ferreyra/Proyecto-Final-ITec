// Tarjeta de un bot en "Mis bots": ícono, nombre, plantilla, estado, un resumen
// (estadísticas si está publicado, qué falta si es borrador) y las acciones.

import BotAvatar from '../../components/common/BotAvatar.jsx'
import { TrashIcon } from './TemplateIcon.jsx'

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`

// Resumen debajo del nombre, según el estado del bot.
function BotSummary({ bot, isPublished }) {
  if (isPublished) {
    const { conversations = 0, leads = 0 } = bot.stats ?? {}
    return (
      <p className="bot-card-summary">
        {plural(conversations, 'conversación', 'conversaciones')} · {plural(leads, 'registro', 'registros')}
      </p>
    )
  }
  const missing = bot.missingFields?.length ?? 0
  return missing > 0 ? (
    <p className="bot-card-summary bot-card-warning">Faltan {plural(missing, 'dato', 'datos')} para publicar</p>
  ) : (
    <p className="bot-card-summary bot-card-ready">Listo para publicar</p>
  )
}

export default function BotCard({ bot, busy, onEdit, onDelete, onPublish, onUnpublish }) {
  const isPublished = bot.status === 'PUBLISHED'

  return (
    <article className={`bot-card ${isPublished ? 'bot-card-published' : 'bot-card-draft'}`}>
      <header className="bot-card-header">
        {/* Logo del bot: iniciales + insignia de la plantilla. Un borrador se ve apagado. */}
        <BotAvatar
          name={bot.name}
          templateKey={bot.template.key}
          className={isPublished ? '' : 'bot-avatar-draft'}
        />
        <div className="bot-card-heading">
          <h2 className="bot-card-title">{bot.name}</h2>
          <p className="bot-card-template">{bot.template.name}</p>
          <span className={`status-badge ${isPublished ? 'status-published' : 'status-draft'}`}>
            {isPublished ? 'Publicado' : 'Borrador'}
          </span>
        </div>
      </header>

      <BotSummary bot={bot} isPublished={isPublished} />

      {isPublished && bot.publicPath && (
        // Se abre en otra pestaña para no salir del panel.
        <a className="bot-card-link" href={bot.publicPath} target="_blank" rel="noopener noreferrer">
          Ver chat <span aria-hidden="true">↗</span>
          <span className="visually-hidden"> de {bot.name} (se abre en otra pestaña)</span>
        </a>
      )}

      {/* aria-label agrega el nombre del bot: con varias tarjetas, un lector de
          pantalla lee "Eliminar Peluquería Lola" y no solo "Eliminar". */}
      <div className="bot-card-actions">
        <button type="button" className="btn btn-secondary btn-small" disabled={busy} onClick={() => onEdit(bot)} aria-label={`Editar ${bot.name}`}>
          Editar
        </button>
        {isPublished ? (
          <button type="button" className="btn btn-secondary btn-small" disabled={busy} onClick={() => onUnpublish(bot)} aria-label={`Despublicar ${bot.name}`}>
            Despublicar
          </button>
        ) : (
          <button type="button" className="btn btn-primary btn-small" disabled={busy} onClick={() => onPublish(bot)} aria-label={`Publicar ${bot.name}`}>
            Publicar
          </button>
        )}
        {/* Ícono de tacho: ocupa poco, así los botones entran siempre en una fila.
            title muestra "Eliminar" al pasar el mouse; aria-label lo lee el lector de pantalla. */}
        <button
          type="button"
          className="bot-card-delete"
          disabled={busy}
          onClick={() => onDelete(bot)}
          aria-label={`Eliminar ${bot.name}`}
          title="Eliminar"
        >
          <TrashIcon />
        </button>
      </div>
    </article>
  )
}

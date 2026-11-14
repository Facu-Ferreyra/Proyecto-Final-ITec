// Tarjeta de un bot en "Mis bots": nombre, plantilla, estado y acciones.

export default function BotCard({ bot, busy, onEdit, onDelete, onPublish, onUnpublish }) {
  const isPublished = bot.status === 'PUBLISHED'

  return (
    <article className="bot-card">
      <h2 className="bot-card-title">{bot.name}</h2>
      <p className="bot-card-template">Plantilla: {bot.template.name}</p>

      <span className={`badge ${isPublished ? 'badge-published' : 'badge-draft'}`}>
        {isPublished ? 'Publicado' : 'Borrador'}
      </span>

      {/* aria-label agrega el nombre del bot: con varias tarjetas, un lector de
          pantalla lee "Eliminar Peluquería Lola" y no solo "Eliminar". */}
      <div className="bot-card-actions">
        <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => onEdit(bot)} aria-label={`Editar ${bot.name}`}>
          Editar
        </button>
        <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => onDelete(bot)} aria-label={`Eliminar ${bot.name}`}>
          Eliminar
        </button>
        {isPublished ? (
          <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => onUnpublish(bot)} aria-label={`Despublicar ${bot.name}`}>
            Despublicar
          </button>
        ) : (
          <button type="button" className="btn btn-primary" disabled={busy} onClick={() => onPublish(bot)} aria-label={`Publicar ${bot.name}`}>
            Publicar
          </button>
        )}
      </div>
    </article>
  )
}

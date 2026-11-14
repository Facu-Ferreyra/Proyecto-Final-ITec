// Pantalla "Mis bots": lista de bots del dueño con sus acciones.
// No incluye la barra superior ni las rutas (son de Nicole y Brandon): quien la
// monte en su ruta le pasa onCreate y onEdit para navegar al asistente.

import BotCard from './BotCard.jsx'
import PageState from './PageState.jsx'
import { useMyBots } from './useMyBots.js'
import './theme.css'
import './MyBotsPage.css'

export default function MyBotsPage({ onCreate, onEdit }) {
  const { bots, status, loadError, retry, busyId, notice, remove, publish, unpublish } = useMyBots()

  return (
    <main className="bots-area">
      <header className="my-bots-header">
        <h1>Mis bots</h1>
        {status === 'ready' && bots.length > 0 && (
          <button type="button" className="btn btn-primary" onClick={() => onCreate?.()}>
            Crear bot
          </button>
        )}
      </header>

      {status === 'loading' && <PageState title="Cargando tus bots…" />}

      {status === 'error' && (
        <PageState
          isError
          title="No pudimos cargar tus bots"
          text={loadError}
          actionLabel="Reintentar"
          onAction={retry}
        />
      )}

      {status === 'ready' && bots.length === 0 && (
        <PageState
          title="Todavía no creaste ningún bot"
          text="Elegí una plantilla, cargá los datos de tu negocio y publicá el link."
          actionLabel="Crear mi primer bot"
          onAction={() => onCreate?.()}
        />
      )}

      {notice && (
        <p className={`notice notice-${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>
          {notice.text}
        </p>
      )}

      {status === 'ready' && bots.length > 0 && (
        <div className="bot-grid">
          {bots.map((bot) => (
            <BotCard
              key={bot.id}
              bot={bot}
              busy={busyId === bot.id}
              onEdit={(b) => onEdit?.(b)}
              onDelete={remove}
              onPublish={publish}
              onUnpublish={unpublish}
            />
          ))}
        </div>
      )}
    </main>
  )
}

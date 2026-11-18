// Pantalla "Mis bots": lista de bots del dueño con sus acciones.
// No incluye la barra superior ni las rutas (están en App.jsx y AppLayout): quien la
// monte en su ruta le pasa onCreate y onEdit para navegar al asistente.

import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import BotCard from './BotCard.jsx'
import PageState from './PageState.jsx'
import { useMyBots } from './useMyBots.js'
import './theme.css'
import './MyBotsPage.css'

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`

// Qué se pierde al eliminar: si el bot tiene actividad, se dice cuánta.
function DeleteBotWarning({ bot }) {
  const { conversations = 0, leads = 0 } = bot?.stats ?? {}
  const hasActivity = conversations > 0 || leads > 0
  return (
    <>
      <p>
        {hasActivity
          ? `Se borran también sus ${plural(conversations, 'conversación', 'conversaciones')} y ${plural(leads, 'registro', 'registros')}.`
          : 'Se borran también sus conversaciones y registros.'}
        {bot?.status === 'PUBLISHED' && ' El link público deja de funcionar.'}
      </p>
      <p>
        <strong>Esta acción no se puede deshacer.</strong>
      </p>
    </>
  )
}

export default function MyBotsPage({ onCreate, onEdit }) {
  const { bots, status, loadError, retry, busyId, notice, remove, pendingDelete, confirmDelete, cancelDelete, publish, unpublish } =
    useMyBots()

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

      {status === 'loading' && <PageState isLoading title="Cargando tus bots…" />}

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

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`¿Eliminar "${pendingDelete?.name}"?`}
        confirmLabel="Eliminar bot"
        requireText={pendingDelete?.name}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      >
        <DeleteBotWarning bot={pendingDelete} />
      </ConfirmDialog>
    </main>
  )
}

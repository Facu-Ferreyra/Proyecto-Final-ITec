// Pestaña de conversaciones de un bot: lista paginada (la más reciente primero)
// y, al elegir una, sus mensajes.

import { useCallback, useState } from 'react'
import { listConversations } from '../../api/panel.js'
import { formatDate } from '../../components/common/format.js'
import Pagination from '../../components/common/Pagination.jsx'
import { useApiData } from '../../components/common/useApiData.js'
import PageState from '../bots/PageState.jsx'
import ConversationDetail from './ConversationDetail.jsx'
import { LEAD_TYPES } from './leadInfo.js'

export default function ConversationsTab({ botId }) {
  const [page, setPage] = useState(1)
  const [openId, setOpenId] = useState(null) // conversación abierta

  const load = useCallback(() => listConversations(botId, { page }), [botId, page])
  const { data, status, error, retry } = useApiData(load)

  if (openId) return <ConversationDetail conversationId={openId} onBack={() => setOpenId(null)} />

  return (
    <section aria-label="Conversaciones">
      {status === 'loading' && <PageState title="Cargando conversaciones…" />}
      {status === 'error' && (
        <PageState isError title="No pudimos cargar las conversaciones" text={error?.message} actionLabel="Reintentar" onAction={retry} />
      )}
      {status === 'ready' && data.items.length === 0 && (
        <PageState title="Todavía no hay conversaciones" text="Compartí el link de tu bot: cada charla con un cliente aparece acá." />
      )}

      {status === 'ready' && data.items.length > 0 && (
        <>
          <ul className="data-list">
            {data.items.map((conversation) => (
              <li key={conversation.id} className="data-item">
                <div className="data-item-head">
                  <h3 className="data-item-title">{conversation.contactName || 'Visitante'}</h3>
                  <div className="badge-row">
                    {conversation.leadTypes.map((type) => (
                      <span key={type} className="badge">
                        {LEAD_TYPES[type]?.name ?? type}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="data-item-meta">
                  {formatDate(conversation.updatedAt)} · {conversation.messageCount} mensajes
                </p>
                {conversation.lastMessage && <p className="conversation-preview">{conversation.lastMessage.content}</p>}
                <div className="data-item-actions">
                  <button type="button" className="btn btn-secondary btn-small" onClick={() => setOpenId(conversation.id)}>
                    Ver conversación
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}
    </section>
  )
}

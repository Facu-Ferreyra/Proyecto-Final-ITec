// Todos los mensajes de una conversación, con las mismas burbujas que el chat.

import { useCallback } from 'react'
import { getConversationMessages } from '../../api/panel.js'
import { formatDate } from '../../components/common/format.js'
import { useApiData } from '../../components/common/useApiData.js'
import '../../components/chat/chat.css'
import PageState from '../bots/PageState.jsx'
import { LEAD_TYPES } from './leadInfo.js'

const BUBBLE = { BOT: 'chat-bubble-bot', VISITOR: 'chat-bubble-visitor' }

export default function ConversationDetail({ conversationId, onBack }) {
  const load = useCallback(() => getConversationMessages(conversationId), [conversationId])
  const { data, status, error, retry } = useApiData(load)

  const conversation = data?.conversation
  const contactName = conversation?.leads.find((lead) => lead.contactName)?.contactName

  return (
    <section aria-label="Conversación">
      <button type="button" className="btn btn-secondary btn-small" onClick={onBack}>
        ← Volver a la lista
      </button>

      {status === 'loading' && <PageState title="Cargando la conversación…" />}
      {status === 'error' && (
        <PageState isError title="No pudimos cargar la conversación" text={error?.message} actionLabel="Reintentar" onAction={retry} />
      )}

      {status === 'ready' && (
        <div className="conversation">
          <div className="data-item-head">
            <h2 className="data-item-title">{contactName || 'Visitante'}</h2>
            <div className="badge-row">
              {conversation.leads.map((lead) => (
                <span key={lead.id} className="badge">
                  {LEAD_TYPES[lead.type]?.name ?? lead.type}
                </span>
              ))}
            </div>
          </div>
          <p className="data-item-meta">Empezó el {formatDate(conversation.createdAt)}</p>

          <div className="chat conversation-log">
            <div className="chat-body">
              {data.items.map((message) => (
                <p key={message.id} className={`chat-bubble ${BUBBLE[message.sender] ?? 'chat-bubble-bot'}`}>
                  {message.content}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

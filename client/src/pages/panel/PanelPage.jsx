// Panel del dueño: elegir un bot y ver sus conversaciones y sus contactos,
// turnos o pedidos (según la plantilla). No sabe de rutas: si no hay bots,
// avisa con onCreateBot y App.jsx decide a dónde ir.

import { useId, useState } from 'react'
import { listBots } from '../../api/bots.js'
import '../../components/common/common.css'
import Tabs from '../../components/common/Tabs.jsx'
import { useApiData } from '../../components/common/useApiData.js'
import '../bots/theme.css'
import PageState from '../bots/PageState.jsx'
import ConversationsTab from './ConversationsTab.jsx'
import LeadsTab from './LeadsTab.jsx'
import { LEAD_TYPES, leadTypesFor } from './leadInfo.js'
import './panel.css'

export default function PanelPage({ onCreateBot }) {
  const selectId = useId()
  const { data: bots, status, error, retry } = useApiData(listBots)
  const [botId, setBotId] = useState(null)
  const [tab, setTab] = useState('conversations')

  // Si no eligió ninguno, arranca con el primer bot publicado (los borradores no tienen charlas).
  const bot = bots?.find((b) => b.id === botId) ?? bots?.find((b) => b.status === 'PUBLISHED') ?? bots?.[0]
  const tabs = [
    { id: 'conversations', label: 'Conversaciones' },
    ...(bot ? leadTypesFor(bot.template.key) : []).map((type) => ({ id: type, label: LEAD_TYPES[type].tab })),
  ]
  const activeTab = tabs.some((t) => t.id === tab) ? tab : 'conversations'

  function changeBot(id) {
    setBotId(id)
    setTab('conversations')
  }

  return (
    <main className="bots-area">
      <header className="page-header">
        <h1>Panel</h1>
        {status === 'ready' && bots.length > 0 && (
          <label className="inline-select" htmlFor={selectId}>
            Bot
            <select id={selectId} value={bot.id} onChange={(event) => changeBot(event.target.value)}>
              {bots.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                  {b.status === 'DRAFT' ? ' (borrador)' : ''}
                </option>
              ))}
            </select>
          </label>
        )}
      </header>

      {status === 'loading' && <PageState title="Cargando tus bots…" />}
      {status === 'error' && (
        <PageState isError title="No pudimos cargar tus bots" text={error?.message} actionLabel="Reintentar" onAction={retry} />
      )}
      {status === 'ready' && bots.length === 0 && (
        <PageState
          title="Todavía no tenés bots"
          text="Creá tu primer bot y compartí el link: las conversaciones y pedidos van a aparecer acá."
          actionLabel="Crear mi primer bot"
          onAction={() => onCreateBot?.()}
        />
      )}

      {status === 'ready' && bot && (
        // key: al cambiar de bot, cada pestaña arranca de cero (página 1, sin filtros).
        <div key={bot.id}>
          <Tabs tabs={tabs} active={activeTab} onChange={setTab} label="Secciones del panel" />
          {activeTab === 'conversations' ? (
            <ConversationsTab botId={bot.id} />
          ) : (
            <LeadsTab key={activeTab} botId={bot.id} type={activeTab} />
          )}
        </div>
      )}
    </main>
  )
}

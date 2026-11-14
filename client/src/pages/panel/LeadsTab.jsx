// Pestaña de contactos, turnos o pedidos de un bot: filtro por estado,
// lista paginada y cambio de estado de cada uno.

import { useCallback, useId, useState } from 'react'
import { listLeads, updateLeadStatus } from '../../api/panel.js'
import Pagination from '../../components/common/Pagination.jsx'
import { useApiData } from '../../components/common/useApiData.js'
import PageState from '../bots/PageState.jsx'
import LeadCard from './LeadCard.jsx'
import { LEAD_TYPES, statusLabel } from './leadInfo.js'

export default function LeadsTab({ botId, type }) {
  const info = LEAD_TYPES[type]
  const filterId = useId()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [notice, setNotice] = useState(null) // { type: 'error' | 'success', text }

  const load = useCallback(() => listLeads(botId, { type, status: statusFilter, page }), [botId, type, statusFilter, page])
  const { data, setData, status, error, retry } = useApiData(load)

  async function changeStatus(lead, newStatus) {
    setBusyId(lead.id)
    setNotice(null)
    try {
      const updated = await updateLeadStatus(lead.id, newStatus)
      setData((current) => ({ ...current, items: current.items.map((l) => (l.id === updated.id ? updated : l)) }))
      setNotice({ type: 'success', text: `${lead.contactName || info.name}: ahora está "${statusLabel(updated)}".` })
    } catch (err) {
      setNotice({ type: 'error', text: err.message })
    } finally {
      setBusyId(null)
    }
  }

  function changeFilter(value) {
    setStatusFilter(value)
    setPage(1)
  }

  return (
    <section aria-label={info.tab}>
      <div className="panel-toolbar">
        <label className="inline-select" htmlFor={filterId}>
          Mostrar
          <select id={filterId} value={statusFilter} onChange={(event) => changeFilter(event.target.value)}>
            <option value="">Todos</option>
            {Object.entries(info.statuses).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {notice && (
        <p className={`notice notice-${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>
          {notice.text}
        </p>
      )}

      {status === 'loading' && <PageState title={`Cargando ${info.tab.toLowerCase()}…`} />}
      {status === 'error' && (
        <PageState isError title={`No pudimos cargar ${info.tab.toLowerCase()}`} text={error?.message} actionLabel="Reintentar" onAction={retry} />
      )}
      {status === 'ready' && data.items.length === 0 && (
        <PageState
          title={`No hay ${info.tab.toLowerCase()}${statusFilter ? ' con ese estado' : ' todavía'}`}
          text="Cuando un cliente complete el flujo en tu bot, aparece acá."
        />
      )}

      {status === 'ready' && data.items.length > 0 && (
        <>
          <ul className="data-list">
            {data.items.map((lead) => (
              <LeadCard key={lead.id} lead={lead} busy={busyId === lead.id} onStatusChange={changeStatus} />
            ))}
          </ul>
          <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}
    </section>
  )
}

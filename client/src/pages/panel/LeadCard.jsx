// Un contacto, turno o pedido: datos del cliente, detalle y cambio de estado.

import { useId } from 'react'
import { formatDate } from '../../components/common/format.js'
import { LEAD_TYPES, leadDetails, statusLabel } from './leadInfo.js'

export default function LeadCard({ lead, busy, onStatusChange }) {
  const selectId = useId()
  const statuses = LEAD_TYPES[lead.type]?.statuses

  return (
    <li className="data-item">
      <div className="data-item-head">
        <h3 className="data-item-title">{lead.contactName || 'Sin nombre'}</h3>
        <span className={`badge lead-status lead-status-${lead.status.toLowerCase()}`}>{statusLabel(lead)}</span>
      </div>
      <p className="data-item-meta">
        {formatDate(lead.createdAt)}
        {lead.contactPhone && (
          <>
            {' · '}
            <a href={`tel:${lead.contactPhone.replace(/\s/g, '')}`}>{lead.contactPhone}</a>
          </>
        )}
      </p>

      <dl className="lead-details">
        {leadDetails(lead).map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      {statuses && (
        <div className="data-item-actions">
          <label className="inline-select" htmlFor={selectId}>
            Estado
            <select
              id={selectId}
              value={lead.status}
              disabled={busy}
              onChange={(event) => onStatusChange(lead, event.target.value)}
            >
              {Object.entries(statuses).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          {busy && <span className="data-item-meta">Guardando…</span>}
        </div>
      )}
    </li>
  )
}

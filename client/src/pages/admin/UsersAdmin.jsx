// Admin → Usuarios: buscar y filtrar cuentas, y activarlas o desactivarlas.
// Hay un solo administrador (el del seed): el backend no deja nombrar otro, por eso
// acá no hay botón para cambiar el rol.
// La propia cuenta no se puede modificar (el backend responde 403 CANNOT_MODIFY_SELF);
// acá además se desactivan esos controles para que se entienda por qué.
// Desactivar pide confirmación: la persona deja de poder entrar al instante.

import { useState } from 'react'
import { listUsers, updateUser } from '../../api/admin.js'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import { formatDate } from '../../components/common/format.js'
import Notice from '../../components/common/Notice.jsx'
import { ListSkeleton } from '../../components/common/Skeleton.jsx'
import { useApiData } from '../../components/common/useApiData.js'
import { useItemActions } from '../../components/common/useItemActions.js'
import PageState from '../bots/PageState.jsx'
import UsersFilters from './UsersFilters.jsx'
import { countByStatus, filterUsers } from './usersFilter.js'

const ROLE_LABELS = { USER: 'Usuario', ADMIN: 'Administrador' }

export default function UsersAdmin({ currentUserId }) {
  const { data: users, setData, status, error, retry } = useApiData(listUsers)
  const { busyId, notice, run } = useItemActions()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pendingDeactivate, setPendingDeactivate] = useState(null) // usuario a confirmar

  function setActive(user, isActive) {
    return run(
      user.id,
      async () => {
        const updated = await updateUser(user.id, { isActive })
        setData((current) => current.map((u) => (u.id === updated.id ? updated : u)))
      },
      `La cuenta de ${user.name} quedó ${isActive ? 'activa' : 'desactivada'}.`,
    )
  }

  async function confirmDeactivate() {
    const user = pendingDeactivate
    setPendingDeactivate(null)
    await setActive(user, false)
  }

  if (status === 'loading') return <ListSkeleton label="Cargando usuarios…" />
  if (status === 'error') {
    return <PageState isError title="No pudimos cargar los usuarios" text={error?.message} actionLabel="Reintentar" onAction={retry} />
  }

  const visible = filterUsers(users, { query, status: statusFilter })

  return (
    <section aria-label="Usuarios">
      <UsersFilters
        query={query}
        status={statusFilter}
        counts={countByStatus(users)}
        onQueryChange={setQuery}
        onStatusChange={setStatusFilter}
      />
      <Notice notice={notice} />

      {/* role="status": el lector de pantalla anuncia cuántos resultados quedan al filtrar. */}
      <p className="users-results" role="status">
        {visible.length === 1 ? '1 cuenta' : `${visible.length} cuentas`}
      </p>

      {visible.length === 0 ? (
        <PageState title="No hay cuentas que coincidan" text="Probá con otro nombre o email, o cambiá el filtro de estado." />
      ) : (
        <ul className="data-list">
          {visible.map((user) => {
            const isMe = user.id === currentUserId
            const disabled = isMe || busyId === user.id
            return (
              <li key={user.id} className="data-item">
                <div className="data-item-head">
                  <h3 className="data-item-title">
                    {user.name} {isMe && <span className="data-item-meta">(vos)</span>}
                  </h3>
                  <div className="badge-row">
                    <span className="badge">{ROLE_LABELS[user.role] ?? user.role}</span>
                    {!user.isActive && <span className="badge badge-muted">Desactivada</span>}
                  </div>
                </div>
                <p className="data-item-meta">
                  {user.email} · {user.botsCount === 1 ? '1 bot' : `${user.botsCount} bots`} · Alta: {formatDate(user.createdAt)}
                </p>
                <div className="data-item-actions">
                  <button
                    type="button"
                    className={user.isActive ? 'btn btn-secondary btn-small btn-danger' : 'btn btn-secondary btn-small'}
                    disabled={disabled}
                    onClick={() => (user.isActive ? setPendingDeactivate(user) : setActive(user, true))}
                  >
                    {user.isActive ? 'Desactivar cuenta' : 'Activar cuenta'}
                  </button>
                  {isMe && <span className="data-item-meta">No podés modificar tu propia cuenta.</span>}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(pendingDeactivate)}
        title={`¿Desactivar la cuenta de ${pendingDeactivate?.name}?`}
        confirmLabel="Desactivar cuenta"
        onConfirm={confirmDeactivate}
        onCancel={() => setPendingDeactivate(null)}
      >
        <p>
          No va a poder iniciar sesión y, si tiene la sesión abierta, se cierra en su próximo paso. Sus bots y datos no se
          borran: la podés volver a activar cuando quieras.
        </p>
      </ConfirmDialog>
    </section>
  )
}

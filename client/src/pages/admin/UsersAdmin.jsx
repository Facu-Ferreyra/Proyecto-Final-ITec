// Admin → Usuarios: ver todas las cuentas, cambiar el rol y activar/desactivar.
// La propia cuenta no se puede modificar (el backend responde 403 CANNOT_MODIFY_SELF);
// acá además se desactivan esos controles para que se entienda por qué.

import { listUsers, updateUser } from '../../api/admin.js'
import { formatDate } from '../../components/common/format.js'
import Notice from '../../components/common/Notice.jsx'
import { useApiData } from '../../components/common/useApiData.js'
import { useItemActions } from '../../components/common/useItemActions.js'
import PageState from '../bots/PageState.jsx'

const ROLE_LABELS = { USER: 'Usuario', ADMIN: 'Administrador' }

export default function UsersAdmin({ currentUserId }) {
  const { data: users, setData, status, error, retry } = useApiData(listUsers)
  const { busyId, notice, run } = useItemActions()

  function change(user, changes, successText) {
    return run(
      user.id,
      async () => {
        const updated = await updateUser(user.id, changes)
        setData((current) => current.map((u) => (u.id === updated.id ? updated : u)))
      },
      successText,
    )
  }

  if (status === 'loading') return <PageState title="Cargando usuarios…" />
  if (status === 'error') {
    return <PageState isError title="No pudimos cargar los usuarios" text={error?.message} actionLabel="Reintentar" onAction={retry} />
  }

  return (
    <section aria-label="Usuarios">
      <Notice notice={notice} />
      <ul className="data-list">
        {users.map((user) => {
          const isMe = user.id === currentUserId
          const disabled = isMe || busyId === user.id
          const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN'
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
                  className="btn btn-secondary btn-small"
                  disabled={disabled}
                  onClick={() => change(user, { role: newRole }, `${user.name} ahora es ${ROLE_LABELS[newRole].toLowerCase()}.`)}
                >
                  {user.role === 'ADMIN' ? 'Quitar admin' : 'Hacer admin'}
                </button>
                <button
                  type="button"
                  className={user.isActive ? 'btn btn-secondary btn-small btn-danger' : 'btn btn-secondary btn-small'}
                  disabled={disabled}
                  onClick={() =>
                    change(user, { isActive: !user.isActive }, `La cuenta de ${user.name} quedó ${user.isActive ? 'desactivada' : 'activa'}.`)
                  }
                >
                  {user.isActive ? 'Desactivar cuenta' : 'Activar cuenta'}
                </button>
                {isMe && <span className="data-item-meta">No podés modificar tu propia cuenta.</span>}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

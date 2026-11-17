// Admin → Plantillas: ver todas, activar/desactivar y eliminar las que no usa ningún bot.
// Una plantilla inactiva no aparece en el paso 1 del asistente.

import { deleteTemplate, listAdminTemplates, updateTemplate } from '../../api/admin.js'
import Notice from '../../components/common/Notice.jsx'
import { useApiData } from '../../components/common/useApiData.js'
import { useItemActions } from '../../components/common/useItemActions.js'
import PageState from '../bots/PageState.jsx'

export default function TemplatesAdmin() {
  const { data: templates, setData, status, error, retry } = useApiData(listAdminTemplates)
  const { busyId, notice, run } = useItemActions()

  const replace = (updated) => setData((current) => current.map((t) => (t.id === updated.id ? updated : t)))

  function toggle(template) {
    const isActive = !template.isActive
    return run(
      template.id,
      async () => replace(await updateTemplate(template.id, { isActive })),
      `"${template.name}" ${isActive ? 'está activa' : 'quedó desactivada'}.`,
    )
  }

  function remove(template) {
    if (!window.confirm(`¿Eliminar la plantilla "${template.name}"? No se puede deshacer.`)) return
    return run(
      template.id,
      async () => {
        await deleteTemplate(template.id)
        setData((current) => current.filter((t) => t.id !== template.id))
      },
      `Eliminaste "${template.name}".`,
    )
  }

  if (status === 'loading') return <PageState title="Cargando plantillas…" />
  if (status === 'error') {
    return <PageState isError title="No pudimos cargar las plantillas" text={error?.message} actionLabel="Reintentar" onAction={retry} />
  }
  if (templates.length === 0) return <PageState title="No hay plantillas" />

  return (
    <section aria-label="Plantillas">
      <Notice notice={notice} />
      <ul className="data-list">
        {templates.map((template) => {
          const busy = busyId === template.id
          return (
            <li key={template.id} className="data-item">
              <div className="data-item-head">
                <h3 className="data-item-title">{template.name}</h3>
                <span className={template.isActive ? 'badge' : 'badge badge-muted'}>{template.isActive ? 'Activa' : 'Inactiva'}</span>
              </div>
              <p className="data-item-meta">
                Clave: {template.key} · {template.botCount === 1 ? '1 bot la usa' : `${template.botCount} bots la usan`}
              </p>
              {template.description && <p className="admin-description">{template.description}</p>}
              <div className="data-item-actions">
                <button type="button" className="btn btn-secondary btn-small" disabled={busy} onClick={() => toggle(template)}>
                  {template.isActive ? 'Desactivar' : 'Activar'}
                </button>
                {template.botCount === 0 ? (
                  <button type="button" className="btn btn-secondary btn-small btn-danger" disabled={busy} onClick={() => remove(template)}>
                    Eliminar
                  </button>
                ) : (
                  <span className="data-item-meta">No se puede eliminar porque la usan bots.</span>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

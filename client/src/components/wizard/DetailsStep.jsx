// Paso 2: datos del negocio con vista previa al costado (prototipo, pantalla 6).

import ConfigForm from './ConfigForm.jsx'
import PreviewChat from './PreviewChat.jsx'

export default function DetailsStep({
  titleRef, botId, fields, config, errors, saving, hasUnsavedChanges, previewKey, onFieldChange, onSave, onBack, onNext,
}) {
  const hasErrors = Object.keys(errors).length > 0

  return (
    <div className="details-layout">
      <section className="card" aria-labelledby="details-step-title">
        <h2 id="details-step-title" className="step-title" ref={titleRef} tabIndex={-1}>
          Datos del negocio
        </h2>
        <p className="step-hint">
          Podés guardar con datos sin completar. Los obligatorios se piden recién al publicar.
        </p>

        {hasErrors && (
          <p className="notice notice-error" role="alert">
            Revisá los campos marcados en rojo.
          </p>
        )}

        <ConfigForm fields={fields} config={config} errors={errors} onFieldChange={onFieldChange} />

        {hasUnsavedChanges && (
          <p className="unsaved-changes" role="status">
            Tenés cambios sin guardar. La vista previa todavía muestra los datos anteriores.
          </p>
        )}

        <div className="step-actions">
          <button type="button" className="btn btn-secondary" disabled={saving} onClick={onBack}>
            Atrás
          </button>
          <button type="button" className="btn btn-secondary" disabled={saving} onClick={onSave}>
            {saving ? 'Guardando…' : 'Guardar y actualizar vista previa'}
          </button>
          <button type="button" className="btn btn-primary" disabled={saving} onClick={onNext}>
            Siguiente
          </button>
        </div>
      </section>

      <PreviewChat botId={botId} reloadKey={previewKey} />
    </div>
  )
}

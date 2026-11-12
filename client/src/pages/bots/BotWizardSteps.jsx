// Muestra el paso actual del asistente. Recibe los datos ya cargados.

import { useEffect, useRef } from 'react'
import DetailsStep from '../../components/wizard/DetailsStep.jsx'
import PublishedStep from '../../components/wizard/PublishedStep.jsx'
import ReviewStep from '../../components/wizard/ReviewStep.jsx'
import Stepper from '../../components/wizard/Stepper.jsx'
import TemplateStep from '../../components/wizard/TemplateStep.jsx'
import { useBotWizard } from './useBotWizard.js'

export default function BotWizardSteps({ initialBot, templates, onExit }) {
  const wizard = useBotWizard(initialBot, templates)
  const { step, bot, template, notice, busy } = wizard

  // Accesibilidad: al cambiar de paso, el foco va al título del paso nuevo.
  // Así, quien usa teclado o lector de pantalla se entera del cambio y sigue
  // desde ahí. No se hace al abrir el asistente, solo al cambiar de paso.
  const titleRef = useRef(null)
  const previousStep = useRef(step)
  useEffect(() => {
    if (previousStep.current === step) return
    previousStep.current = step
    titleRef.current?.focus()
  }, [step])

  return (
    <>
      <Stepper current={step} />

      {notice && (
        <p className="notice notice-error" role="alert">
          {notice}
        </p>
      )}

      {step === 1 && (
        <TemplateStep
          titleRef={titleRef}
          templates={templates}
          selectedId={wizard.templateId}
          locked={Boolean(bot)}
          busy={busy}
          onSelect={wizard.selectTemplate}
          onNext={wizard.createDraft}
        />
      )}

      {step === 2 && (
        <DetailsStep
          titleRef={titleRef}
          botId={bot.id}
          fields={template.config.fields}
          config={wizard.config}
          errors={wizard.errors}
          saving={busy}
          hasUnsavedChanges={wizard.hasUnsavedChanges}
          previewKey={wizard.previewKey}
          onFieldChange={wizard.changeField}
          onSave={wizard.save}
          onBack={() => wizard.goTo(1)}
          onNext={wizard.saveAndContinue}
        />
      )}

      {step === 3 && (
        <ReviewStep
          titleRef={titleRef}
          bot={bot}
          template={template}
          publishing={busy}
          onBack={() => wizard.goTo(2)}
          onPublish={wizard.publish}
        />
      )}

      {step === 4 && <PublishedStep titleRef={titleRef} bot={bot} onExit={() => onExit?.()} />}
    </>
  )
}

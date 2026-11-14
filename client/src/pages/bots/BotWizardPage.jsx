// Pantalla del asistente para crear o editar un bot.
// Sin botId: crea un bot nuevo (arranca en el paso 1).
// Con botId: edita ese bot (arranca en el paso 2).
// No incluye la barra superior ni las rutas (son de Nicole y Brandon): quien la
// monte en su ruta le pasa botId y onExit (volver a "Mis bots").

import BotWizardSteps from './BotWizardSteps.jsx'
import PageState from './PageState.jsx'
import { useWizardData } from './useWizardData.js'
import './theme.css'
import '../../components/wizard/wizard.css'

export default function BotWizardPage({ botId, onExit }) {
  const { templates, initialBot, status, error, retry } = useWizardData(botId)

  return (
    <main className="bots-area">
      <h1 className="visually-hidden">{botId ? 'Editar bot' : 'Crear bot'}</h1>

      {status === 'loading' && <PageState title="Cargando…" />}

      {status === 'error' && (
        <PageState isError title="No pudimos abrir el asistente" text={error} actionLabel="Reintentar" onAction={retry} />
      )}

      {status === 'ready' && <BotWizardSteps initialBot={initialBot} templates={templates} onExit={onExit} />}
    </main>
  )
}

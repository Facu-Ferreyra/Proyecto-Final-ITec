// Página provisoria (Brandon) para rutas cuya pantalla todavía no existe
// (chat público, panel y admin de Nicole) y para el 404.
// Cuando esté la pantalla real, se reemplaza en App.jsx.

import { useNavigate } from 'react-router-dom'
import PageState from '../../pages/bots/PageState.jsx'
import '../../pages/bots/theme.css'

export default function PlaceholderPage({ title, text, backTo = '/', backLabel = 'Volver al inicio' }) {
  const navigate = useNavigate()
  return (
    <main className="bots-area">
      <PageState title={title} text={text} actionLabel={backLabel} onAction={() => navigate(backTo)} />
    </main>
  )
}

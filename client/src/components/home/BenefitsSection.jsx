// "Panel": lo que el dueño ve después de publicar. Muestra el panel real en
// miniatura (pedidos y turnos de ejemplo, los mismos datos de prueba de la app),
// con lo nuevo marcado en azul, y al lado tres datos concretos.
//
// Movimiento: cuando la sección entra en pantalla, cada fila se escribe de
// izquierda a derecha, una después de otra, una sola vez (con "reducir
// movimiento", aparecen directo).

import useSeenOnce from './useSeenOnce.js'
import BotAvatar from '../common/BotAvatar.jsx'

const LEADS = [
  { name: 'Ana Pérez', detail: 'Corte de pelo · jue 19 nov, 3:00 PM', type: 'Turno', isNew: true },
  { name: 'Juan Gómez', detail: '2 viandas de pollo · envío', type: 'Pedido', isNew: true },
  { name: 'Carla Ruiz', detail: 'Color · sáb 21 nov, 10:30 AM', type: 'Turno', isNew: false },
  { name: 'Marta Díaz', detail: 'Consulta por precios', type: 'Contacto', isNew: false },
]

const POINTS = [
  { title: 'Cada pedido con sus datos', text: 'Ítems, total, retiro o envío y el teléfono del cliente.' },
  { title: 'Vos confirmás cada turno', text: 'Lo marcás pendiente, confirmado o cancelado con un toque.' },
  { title: 'Solo vos ves tus datos', text: 'Cada dueño ve únicamente sus bots, conversaciones y pedidos.' },
]

function MiniPanel({ seen }) {
  return (
    <div className="home-panel" aria-hidden="true" data-seen={seen}>
      <div className="home-panel-bar">
        <BotAvatar name="Peluquería Lola" size={30} />
        <strong>Peluquería Lola</strong>
        <span className="home-stamp">Panel de ejemplo</span>
        <span className="home-panel-tabs">
          <span>Conversaciones</span>
          <span className="is-active">Pedidos y turnos</span>
        </span>
      </div>
      <ul className="home-panel-list">
        {LEADS.map((lead, i) => (
          <li key={lead.name} style={{ '--i': i }} data-new={lead.isNew}>
            <span className="home-panel-type">{lead.type}</span>
            <span className="home-panel-text">
              <strong>{lead.name}</strong>
              <span>{lead.detail}</span>
            </span>
            <span className="home-panel-state">{lead.isNew ? 'Nuevo' : 'Visto'}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function BenefitsSection() {
  const [ref, seen] = useSeenOnce()

  return (
    <section id="panel" className="home-section home-panel-section" aria-labelledby="home-panel-title">
      <div className="home-container home-panel-grid" ref={ref}>
        <div className="home-section-head">
          <h2 id="home-panel-title" className="home-title eb-marker">
            Turnos y pedidos en un solo panel
          </h2>
          <p className="home-text">
            Lo que tus clientes dejan en el chat llega a tu panel. Lo nuevo aparece marcado para que no se te pase.
          </p>
          <ul className="home-points">
            {POINTS.map((point) => (
              <li key={point.title}>
                <h3 className="home-point-title">{point.title}</h3>
                <p className="home-point-text">{point.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <MiniPanel seen={seen} />
      </div>
    </section>
  )
}

// "Beneficios" en formato bento: tarjetas de distinto tamaño según su peso.
// Las tres grandes MUESTRAN el beneficio (un panel en miniatura, el dial de 24 h,
// el link real del sitio) en vez de solo contarlo; las tres chicas son texto.
//
// Movimiento: cuando la sección entra en pantalla, las filas del panel en
// miniatura aparecen en ola, una sola vez. Es el único momento animado de la
// sección (con "reducir movimiento", aparecen directo).

import { useEffect, useRef, useState } from 'react'
import BotAvatar from '../common/BotAvatar.jsx'
import { ClockIcon, CodeIcon, LinkIcon, LockIcon, PanelIcon, PhoneIcon } from './icons.jsx'

// Pedidos y turnos de ejemplo (los mismos datos de prueba de la app).
const LEADS = [
  { name: 'Ana Pérez', detail: 'Corte de pelo · jue 19 nov, 15:00', type: 'Turno', isNew: true },
  { name: 'Juan Gómez', detail: '2 viandas de pollo · envío', type: 'Pedido', isNew: true },
  { name: 'Carla Ruiz', detail: 'Color · sáb 21 nov, 10:30', type: 'Turno', isNew: false },
]

const SMALL = [
  {
    Icon: CodeIcon,
    title: 'Sin programar',
    text: 'Un asistente guiado te va pidiendo los datos. No necesitás conocimientos técnicos.',
  },
  {
    Icon: PhoneIcon,
    title: 'Tus clientes no instalan nada',
    text: 'Abren el link, eligen una opción y listo. No se registran ni descargan ninguna app.',
  },
  {
    Icon: LockIcon,
    title: 'Tus datos son solo tuyos',
    text: 'Cada dueño ve únicamente sus propios bots, conversaciones y pedidos.',
  },
]

// Avisa una vez cuando el elemento entra en pantalla.
function useSeenOnce(threshold = 0.3) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, seen]
}

function MiniPanel({ seen }) {
  return (
    <div className="bento-panel" aria-hidden="true" data-seen={seen}>
      <div className="bento-panel-bar">
        <BotAvatar name="Peluquería Lola" size={28} />
        <strong>Peluquería Lola</strong>
        <span className="bento-panel-tabs">
          <span>Conversaciones</span>
          <span className="is-active">Pedidos y turnos</span>
        </span>
      </div>
      <ul className="bento-panel-list">
        {LEADS.map((lead, i) => (
          <li key={lead.name} style={{ '--i': i }}>
            <span className="bento-lead-text">
              <strong>{lead.name}</strong>
              <span>{lead.detail}</span>
            </span>
            <span className={lead.isNew ? 'bento-badge bento-badge-new' : 'bento-badge'}>
              {lead.isNew ? 'Nuevo' : lead.type}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function BenefitsSection() {
  const [ref, seen] = useSeenOnce()
  // El link de ejemplo usa el dominio real donde está publicada la app.
  const host = typeof window !== 'undefined' ? window.location.host : 'easybot'

  return (
    <section id="beneficios" className="home-section home-section-white" aria-labelledby="home-benefits-title">
      <div className="home-container">
        <p className="home-eyebrow">Beneficios</p>
        <h2 id="home-benefits-title" className="home-title home-title-narrow">
          Menos mensajes repetidos, más tiempo para tu negocio
        </h2>

        <ul ref={ref} className="bento">
          <li className="bento-tile bento-tile-panel">
            <span className="home-icon-box">
              <PanelIcon />
            </span>
            <h3 className="home-card-title">Todo en un panel</h3>
            <p className="home-card-text">
              Las conversaciones, los contactos, los turnos y los pedidos que te dejaron, en un solo lugar.
            </p>
            <MiniPanel seen={seen} />
          </li>

          <li className="bento-tile bento-tile-dark">
            <span className="home-icon-box">
              <ClockIcon />
            </span>
            <h3 className="home-card-title">Respuestas a toda hora</h3>
            <p className="home-card-text">Tu bot contesta al instante, aunque estés ocupado o el local esté cerrado.</p>
          </li>

          <li className="bento-tile">
            <span className="home-icon-box">
              <LinkIcon />
            </span>
            <h3 className="home-card-title">Un link para compartir</h3>
            <p className="home-card-text">En tus redes, en un QR o en un mensaje.</p>
            <span className="bento-link" aria-hidden="true">
              {host}/chat/peluqueria-lola
            </span>
          </li>

          {SMALL.map(({ Icon, title, text }) => (
            <li key={title} className="bento-tile bento-tile-small">
              <span className="home-icon-box">
                <Icon />
              </span>
              <h3 className="home-card-title">{title}</h3>
              <p className="home-card-text">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// "Beneficios": seis tarjetas con ícono, título y texto.

import { ClockIcon, CodeIcon, LinkIcon, LockIcon, PanelIcon, PhoneIcon } from './icons.jsx'

const BENEFITS = [
  {
    Icon: CodeIcon,
    title: 'Sin programar',
    text: 'Un asistente guiado te va pidiendo los datos. No necesitás conocimientos técnicos.',
  },
  {
    Icon: ClockIcon,
    title: 'Respuestas a toda hora',
    text: 'Tu bot contesta al instante las preguntas de siempre, aunque estés ocupado o cerrado.',
  },
  {
    Icon: PhoneIcon,
    title: 'Tus clientes no instalan nada',
    text: 'Abren el link, eligen una opción y listo. No se registran ni descargan ninguna app.',
  },
  {
    Icon: PanelIcon,
    title: 'Todo en un panel',
    text: 'Mirá las conversaciones, los contactos, las solicitudes de turno y los pedidos que te dejaron.',
  },
  {
    Icon: LinkIcon,
    title: 'Un link para compartir',
    text: 'Compartilo en tus redes sociales o enviáselo a tus clientes en un mensaje.',
  },
  {
    Icon: LockIcon,
    title: 'Tus datos son solo tuyos',
    text: 'Cada dueño ve únicamente sus propios bots, conversaciones y pedidos, con su cuenta protegida.',
  },
]

export default function BenefitsSection() {
  return (
    <section id="beneficios" className="home-section home-section-white" aria-labelledby="home-benefits-title">
      <div className="home-container">
        <p className="home-eyebrow">Beneficios</p>
        <h2 id="home-benefits-title" className="home-title home-title-narrow">
          Menos mensajes repetidos, más tiempo para tu negocio
        </h2>
        <ul className="home-grid home-benefits">
          {BENEFITS.map(({ Icon, title, text }) => (
            <li key={title} className="home-card home-card-tinted">
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

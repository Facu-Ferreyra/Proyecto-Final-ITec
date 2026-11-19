// Skeletons de carga: siluetas con la forma del contenido que va a aparecer.
// Usan las mismas clases de layout que el contenido real (.bot-grid, .data-list,
// .details-layout), así nada "salta" cuando llegan los datos.
//
// Accesibilidad: el contenedor es role="status" con un texto oculto ("Cargando…");
// las siluetas son aria-hidden. Aparecen recién a los 150 ms (skeleton.css): si la
// carga es instantánea, no parpadean.

import './skeleton.css'

// Un bloque gris con brillo. w/h aceptan cualquier medida CSS.
export function Bone({ w = '100%', h = 14, r, className = '' }) {
  return <span className={`sk-bone ${className}`} style={{ width: w, height: h, borderRadius: r }} aria-hidden="true" />
}

function Wrap({ label, className = '', children }) {
  return (
    <div className={`sk ${className}`} role="status">
      <span className="visually-hidden">{label}</span>
      {children}
    </div>
  )
}

// "Mis bots": tarjetas con logo, nombre, estado, resumen y acciones.
export function BotCardsSkeleton({ count = 3, label = 'Cargando tus bots…' }) {
  return (
    <Wrap label={label}>
      <div className="bot-grid" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="bot-card sk-card">
            <div className="bot-card-header">
              <Bone w={44} h={44} r={12} />
              <div className="sk-stack" style={{ flex: 1 }}>
                <Bone w="70%" h={18} />
                <Bone w="45%" h={12} />
                <Bone w={84} h={22} r={999} />
              </div>
            </div>
            <Bone w="60%" h={12} />
            <div className="bot-card-actions">
              <Bone w={70} h={34} r={999} />
              <Bone w={96} h={34} r={999} />
            </div>
          </div>
        ))}
      </div>
    </Wrap>
  )
}

// Listas del panel y de admin: título, línea de datos, texto y un botón.
export function ListSkeleton({ count = 3, label = 'Cargando…' }) {
  return (
    <Wrap label={label}>
      <ul className="data-list" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className="data-item sk-stack">
            <div className="data-item-head">
              <Bone w="40%" h={18} />
              <Bone w={64} h={22} r={999} />
            </div>
            <Bone w="30%" h={12} />
            <Bone w={i % 2 ? '75%' : '90%'} h={14} />
            <Bone w={130} h={32} r={999} />
          </li>
        ))}
      </ul>
    </Wrap>
  )
}

// Asistente: los 4 pasos, el formulario y la vista previa.
export function WizardSkeleton({ label = 'Cargando el asistente…' }) {
  return (
    <Wrap label={label}>
      <div aria-hidden="true">
        <div className="sk-row sk-stepper">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="sk-row">
              <Bone w={40} h={40} r="50%" />
              <Bone w={80} h={14} className="sk-hide-mobile" />
            </span>
          ))}
        </div>
        <div className="details-layout">
          <div className="card sk-stack sk-gap-lg">
            <Bone w="45%" h={26} />
            <Bone w="80%" h={14} />
            {[0, 1, 2].map((i) => (
              <div key={i} className="sk-stack">
                <Bone w="35%" h={14} />
                <Bone h={44} r={8} />
              </div>
            ))}
          </div>
          <div className="card sk-stack">
            <Bone w="50%" h={20} />
            <Bone w="85%" h={40} r={14} />
            <div className="sk-row">
              <Bone w={84} h={34} r={999} />
              <Bone w={84} h={34} r={999} />
            </div>
          </div>
        </div>
      </div>
    </Wrap>
  )
}

// Chat: globos alternados del bot y del visitante.
export function ChatSkeleton({ label = 'Cargando el chat…' }) {
  return (
    <Wrap label={label} className="sk-chat">
      <Bone w="72%" h={44} r={14} className="sk-bubble-bot" />
      <Bone w="40%" h={36} r={14} className="sk-bubble-visitor" />
      <Bone w="60%" h={44} r={14} className="sk-bubble-bot" />
      <div className="sk-row">
        <Bone w={92} h={36} r={999} />
        <Bone w={92} h={36} r={999} />
        <Bone w={92} h={36} r={999} />
      </div>
    </Wrap>
  )
}

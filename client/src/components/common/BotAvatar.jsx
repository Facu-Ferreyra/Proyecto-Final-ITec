// Logo de un bot: sus iniciales sobre un color que sale del propio nombre.
// El mismo nombre da siempre el mismo color (no hace falta guardar nada en la base)
// y bots distintos se distinguen de un vistazo en "Mis bots".
//
// Iniciales: primera letra de las dos primeras palabras con contenido
// ("Peluquería Lola" → PL, "Viandas de Don Pepe" → VD; se saltean "de", "la"…).
// Con templateKey se agrega una insignia con el ícono de la plantilla.

import { TemplateGlyph } from '../../pages/bots/TemplateIcon.jsx'
import { avatarColor, initials } from './botAvatarUtils.js'
import './bot-avatar.css'

export default function BotAvatar({ name, templateKey, size = 44, className = '' }) {
  const text = initials(name)
  return (
    <span
      className={`bot-avatar ${className}`}
      style={{ '--avatar-size': `${size}px`, '--avatar-bg': avatarColor(name) }}
      aria-hidden="true"
      data-letters={text.length}
    >
      {text}
      {templateKey && (
        <span className="bot-avatar-badge">
          <TemplateGlyph templateKey={templateKey} />
        </span>
      )}
    </span>
  )
}

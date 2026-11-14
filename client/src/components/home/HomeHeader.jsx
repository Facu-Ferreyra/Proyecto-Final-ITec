// Barra superior: logo, links a las secciones de la página y botones de cuenta.

import { UserIcon } from './icons.jsx'

const LINKS = [
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#beneficios', label: 'Beneficios' },
  { href: '#plantillas', label: 'Plantillas' },
]

export default function HomeHeader({ onLogin, onRegister }) {
  return (
    <header className="home-header home-dark">
      <div className="home-container home-header-inner">
        <span className="home-logo">EasyBot</span>
        <nav className="home-nav" aria-label="Secciones de la página">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="home-header-actions">
          <button type="button" className="home-btn home-btn-outline home-btn-small" onClick={onLogin}>
            <UserIcon />
            Iniciar sesión
          </button>
          <button type="button" className="home-btn home-btn-light home-btn-small" onClick={onRegister}>
            Crear cuenta
          </button>
        </div>
      </div>
    </header>
  )
}

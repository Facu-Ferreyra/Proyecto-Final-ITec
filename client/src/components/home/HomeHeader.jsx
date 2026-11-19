// Barra superior: logo, links a las secciones de la página y botones de cuenta.

import MobileMenu from '../layout/MobileMenu.jsx'
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
        <span className="home-logo">
          <img src="/favicon.svg" alt="" width="28" height="28" className="brand-mark" />
          EasyBot
        </span>
        <nav className="home-nav" aria-label="Secciones de la página">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="home-header-actions">
          <button type="button" className="home-btn home-btn-outline home-btn-small home-header-login" onClick={onLogin}>
            <UserIcon />
            Iniciar sesión
          </button>
          <button type="button" className="home-btn home-btn-light home-btn-small" onClick={onRegister}>
            Crear cuenta
          </button>
          {/* Celular y tablet: las secciones (y en celular chico, "Iniciar sesión") van en el menú lateral. */}
          <MobileMenu title="EasyBot" buttonClassName="home-menu-toggle">
            <nav aria-label="Secciones de la página">
              <ul className="mobile-menu-links">
                {LINKS.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mobile-menu-footer">
              <button type="button" className="mobile-menu-btn" data-close-menu onClick={onLogin}>
                Iniciar sesión
              </button>
              <button type="button" className="mobile-menu-btn mobile-menu-btn-primary" data-close-menu onClick={onRegister}>
                Crear cuenta
              </button>
            </div>
          </MobileMenu>
        </div>
      </div>
    </header>
  )
}

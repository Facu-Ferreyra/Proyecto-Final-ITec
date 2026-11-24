// Barra superior: logo, links a las secciones de la página y botones de cuenta.
// La acción principal ("Crear mi bot") dice lo mismo acá, en la portada y al cierre.

import MobileMenu from '../layout/MobileMenu.jsx'

const LINKS = [
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#panel', label: 'Panel' },
  { href: '#plantillas', label: 'Plantillas' },
]

export default function HomeHeader({ onLogin, onRegister }) {
  return (
    <header className="home-header">
      <div className="home-container home-header-inner">
        <a className="home-logo" href="#top" aria-label="EasyBot, ir al inicio">
          <img src="/favicon.svg" alt="" width="30" height="30" className="brand-mark" />
          EasyBot
        </a>
        <nav className="home-nav" aria-label="Secciones de la página">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="home-header-actions">
          <button type="button" className="home-btn home-btn-ghost home-btn-small home-header-login" onClick={onLogin}>
            Iniciar sesión
          </button>
          <button type="button" className="home-btn home-btn-primary home-btn-small" onClick={onRegister}>
            Crear mi bot
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
                Crear mi bot
              </button>
            </div>
          </MobileMenu>
        </div>
      </div>
    </header>
  )
}

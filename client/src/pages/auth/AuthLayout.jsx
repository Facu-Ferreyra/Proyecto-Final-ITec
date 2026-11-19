// Marco común de las pantallas de login y registro (Brandon): barra con el logo,
// tarjeta blanca sobre fondo azul oscuro (mismo estilo que la home) y pie de página.
// El pie de página (SiteFooter) va afuera del <main>, para ocupar todo el ancho.

import { Link } from 'react-router-dom'
import SiteFooter from '../../components/common/SiteFooter.jsx'
import '../bots/theme.css'
import './auth.css'
import './auth-shell.css'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-shell">
      <main className="bots-area auth-page">
        <header className="auth-bar">
          <Link to="/" className="auth-brand">
            <img src="/favicon.svg" alt="" width="28" height="28" className="brand-mark" />
            EasyBot
          </Link>
          <Link to="/" className="auth-back">
            Volver al inicio
          </Link>
        </header>

        <section className="auth-card" aria-labelledby="auth-title">
          <h1 id="auth-title">{title}</h1>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          {children}
          {footer && <p className="auth-footer">{footer}</p>}
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

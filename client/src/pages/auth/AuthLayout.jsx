// Marco común de las pantallas de login y registro (Brandon): logo, tarjeta y pie.

import { Link } from 'react-router-dom'
import '../bots/theme.css'
import './auth.css'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className="bots-area auth-page">
      <Link to="/" className="auth-brand">
        EasyBot
      </Link>
      <section className="card auth-card" aria-labelledby="auth-title">
        <h1 id="auth-title">{title}</h1>
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        {children}
      </section>
      {footer && <p className="auth-footer">{footer}</p>}
    </main>
  )
}

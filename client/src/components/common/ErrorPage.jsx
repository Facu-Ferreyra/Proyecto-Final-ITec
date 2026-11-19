// Página de error reutilizable (404, 403…), con el estilo de devff.tech/404:
// barra arriba, número enorme en itálica, título grande y fino, y dos salidas.
// Buenas prácticas de páginas de error: dice qué pasó sin culpar a nadie, ofrece
// salidas claras y no redirige sola. noindex: que los buscadores no la guarden.
//
// withHeader: false cuando la página ya está dentro de la barra de la app (ej.: 403).

import { Link } from 'react-router-dom'
import { useAuth } from '../../context/useAuth.js'
import SiteFooter from './SiteFooter.jsx'
import './error-page.css'

export default function ErrorPage({ code, title, text, actions, withHeader = true }) {
  const { isAuthenticated } = useAuth()

  return (
    <div className={withHeader ? 'error-page' : 'error-page error-page-embedded'}>
      <title>{`${title.replace(/\.$/, '')} · EasyBot`}</title>
      <meta name="robots" content="noindex" />

      {withHeader && (
        <header className="error-page-bar">
          <Link to="/" className="error-page-brand">
            <img src="/favicon.svg" alt="" width="28" height="28" />
            EasyBot
          </Link>
          <Link to={isAuthenticated ? '/bots' : '/login'} className="error-page-bar-link">
            {isAuthenticated ? 'Mis bots' : 'Iniciar sesión'}
          </Link>
        </header>
      )}

      <main className="error-page-main" aria-labelledby="error-page-title">
        {/* El número es decorativo: el lector de pantalla lee directamente el título. */}
        <p className="error-page-code" aria-hidden="true">
          {code}
        </p>
        <h1 id="error-page-title" className="error-page-title">
          {title}
        </h1>
        <p className="error-page-text">{text}</p>
        <div className="error-page-actions">
          {actions.map((action, index) => (
            <Link key={action.to} to={action.to} className={index === 0 ? 'error-page-btn' : 'error-page-btn error-page-btn-ghost'}>
              {action.label}
            </Link>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

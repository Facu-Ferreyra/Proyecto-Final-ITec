// Cierre: un último cartel grande con la acción principal, y el pie de página.

import { Link } from 'react-router-dom'

export default function CtaFooter({ onLogin, onRegister }) {
  return (
    <>
      <section className="home-section home-close" aria-labelledby="home-close-title">
        <div className="home-container">
          <div className="home-close-sign eb-sign eb-sign--blue eb-tape">
            <h2 id="home-close-title" className="home-close-title eb-marker">
              Tu bot puede estar atendiendo hoy
            </h2>
            <p className="home-close-text">Registrate gratis, elegí una plantilla y publicá tu link en minutos.</p>
            <div className="home-actions">
              <button type="button" className="home-btn home-btn-primary" onClick={onRegister}>
                Crear mi bot
              </button>
              <button type="button" className="home-link home-link-button" onClick={onLogin}>
                Ya tengo cuenta
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-container home-footer-inner">
          <span className="home-footer-brand">
            <img src="/favicon.svg" alt="" width="24" height="24" />
            EasyBot
          </span>
          <p>Proyecto Integrador Final · Programación Web con IA aplicada · IntegrarTEC 2026</p>
          <Link to="/privacidad" className="home-footer-link">
            Política de privacidad
          </Link>
        </div>
      </footer>
    </>
  )
}

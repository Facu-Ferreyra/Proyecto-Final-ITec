// Llamado final a crear la cuenta y pie de página.

export default function CtaFooter({ onLogin, onRegister }) {
  return (
    <>
      <section className="home-cta home-dark" aria-labelledby="home-cta-title">
        <div className="home-container">
          <h2 id="home-cta-title" className="home-title home-title-narrow">
            Creá tu chatbot hoy y dejá de responder lo mismo
          </h2>
          <p className="home-hero-text">Registrate, elegí una plantilla y publicá tu link en minutos.</p>
          <div className="home-actions">
            <button type="button" className="home-btn home-btn-light" onClick={onRegister}>
              Crear mi cuenta
            </button>
            <button type="button" className="home-btn home-btn-outline" onClick={onLogin}>
              Iniciar sesión
            </button>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-container home-footer-inner">
          <span className="home-logo">EasyBot</span>
          <p>Proyecto Integrador Final · Programación Web con IA aplicada · IntegrarTEC 2026</p>
        </div>
      </footer>
    </>
  )
}

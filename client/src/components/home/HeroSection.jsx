// Portada: título principal, botones y un chat de ejemplo animado (ExampleChat).

import ExampleChat from './ExampleChat.jsx'

export default function HeroSection({ onRegister }) {
  return (
    <section className="home-hero home-dark" aria-labelledby="home-hero-title">
      <div className="home-container home-hero-inner">
        <div className="home-hero-copy">
          <p className="home-badge">Para microemprendimientos y pequeños comercios</p>
          <h1 id="home-hero-title" className="home-hero-title">
            Tu chatbot en minutos, sin programar
          </h1>
          <p className="home-hero-text">
            Elegí una plantilla, cargá los datos de tu negocio y publicá el link. Tus clientes consultan
            horarios, precios, turnos y pedidos sin esperar tu respuesta.
          </p>
          <div className="home-actions">
            <button type="button" className="home-btn home-btn-light" onClick={onRegister}>
              Crear mi bot
            </button>
            <a className="home-btn home-btn-outline" href="#como-funciona">
              Ver cómo funciona
            </a>
          </div>
          <p className="home-hero-note">Se usa desde la web. Tus clientes no se registran ni instalan nada.</p>
        </div>
        {/* Detrás del chat, el dial de 24 h (ilustración decorativa, en CSS):
            el negocio contesta a cualquier hora, aunque esté cerrado. */}
        <div className="home-hero-art">
          <ExampleChat />
        </div>
      </div>
    </section>
  )
}

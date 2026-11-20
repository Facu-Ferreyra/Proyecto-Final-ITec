// Portada: el título en un cartel de cartulina arena colgado de la vidriera
// (entra oscilando y se asienta), la acción principal (el único cartel azul tinta)
// y, al lado, el chat de ejemplo donde la respuesta del bot cae como un cartel más.
// Arriba de todo, el toldo a rayas del comercio: la portada es la vidriera del local.

import ExampleChat from './ExampleChat.jsx'

export default function HeroSection({ onRegister }) {
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      {/* El toldo del local: decorativo, se despliega una vez al cargar. */}
      <div className="home-awning" aria-hidden="true" />
      <div className="home-container home-hero-grid">
        <div className="home-hero-copy">
          <div className="home-hero-sign eb-sign eb-sign--sand eb-tape eb-hang" data-enter>
            <h1 id="home-hero-title" className="home-hero-title eb-marker">
              Chatbot para tu negocio, sin programar
            </h1>
            <ul className="home-facts" aria-label="En resumen">
              <li>4 pasos</li>
              <li>Gratis</li>
              <li>Tus clientes no instalan nada</li>
            </ul>
          </div>
          <p className="home-hero-text">
            Elegí una plantilla, cargá tus horarios, precios o catálogo y compartí el link. El bot les contesta a
            tus clientes y toma turnos y pedidos, aunque el local esté cerrado.
          </p>
          <div className="home-actions">
            <button type="button" className="home-btn home-btn-primary" onClick={onRegister}>
              Crear mi bot
            </button>
            <a className="home-link" href="#como-funciona">
              Ver los 4 pasos
            </a>
          </div>
        </div>
        <div className="home-hero-chat">
          <ExampleChat />
        </div>
      </div>
    </section>
  )
}

// Portada: título principal, botones y un chat de ejemplo (solo ilustrativo).

const EXAMPLE_OPTIONS = ['Horarios', 'Precios', 'Ubicación', 'Sacar un turno']

function ExampleChat() {
  return (
    <figure className="home-chat" aria-label="Ejemplo de conversación con el bot de Peluquería Lola">
      <div className="home-chat-header">
        <strong>Peluquería Lola</strong>
        <span>Respuestas automáticas</span>
      </div>
      <div className="home-chat-body">
        <p className="home-chat-bubble">¡Hola! Soy el asistente de Peluquería Lola. ¿En qué te puedo ayudar?</p>
        <ul className="home-chip-list" aria-label="Opciones del bot">
          {EXAMPLE_OPTIONS.map((option) => (
            <li key={option} className="home-chip">
              {option}
            </li>
          ))}
        </ul>
        <p className="home-chat-bubble home-chat-bubble-user">Horarios</p>
        <p className="home-chat-bubble">Atendemos de martes a sábado de 9 a 19 h.</p>
      </div>
    </figure>
  )
}

export default function HeroSection({ onRegister }) {
  return (
    <section className="home-hero home-dark" aria-labelledby="home-hero-title">
      <div className="home-container home-hero-inner">
        <div>
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
        <ExampleChat />
      </div>
    </section>
  )
}

// "El problema": las preguntas que el comercio responde a mano todos los días.
// Cada pregunta llega como el globo de chat del cliente (igual que en el chat
// real) y debajo cuelga el cartel con la respuesta que da el bot de ejemplo
// (Peluquería Lola, el mismo del chat de la portada).
//
// La vidriera no es una grilla pareja: el primer cartel manda (más grande) y los
// demás quedan a distintas alturas, como pegados a mano. Las respuestas van en
// arena o papel, nunca en azul: el azul es la voz del cliente.

const SIGNS = [
  { question: '¿Hasta qué hora atienden?', answer: 'Hasta las 7:00 PM', color: 'sand', lead: true },
  { question: '¿Cuánto sale el corte?', answer: '$9.500', color: 'paper' },
  { question: '¿Tienen turno el jueves?', answer: 'Jue 3:00 PM libre', color: 'sand' },
  { question: '¿Dónde quedan?', answer: 'Av. Colón, centro', color: 'sand' },
  { question: '¿Cómo se paga?', answer: 'Efectivo o transferencia', color: 'paper' },
]

export default function ProblemSection() {
  return (
    <section className="home-section home-problem" aria-labelledby="home-problem-title">
      <div className="home-container home-problem-grid">
        <div className="home-section-head">
          <h2 id="home-problem-title" className="home-title eb-marker">
            Las mismas preguntas, todos los días
          </h2>
          <p className="home-text">
            Horarios, precios, turnos y pedidos llegan a mano por redes y mensajes. Si tardás en contestar, el cliente
            se va con otro. Con EasyBot cargás cada respuesta una vez y el bot la repite las veces que haga falta.
          </p>
        </div>
        <ul className="home-window" aria-label="Preguntas de clientes y la respuesta del bot de ejemplo de Peluquería Lola">
          {SIGNS.map((sign) => (
            <li key={sign.question} className={sign.lead ? 'home-window-item home-window-lead' : 'home-window-item'}>
              <p className="home-window-question">{sign.question}</p>
              <p className={`home-window-answer eb-sign eb-tape eb-marker eb-sign--${sign.color}`}>{sign.answer}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

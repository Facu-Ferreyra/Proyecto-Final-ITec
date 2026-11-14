// "El problema": las preguntas que el comercio responde a mano todos los días.

const QUESTIONS = [
  '¿Hasta qué hora atienden?',
  '¿Cuánto sale el corte?',
  '¿Dónde quedan?',
  '¿Tienen turno el jueves?',
  '¿Hacen envíos?',
]

export default function ProblemSection() {
  return (
    <section className="home-section home-section-white" aria-labelledby="home-problem-title">
      <div className="home-container home-two-columns">
        <div>
          <p className="home-eyebrow">El problema</p>
          <h2 id="home-problem-title" className="home-title">
            Respondés lo mismo todos los días
          </h2>
          <p className="home-text">
            Horarios, precios, ubicación, turnos y pedidos, a mano por redes sociales o mensajes. Si no
            contestás a tiempo, el cliente se va con otro. Y las herramientas de chatbots que existen son
            complejas o caras para quien no sabe programar.
          </p>
        </div>
        <ul className="home-question-list" aria-label="Preguntas que llegan todos los días">
          {QUESTIONS.map((question) => (
            <li key={question} className="home-question">
              “{question}”
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

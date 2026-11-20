// "Cómo funciona": los 4 pasos del asistente, uno por fila de ancho completo.
// A la derecha de cada paso, un dato concreto de lo que pasa en ese paso.
//
// Movimiento (una vez, al entrar en pantalla): el número de cada paso gira hasta
// su valor como el contador de "su turno", y la línea de tinta debajo de cada
// fila se traza de izquierda a derecha, una fila después de la otra.

import useSeenOnce from './useSeenOnce.js'

const DIGITS = [0, 1, 2, 3, 4]

const STEPS = [
  {
    title: 'Elegí una plantilla',
    text: 'Preguntas frecuentes, turnos o pedidos. Cada una trae sus preguntas y respuestas armadas.',
    fact: '3 plantillas',
  },
  {
    title: 'Cargá los datos de tu negocio',
    text: 'Nombre, horarios, dirección, servicios o catálogo, en un formulario guiado.',
    fact: 'Horarios · precios · catálogo',
  },
  {
    title: 'Probá el bot en la vista previa',
    text: 'Mientras completás los datos, chateás con tu bot tal como lo van a ver tus clientes.',
    fact: 'Vista previa en vivo',
  },
  {
    title: 'Publicá y compartí el link',
    text: 'En tus redes, en un QR o en un mensaje. Desde ese momento el bot atiende.',
    fact: '/chat/tu-negocio',
  },
]

export default function StepsSection() {
  const [ref, seen] = useSeenOnce(0.25)
  return (
    <section id="como-funciona" className="home-section home-steps-section" aria-labelledby="home-steps-title">
      <div className="home-container">
        <div className="home-section-head">
          <h2 id="home-steps-title" className="home-title eb-marker">
            Tu bot en 4 pasos
          </h2>
          <p className="home-text">Un asistente te pide los datos de a uno. No hace falta saber de tecnología.</p>
        </div>
        <ol ref={ref} className="home-steps" data-seen={seen}>
          {STEPS.map((step, index) => (
            <li key={step.title} className="home-step" style={{ '--i': index }}>
              <span className="home-step-number eb-sign eb-sign--sand eb-marker" aria-hidden="true">
                <span className="home-roll" style={{ '--n': index + 1 }}>
                  {DIGITS.map((digit) => (
                    <span key={digit}>{digit}</span>
                  ))}
                </span>
              </span>
              <div className="home-step-body">
                <h3 className="home-step-title">{step.title}</h3>
                <p className="home-step-text">{step.text}</p>
              </div>
              <p className="home-step-fact">{step.fact}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

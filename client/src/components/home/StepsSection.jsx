// "Cómo funciona": los 4 pasos del asistente de creación de bots.

const STEPS = [
  {
    title: 'Elegí una plantilla',
    text: 'Preguntas frecuentes, turnos o pedidos. Ya traen sus preguntas y respuestas listas.',
  },
  {
    title: 'Cargá los datos de tu negocio',
    text: 'Nombre, horarios, dirección, servicios o catálogo. Un formulario simple, paso a paso.',
  },
  {
    title: 'Probalo en la vista previa',
    text: 'Chateá con tu bot antes de publicarlo y mirá cómo lo van a ver tus clientes.',
  },
  {
    title: 'Publicá y compartí el link',
    text: 'Compartilo en tus redes sociales o en un mensaje. Ya está atendiendo.',
  },
]

export default function StepsSection() {
  return (
    <section id="como-funciona" className="home-section" aria-labelledby="home-steps-title">
      <div className="home-container">
        <p className="home-eyebrow">Cómo funciona</p>
        <h2 id="home-steps-title" className="home-title">
          Cuatro pasos y tu bot ya atiende
        </h2>
        <ol className="home-grid home-steps">
          {STEPS.map((step, index) => (
            <li key={step.title} className="home-card">
              <span className="home-step-number" aria-hidden="true">
                {index + 1}
              </span>
              <h3 className="home-card-title">{step.title}</h3>
              <p className="home-card-text">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

// Barra de pasos numerada del asistente (prototipo, pantallas 5 a 8).

const STEPS = ['Plantilla', 'Datos del negocio', 'Revisar', 'Publicar']

export default function Stepper({ current }) {
  return (
    <ol className="stepper">
      {STEPS.map((label, index) => {
        const number = index + 1
        const state = number === current ? 'current' : number < current ? 'done' : 'pending'
        return (
          // aria-current="step" le indica al lector de pantalla cuál es el paso actual.
          <li key={label} className={`stepper-item stepper-${state}`} aria-current={state === 'current' ? 'step' : undefined}>
            <span className="stepper-number">{number}</span>
            <span className="stepper-label">{label}</span>
          </li>
        )
      })}
    </ol>
  )
}

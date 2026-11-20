// "Plantillas": un cartel por plantilla (arena, azul tinta, papel), con lo que ofrece
// el bot y lo que llega al panel. Debajo, los rubros para los que sirve.

import { BUSINESS_TYPES, TEMPLATES_INFO } from './templatesInfo.js'

const COLORS = ['sand', 'blue', 'paper']

function TemplateCard({ template, color }) {
  return (
    <li className={`home-template eb-sign eb-tape eb-sign--${color}`}>
      <h3 className="home-template-title eb-marker">{template.title}</h3>
      <p className="home-template-ideal">Para {template.idealFor}</p>
      <p className="home-template-text">{template.summary}</p>
      <ul className="home-template-options" aria-label={`Opciones del bot de ${template.title}`}>
        {template.options.map((option) => (
          <li key={option}>{option}</li>
        ))}
      </ul>
      <p className="home-template-panel">
        <strong>En tu panel:</strong> {template.panel}
      </p>
    </li>
  )
}

export default function TemplatesSection() {
  return (
    <section id="plantillas" className="home-section home-templates-section" aria-labelledby="home-templates-title">
      <div className="home-container">
        <div className="home-section-head">
          <h2 id="home-templates-title" className="home-title eb-marker">
            3 plantillas para empezar
          </h2>
          <p className="home-text">
            Los turnos y pedidos llegan a tu panel como solicitudes y vos los confirmás. EasyBot no cobra ni maneja
            calendarios.
          </p>
        </div>
        <ul className="home-templates">
          {TEMPLATES_INFO.map((template, i) => (
            <TemplateCard key={template.title} template={template} color={COLORS[i % COLORS.length]} />
          ))}
        </ul>
        <p className="home-business">
          <strong>Sirve para</strong> {BUSINESS_TYPES.join(' · ').toLowerCase()}.
        </p>
      </div>
    </section>
  )
}

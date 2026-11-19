// "Plantillas": una tarjeta por plantilla y los tipos de negocio para los que sirve.

import { BUSINESS_TYPES, TEMPLATES_INFO } from './templatesInfo.js'

function TemplateCard({ template }) {
  const className = template.featured ? 'home-card home-template home-template-featured' : 'home-card home-template'
  return (
    <li className={className}>
      <h3 className="home-card-title home-template-title">{template.title}</h3>
      <p className="home-card-text">{template.summary}</p>
      <p className="home-ideal">
        <strong>Ideal para:</strong> {template.idealFor}
      </p>
      <h4 className="home-label">Qué te pide el asistente</h4>
      <p className="home-card-text">{template.asks}</p>
      <h4 className="home-label">Qué ofrece tu bot</h4>
      <ul className="home-chip-list" aria-label={`Opciones del bot de ${template.title}`}>
        {template.options.map((option) => (
          <li key={option} className="home-chip">
            {option}
          </li>
        ))}
      </ul>
      {template.flow && <p className="home-card-text">{template.flow}</p>}
      <p className="home-template-panel">
        <strong>En tu panel:</strong> {template.panel}
      </p>
    </li>
  )
}

export default function TemplatesSection() {
  return (
    <>
      <section id="plantillas" className="home-section" aria-labelledby="home-templates-title">
        <div className="home-container">
          <p className="home-eyebrow">Plantillas</p>
          <h2 id="home-templates-title" className="home-title home-title-narrow">
            Una plantilla para cada tipo de negocio
          </h2>
          <ul className="home-grid home-templates">
            {TEMPLATES_INFO.map((template) => (
              <TemplateCard key={template.title} template={template} />
            ))}
          </ul>
          <p className="home-note">
            Los turnos y pedidos llegan como solicitudes a tu panel y vos los confirmás. No hay calendario ni
            pagos dentro de EasyBot.
          </p>
        </div>
      </section>

      <section className="home-section home-section-white" aria-labelledby="home-business-title">
        <div className="home-container">
          <h2 id="home-business-title" className="home-subtitle">
            Pensado para negocios como el tuyo
          </h2>
          <ul className="home-chip-list">
            {BUSINESS_TYPES.map((type) => (
              <li key={type} className="home-chip home-chip-soft">
                {type}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

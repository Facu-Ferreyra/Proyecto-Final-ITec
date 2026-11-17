// Etiqueta + campo + mensaje de error. Todos los tipos de campo lo usan, así
// los errores se muestran siempre igual y quedan conectados al campo.

export default function FieldWrapper({ id, label, required, error, children, asGroup = false }) {
  const errorId = `${id}-error`
  const Title = asGroup ? 'legend' : 'label'
  const Container = asGroup ? 'fieldset' : 'div'

  return (
    <Container className="field" aria-describedby={asGroup && error ? errorId : undefined}>
      <Title className="field-label" htmlFor={asGroup ? undefined : id}>
        {label}
        {required && <span className="field-required"> (obligatorio para publicar)</span>}
      </Title>
      {children(error ? errorId : undefined)}
      {error && (
        <p id={errorId} className="field-error">
          {error}
        </p>
      )}
    </Container>
  )
}

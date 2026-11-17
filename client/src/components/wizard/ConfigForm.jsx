// Formulario del paso 2: dibuja un campo por cada "field" de la plantilla,
// eligiendo el componente según el tipo.

import ItemsField from './fields/ItemsField.jsx'
import ListField from './fields/ListField.jsx'
import SimpleField from './fields/SimpleField.jsx'
import WeekdaysField from './fields/WeekdaysField.jsx'
import './fields/fields.css'

export default function ConfigForm({ fields, config, errors, onFieldChange }) {
  return (
    <div className="config-form">
      {fields.map((field) => {
        const props = {
          field,
          value: config[field.key],
          onChange: (value) => onFieldChange(field.key, value),
        }
        switch (field.type) {
          case 'weekdays':
            return <WeekdaysField key={field.key} {...props} error={errors[field.key]} />
          case 'list':
            return <ListField key={field.key} {...props} errors={errors} />
          case 'items':
            return <ItemsField key={field.key} {...props} errors={errors} />
          default:
            return <SimpleField key={field.key} {...props} error={errors[field.key]} />
        }
      })}
    </div>
  )
}

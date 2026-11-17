// Formulario del paso 2: dibuja un campo por cada "field" de la plantilla,
// eligiendo el componente según el tipo.

import HoursField from './fields/HoursField.jsx'
import ItemsField from './fields/ItemsField.jsx'
import ListField from './fields/ListField.jsx'
import PaymentMethodsField from './fields/PaymentMethodsField.jsx'
import PricesField from './fields/PricesField.jsx'
import SimpleField from './fields/SimpleField.jsx'
import TimeSlotsField from './fields/TimeSlotsField.jsx'
import WeekdaysField from './fields/WeekdaysField.jsx'
import './fields/fields.css'
import './fields/presets.css'

export default function ConfigForm({ fields, config, errors, onFieldChange }) {
  return (
    <div className="config-form">
      {fields.map((field) => {
        const props = {
          field,
          value: config[field.key],
          onChange: (value) => onFieldChange(field.key, value),
        }

        // Campos de las plantillas base con opciones predefinidas (se reconocen
        // por su key y su tipo). En cualquier otra plantilla se usa el campo común.
        if (field.key === 'hours' && field.type === 'text') {
          return <HoursField key={field.key} {...props} error={errors[field.key]} />
        }
        if (field.key === 'paymentMethods' && field.type === 'list') {
          return <PaymentMethodsField key={field.key} {...props} errors={errors} />
        }
        if (field.key === 'prices' && field.type === 'textarea') {
          return <PricesField key={field.key} {...props} error={errors[field.key]} />
        }
        if (field.key === 'timeSlots' && field.type === 'list') {
          return <TimeSlotsField key={field.key} {...props} error={errors[field.key]} />
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

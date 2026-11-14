// Estados posibles de cada tipo de lead. El estado se guarda en lead.data.status
// (el schema no tiene una columna para esto). El primero de cada lista es el inicial.
export const LEAD_STATUSES = {
  CONTACT: ['NEW', 'CONTACTED'],
  APPOINTMENT: ['PENDING', 'CONFIRMED', 'CANCELLED'],
  ORDER: ['NEW', 'IN_PROGRESS', 'DELIVERED', 'CANCELLED'],
};

export const initialStatus = (leadType) => LEAD_STATUSES[leadType][0];

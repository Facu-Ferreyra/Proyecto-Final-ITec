import { readFileSync } from 'node:fs';
import path from 'node:path';

// Punto de entrada del motor. El resto del backend importa desde acá.
export { startChat, handleMessage } from './conversation.js';
export { buildConfigSchema, getMissingFields } from './configSchema.js';
export { templateConfigSchema } from './templateSchema.js';
export { LEAD_STATUSES, initialStatus } from './leadStatuses.js';

const TEMPLATE_FILES = ['faq.json', 'turnos.json', 'pedidos.json'];
const templatesDir = path.join(import.meta.dirname, 'templates');

// Las tres plantillas base, tal como están en engine/templates/*.json.
// Cada una: { key, name, description, config }
export const baseTemplates = TEMPLATE_FILES.map((file) =>
  JSON.parse(readFileSync(path.join(templatesDir, file), 'utf8')),
);

/**
 * Carga (o actualiza) las plantillas base en la tabla templates.
 * La usa el seed: `await syncBaseTemplates(prisma)`.
 * Se puede correr varias veces: busca cada plantilla por su key.
 */
export async function syncBaseTemplates(prisma) {
  for (const { key, name, description, config } of baseTemplates) {
    await prisma.template.upsert({
      where: { key },
      create: { key, name, description, config },
      update: { name, description, config },
    });
  }
}

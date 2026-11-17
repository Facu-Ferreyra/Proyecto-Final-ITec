import { z } from 'zod';

// Mensajes de validación de Zod en español, para que el frontend los pueda mostrar.
z.config(z.locales.es());

export { z };

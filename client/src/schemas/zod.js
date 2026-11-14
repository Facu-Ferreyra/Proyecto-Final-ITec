// Zod configurado en español, igual que en el backend (server/src/utils/zod.js).
// Así, si algún mensaje no está personalizado, igual sale en español.
// Los esquemas del front importan "z" desde acá y no directo de 'zod'.

import { z } from 'zod'

z.config(z.locales.es())

export { z }

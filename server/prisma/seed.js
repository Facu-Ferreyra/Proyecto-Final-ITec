// Datos iniciales de la base: las 3 plantillas base y un usuario de prueba por rol.
// Uso: `npm run seed` (después de aplicar las migraciones).
// Se puede correr varias veces: busca cada plantilla por su key y cada usuario
// por su email, y los actualiza en lugar de duplicarlos.
//
// Las contraseñas NO están en el código (no se suben al repositorio): salen de
// las variables de entorno SEED_ADMIN_PASSWORD y SEED_USER_PASSWORD.

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/db/prisma.js';
import { syncBaseTemplates } from '../src/engine/index.js';

// Mismo costo que auth.service.js, para que el login compare igual.
const BCRYPT_ROUNDS = 10;

const TEST_USERS = [
  { email: 'admin@easybot.com', name: 'Admin EasyBot', role: 'ADMIN', passwordEnv: 'SEED_ADMIN_PASSWORD' },
  { email: 'usuario@easybot.com', name: 'Usuario de prueba', role: 'USER', passwordEnv: 'SEED_USER_PASSWORD' },
];

// Misma política que el registro (auth.schemas.js): 8 a 72 bytes, con al menos
// una letra y un número.
function isValidPassword(value) {
  return value.length >= 8 && Buffer.byteLength(value, 'utf8') <= 72 && /\p{L}/u.test(value) && /\d/.test(value);
}

function readPasswords() {
  const missing = TEST_USERS.filter((user) => !process.env[user.passwordEnv]).map((user) => user.passwordEnv);
  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno: ${missing.join(', ')}`);
  }
  const invalid = TEST_USERS.filter((user) => !isValidPassword(process.env[user.passwordEnv])).map((user) => user.passwordEnv);
  if (invalid.length > 0) {
    throw new Error(`${invalid.join(', ')}: mínimo 8 caracteres, con al menos una letra y un número`);
  }
}

async function seedUsers() {
  for (const user of TEST_USERS) {
    const passwordHash = await bcrypt.hash(process.env[user.passwordEnv], BCRYPT_ROUNDS);
    await prisma.user.upsert({
      where: { email: user.email },
      create: { email: user.email, name: user.name, role: user.role, passwordHash },
      // Si ya existía, se deja como al principio: con su rol, activo y con la contraseña del .env.
      update: { name: user.name, role: user.role, passwordHash, isActive: true },
      select: { id: true },
    });
    console.log(`Usuario de prueba listo: ${user.email} (${user.role})`);
  }
}

async function main() {
  readPasswords(); // antes de tocar la base: si falta algo, no se carga nada
  await syncBaseTemplates(prisma);
  console.log('Plantillas base cargadas: faq, turnos y pedidos');
  await seedUsers();
}

main()
  .catch((error) => {
    console.error('No se pudo completar el seed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

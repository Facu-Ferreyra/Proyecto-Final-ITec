import { randomBytes } from 'node:crypto';

// El slug identifica al bot en el link público: /chat/peluqueria-lola-k3m9xa
// - La primera parte sale del nombre, para que el link sea legible.
// - El sufijo es aleatorio (crypto), así el link no se puede adivinar y es
//   distinto del id interno de la base.
// - Se genera una sola vez, al crear el bot: si el dueño cambia el nombre,
//   el link que ya compartió sigue funcionando.

// 32 caracteres sin los que se confunden (0/o, 1/l): 32^6 ≈ 1.000 millones de combinaciones.
const ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789';
const SUFFIX_LENGTH = 6;

export function slugify(name) {
  const base = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // saca tildes
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .replace(/-+$/, '');
  return base || 'bot';
}

export function randomSuffix(length = SUFFIX_LENGTH) {
  // 256 es múltiplo de 32, así que byte % 32 no favorece a ningún carácter.
  return [...randomBytes(length)].map((byte) => ALPHABET[byte % ALPHABET.length]).join('');
}

export const generateSlug = (name) => `${slugify(name)}-${randomSuffix()}`;

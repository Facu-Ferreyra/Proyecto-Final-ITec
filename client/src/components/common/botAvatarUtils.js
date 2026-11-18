// Iniciales y color del logo de un bot (los usa BotAvatar.jsx).
// Separado del componente para que la recarga en caliente de Vite funcione.

// Colores con contraste ≥ 4.5:1 contra texto blanco, en la familia de la marca.
// Sin naranja: ese color está reservado para "publicado".
const PALETTE = ['#1D4ED8', '#0B1F4B', '#0F766E', '#7C3AED', '#BE123C', '#4338CA', '#166534', '#1E40AF']

// Palabras que no aportan inicial ("Viandas de Don Pepe" → VD, no VDD).
const SKIP = new Set(['de', 'del', 'la', 'las', 'el', 'los', 'y', 'e', 'en', 'the', 'a'])

const firstChar = (word) => word.match(/[\p{L}\p{N}]/u)?.[0]

// "Peluquería Lola" → "PL"; "Kiosco" → "K"; vacío → "?".
export function initials(name = '') {
  const letters = name
    .split(/\s+/)
    .filter((word) => firstChar(word) && !SKIP.has(word.toLowerCase()))
    .slice(0, 2)
    .map(firstChar)
  return letters.join('').toUpperCase() || '?'
}

// Mismo nombre → mismo color, siempre (hash simple del texto).
export function avatarColor(name = '') {
  let hash = 0
  for (const char of name.trim().toLowerCase()) hash = (hash * 31 + char.codePointAt(0)) >>> 0
  return PALETTE[hash % PALETTE.length]
}

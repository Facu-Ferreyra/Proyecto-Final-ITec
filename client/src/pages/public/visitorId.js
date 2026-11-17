// Id anónimo del visitante del chat público. Se genera una sola vez y se guarda
// en el navegador: así el dueño ve en su panel las conversaciones de la misma
// persona. No identifica a nadie (no es un dato personal).
//
// localStorage puede fallar (modo privado, almacenamiento bloqueado): en ese caso
// no se manda y el backend crea uno nuevo.

const KEY = 'easybot:visitorId'

export function getVisitorId() {
  try {
    let id = localStorage.getItem(KEY)
    if (!id && globalThis.crypto?.randomUUID) {
      id = crypto.randomUUID()
      localStorage.setItem(KEY, id)
    }
    return id ?? undefined
  } catch {
    return undefined
  }
}

// Guarda el id que devolvió el backend (por si lo creó él).
export function saveVisitorId(id) {
  try {
    if (id) localStorage.setItem(KEY, id)
  } catch {
    // Sin almacenamiento: el chat funciona igual, solo no se recuerda al visitante.
  }
}

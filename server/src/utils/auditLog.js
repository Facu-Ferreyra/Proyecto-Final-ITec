// Registro de las acciones de los administradores (guía de OWASP Logging: anotar
// "cuándo, quién, qué y sobre qué" de cada acción de un admin).
//
// Escribe una línea JSON por acción en la salida del servidor (en Render: pestaña
// "Logs"). Solo IDs y qué cambió: nunca emails, nombres, contraseñas ni tokens.
// Se llama DESPUÉS de que la acción salió bien.
//
//   {"type":"admin_action","at":"2026-11-18T15:00:00.000Z","adminId":"cm…",
//    "action":"user.update","targetType":"user","targetId":"cm…","details":{"isActive":false}}

export function logAdminAction({ adminId, action, targetType, targetId, details }) {
  console.info(
    JSON.stringify({ type: 'admin_action', at: new Date().toISOString(), adminId, action, targetType, targetId, details }),
  );
}

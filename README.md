# EasyBot

Plataforma para que pequeños negocios creen, sin programar, un chatbot con respuestas predefinidas (preguntas frecuentes, turnos o pedidos) y lo compartan con sus clientes mediante un link público.

## Demo

- App: _pendiente_ (frontend y API en el mismo servicio de Render)
- Video: _pendiente_

> El plan gratuito de Render "duerme" el servicio tras un rato sin uso: el primer pedido puede tardar unos segundos.

## Usuarios de prueba

| Rol     | Email | Contraseña |
|---------|-------|------------|
| admin   | _pendiente_ | _pendiente_ |
| usuario | _pendiente_ | _pendiente_ |

## Funcionalidades

- **Cuentas y roles:** registro, inicio y cierre de sesión. Dos roles: usuario (dueño de un negocio) y administrador.
- **Mis bots:** lista de bots del usuario con estado (borrador o publicado), editar, eliminar, publicar y despublicar.
- **Asistente de creación en 4 pasos:** elegir plantilla, cargar los datos del negocio con vista previa del chat, revisar y publicar. Valida los datos antes de guardar.
- **Plantillas:** preguntas frecuentes, turnos y toma de pedidos.
- **Chat público:** cada bot publicado tiene un link (`/chat/:slug`) que los clientes usan sin registrarse.
- **Panel del dueño:** conversaciones con sus mensajes, y contactos, turnos o pedidos con cambio de estado (pendiente, confirmado, entregado, etc.).
- **Administración (solo admin):** activar, desactivar o eliminar plantillas, y cambiar el rol o desactivar cuentas de usuarios.

## Stack

React + Vite · Node + Express · PostgreSQL (Neon) + Prisma · JWT en cookie httpOnly · Render

Detalle y justificación en [docs/justificacion.md](docs/justificacion.md).

## Arquitectura

Monorepo con `client/` (frontend) y `server/` (backend). En producción, Express sirve el frontend compilado (`client/dist`), así que todo vive en un solo servicio. Ver [docs/arquitectura.md](docs/arquitectura.md).

## Cómo correrlo en local

Requisitos: Node 22 o superior.

1. `git clone https://github.com/Facu-Ferreyra/Proyecto-Final-ITec.git`
2. `cp .env.example server/.env` y completar las variables
3. `npm install`
4. `npm run db:migrate` (crea las tablas)
5. `npm run seed` (carga plantillas y usuarios de prueba)
6. `npm run dev` (frontend en http://localhost:5173, API en http://localhost:3000)

## Equipo

- Facundo Ferreyra: base de datos, deploy y entorno
- Ayelen Ortega: frontend: asistente de creación, vista previa, Mis bots, home, chat público, panel y administración
- Brandon Velazquez: autenticación, roles y seguridad
- Santiago Silva: API de bots y motor de conversación

## Uso de IA

Ver [docs/uso-de-ia.md](docs/uso-de-ia.md).

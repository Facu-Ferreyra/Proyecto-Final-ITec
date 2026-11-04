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

- _pendiente_

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
- Ayelen Ortega: frontend, asistente y vista previa
- Brandon Velazquez: autenticación, roles y seguridad
- Santiago Silva: API de bots y motor de conversación
- Nicole Rodriguez: frontend, chat público y panel

## Uso de IA

Ver [docs/uso-de-ia.md](docs/uso-de-ia.md).

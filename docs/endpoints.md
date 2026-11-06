# Endpoints de la API

Responsable: Santiago Silva (bots, plantillas, panel, chat público y motor). Los endpoints de auth y usuarios los documenta Brandon.

Todas las rutas empiezan con `/api` y reciben y devuelven JSON. Las fechas van en ISO 8601 (UTC).

## Convenciones

### Sesión

Los endpoints privados usan la cookie de sesión (httpOnly) que crea el login. El frontend la manda sola si hace los pedidos con `credentials: 'include'`. Dentro del backend, `requireAuth` deja `req.user = { id, role }`.

| Situación | Respuesta |
|---|---|
| Sin sesión o sesión vencida | `401 UNAUTHORIZED` |
| Rol equivocado (usuario en ruta de admin) | `403 FORBIDDEN` |
| ID de un bot, conversación o lead de otro usuario | `404` (igual que si no existiera, para no revelar qué IDs existen) |

### Formato de errores

Todos los errores tienen la misma forma:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Hay datos inválidos en el pedido",
    "details": [{ "path": "config.catalog.0.price", "message": "Entrada inválida: se esperaba número, recibido texto" }]
  }
}
```

- `code`: constante para que el frontend decida qué hacer.
- `message`: texto en español que se puede mostrar al usuario.
- `details`: solo en algunos errores. En `VALIDATION_ERROR` es la lista de campos con problemas (`path` usa puntos: `config.services.0.name`). En `BOT_INCOMPLETE` es la lista de campos obligatorios que faltan (`[{ key, label }]`).

Nunca se devuelven datos internos (stack, SQL, mensajes de Prisma).

| Código | HTTP | Cuándo |
|---|---|---|
| `VALIDATION_ERROR` | 400 | El body, la URL o la query no cumplen el esquema Zod |
| `INVALID_JSON` | 400 | El body no es JSON válido |
| `TEMPLATE_NOT_FOUND` | 400 / 404 | Plantilla inexistente o desactivada |
| `INVALID_STATUS` | 400 | Estado de lead que no corresponde a su tipo |
| `UNAUTHORIZED` | 401 | Sin sesión |
| `FORBIDDEN` | 403 | Rol equivocado |
| `BOT_NOT_FOUND`, `CONVERSATION_NOT_FOUND`, `LEAD_NOT_FOUND`, `NOT_FOUND` | 404 | No existe o es de otro usuario |
| `TEMPLATE_KEY_TAKEN`, `TEMPLATE_IN_USE` | 409 | Conflicto en plantillas |
| `PAYLOAD_TOO_LARGE` | 413 | Body de más de 100 kb |
| `BOT_INCOMPLETE` | 422 | Publicar (o dejar publicado) un bot sin los campos obligatorios |
| `INTERNAL_ERROR` | 500 | Error inesperado |

### Listas

Las listas devuelven `{ "items": [...] }`. Las paginadas agregan `page`, `limit`, `total` y `totalPages` y aceptan `?page=1&limit=20` (máximo 100).

---

## Plantillas

### `GET /api/templates` — usuario y admin

Plantillas activas, para el paso 1 del asistente.

```json
{
  "items": [
    {
      "id": "cm…",
      "key": "turnos",
      "name": "Turnos simples",
      "description": "Guía al visitante para pedir servicio, día, horario y contacto.",
      "config": { "idealFor": "…", "fields": [ … ], "messages": { … }, "menu": [ … ], "flows": { … } }
    }
  ]
}
```

`config.fields` es lo que el asistente tiene que pedir en el paso 2 (ver [Estructura de una plantilla](#estructura-de-una-plantilla)).

### `GET /api/templates/:id` — usuario y admin

Una plantilla activa. Misma forma que cada ítem de la lista.

### Admin: `GET /api/admin/templates` · `POST` · `PUT /:id` · `DELETE /:id` — solo admin

- `GET` lista todas (también las inactivas), con `isActive` y `botCount`.
- `POST` crea: `{ "key": "mi-plantilla", "name": "…", "description": "…", "isActive": true, "config": { … } }` → `201`. La `config` se valida completa (ver [Estructura de una plantilla](#estructura-de-una-plantilla)); si referencia un flujo o campo que no existe responde `400`.
- `PUT /:id` modifica `name`, `description`, `isActive` o `config` (la `key` no se puede cambiar).
- `DELETE /:id` → `204`. Si hay bots usando la plantilla responde `409 TEMPLATE_IN_USE`: en ese caso conviene desactivarla con `PUT { "isActive": false }`.

---

## Bots (solo el dueño, sobre sus bots)

### Forma de un bot

```json
{
  "id": "cm…",
  "name": "Peluquería Lola",
  "slug": "peluqueria-lola-k3m9xa",
  "status": "DRAFT",
  "publishedAt": null,
  "publicPath": "/chat/peluqueria-lola-k3m9xa",
  "template": { "id": "cm…", "key": "turnos", "name": "Turnos simples" },
  "config": { "businessName": "Peluquería Lola", "hours": "Martes a sábado, 9 a 19 h" },
  "missingFields": [{ "key": "services", "label": "Servicios" }],
  "canPublish": false,
  "stats": { "conversations": 0, "leads": 0 },
  "createdAt": "2026-11-06T15:00:00.000Z",
  "updatedAt": "2026-11-06T15:00:00.000Z"
}
```

- `status`: `DRAFT` o `PUBLISHED`.
- `publicPath`: ruta del frontend para el chat público. El link completo es el dominio + `publicPath`.
- `missingFields` / `canPublish`: sirven para el paso "Revisar" del asistente ("Sin cargar").

### `GET /api/bots`

`{ "items": [bot, …] }`, ordenados por última modificación.

### `POST /api/bots`

```json
{ "templateId": "cm…", "name": "Peluquería Lola", "config": { "businessName": "Peluquería Lola" } }
```

→ `201` con el bot. Se puede crear como borrador con datos incompletos: los campos obligatorios se exigen recién al publicar. `name` tiene de 2 a 60 caracteres. Los campos de `config` que la plantilla no conoce se descartan; los que no cumplen su tipo dan `400` con `path: "config.…"`.

### `GET /api/bots/:id`

El bot.

### `PUT /api/bots/:id`

`{ "name": "…" }`, `{ "config": { … } }` o ambos. `config` **reemplaza** la anterior completa (mandar todos los datos del formulario). Si el bot está publicado y le faltaría un campo obligatorio → `422 BOT_INCOMPLETE`.

### `DELETE /api/bots/:id`

`204`. Borra también sus conversaciones, mensajes y leads.

### `POST /api/bots/:id/publish` · `POST /api/bots/:id/unpublish`

Publicar devuelve el bot con `status: "PUBLISHED"`, o `422 BOT_INCOMPLETE` con `details` = campos que faltan. Despublicar lo vuelve a `DRAFT` (el link deja de funcionar, pero conserva el mismo slug).

### Vista previa: `GET /api/bots/:id/preview` · `POST /api/bots/:id/preview/messages`

Funcionan igual que el chat público (misma forma de pedido y respuesta), pero también con borradores y **sin guardar nada**. En vez de `lead`, la respuesta trae `leadPreview` con lo que se guardaría.

---

## Panel (solo el dueño, sobre sus bots)

### `GET /api/bots/:id/conversations?page=1&limit=20`

```json
{
  "items": [
    {
      "id": "cm…",
      "visitorId": "4f1c…",
      "contactName": "Ana Pérez",
      "leadTypes": ["APPOINTMENT"],
      "messageCount": 14,
      "lastMessage": { "sender": "BOT", "content": "¡Listo, Ana Pérez! …", "createdAt": "…" },
      "createdAt": "…",
      "updatedAt": "…"
    }
  ],
  "page": 1, "limit": 20, "total": 1, "totalPages": 1
}
```

`contactName` es `null` si el visitante no dejó sus datos (mostrar "Visitante"). Ordenadas por actividad más reciente.

### `GET /api/conversations/:id/messages`

```json
{
  "conversation": { "id": "cm…", "bot": { "id": "cm…", "name": "Peluquería Lola" }, "visitorId": "…", "createdAt": "…", "updatedAt": "…", "leads": [lead, …] },
  "items": [
    { "id": "cm…", "sender": "BOT", "content": "¡Hola! Soy el asistente de Peluquería Lola. ¿En qué te puedo ayudar?", "createdAt": "…" },
    { "id": "cm…", "sender": "VISITOR", "content": "Sacar un turno", "createdAt": "…" },
    { "id": "cm…", "sender": "BOT", "content": "¿Qué servicio querés?", "createdAt": "…" }
  ]
}
```

Mensajes en orden cronológico. `sender`: `BOT` o `VISITOR`. El contenido puede tener saltos de línea (`\n`): mostrarlo con `white-space: pre-line`.

### `GET /api/bots/:id/leads?type=APPOINTMENT&status=PENDING&page=1&limit=20`

Contactos, turnos y pedidos. `type` y `status` son opcionales.

```json
{
  "items": [
    {
      "id": "cm…",
      "botId": "cm…",
      "conversationId": "cm…",
      "type": "APPOINTMENT",
      "status": "PENDING",
      "contactName": "Ana Pérez",
      "contactPhone": "11 5555 0101",
      "data": { "service": "Corte de pelo", "date": "Jue 12 nov", "dateValue": "2026-11-12", "time": "15:00" },
      "createdAt": "…"
    }
  ],
  "page": 1, "limit": 20, "total": 1, "totalPages": 1
}
```

### `PATCH /api/leads/:id`

`{ "status": "CONFIRMED" }` → el lead actualizado. Estados válidos según el tipo (el primero es el inicial):

| Tipo | Estados |
|---|---|
| `CONTACT` | `NEW`, `CONTACTED` |
| `APPOINTMENT` | `PENDING`, `CONFIRMED`, `CANCELLED` |
| `ORDER` | `NEW`, `IN_PROGRESS`, `DELIVERED`, `CANCELLED` |

### Qué guarda cada tipo de lead

`contactName` y `contactPhone` van en columnas propias. El resto va en `data`:

| Tipo | Plantilla | `data` |
|---|---|---|
| `CONTACT` | Preguntas frecuentes | `{ message }` |
| `APPOINTMENT` | Turnos | `{ service, date, dateValue, time }` — `date` es el texto que vio el visitante ("Jue 12 nov") y `dateValue` la fecha ISO ("2026-11-12") |
| `ORDER` | Pedidos | `{ items: [{ name, quantity, unitPrice, subtotal }], total, delivery, deliveryValue, deliveryAddress?, notes? }` |

Regla general: cada paso de un flujo guarda en `data[clave del paso]` el texto que eligió o escribió el visitante. Si la opción tenía un valor interno distinto (fechas, tipo de entrega), se guarda además en `data[clave]Value`. Los precios y el total se calculan en el backend con los precios del bot, nunca con lo que manda el navegador.

---

## Chat público (sin login, solo bots publicados)

### `GET /api/public/bots/:slug`

```json
{
  "slug": "peluqueria-lola-k3m9xa",
  "title": "Peluquería Lola",
  "templateKey": "turnos",
  "replies": ["¡Hola! Soy el asistente de Peluquería Lola. ¿En qué te puedo ayudar?"],
  "options": [
    { "id": "hours", "label": "Horarios" },
    { "id": "prices", "label": "Precios" },
    { "id": "book", "label": "Sacar un turno" }
  ]
}
```

`404 BOT_NOT_FOUND` si no existe o no está publicado. No expone el id interno ni datos del dueño.

### `POST /api/public/bots/:slug/messages`

Pedido:

```json
{
  "visitorId": "4f1c2a9e-…",
  "conversationId": "cm…",
  "optionId": "book",
  "text": "Ana Pérez",
  "state": { "flow": "appointment", "step": 3, "answers": { … } }
}
```

| Campo | Obligatorio | Descripción |
|---|---|---|
| `optionId` o `text` | uno de los dos | `optionId` = id del botón que tocó. `text` = lo que escribió (máx. 500 caracteres). |
| `visitorId` | no | Id anónimo del visitante (8 a 64 caracteres: letras, números, `-` y `_`). El frontend lo genera una vez con `crypto.randomUUID()` y lo guarda en `localStorage`. Si no se manda, el backend crea uno y lo devuelve. |
| `conversationId` | no | El que devolvió la respuesta anterior. Si no se manda (o no coincide con el bot y el visitante), empieza una conversación nueva. |
| `state` | no | El `state` que devolvió la respuesta anterior, **tal cual**. `null` o ausente = está en el menú. |

Respuesta:

```json
{
  "visitorId": "4f1c2a9e-…",
  "conversationId": "cm…",
  "replies": ["¿Qué día te queda bien?"],
  "options": [
    { "id": "2026-11-12", "label": "Jue 12 nov" },
    { "id": "2026-11-13", "label": "Vie 13 nov" },
    { "id": "cancel", "label": "Cancelar" }
  ],
  "input": null,
  "state": { "flow": "appointment", "step": 1, "answers": { "service": { "value": "Corte de pelo", "label": "Corte de pelo" } } },
  "lead": null
}
```

| Campo | Qué hacer en el frontend |
|---|---|
| `replies` | Una burbuja del bot por cada texto (en orden). |
| `options` | Botones. Al tocar uno, mandar `optionId` = su `id` y mostrar su `label` como burbuja del visitante. |
| `input` | Si no es `null`, el bot espera texto libre: mostrar el campo de texto. `{ "type": "text" \| "phone", "maxLength": 60, "placeholder": null, "optional": false }`. |
| `state` | Guardarlo y mandarlo en el próximo mensaje. |
| `lead` | `{ "id", "type" }` cuando se terminó de registrar un turno, pedido o contacto. |

#### Cómo se identifica la opción elegida

1. Si viene `optionId`, se busca entre las opciones que el bot mostró en ese momento.
2. Si viene `text`, en los pasos con botones se compara con los `label` sin importar mayúsculas ni tildes ("ubicacion" = "Ubicación"). En los pasos de texto libre (`input` no nulo) se toma el texto como respuesta.
3. Si no coincide con nada, el bot repite la pregunta con "Elegí una de las opciones 👇" (o el menú con el mensaje de ayuda).

Opciones especiales, válidas en cualquier momento:

| `optionId` | Efecto |
|---|---|
| `menu` | "Volver al menú" |
| `cancel` | "Cancelar": sale del flujo sin guardar nada |
| `skip` | "Omitir" un paso opcional |
| `cart-more` / `cart-done` | "Agregar otra cosa" / "Confirmar pedido" en el carrito |

#### Qué se guarda

Cada pedido guarda el mensaje del visitante y las respuestas del bot. Al crear una conversación nueva también se guarda el saludo, así el historial del panel queda completo. Al terminar un flujo se crea el lead asociado a la conversación.

#### Protecciones

Solo bots publicados, slug con parte aleatoria (no se adivina), mensaje de 500 caracteres como máximo, body de 100 kb como máximo y límite de pedidos por IP (lo configura Brandon). Como el `state` lo guarda el navegador, el backend vuelve a validar **todas** las respuestas contra los datos del bot antes de crear el lead: si alguien manipula el `state`, no se guarda nada.

---

## Motor del bot (`server/src/engine/`)

El bot no es un programa aparte: es la configuración guardada en la base más el motor que la interpreta.

- `templates/*.json`: las tres plantillas base (`faq`, `turnos`, `pedidos`).
- `conversation.js`: `startChat()` y `handleMessage()`. Son funciones puras (no usan la base), por eso se pueden testear fácil y la vista previa reutiliza el mismo código.
- `configSchema.js`: arma el esquema Zod de `bot.config` a partir de los `fields` de la plantilla.
- `templateSchema.js`: valida la estructura de una plantilla (la usa el admin y los tests).
- `index.js`: `syncBaseTemplates(prisma)` carga las tres plantillas en la base; la usa el seed.

### Estructura de una plantilla

Cada JSON tiene `key`, `name`, `description` y `config`. Lo que va en `config`:

```jsonc
{
  "idealFor": "Peluquerías, consultorios y talleres",

  // 1. Los datos que el dueño completa en el asistente → se guardan en bot.config
  "fields": [
    { "key": "businessName", "label": "Nombre del negocio", "type": "text", "required": true, "maxLength": 80, "placeholder": "Peluquería Lola" },
    { "key": "services", "label": "Servicios", "type": "items", "required": true, "maxItems": 15,
      "itemFields": [
        { "key": "name", "label": "Servicio", "type": "text", "required": true, "maxLength": 40 },
        { "key": "price", "label": "Precio", "type": "price" }
      ] },
    { "key": "workingDays", "label": "Días que das turnos", "type": "weekdays", "required": true }
  ],

  // 2. Textos fijos del bot. {{clave}} se reemplaza por el dato del negocio.
  "messages": {
    "welcome": "¡Hola! Soy el asistente de {{businessName}}. ¿En qué te puedo ayudar?",
    "fallback": "No entendí tu mensaje. Elegí una de las opciones 👇",
    "backToMenu": "¿Te ayudo con algo más?"
  },

  // 3. El menú: botones del primer mensaje
  "menu": [
    { "id": "hours", "label": "Horarios", "type": "answer", "requires": ["hours"], "answer": "Atendemos {{hours}}." },
    { "id": "book", "label": "Sacar un turno", "type": "flow", "flow": "appointment" }
  ],

  // 4. Flujos de varios pasos que terminan en un lead
  "flows": {
    "appointment": {
      "leadType": "APPOINTMENT",
      "steps": [
        { "key": "service", "prompt": "¿Qué servicio querés?", "input": "choice", "source": { "field": "services", "labelKey": "name" } },
        { "key": "date", "prompt": "¿Qué día te queda bien?", "input": "choice", "source": { "type": "nextDates", "field": "workingDays", "count": 6 } },
        { "key": "name", "prompt": "¿A nombre de quién?", "input": "text", "maxLength": 60, "saveAs": "contactName" },
        { "key": "phone", "prompt": "¿A qué teléfono te confirmamos?", "input": "phone", "saveAs": "contactPhone" }
      ],
      "success": "¡Listo, {{name}}! Tu turno para {{service}} el {{date}} quedó registrado."
    }
  }
}
```

**Tipos de campo** (`fields[].type`), para que el asistente sepa qué input mostrar:

| Tipo | Valor en `bot.config` | Input sugerido |
|---|---|---|
| `text` | `"texto"` | input de una línea |
| `textarea` | `"texto"` | textarea |
| `phone` | `"11 5555 0000"` | input tel |
| `boolean` | `true` / `false` | checkbox |
| `weekdays` | `[2, 3, 4]` (0 = domingo … 6 = sábado) | 7 checkboxes |
| `list` | `["Efectivo", "Transferencia"]` | lista de inputs con "agregar" |
| `items` | `[{ "name": "Corte", "price": 8000 }]` | tabla con las columnas de `itemFields` (`text`, `textarea` o `price` = número en pesos) |

**Ítems del menú** (`menu[].type`):

- `answer`: responde un texto fijo. `requires`: si alguno de esos campos está vacío, el botón no aparece.
- `flow`: arranca un flujo de `flows`.
- `answerList`: convierte cada ítem de un campo `items` (por ejemplo, las preguntas propias del dueño en `faq`) en un botón con su respuesta.

**Pasos de un flujo** (`steps[].input`):

- `choice`: botones. Las opciones salen de `choices` (fijas, cada una con `requires` opcional), de `source.field` (un campo `list` o `items` del negocio) o de `source.type: "nextDates"` (próximos días hábiles según un campo `weekdays`, en hora de Argentina). Con `autoSelectSingle`, si hay una sola opción se elige sola.
- `text` / `phone`: texto libre, con `maxLength`. `optional: true` agrega el botón "Omitir".
- `cart`: carrito de productos de un campo `items` con precio.
- `when: { "step": "delivery", "equals": "delivery" }`: el paso solo se hace si un paso anterior tuvo ese valor.
- `saveAs`: `contactName` o `contactPhone` → va a la columna del lead. Todo flujo tiene que tener un paso con `saveAs: "contactName"`.

En los textos se puede usar `{{clave}}` de cualquier campo del negocio o paso anterior. En el carrito, además, `{{item}}`, `{{cart}}` y `{{total}}`.

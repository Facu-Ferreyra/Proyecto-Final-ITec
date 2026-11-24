---
name: EasyBot
description: Tu chatbot en minutos, sin programar.
colors:
  glass: "#f3f1ec"
  paper: "#fffefb"
  ink: "#14171f"
  ink-deep: "#0c0e14"
  ink-soft: "#383c47"
  muted: "#5a5e68"
  line: "#dcd7cc"
  line-strong: "#a7a194"
  on-dark: "#d4d6dc"
  sand: "#e6dcc4"
  sand-deep: "#d8cbab"
  sand-wash: "#ebe5d8"
  accent: "#23408e"
  accent-dark: "#192f6b"
  accent-soft: "#e2e7f3"
  accent-wash: "#f0f2f8"
  green: "#2f6b45"
  green-soft: "#dfeae1"
  error: "#a8261b"
  error-dark: "#82190f"
  error-soft: "#f8e8e5"
  warning-ink: "#7a4a07"
typography:
  display:
    fontFamily: "Bricolage Grotesque Variable, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(2.6rem, 6.4vw, 5.25rem)"
    fontWeight: 720
    lineHeight: 1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Bricolage Grotesque Variable, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(2.1rem, 4.2vw, 3.4rem)"
    fontWeight: 720
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  page-title:
    fontFamily: "Bricolage Grotesque Variable, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(1.9rem, 5vw, 2.4rem)"
    fontWeight: 720
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Bricolage Grotesque Variable, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(20px, 2vw, 26px)"
    fontWeight: 800
    lineHeight: 1.2
  body:
    fontFamily: "Bricolage Grotesque Variable, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "tnum"
  body-app:
    fontFamily: "Bricolage Grotesque Variable, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
  label:
    fontFamily: "Bricolage Grotesque Variable, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 800
    lineHeight: 1.4
rounded:
  sign: "4px"
  lg: "6px"
  bubble: "14px"
  tab: "10px 10px 0 0"
  round: "50%"
spacing:
  gutter-sm: "16px"
  gutter-md: "32px"
  gutter-lg: "48px"
  section-y: "clamp(72px, 10vw, 128px)"
  card: "24px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sign}"
    padding: "10px 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.accent-dark}"
  button-primary-landing:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sign}"
    padding: "0 26px"
    height: "52px"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.accent}"
    rounded: "{rounded.sign}"
    padding: "10px 20px"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.accent-wash}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sign}"
    padding: "0 26px"
    height: "52px"
  chat-option:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.accent}"
    rounded: "{rounded.sign}"
    padding: "8px 14px"
    height: "44px"
  chat-option-hover:
    backgroundColor: "{colors.accent-soft}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sign}"
    padding: "10px 14px"
    height: "44px"
  tab-active:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-dark}"
    rounded: "{rounded.sign}"
    padding: "8px 14px"
    height: "40px"
  nav-tab-active:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tab}"
    padding: "0 16px"
    height: "52px"
  nav-tab-hover:
    backgroundColor: "{colors.accent-wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tab}"
    padding: "0 16px"
    height: "52px"
  home-nav-tab-hover:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tab}"
    padding: "0 16px"
    height: "54px"
  chat-to-top:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper}"
    rounded: "{rounded.round}"
    size: "48px"
  chat-to-top-hover:
    backgroundColor: "{colors.accent-dark}"
  badge-published:
    backgroundColor: "{colors.green-soft}"
    textColor: "{colors.green}"
    typography: "{typography.label}"
    rounded: "{rounded.sign}"
    padding: "2px 10px"
  badge-draft:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.sign}"
    padding: "2px 10px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sign}"
    padding: "24px"
  sign-sand:
    backgroundColor: "{colors.sand}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sign}"
    padding: "32px 26px 26px"
  sign-blue:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sign}"
    padding: "32px 26px 26px"
  chat-bubble-bot:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.bubble}"
    padding: "10px 14px"
  chat-bubble-visitor:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper}"
    rounded: "{rounded.bubble}"
    padding: "10px 14px"
---

# Design System: EasyBot

## Overview

**Creative North Star: "Cartel de vidriera"**

EasyBot es la vidriera de un comercio de barrio con sus carteles de cartulina impresa: fondo arena, carteles en arena y en azul tinta, letra de imprenta grande, pegados con una tira de cinta de papel. Cada respuesta del bot es uno de esos carteles: concreto (una hora, un precio, un turno), grande y legible desde la vereda. La portada lo dice en voz alta (el título en un cartel arena enorme, la vidriera de preguntas con su cartel principal y los demás desfasados, las tres plantillas como tres carteles) y el local tiene frente: un toldo a rayas azul tinta y papel bajo la barra y un suelo de arena con grano de papel; las pantallas de trabajo (Mis bots, asistente, panel, admin) bajan el volumen: arena, papel y tinta, con el azul tinta para la acción y lo seleccionado, y la letra de títulos reservada al h1 de cada página.

La densidad es baja y los toques son grandes (mínimo 44px): el dueño trabaja desde el celular. La forma es casi recta (4px), los bordes son de tinta (1.5px a 2px) y la profundidad es la de una hoja apoyada en el vidrio, con sombra suave, nunca un bloque duro. El estado se lee en la forma y no solo en el color: publicado es borde firme verde con relleno suave; borrador es borde punteado sin relleno.

El chat es la excepción deliberada: es la cara del negocio ante su cliente, así que sus globos son redondeados (14px) como en los chats que la gente ya usa, con la esquina "pegada" del lado de quien habla, y el cliente escribe en azul tinta. En la portada la respuesta del bot cae como cartel arena colgado dentro de ese chat; ahí se juntan los dos idiomas.

El movimiento no usa fundidos genéricos: tiene tres gestos del mundo (colgar, trazar, girar), más escribir, bajar el toldo y el globo que crece desde su punta. Los gestos se miran (1 s aprox.); la interfaz responde rápido (≤ 300ms). Con movimiento reducido todo queda quieto en su estado final.

**Key Characteristics:**
- Fondo arena cálido, superficies de papel, tinta casi negra; nada flúo.
- Azul tinta como única voz de acción y de selección; verde solo para "publicado".
- Una sola familia, Bricolage Grotesque Variable: los títulos se distinguen por peso (720) y tamaño óptico, no por otra fuente.
- Cartel = cartulina con 4px, sombra de papel y cinta arriba, con un dato concreto adentro.
- Estado por forma: firme y lleno = publicado / activo; punteado y vacío = borrador / pendiente.
- Cifras tabulares en todo el sitio (horarios, precios, turnos).
- La portada es un local con frente: toldo a rayas bajo la barra, grano de papel en el suelo y los links como pestañas de navegador.
- Tres gestos de movimiento (colgar, trazar, girar); con movimiento reducido, todo en reposo.

## Colors

Arena, papel y tinta como base; dos cartulinas impresas (arena y azul tinta) para los carteles; un verde de estado.

### Primary
- **Azul tinta** (`accent`): la acción principal (botón lleno, cartel de cierre), el globo del cliente en el chat, el encabezado del chat público, el botón redondo de volver arriba del chat, el paso actual del asistente, la línea bajo el h1 de cada página, las rayas del toldo de la portada (alternadas con papel), `caret-color` y `accent-color`. **Azul tinta oscuro** (`accent-dark`): el relleno que cubre el botón en hover y el texto de la pestaña activa.
- **Azul suave** (`accent-soft`): selección. Pestaña activa de los grupos de pestañas, opción elegida del chat, fila nueva del panel, aura de foco, `::selection`. **Azul lavado** (`accent-wash`): hover de pestañas, de la pestaña de navegador de la barra de la app y de los botones secundarios.

### Secondary
- **Cartulina arena** (`sand`): el cartel de siempre (título de la portada, respuesta del bot, número de paso, código de error, plantilla elegida) y la cinta del bot publicado. **Arena profunda** (`sand-deep`): segunda cartulina, solo en la paleta de avatares y en la variante vieja `eb-sign--green`.

### Tertiary
- **Verde publicado** (`green`) con **verde suave** (`green-soft`): solo "publicado / activo / hecho": borde y texto de la etiqueta, borde de la tarjeta de bot publicada, paso completado del asistente, avisos de éxito.

### Neutral
- **Arena de vidriera** (`glass`): fondo de toda página y del cuerpo del chat; también el relleno de la pestaña de navegador abierta (la sección actual de la app, el hover de la portada), porque la pestaña es un pedazo de la página que sube a la barra.
- **Arena lavada** (`sand-wash`): la franja de fondo más oscura de la portada (la sección del problema), siempre con grano.
- **Papel** (`paper`): formularios, tarjetas, chat, tablas, barra de la app; texto sobre azul tinta y sobre tinta.
- **Tinta** (`ink`): texto, bordes de cartel, globo del bot, reglas de paso, pie de la portada. **Tinta profunda** (`ink-deep`): fondo del pie del sitio en las pantallas de login y legales (vía el alias `--eb-navy-deep`).
- **Tinta suave** (`ink-soft`): bajadas y texto secundario fuerte, texto de borrador.
- **Gris de rótulo** (`muted`): metadatos, fechas, ayudas (6:1 sobre arena).
- **Línea** (`line`) y **Línea firme** (`line-strong`): divisores, borde de campos en reposo, bordes punteados de borrador.
- **Tinta clara** (`on-dark`): texto del pie oscuro.
- **Estados legibles:** `error` / `error-dark` / `error-soft`, `warning-ink`. Con `green`, son los únicos colores de texto con tono.

Los nombres `--eb-yellow`, `--eb-pink`, `--eb-orange`, `--eb-marker`, `--eb-navy`, `--eb-blue`, `--eb-sun`, `--eb-wide` (y sus `-soft` / `-dark`) son alias heredados en `tokens.css` que apuntan a esta paleta (por ejemplo `--eb-yellow` → `accent-soft`, `--eb-pink` → `sand`, `--eb-blue` → `accent`, `--eb-sun` → `green`, `--eb-marker` → la letra de títulos). No son colores propios.

### Named Rules
**The Una Sola Voz Rule.** El azul tinta lleno es la acción principal de su zona; el resto de los botones son de borde (azul o tinta) sobre papel o transparentes. Sobre un cartel azul, el botón principal se invierte: papel con letra azul tinta.

**The Selección Azul Rule.** En las pantallas de trabajo lo seleccionado o activo se marca con azul suave (y borde azul tinta o tinta): pestaña de un grupo, opción elegida, foco. Nada más usa ese fondo. La única excepción es la navegación principal: la sección actual es la pestaña de navegador abierta, en el arena de la página con borde de tinta.

**The Grano De Papel Rule.** El suelo de la portada (arena), la franja del problema (arena lavada) y la banda del panel (papel) llevan el grano `--eb-grain` (ruido SVG `feTurbulence` de tinta a ~7%, en mosaico de 180px) debajo del color: `background: var(--eb-grain) <color>`. Es textura de material, no dibujo; no va sobre carteles, tarjetas ni el chat.

**The Verde Es Publicado Rule.** El verde aparece solo para publicado / activo / hecho, siempre con borde firme además del color.

## Typography

**Display Font:** Bricolage Grotesque Variable (con system-ui, -apple-system, Segoe UI, Roboto, sans-serif)
**Body Font:** Bricolage Grotesque Variable (la misma familia)

**Character:** Una grotesca de imprenta con tamaño óptico: en grande toma la forma apretada del cartel, en chico la de lectura. Se sirve desde el propio servidor (`@fontsource-variable/bricolage-grotesque/opsz.css`) con `font-optical-sizing: auto`.

### Hierarchy
- **Display** (720, `clamp(2.6rem, 6.4vw, 5.25rem)`, 1, `-0.025em`): título del cartel de la portada; el cierre usa `clamp(2.4rem, 5.6vw, 4.6rem)`; el código de las páginas de error llega a `clamp(72px, 13vw, 140px)`.
- **Headline** (720, `clamp(2.1rem, 4.2vw, 3.4rem)`, 1.04): títulos de sección de la portada; respuestas de la vidriera `clamp(22px, 2vw, 28px)` y la principal `clamp(32px, 3.6vw, 48px)`.
- **Page title** (720, `clamp(1.9rem, 5vw, 2.4rem)`, 1.05, `-0.02em`): el h1 de cada pantalla de trabajo, con su línea azul de 3px debajo. Títulos de paso del asistente `clamp(1.8rem, 4vw, 2.4rem)`.
- **Title** (800, `clamp(20px, 2vw, 26px)`, 1.2): títulos de paso y de tarjeta; h2/h3 de las pantallas de trabajo en 800 con 1.25 y `-0.005em`.
- **Body** (400, 17px, 1.55 en la portada; 16px, 1.5 en la app): bajadas con `max-width: 34em`–`40em` y `text-wrap: pretty`.
- **Label** (800, 0.8rem): etiquetas de estado y el sello "Chat de ejemplo" (12px); botones y links en 700; chips en 600.

El logo ("EasyBot" junto al sello) va en la letra de títulos a 760 (barra de la app, login, legal) o 720 (portada, pie).

### Named Rules
**The Una Familia Rule.** Una sola familia en todo el sitio. Los títulos se distinguen por peso 720, tamaño óptico y tracking negativo (`-0.02em` a `-0.025em`), nunca por una segunda fuente.

**The Cifra Fija Rule.** `font-variant-numeric: tabular-nums` está en `:root`: horarios, precios y turnos se alinean en columnas fijas.

## Layout

La portada usa un contenedor de 1200px con margen lateral de 16px (celular), 32px (desde 640px) y 48px (desde 1024px), y un ritmo vertical de sección `clamp(72px, 10vw, 128px)`. Lo primero bajo la barra es el toldo, a todo el ancho (fuera del contenedor), con `clamp(32px, 5vw, 56px)` de aire debajo. Sigue una grilla 7/5 desde 960px (cartel a la izquierda, chat de ejemplo a la derecha, máximo 400px); debajo de 960px se apila. La vidriera de preguntas es una grilla 4/7 desde 1024px con el encabezado fijo (`sticky`) y una vidriera compuesta de dos columnas: el primer cartel ocupa el ancho y manda, los demás quedan a alturas fijas distintas (0, 28px, -6px, 28px); debajo de 560px, una columna. Los 4 pasos son cuatro filas de ancho completo separadas por reglas de tinta de 2px (número 72px / texto / dato desde 768px), no una grilla de tarjetas. El panel de ejemplo va en 5/6 desde 960px; las plantillas, 3 columnas desde 900px.

Las pantallas de trabajo tienen `padding: 24px 16px` en celular y `32px 48px` desde 768px, alto mínimo `100svh`. Las listas de bots son `auto-fill` con mínimo 280px y 20px de separación; el asistente usa formulario + vista previa en 3/2 desde 900px. La barra de la app pasa a logo + menú lateral debajo de 768px; la de la portada, debajo de 960px. El chat público mide exactamente el alto de la pantalla (`100svh`): el encabezado y la caja de escribir quedan fijos y los mensajes se desplazan adentro. Todo funciona a 360px de ancho.

## Elevation & Depth

Plano por defecto, con una sola idea de profundidad: papel apoyado sobre la vidriera. La sombra es siempre desplazada hacia abajo con desenfoque suave y teñida de tinta, nunca un bloque duro. La cinta (una tira translúcida, apenas sesgada, de 70×20px arriba del cartel) agrega la segunda capa física.

### Shadow Vocabulary
- **Papel** (`box-shadow: 0 1px 0 rgb(20 23 31 / 0.05), 0 10px 22px -12px rgb(20 23 31 / 0.3)`): carteles, tarjetas, bot publicado, paso actual, plantilla elegida, botón principal de la portada.
- **Despegado** (`box-shadow: 0 22px 46px -16px rgb(20 23 31 / 0.34)`): lo que flota sobre la página: chat y panel de ejemplo de la portada, tarjeta de login, menús, diálogos.
- **Aura de foco** (`box-shadow: 0 0 0 6px` azul suave, o `4px` en campos): acompaña al contorno de foco; no es sombra sino trazo.
- **Tela colgada** (`filter: drop-shadow(0 10px 12px rgb(20 23 31 / 0.16))`, más un pliegue `linear-gradient(rgb(20 23 31 / 0.18), transparent 45%)` contra el caño): solo el toldo. Va como `filter` para que siga las ondas del borde.

El grano de papel (ver Colors) es la otra capa de material: el suelo tiene textura, las hojas apoyadas encima son lisas.

### Named Rules
**The Hoja Apoyada Rule.** Solo dos sombras para superficies: papel y despegado. Lo que no está publicado o pegado (borradores, tarjetas de datos en reposo) va sin sombra. La sombra de tela es del toldo y de nada más.

## Shapes

Cartulina cortada: esquinas casi rectas de 4px en carteles, tarjetas, botones, chips, campos y etiquetas (`--eb-radius`, `--eb-radius-sm` y `--eb-radius-pill` valen 4px). Contenedores grandes (chat, panel de ejemplo, diálogos) en 6px. La única curva amplia es el globo del chat (14px) con la esquina de quien habla en 4px. Tres excepciones con motivo, fuera de la escala de 4px: la pestaña de navegador (10px arriba, recta abajo, con dos "pies" cóncavos de 10px que la unen a la línea de la barra), porque copia la pestaña real del navegador; el botón de volver arriba del chat, un círculo de 48px y el único control redondo del chat, para que no se confunda con carteles ni globos; y el borde de abajo del toldo, en ondas de medio círculo (una por raya). Bordes de tinta de 1.5px (chips, etiquetas, tarjetas, globos) a 2px (botones, chat, reglas de paso, barra de la app). El borde punteado es un significado, no un adorno: borrador, pendiente, estado vacío. Viñetas: cuadraditos de 9–10px de tinta llenos, nunca círculos. El sello del logo es un cuadrado azul tinta de 7px de radio con un globo de chat arena y dos ojos, formas gruesas que se leen a 16px.

## Components

### Buttons
Carteles chicos, firmes al tacto.
- **Shape:** casi recto (4px), borde de 2px.
- **Primary:** azul tinta con texto de papel, 700; 44px en la app (`10px 20px`), 52px en la portada (`0 26px`).
- **Hover:** el azul tinta oscuro cubre el botón de izquierda a derecha (`background-size` de 0 a 100% en 320ms con `--eb-ease-pen`), como tinta que entra en el papel.
- **Focus:** contorno de 3px en azul tinta a 2px de distancia con aura azul suave de 6px; sobre fondo oscuro o azul, contorno arena sin aura.
- **Pressed:** todo lo que se toca se achica a `scale(0.97)` con `160ms cubic-bezier(0.23, 1, 0.32, 1)`; se anula con movimiento reducido.
- **Secondary:** papel con borde y texto azul tinta; hover en azul lavado. **Ghost** (portada, barra de error): transparente con borde de tinta; hover en papel o azul lavado.
- **Text link:** subrayado de 2px a 6px de distancia que se engrosa a 4px en hover.

### Chips
- **Style:** opciones del chat: papel, borde azul tinta de 1.5px, texto azul tinta, 4px, 600, mínimo 44px. En el chat de ejemplo, borde de tinta.
- **State:** hover en azul suave; opción elegida en azul suave con borde azul tinta (en la demo también `scale(0.96)`).

### Cards / Containers
- **Corner Style:** 4px.
- **Background:** papel sobre arena.
- **Shadow Strategy:** papel cuando el objeto está "pegado"; nada en tarjetas de datos ni borradores.
- **Border:** tarjeta genérica en tinta 1.5px; tarjeta de bot: borrador punteado en línea firme, publicada firme en verde con cinta arena; hover con mouse pasa el borde a tinta y sube 2px.
- **Internal Padding:** 24px (tarjeta), `22px 20px 20px` (bot).

### Inputs / Fields
- **Style:** papel, borde de línea firme 1.5px, 4px, 44px de alto, `10px 14px`; hover a tinta suave.
- **Focus:** el borde pasa a tinta y aparece un aura azul suave de 4px, sin contorno.
- **Error / Disabled:** borde de error de 2px y mensaje en `error` debajo; deshabilitado a opacidad 0.55–0.6.

### Navigation
Los links de sección son pestañas de navegador (como en Opera): una sola mecánica compartida en `tokens.css` para las dos barras, que cada barra colorea con tres variables (`--tab-fill`, `--tab-line`, `--tab-bw`). La pestaña tiene 10px arriba, no tiene borde abajo, baja `--tab-bw` para tapar la línea de la barra y lleva dos pies cóncavos que la unen a esa línea; relleno, borde y pies cambian en 160ms.
- **App:** barra de papel con regla inferior de tinta de 2px; pestañas 700 de 52px con `0 16px`. Sección actual = pestaña abierta: arena de la página con borde de tinta de 2px, se une con la pantalla de abajo. Hover sobre otra = pestaña suave en azul lavado con borde de línea firme. Debajo de 768px, logo + menú lateral.
- **Portada:** barra de papel (`rgb(255 254 251 / 0.94)` con desenfoque) y línea fina de 1px; pestañas 600 de 54px en tinta suave. Al pasar el mouse la pestaña toma el arena de la página con borde de línea de 1px, como si se abriera hacia ella, y el texto pasa a tinta. Debajo de 960px, menú lateral.

### Tabs and Status Badges
- **Tabs:** grupo encerrado en tinta 1.5px sobre papel; activa = azul suave con borde azul tinta y texto azul oscuro.
- **Badges:** publicado = verde suave con borde y texto verdes firmes; borrador = transparente con borde punteado de tinta suave. Mismo patrón en el avatar del bot (borrador punteado sobre papel) y en el número de paso del asistente (actual azul tinta lleno, hecho verde, pendiente punteado).

### Cartel (signature)
La pieza del mundo: cartulina (arena, azul tinta con texto de papel, papel o tinta) con 4px, sombra de papel y la cinta translúcida centrada arriba, sesgada `-2deg`. Lleva un dato concreto en la letra de títulos (una hora, un precio, un turno). Cuelga de la cinta: gira desde arriba (`transform-origin: 50% 0`). Con mouse fino, los carteles de la vidriera y las plantillas se mecen apenas al pasar (`rotate` ±1.4deg / -0.8deg, 520ms con rebote).

### Toldo (portada)
El frente del local, a todo el ancho justo debajo de la barra: tela de rayas verticales azul tinta y papel (raya de 44px, 30px debajo de 640px), colgada de un caño de tinta de 5px, con el borde de abajo en ondas (medio círculo por raya, del color de su raya), pliegue sombreado arriba y sombra de tela. Es decorado de la portada, no un componente para repetir en pantallas de trabajo.

### Chat
Cuerpo de arena dentro de un marco de tinta de 2px y 6px; encabezado azul tinta con texto de papel (chat público); globo del bot en papel con borde de tinta 1.5px, globo del cliente en azul tinta; esquina pegada de 4px del lado de quien habla. Escribiendo: tres puntos que laten en ola (quietos con movimiento reducido).
- **Volver arriba:** círculo de 48px azul tinta con flecha de papel y borde de papel de 2px, sombra despegada, abajo a la derecha del área de mensajes (16px de los bordes). Aparece cuando la conversación bajó más de una pantalla del área de mensajes; hover en azul tinta oscuro, presionado `scale(0.94)`. Sube con desplazamiento suave (instantáneo con movimiento reducido).

### Motion (los gestos del mundo)
- **Colgar** (`eb-hang`): el cartel oscila como péndulo amortiguado `-4.5° → 3° → -1.6° → 0.7° → -0.25° → 0°`; cada tramo lleva su propia curva seno `cubic-bezier(0.37, 0, 0.63, 1)`, así frena en los extremos sin importar la curva de quien lo use. 1100ms en el cartel de la portada y el 404, 1000ms en la respuesta del chat de ejemplo, 900ms en la plantilla elegida. Arranca visible.
- **Trazar** (`eb-draw`, `scaleX(0 → 1)` con `--eb-ease-pen` `cubic-bezier(0.65, 0, 0.35, 1)`): la regla de datos del cartel de la portada (640ms, a los 700ms), las reglas de los 4 pasos (720ms, de a 140ms), la línea bajo el h1 de cada pantalla (640ms, a los 120ms) y el relleno del botón.
- **Girar**: el número de cada paso rueda por una columna de cifras 0–4 hasta su valor, como el contador de "su turno" (900ms `cubic-bezier(0.34, 1.32, 0.64, 1)`, de a 140ms tras 200ms).
- **Escribir** (`eb-write`, `clip-path: inset(0 100% 0 0) → inset(0)`): el título de la portada (650ms) y las filas del panel de ejemplo (520ms, de a 160ms); las opciones del chat se descubren igual (420ms).
- **Bajar el toldo**: el toldo se despliega una sola vez al cargar, de arriba hacia abajo (`clip-path: inset(0 0 100% 0) → inset(0 0 -40px 0)`, 720ms con `--eb-ease-pen`); el margen negativo final deja ver su sombra.
- **Globo**: cada globo crece desde su punta (`scale(0.82) → 1`, 300ms con `--eb-ease-out`), abajo a la izquierda el bot, abajo a la derecha el cliente. El botón de volver arriba crece igual desde su rincón (`scale(0.6) → 1`, 220ms, origen abajo a la derecha).
- **Interfaz**: press 160ms, entradas 220–240ms con `--eb-ease-out`, pestañas 160ms; avisos bajan 4px, el paso del asistente entra 8px desde la derecha.
- **Movimiento reducido:** cada gesto vive dentro de `prefers-reduced-motion: no-preference`; con `reduce`, todo queda en su estado final (cartel derecho, reglas trazadas, cifra en su valor, texto completo, toldo desplegado), sin achicar al presionar, con los puntos de "escribiendo" quietos y el volver arriba instantáneo.

## Do's and Don'ts

### Do:
- **Do** tomar todo color, radio, sombra y curva de `src/styles/tokens.css`; las variables de cada pantalla (`--color-*`, `--home-*`, `--chat-*`) apuntan ahí.
- **Do** usar el azul tinta lleno para una sola acción principal por zona, y el azul suave solo para lo seleccionado o activo.
- **Do** expresar el estado por forma además de color: borde firme + relleno suave para publicado / activo, punteado sin relleno para borrador / pendiente.
- **Do** mantener los toques en 44px como mínimo y los radios en 4px (6px contenedores grandes, 14px solo globos de chat, 10px arriba solo en las pestañas de navegador, círculo solo en el volver arriba del chat).
- **Do** dibujar los links de sección de una barra como pestañas de navegador con la mecánica compartida de `tokens.css`, coloreándolas solo con `--tab-fill`, `--tab-line` y `--tab-bw`.
- **Do** poner el grano de papel debajo del color de los fondos de banda de la portada (`var(--eb-grain) <color>`), nunca sobre carteles o tarjetas.
- **Do** animar con los gestos del mundo (colgar, trazar, girar, escribir, globo desde su punta) y dejar todo en su estado final con `prefers-reduced-motion: reduce`.
- **Do** marcar con un sello visible ("Chat de ejemplo") cualquier dato inventado de demostración.

### Don't:
- **Don't** volver a los colores flúo ni a la letra de fibrón: amarillo, rosa, verde y naranja flúo y Permanent Marker quedaron afuera.
- **Don't** usar una segunda familia tipográfica; los títulos son Bricolage a 720.
- **Don't** usar más de un botón azul tinta lleno por zona.
- **Don't** usar fundidos genéricos (aparecer con opacidad sola) como entrada de contenido.
- **Don't** usar sombras de bloque duro desplazado ni sombras fuera de las dos del vocabulario (la de tela es solo del toldo).
- **Don't** agregar otros controles redondos al chat: el círculo es la marca del volver arriba.
- **Don't** usar en código nuevo los alias heredados (`--eb-yellow`, `--eb-pink`, `--eb-orange`, `--eb-marker`, `--eb-navy`, `--eb-blue`, `--eb-sun`, `--eb-wide`); usar arena, papel, tinta, `accent` y `green`.
- **Don't** usar barras de color al costado en avisos: los avisos llevan borde completo y fondo suave.

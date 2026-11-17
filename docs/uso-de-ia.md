# Uso de IA en el proyecto

## Herramientas utilizadas

- Claude Code (Claude): generación de código, consulta de documentación y revisión.

## Tareas en las que la usamos

- Generación de código: pantallas del frontend, validaciones con Zod y datos de prueba (mocks).
- Depuración de errores: revisión de errores de ESLint y de pantallas que no se veían bien.
- Documentación / tests / diseño: consulta de la documentación actualizada de React y Zod.

## Un caso en que la IA ayudó bien

Le pedimos que armara la validación del formulario de creación de bots en el
frontend con las mismas reglas que el backend (`server/src/engine/configSchema.js`).
Generó un esquema Zod que se arma a partir de los campos de cada plantilla, con
mensajes en español. Fue útil porque el usuario ve los errores antes de enviar el
formulario y las reglas coinciden con las del backend, que igual vuelve a validar todo.

## Un caso en que hubo que corregirla

Propuso crear un archivo de datos de prueba en una carpeta que no correspondía a
esa parte del proyecto, sin consultarlo, y más adelante generó un archivo de más
de 400 líneas. Lo detectamos al revisar los cambios antes de hacer el commit. Lo
resolvimos moviendo el código a `client/src/api/` y dividiéndolo en archivos más
chicos (`http.js`, `bots.js` y la carpeta `mocks/`), cada uno con una sola tarea.



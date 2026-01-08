# Repository Guidelines

## Project Structure & Module Organization
La raíz contiene `bloques.md`, índice maestro con la numeración de cada bloque. Los contenidos viven en `bloques/`, divididos por subcarpetas temáticas (p. ej. `bloques/urbano - tradicional/`, `bloques/urbano - cultura local/`). Cada itinerario es un archivo Markdown llamado `NN-nombre.md`, como `bloques/urbano - tradicional/1-asakusa.md`; mantené la numeración sincronizada con el índice y usa títulos iniciales en formato “Bloques … / Itinerario: …”. Replicá secciones existentes (Concepto, Estructura, etc.) para mantener comparabilidad.

## Build, Test, and Development Commands
Este repositorio es solo Markdown, sin pasos de compilación. Antes de abrir un PR corré comandos rápidos:
- `rg -n "Itinerario:" bloques` confirma que agregaste encabezados coherentes y facilita revisar cambios.
- No corras `markdownlint` ni `npx -y markdownlint-cli2` hasta nuevo aviso: la limpieza quedó pendiente y el linter está deshabilitado para evitar ruido.
- `glow bloques/<ruta>.md` o cualquier visor Markdown ayuda a validar el renderizado final si trabajás en terminal.

## Coding Style & Naming Conventions
Escribí todo en español y en tono explicativo. Usá encabezados ATX (`#`, `##`), listas con guiones y mantén saltos manuales (`  `) para cortes de línea controlados como en `bloques.md`. Los nombres de archivo deben ser slug descriptivos en minúsculas con guiones, precedidos por un número de dos dígitos cuando aplique. Para énfasis usá `**negritas**` y *cursivas* igual que en los archivos existentes; evitá HTML embebido.

## Testing Guidelines
No hay suite automatizada, así que probamos leyendo. Revisá que cada itinerario nuevo esté enlazado en `bloques.md`, que la numeración sea única y que las flechas (`→`) sigan el flujo lógico del recorrido. El linter de Markdown queda suspendido temporalmente; concentrá la revisión manual en el diff renderizado (GitHub o `glow`) buscando encabezados huérfanos, listas sin contexto y caracteres no ASCII involuntarios.

## Commit & Pull Request Guidelines
Los commits existentes son breves (`update`, `primer commit`), pero preferimos mensajes imperativos que indiquen el bloque tocado, e.g. `add: bloque 10 Itabashi` o `fix: indice shibamata`. Cada PR describe qué itinerarios cambiaron, enlaza issues relevantes y, si altera diagramas o numeración, explica cómo volver a producir el PDF o nota correspondiente. Incluí capturas o enlaces a la vista renderizada cuando el formato pueda ser ambiguo.

## Localization & Tone Notes
Mantené la voz en español rioplatense, enfocada en explicar contexto histórico y usos locales. Dichos y giros demasiado turísticos se evitan; preferí instrucciones accionables (“tomá la línea Tobu…”) y referencias históricas breves que muestren por qué el bloque está en el itinerario.

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
Los commits existentes son breves (`update`, `primer commit`), pero preferimos mensajes imperativos que indiquen el bloque tocado, e.g. `add: bloque 10 Itabashi` o `fix: indice shibamata`. Cada PR describe qué itinerarios cambió, enlaza issues relevantes y, si altera diagramas o numeración, explica cómo volver a producir el PDF o nota correspondiente. Incluí capturas o enlaces a la vista renderizada cuando el formato pueda ser ambiguo.

## Localization & Tone Notes
Mantené la voz en español rioplatense, enfocada en explicar contexto histórico y usos locales. Dichos y giros demasiado turísticos se evitan; preferí instrucciones accionables (“tomá la línea Tobu…”) y referencias históricas breves que muestren por qué el bloque está en el itinerario.

---

## Trabajo con límite de tools

Los agentes tienen un límite de aproximadamente 20-25 llamadas a herramientas por respuesta. Para tareas que requieren múltiples archivos o pasos complejos (crear itinerario + entrada en índice + verificaciones), usá este flujo:

### Patrón: Checklist + Iteración

1. **Analizá** la tarea completa y separala en pasos atómicos
2. **Presentá un checklist** inicial con todos los pasos necesarios
3. **Ejecutá de a un paso por mensaje**, marcando ✅ el completado
4. **Confirmá con el usuario** antes de pasar al siguiente paso
5. **Actualizá el checklist** en cada respuesta para mantener contexto

### Ejemplo: Crear nuevo bloque

```
Usuario: Quiero agregar el bloque 52 de hiking

Agente:
CHECKLIST propuesto:
- [ ] 1. Verificar numeración disponible en bloques.md
- [ ] 2. Crear archivo 52-nombre.md con estructura completa
- [ ] 3. Agregar entrada en bloques.md
- [ ] 4. Verificar renderizado con glow

¿Ejecuto paso 1?

[usuario confirma]

Agente:
✅ Paso 1 completado: numeración 52 disponible.

CHECKLIST actual:
- [x] 1. Verificar numeración disponible en bloques.md
- [ ] 2. Crear archivo 52-nombre.md con estructura completa
- [ ] 3. Agregar entrada en bloques.md
- [ ] 4. Verificar renderizado con glow

¿Ejecuto paso 2?
```

### Reglas importantes

- **No intentés hacer todo en un solo mensaje** - si ves que necesitás más de 3-4 tool calls, pará y pedí confirmación
- **Siempre incluí el checklist actualizado** en cada respuesta cuando estés en modo iterativo
- **Marcá con ✅ los pasos completados** para que el usuario vea el progreso
- **Cuando termines la tarea**, resumí qué se hizo con una tabla o lista final

Este patrón evita cortes por límite de tools y permite al usuario intervenir o corregir dirección en cualquier punto.

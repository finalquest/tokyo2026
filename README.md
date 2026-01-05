# Itinerarios Tokio – primavera 2026

Repositorio con bloques modulares para planear un viaje en Tokio y alrededores. Cada bloque describe un día completo en formato Markdown (concepto, estructura, paradas clave, consejos prácticos y notas de temporada) y luego se puede convertir en mapas KML/PNG listos para Google My Maps. Se puede extender añadiendo nuevos itinerarios o editando los existentes a medida que cambian intereses, temporadas o datos prácticos.

## Requisitos previos
1. **Node.js + npm** para ejecutar los scripts (`npm install` al clonar).
2. **Google Cloud API Key** con acceso a:
   - *Places API* (para resolver coordenadas).
   - *Directions API* (para los tramos entre puntos).
   - *Maps JavaScript API* (para renderizar los PNG con tiles en inglés/español).
3. Guardá la key en `.env` (no versionado):  
   ```bash
   echo "GOOGLE_MAPS_API_KEY=tu_api_key" >> .env
   ```
   Si no configurás la key, el render usará OpenStreetMap automáticamente.

## Flujo de trabajo sugerido
1. **Crear/editar itinerarios en Markdown**: cada bloque vive en `bloques/<carpeta>/<NN-nombre>.md`.
2. **Cargar lugares del bloque** en `data/places-input/<block-id>.json`. Hoy ese paso se hizo manualmente/externamente (apoyándonos en un LLM para extraer la lista desde el Markdown), pero cualquier método es válido siempre que termine generando el JSON con `{ "name": "...", "hint": "..." }` siguiendo el orden del itinerario.
3. **Resolver coordenadas y rutas** con:
   ```bash
   npm run fetch:block -- <block-id>
   npm run routes:block -- <block-id>
   npm run build:map -- <block-id>      # genera maps/<block-id>.kml
   ```
4. **Renderizar mapas listos para My Maps**:
   ```bash
   npm run render:block -- <block-id> [--chunk-size=N]
   ```
   El comando produce `maps/<block-id>.png` (más los detalles si pedís `--chunk-size`).

## Estructura
- `bloques.md`: índice maestro con las categorías (urbano tradicional, historia, cultura local, subcultura, excursiones y evaluación). Incluye recordatorio de la ventana del viaje.
- `bloques/` subcarpetas: contienen los itinerarios detallados. Los nombres siguen la numeración del índice (`NN-nombre.md`).
  - `urbano - .../`: días dentro de Tokio separados por temática.
  - `excursion/`: escapadas de hasta dos horas de viaje (Kamakura, Hakone, etc.).
  - `evaluacion/`: ideas en reserva para futuros ajustes.
- `AGENTS.md`: guía de contribución para mantener estilo, comandos de revisión y tono.

## Cómo usar los bloques
1. Cada mañana revisá clima, energía y eventos especiales (hanami, iluminaciones).
2. Elegí un bloque del índice y abrí su archivo correspondiente en `bloques/`.
3. Seguí la estructura sugerida (orden óptimo de templos, cafés y transporte). Casi todos los bloques tienen notas específicas de primavera.
4. Podés mezclar o cortar bloques según ganas; el objetivo es tener más ideas de las que vas a usar.

## Contribuir
- Antes de editar, leé `AGENTS.md` para conocer estilo, comandos (`markdownlint`, `rg`) y tono en español rioplatense.
- Respetá la numeración y el formato "Bloques … / Itinerario …" al crear archivos nuevos.
- Tras agregar o modificar un bloque, asegurate de actualizar `bloques.md` y de incluir notas de temporada si aplican.
- Verificá cambios renderizando los `.md` (por ejemplo con `glow`) y corré `npx -y markdownlint-cli2 "**/*.md"` antes de hacer commit.
- Para mapas podés trabajar bloque a bloque:
  1. Creá `data/places-input/<block-id>.json` (lista de lugares del MD).
  2. `npm run fetch:block -- <block-id>` para guardar `data/places/<block-id>.json`.
  3. `npm run routes:block -- <block-id>` para guardar `data/routes/<block-id>.json`.
  4. `npm run build:map -- <block-id>` para generar `maps/<block-id>.kml`.
  Si querés regenerar todo de una vez, mantené `data/places-input.json` con todos los bloques y usá `./run-fetch.sh`, `./run-directions.sh`, `npm run build:maps`.

### Render de mapas (PNG listos para My Maps)
- **Prerequisitos**: `npm install` ya trae Puppeteer y conversores. Para tener etiquetas de Google en inglés/español, agregá `GOOGLE_MAPS_API_KEY=<tu_key>` al `.env`. Si no hay key, el render usa OpenStreetMap por defecto.
- **Panorámico por bloque**: `npm run render:block -- <block-id>` crea `maps/<block-id>.png` con la ruta, pines numerados y lista lateral.
- **Detalles por tramo**: sumá `--chunk-size=N` para generar además `maps/<block-id>-detalle-XX.png`, cada uno centrado en N paradas consecutivas (útil para itinerarios largos).
- **Mapas por lotes**: corré el script en un loop (`for id in ...; do npm run render:block -- $id; done`) para regenerar todos los bloques. Cada PNG queda en `maps/` (3‑6 MB aprox.).

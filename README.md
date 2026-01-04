# Itinerarios Tokio – primavera 2026

Repositorio con bloques modulares para planear un viaje de 21 de marzo al 11 de abril de 2026 en Tokio y alrededores. Cada bloque describe un día completo en formato Markdown (concepto, estructura, paradas clave, consejos prácticos y notas de temporada: sakura, eventos, horarios).

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

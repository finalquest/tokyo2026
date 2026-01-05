# Plan de renderizado CLI (KML → PNG)

## Objetivo
Generar capturas PNG homogéneas de cada bloque utilizando únicamente los `.kml` existentes en `maps/`, sin depender de servicios externos. El proceso debe ser reproducible desde scripts Node y correr en lote si es necesario.

## Flujo propuesto
1. **Entrada**: `maps/<block-id>.kml`.
2. **Conversión**: usar `@tmcw/togeojson` + `jsdom` para transformar el KML en GeoJSON en memoria (sin crear archivos intermedios).
3. **Render HTML**: armar un HTML temporal que carga MapLibre GL desde CDN (estilo `https://demotiles.maplibre.org/style.json`), inyecta el GeoJSON y dibuja:
   - Círculos/labels para los `Point` numerados según su orden.
   - Líneas (`LineString`) para los tramos de ruta.
   - Ajuste automático de bounds (`map.fitBounds`) con padding para asegurar que todo el recorrido entra en la vista.
4. **Screenshot**: lanzar Puppeteer en modo headless, abrir el HTML, esperar a que `window.renderDone === true` y generar `maps/<block-id>.png`.

## Dependencias nuevas
- `puppeteer`
- `@tmcw/togeojson`
- `jsdom`
(MapLibre GL se usará vía CDN en el HTML, por lo que no se instala como dependencia local.)

## Scripts previstos
- `scripts/render-map-block.js`: recibe `<block-id>` como argumento, realiza todo el pipeline para un bloque y guarda el PNG en `maps/`.
- (Opcional) `scripts/render-maps.js`: recorre todos los `.kml` y llama internamente al renderizador por bloque.
- `package.json`: agregar scripts `render:block` y `render:all` para facilitar la ejecución.

## Checklist de implementación
- [x] **Instalar dependencias**  
  `npm install puppeteer @tmcw/togeojson jsdom`
- [x] **Crear `scripts/render-map-block.js`**  
  - Validar argumento y existencia del `.kml`.  
  - Convertir a GeoJSON (separar puntos/líneas, calcular bounds).  
  - Generar HTML embebiendo los datos y la lógica MapLibre.  
  - Ejecutar Puppeteer para capturar `maps/<block-id>.png`.  
  - Manejar errores (KML faltante, timeouts).
- [ ] **Crear (opcional) `scripts/render-maps.js`** para procesar todos los KML en lote.
- [x] **Actualizar `package.json`** con los scripts `render:block` y `render:all`.
- [x] **Probar con un bloque** (`npm run render:block -- 34-ginza-nihonbashi`) y verificar el PNG.
- [ ] **Documentar** en `README.md` o `PLAN_MAPS.md` cómo se usa el renderizador y requisitos (Chromium auto-descargado por Puppeteer).
- [ ] **Definir política de versionado** de los PNG (agregar a `.gitignore` si no se versionan, o lo contrario).

Vamos marcando cada ítem al completarlo para mantener tracking del progreso.

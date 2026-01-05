# Plan de implementación – Mapas por bloque

## Objetivo
Generar automáticamente un mapa (KML listo para Google My Maps) por cada bloque del itinerario, usando los lugares descritos en los archivos Markdown y obteniendo coordenadas vía Google Places API. El flujo debe ser reproducible con scripts en Node.js.

## Tareas
1. **Preparar entorno Node.js**
   - Inicializar `package.json` si no existe.
   - Crear directorio `scripts/`.
   - Añadir dependencias: `@googlemaps/google-maps-services-js`, `dotenv`, `axios` (opcional), convertidor KML (ej. `tokml`).

2. **Configurar variables sensibles**
   - Crear `.env` (no versionado) con `GOOGLE_MAPS_API_KEY`.
   - Instrucción para exportar la key si se corre el script fuera de npm.

3. **Definir lista de lugares por bloque**
   - Leer cada `bloques/**/NN-nombre.md` y registrar manualmente los sitios relevantes.
   - Guardar esa lista en `data/places-input.json` con formato:
     ```json
     {
       "1-asakusa": [
         {"name": "Sensō-ji", "hint": "Asakusa"},
         ...
       ]
     }
     ```
   - Este archivo se mantiene a mano (se revisa/edita antes de llamar a la API).

4. **Resolución de coordenadas**
   - Script `scripts/fetch-places.js` que lea `data/places-input.json`, consulte la API de Google Places (Find Place + detalles) y genere `data/places.json` con latitud, longitud, `place_id` y dirección.
   - Debe incluir cache (no repetir consultas si el lugar ya está en `data/places.json`).

5. **Rutas (Directions API)**
   - Script `scripts/fetch-directions.js` que lea `data/places.json` y llame a Directions API para cada par consecutivo dentro de un bloque.
   - Produce `data/routes.json` con los polylines decodificables.
   - Se ejecuta con la misma key (`npm run routes`) y se recomienda correrlo en la máquina local.

6. **Generación de mapas**
   - Script `scripts/build-maps.js` que lea `data/places.json` y genere `maps/NN-nombre.kml` listo para importar en Google My Maps (se arma un GeoJSON en memoria y luego se convierte con `tokml`).
   - Si existe `data/routes.json`, agrega las `LineString` con los recorridos.

6. **Documentar uso**
   - Actualizar `README.md` con instrucciones para correr `npm run extract`, `npm run fetch`, `npm run build:maps` y dónde se ubican los outputs.

## Requerimientos externos
- API Key de Google Maps con acceso a Places (Find Place, Place Details).
- Acceso a internet para ejecutar `npm run fetch` (las demás tareas pueden offline).

## Flujo resumido
```bash
# Completar data/places-input.json a mano
npm run fetch       # usa Google Places API → data/places.json
npm run routes      # Directions API → data/routes.json
npm run build:maps  # crea maps/*.kml
```

Repetir cuando se agreguen nuevos bloques o cambios de lugares.

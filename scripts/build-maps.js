#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import tokml from 'tokml';
import { decode } from '@googlemaps/polyline-codec';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const dataPath = path.join(rootDir, 'data', 'places.json');
if (!fs.existsSync(dataPath)) {
  console.error('Falta data/places.json. Corré npm run fetch primero.');
  process.exit(1);
}

const places = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const routesPath = path.join(rootDir, 'data', 'routes.json');
let routes = {};
if (fs.existsSync(routesPath)) {
  routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));
}
const mapsDir = path.join(rootDir, 'maps');
fs.mkdirSync(mapsDir, { recursive: true });

for (const [block, points] of Object.entries(places)) {
  const features = points.map((p, idx) => ({
    type: 'Feature',
    properties: {
      name: `${idx + 1}. ${p.name}`,
      address: p.address,
      place_id: p.place_id,
    },
    geometry: {
      type: 'Point',
      coordinates: [p.lng, p.lat],
    },
  }));
  const routeSegments = routes[block] || [];
  for (const seg of routeSegments) {
    try {
      const coords = decode(seg.polyline).map(([lat, lng]) => [lng, lat]);
      features.push({
        type: 'Feature',
        properties: {
          name: `${seg.from} → ${seg.to}`,
          distance: seg.distance,
          duration: seg.duration,
          type: 'route',
        },
        geometry: { type: 'LineString', coordinates: coords },
      });
    } catch (err) {
      console.warn(`No se pudo decodificar ruta ${seg.from} → ${seg.to}: ${err.message}`);
    }
  }

  const geojson = { type: 'FeatureCollection', features };
  const kml = tokml(geojson, {
    name: 'properties.name',
    description: (props) => props.address,
  });
  const kmlPath = path.join(mapsDir, `${block}.kml`);
  fs.writeFileSync(kmlPath, kml);

  console.log(`Mapa generado: ${block}.kml`);
}

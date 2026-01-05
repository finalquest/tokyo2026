#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client } from '@googlemaps/google-maps-services-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env') });
const apiKey = process.env.GOOGLE_MAPS_API_KEY;
if (!apiKey) {
  console.error('GOOGLE_MAPS_API_KEY no está definida.');
  process.exit(1);
}

const placesPath = path.join(rootDir, 'data', 'places.json');
if (!fs.existsSync(placesPath)) {
  console.error('Falta data/places.json. Corré npm run fetch primero.');
  process.exit(1);
}

const places = JSON.parse(fs.readFileSync(placesPath, 'utf8'));
let routes = {};
const routesPath = path.join(rootDir, 'data', 'routes.json');
if (fs.existsSync(routesPath)) {
  routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));
}

const client = new Client({});

for (const [block, points] of Object.entries(places)) {
  if (points.length < 2) {
    console.log(`[${block}] menos de 2 puntos, se salta`);
    continue;
  }
  routes[block] = routes[block] || [];
  const pendingSegments = [];
  const existing = new Set(routes[block].map((seg) => `${seg.from}->${seg.to}`));
  console.log(`[${block}] Calculando ${points.length - 1} tramos…`);
  for (let i = 0; i < points.length - 1; i += 1) {
    const from = points[i];
    const to = points[i + 1];
    const key = `${from.name}->${to.name}`;
    if (existing.has(key)) continue;
    pendingSegments.push({ from, to, key });
  }
  if (!pendingSegments.length) {
    console.log(`[${block}] todos los tramos ya cacheados`);
    continue;
  }
  for (const { from, to, key } of pendingSegments) {
    console.log(`  -> ${key}`);
    try {
      const resp = await client.directions({
        params: {
          origin: { lat: from.lat, lng: from.lng },
          destination: { lat: to.lat, lng: to.lng },
          mode: 'walking',
          key: apiKey,
        },
      });
      const route = resp.data.routes[0];
      if (!route || !route.overview_polyline) {
        console.warn(`  !! sin ruta para ${key}`);
        continue;
      }
      const leg = route.legs[0];
      routes[block].push({
        from: from.name,
        to: to.name,
        polyline: route.overview_polyline.points,
        distance: leg?.distance?.text || '',
        duration: leg?.duration?.text || '',
      });
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      console.error(`  !! Error con ${key}: ${err.message}`);
    }
  }
  console.log(`[${block}] Segmentos guardados: ${routes[block].length}`);
}

fs.writeFileSync(routesPath, JSON.stringify(routes, null, 2));
console.log(`Guardado ${routesPath}`);

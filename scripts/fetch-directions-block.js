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

const blockId = process.argv[2];
if (!blockId) {
  console.error('Uso: npm run routes:block -- <block-id>');
  process.exit(1);
}

const blockPlacesPath = path.join(rootDir, 'data', 'places', `${blockId}.json`);
if (!fs.existsSync(blockPlacesPath)) {
  console.error(`Falta ${blockPlacesPath}. Corré fetch:block primero.`);
  process.exit(1);
}
const points = JSON.parse(fs.readFileSync(blockPlacesPath, 'utf8'));
if (!points || points.length < 2) {
  console.error(`Bloque ${blockId} necesita al menos 2 puntos.`);
  process.exit(1);
}

const blockRoutesPath = path.join(rootDir, 'data', 'routes', `${blockId}.json`);
fs.mkdirSync(path.dirname(blockRoutesPath), { recursive: true });
let routes = [];
if (fs.existsSync(blockRoutesPath)) {
  routes = JSON.parse(fs.readFileSync(blockRoutesPath, 'utf8'));
}
const entryByKey = new Map(routes.map((seg) => [`${seg.from}->${seg.to}`, seg]));

const client = new Client({});
const pending = [];
for (let i = 0; i < points.length - 1; i += 1) {
  const from = points[i];
  const to = points[i + 1];
  const key = `${from.name}->${to.name}`;
  if (entryByKey.has(key)) continue;
  pending.push({ from, to, key });
}

if (!pending.length) {
  console.log(`[${blockId}] rutas ya cacheadas`);
  fs.writeFileSync(blockRoutesPath, JSON.stringify(routes, null, 2));
  process.exit(0);
}

console.log(`[${blockId}] calculando ${pending.length} tramos…`);
for (const { from, to, key } of pending) {
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
    const seg = {
      from: from.name,
      to: to.name,
      polyline: route.overview_polyline.points,
      distance: leg?.distance?.text || '',
      duration: leg?.duration?.text || '',
    };
    routes.push(seg);
    entryByKey.set(key, seg);
    await new Promise((r) => setTimeout(r, 250));
  } catch (err) {
    console.error(`  !! error con ${key}: ${err.message}`);
  }
}

fs.writeFileSync(blockRoutesPath, JSON.stringify(routes, null, 2));
console.log(`[${blockId}] rutas actualizadas en ${blockRoutesPath}`);

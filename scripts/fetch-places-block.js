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
  console.error('Uso: npm run fetch:block -- <block-id>');
  process.exit(1);
}

const blockInput = path.join(rootDir, 'data', 'places-input', `${blockId}.json`);
if (!fs.existsSync(blockInput)) {
  console.error(`No existe ${blockInput}`);
  process.exit(1);
}
const items = JSON.parse(fs.readFileSync(blockInput, 'utf8'));

const blockPlacesPath = path.join(rootDir, 'data', 'places', `${blockId}.json`);
fs.mkdirSync(path.dirname(blockPlacesPath), { recursive: true });
let cache = [];
if (fs.existsSync(blockPlacesPath)) {
  cache = JSON.parse(fs.readFileSync(blockPlacesPath, 'utf8'));
}

const stopWords = new Set(['gate','temple','shrine','station','street','shopping','garden','park','bridge','museum','cafe','coffee','valley','river','lake','pond','tower','building','rooftop','shotengai','dori','avenue','plaza','district','historic','market']);
const normalize = (str='') => str.toString().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/[^a-z0-9]/g,' ').split(/\s+/).filter((w)=>w && !stopWords.has(w)).join('');

const client = new Client({});
const entryByNorm = new Map();
cache.forEach((entry) => {
  entry.aliases = Array.isArray(entry.aliases) ? entry.aliases : [];
  entryByNorm.set(normalize(entry.name), entry);
  entry.aliases.forEach((alias) => entryByNorm.set(normalize(alias), entry));
});

const pending = [];
for (const item of items) {
  const norm = normalize(item.name);
  const match = entryByNorm.get(norm);
  if (match) {
    if (!match.aliases.includes(item.name)) {
      match.aliases.push(item.name);
      entryByNorm.set(norm, match);
    }
  } else {
    pending.push(item);
  }
}

if (!pending.length) {
  console.log(`[${blockId}] sin pendientes (todo cacheado)`);
  fs.writeFileSync(blockPlacesPath, JSON.stringify(cache, null, 2));
  process.exit(0);
}

console.log(`[${blockId}] resolviendo ${pending.length} lugares…`);
for (const item of pending) {
  const query = `${item.name}, ${item.hint || 'Tokyo'}`;
  console.log(`  -> ${query}`);
  try {
    const resp = await client.findPlaceFromText({
      params: {
        input: query,
        inputtype: 'textquery',
        fields: ['place_id', 'name', 'formatted_address', 'geometry'],
        key: apiKey,
      },
    });
    const candidate = resp.data.candidates[0];
    if (!candidate) {
      console.warn(`  !! no se encontró ${query}`);
      continue;
    }
    const record = {
      name: candidate.name,
      address: candidate.formatted_address,
      lat: candidate.geometry.location.lat,
      lng: candidate.geometry.location.lng,
      place_id: candidate.place_id,
      aliases: [item.name],
    };
    cache.push(record);
    const norm = normalize(candidate.name);
    entryByNorm.set(norm, record);
    record.aliases.forEach((alias) => entryByNorm.set(normalize(alias), record));
    await new Promise((r) => setTimeout(r, 150));
  } catch (err) {
    console.error(`  !! error con ${query}: ${err.message}`);
  }
}

fs.writeFileSync(blockPlacesPath, JSON.stringify(cache, null, 2));
console.log(`[${blockId}] actualizado en ${blockPlacesPath}`);

#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Client } from "@googlemaps/google-maps-services-js";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(rootDir, ".env") });
const apiKey = process.env.GOOGLE_MAPS_API_KEY;
if (!apiKey) {
  console.error(
    "Error: GOOGLE_MAPS_API_KEY no está definido. Cargalo en .env.",
  );
  process.exit(1);
}

const input = {};
const globalInputPath = path.join(rootDir, "data", "places-input.json");
if (fs.existsSync(globalInputPath)) {
  Object.assign(
    input,
    JSON.parse(fs.readFileSync(globalInputPath, "utf8")),
  );
}
const inputDir = path.join(rootDir, "data", "places-input");
if (fs.existsSync(inputDir)) {
  for (const file of fs.readdirSync(inputDir)) {
    if (!file.endsWith(".json")) continue;
    input[path.basename(file, ".json")] = JSON.parse(
      fs.readFileSync(path.join(inputDir, file), "utf8"),
    );
  }
}
if (!Object.keys(input).length) {
  console.error("No hay archivos en data/places-input*. Nada que hacer.");
  process.exit(1);
}
let cache = {};
const cachePath = path.join(rootDir, "data", "places.json");
if (fs.existsSync(cachePath)) {
  cache = JSON.parse(fs.readFileSync(cachePath, "utf8"));
}

const client = new Client({});

const stopWords = new Set([
  "gate",
  "temple",
  "shrine",
  "station",
  "street",
  "shopping",
  "garden",
  "park",
  "bridge",
  "museum",
  "cafe",
  "coffee",
  "valley",
  "river",
  "lake",
  "pond",
  "tower",
  "building",
  "rooftop",
  "shotengai",
  "dori",
  "dōri",
  "avenue",
  "plaza",
  "district",
  "historic",
  "market",
]);

const normalize = (str = "") =>
  str
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]/g, " ")
    .split(/\s+/)
    .filter((word) => word && !stopWords.has(word))
    .join("");

const updatedBlocks = new Set();

for (const [block, items] of Object.entries(input)) {
  cache[block] = cache[block] || [];
  const entryByNorm = new Map();
  cache[block].forEach((entry) => {
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
      continue;
    }
    pending.push(item);
  }
  if (!pending.length) {
    console.log(`[${block}] ${cache[block].length} lugares ya cacheados`);
    continue;
  }
  console.log(`[${block}] Resolviendo ${pending.length} lugares…`);
  for (const item of pending) {
    const query = `${item.name}, ${item.hint || "Tokyo"}`;
    console.log(`  -> ${query}`);
    try {
      const resp = await client.findPlaceFromText({
        params: {
          input: query,
          inputtype: "textquery",
          fields: ["place_id", "name", "formatted_address", "geometry"],
          key: apiKey,
        },
      });
      const candidate = resp.data.candidates[0];
      if (!candidate) {
        console.warn(`  !! No se encontró ${query}`);
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
      cache[block].push(record);
      const norm = normalize(candidate.name);
      entryByNorm.set(norm, record);
      record.aliases.forEach((alias) => entryByNorm.set(normalize(alias), record));
      updatedBlocks.add(block);
      await new Promise((r) => setTimeout(r, 150));
    } catch (err) {
      console.error(`  !! Error con ${query}: ${err.message}`);
    }
  }
  console.log(`[${block}] Total registrados: ${cache[block].length}`);
}

if (updatedBlocks.size) {
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
  console.log(`Guardado ${cachePath}`);
} else {
  console.log("No hubo cambios; cache existente OK.");
}

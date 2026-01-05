#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import tokml from "tokml";
import polyline from "@googlemaps/polyline-codec";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const blockId = process.argv[2];
if (!blockId) {
  console.error("Uso: npm run build:map -- <block-id>");
  process.exit(1);
}

const blockPlacesPath = path.join(rootDir, "data", "places", `${blockId}.json`);
if (!fs.existsSync(blockPlacesPath)) {
  console.error(`Falta ${blockPlacesPath}. Corré fetch:block primero.`);
  process.exit(1);
}
const points = JSON.parse(fs.readFileSync(blockPlacesPath, "utf8"));
if (!points.length) {
  console.error(`No hay lugares para bloque ${blockId}`);
  process.exit(1);
}

const blockRoutesPath = path.join(rootDir, "data", "routes", `${blockId}.json`);
const routeSegments = fs.existsSync(blockRoutesPath)
  ? JSON.parse(fs.readFileSync(blockRoutesPath, "utf8"))
  : [];

const features = points.map((p, idx) => ({
  type: "Feature",
  properties: {
    name: `${idx + 1}. ${p.name}`,
    address: p.address,
    place_id: p.place_id,
    type: "point",
  },
  geometry: {
    type: "Point",
    coordinates: [p.lng, p.lat],
  },
}));

for (const seg of routeSegments) {
  try {
    const coords = polyline
      .decode(seg.polyline)
      .map(([lat, lng]) => [lng, lat]);
    features.push({
      type: "Feature",
      properties: {
        name: `${seg.from} → ${seg.to}`,
        distance: seg.distance,
        duration: seg.duration,
        type: "route",
      },
      geometry: {
        type: "LineString",
        coordinates: coords,
      },
    });
  } catch (err) {
    console.warn(
      `No se pudo decodificar ruta ${seg.from} → ${seg.to}: ${err.message}`,
    );
  }
}

const geojson = { type: "FeatureCollection", features };
const mapsDir = path.join(rootDir, "maps");
fs.mkdirSync(mapsDir, { recursive: true });
const kml = tokml(geojson, {
  name: "properties.name",
  description: (props) =>
    `${props.address || ""} ${props.distance || ""} ${props.duration || ""}`.trim(),
});
fs.writeFileSync(path.join(mapsDir, `${blockId}.kml`), kml);
console.log(`Mapa generado: ${blockId}.kml`);

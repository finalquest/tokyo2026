#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";
import { kml as kmlToGeoJSON } from "@tmcw/togeojson";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const blockId = process.argv[2];
if (!blockId) {
  console.error("Uso: npm run render:block -- <block-id>");
  process.exit(1);
}

const mapKmlPath = path.join(rootDir, "maps", `${blockId}.kml`);
if (!fs.existsSync(mapKmlPath)) {
  console.error(`No existe ${mapKmlPath}. Generá el KML primero con build:map.`);
  process.exit(1);
}

const kmlContent = fs.readFileSync(mapKmlPath, "utf8");
const dom = new JSDOM(kmlContent, { contentType: "text/xml" });
const geojson = kmlToGeoJSON(dom.window.document);

const features = geojson?.features || [];
if (!features.length) {
  console.error(`El archivo ${mapKmlPath} no contiene features renderizables.`);
  process.exit(1);
}

const pointFeatures = [];
const lineFeatures = [];

for (const feature of features) {
  const geometryType = feature.geometry?.type;
  if (!geometryType) continue;
  if (geometryType === "Point") {
    pointFeatures.push(feature);
  } else if (geometryType === "LineString" || geometryType === "MultiLineString") {
    lineFeatures.push(feature);
  }
}

const orderedPoints = pointFeatures.map((feature, idx) => ({
  ...feature,
  properties: {
    ...feature.properties,
    order: idx + 1,
  },
}));

const pointsCollection = {
  type: "FeatureCollection",
  features: orderedPoints,
};

const linesCollection = {
  type: "FeatureCollection",
  features: lineFeatures,
};

const bounds = calculateBounds(features);
const fallbackCenter = [139.767125, 35.681236]; // Tokyo Station
const center = bounds
  ? [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2]
  : fallbackCenter;

const html = buildHtml({
  blockId,
  points: pointsCollection,
  lines: linesCollection,
  bounds,
  center,
});

const outputPngPath = path.join(rootDir, "maps", `${blockId}.png`);

async function renderScreenshot() {
  const browser = await puppeteer.launch({
    defaultViewport: { width: 1280, height: 960, deviceScaleFactor: 2 },
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.waitForFunction("window.renderDone === true", { timeout: 20000 });
    await page.screenshot({ path: outputPngPath, type: "png" });
    console.log(`PNG generado: ${outputPngPath}`);
  } finally {
    await browser.close();
  }
}

renderScreenshot().catch((err) => {
  console.error(`Fallo al renderizar ${blockId}:`, err);
  process.exit(1);
});

function calculateBounds(allFeatures) {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  for (const feature of allFeatures) {
    const coords = extractCoordinates(feature.geometry);
    for (const [lng, lat] of coords) {
      minLng = Math.min(minLng, lng);
      minLat = Math.min(minLat, lat);
      maxLng = Math.max(maxLng, lng);
      maxLat = Math.max(maxLat, lat);
    }
  }

  if (
    !Number.isFinite(minLng) ||
    !Number.isFinite(minLat) ||
    !Number.isFinite(maxLng) ||
    !Number.isFinite(maxLat)
  ) {
    return null;
  }
  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}

function extractCoordinates(geometry) {
  if (!geometry) return [];
  if (geometry.type === "Point") {
    return [geometry.coordinates];
  }
  if (geometry.type === "LineString") {
    return geometry.coordinates;
  }
  if (geometry.type === "MultiLineString") {
    return geometry.coordinates.flat();
  }
  if (geometry.type === "GeometryCollection") {
    return geometry.geometries.flatMap((geom) => extractCoordinates(geom));
  }
  return [];
}

function buildHtml({ blockId: id, points, lines, bounds: mapBounds, center: mapCenter }) {
  const maplibreVersion = "4.7.1";
  const fitBounds = mapBounds ? JSON.stringify(mapBounds) : "null";
  const rasterStyle = {
    version: 8,
    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
    sources: {
      "osm-tiles": {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxzoom: 19,
      },
    },
    layers: [
      {
        id: "osm-tiles",
        type: "raster",
        source: "osm-tiles",
      },
    ],
  };
  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Mapa ${id}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@${maplibreVersion}/dist/maplibre-gl.css" />
    <style>
      html, body { margin: 0; padding: 0; height: 100%; }
      #map { width: 100%; height: 100%; }
      .maplibregl-ctrl-top-right { margin-top: 12px; margin-right: 12px; }
      .pin {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-family: "Open Sans", "Arial Unicode MS", sans-serif;
        font-size: 12px;
        font-weight: 600;
      }
      .pin-dot {
        width: 20px;
        height: 20px;
        border-radius: 999px;
        background: #003566;
        border: 2px solid #fbb317;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        line-height: 1;
        box-shadow: 0 0 4px rgba(0,0,0,0.35);
      }
      .pin-label {
        background: rgba(255,255,255,0.95);
        border-radius: 4px;
        padding: 2px 6px;
        color: #111111;
        text-shadow: 0 0 2px rgba(255,255,255,0.5);
        box-shadow: 0 1px 4px rgba(0,0,0,0.2);
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/maplibre-gl@${maplibreVersion}/dist/maplibre-gl.js"></script>
    <script>
      const pointData = ${JSON.stringify(points)};
      const lineData = ${JSON.stringify(lines)};
      const center = ${JSON.stringify(mapCenter)};
      const bounds = ${fitBounds};
      const baseStyle = ${JSON.stringify(rasterStyle)};

      const map = new maplibregl.Map({
        container: "map",
        style: baseStyle,
        center,
        zoom: 12
      });
      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");

      map.on("load", () => {
        if (lineData.features.length) {
          map.addSource("routes", { type: "geojson", data: lineData });
          map.addLayer({
            id: "route-lines",
            type: "line",
            source: "routes",
            paint: {
              "line-color": "#f72585",
              "line-width": 4,
              "line-opacity": 0.85
            }
          });
        }

        pointData.features.forEach((feature) => {
          if (!feature.geometry || feature.geometry.type !== "Point") return;
          const coords = feature.geometry.coordinates;
          if (!Array.isArray(coords) || coords.length < 2) return;
          const order = feature.properties?.order ?? "";
          const labelText = feature.properties?.name || "";

          const markerEl = document.createElement("div");
          markerEl.className = "pin";

          const dotEl = document.createElement("div");
          dotEl.className = "pin-dot";
          dotEl.textContent = order.toString();

          const labelEl = document.createElement("div");
          labelEl.className = "pin-label";
          labelEl.textContent = labelText;

          markerEl.appendChild(dotEl);
          markerEl.appendChild(labelEl);

          new maplibregl.Marker({ element: markerEl, anchor: "left" })
            .setLngLat(coords)
            .addTo(map);
        });

        if (bounds) {
          map.fitBounds(bounds, { padding: 80, linear: true, maxZoom: 16 });
        } else {
          map.setCenter(center);
          map.setZoom(12);
        }

        map.once("idle", () => {
          setTimeout(() => {
            window.renderDone = true;
          }, 500);
        });
      });
    </script>
  </body>
</html>`;
}

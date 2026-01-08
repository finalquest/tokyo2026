#!/usr/bin/env node
import "dotenv/config";
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

const chunkSize = parseChunkSize(process.argv.slice(3));
const googleApiKey = process.env.GOOGLE_MAPS_API_KEY?.trim() || null;

renderAllVariants().catch((err) => {
  console.error(`Fallo al renderizar ${blockId}:`, err);
  process.exit(1);
});

async function renderAllVariants() {
  await renderVariant({
    blockId,
    points: pointsCollection,
    lines: linesCollection,
    bounds,
    center,
    legendTitle: "Paradas",
    outputPath: path.join(rootDir, "maps", `${blockId}.png`),
    apiKey: googleApiKey,
  });

  if (chunkSize && chunkSize > 0) {
    const chunks = createPointChunks(orderedPoints, chunkSize);
    for (let i = 0; i < chunks.length; i++) {
      const chunkPoints = chunks[i];
      const chunkCollection = { type: "FeatureCollection", features: chunkPoints };
      const chunkBounds = calculateBounds(chunkPoints);
      const chunkCenter = chunkBounds
        ? [(chunkBounds[0][0] + chunkBounds[1][0]) / 2, (chunkBounds[0][1] + chunkBounds[1][1]) / 2]
        : center;
      const chunkLines = filterLinesForBounds(lineFeatures, chunkBounds, 0.002);
      const linesCollectionChunk = { type: "FeatureCollection", features: chunkLines };
      const outputPath = path.join(
        rootDir,
        "maps",
        `${blockId}-detalle-${String(i + 1).padStart(2, "0")}.png`,
      );
      await renderVariant({
        blockId: `${blockId} detalle ${i + 1}`,
        points: chunkCollection,
        lines: linesCollectionChunk,
        bounds: chunkBounds,
        center: chunkCenter,
        legendTitle: `Detalle tramo ${i + 1}`,
        outputPath,
        apiKey: googleApiKey,
      });
    }
  }
}

async function renderVariant({
  blockId: variantId,
  points,
  lines,
  bounds: variantBounds,
  center: variantCenter,
  legendTitle,
  apiKey,
  outputPath,
}) {
  const provider = apiKey ? "google" : "osm";
  const html = provider === "google"
    ? buildGoogleHtml({
        blockId: variantId,
        points,
        lines,
        bounds: variantBounds,
        center: variantCenter,
        legendTitle,
        apiKey,
      })
    : buildOsmHtml({
        blockId: variantId,
        points,
        lines,
        bounds: variantBounds,
        center: variantCenter,
        legendTitle,
      });
  const browser = await puppeteer.launch({
    defaultViewport: { width: 1280, height: 960, deviceScaleFactor: 2 },
  });
  try {
    const page = await browser.newPage();
    page.on("console", (msg) => {
      const type = msg.type().toUpperCase();
      console.log(`[${variantId}] ${type}: ${msg.text()}`);
    });
    page.on("pageerror", (err) => {
      console.error(`[${variantId}] Page error:`, err);
    });
    await page.setContent(html, { waitUntil: "networkidle0" });
    try {
      await page.waitForFunction("window.renderDone === true", { timeout: 20000 });
    } catch (err) {
      console.warn(
        `Render de ${variantId} no confirmó finalización a tiempo (${err.message}). Se fuerza captura tras espera fija.`,
      );
      await page.waitForTimeout(2000);
    }
    await page.screenshot({
      path: outputPath,
      type: "png",
      omitBackground: false,
    });
    console.log(`PNG generado: ${outputPath}`);
  } finally {
    await browser.close();
  }
}

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

function buildGoogleHtml({
  blockId: id,
  points,
  lines,
  bounds: mapBounds,
  center: mapCenter,
  legendTitle,
  apiKey,
}) {
  const fitBounds = mapBounds ? JSON.stringify(mapBounds) : "null";
  const centerLatLng = { lat: mapCenter[1], lng: mapCenter[0] };
  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Mapa ${id}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      html, body { margin: 0; padding: 0; height: 100%; }
      #map { width: 100%; height: 100%; }
      .maplibregl-ctrl-top-right { margin-top: 12px; margin-right: 12px; }
      .pin {
        display: inline-flex;
        align-items: center;
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
      #legend {
        position: absolute;
        top: 16px;
        left: 16px;
        background: rgba(255,255,255,0.95);
        padding: 12px 16px;
        border-radius: 8px;
        max-width: 320px;
        font-family: "Open Sans", "Arial Unicode MS", sans-serif;
        font-size: 12px;
        line-height: 1.4;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
      #legend h2 {
        font-size: 14px;
        margin: 0 0 6px;
      }
      #legend ul {
        margin: 0;
        padding-left: 18px;
      }
      #legend li {
        margin-bottom: 4px;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <div id="legend"></div>
    <script async defer src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&language=en&callback=initMap&v=weekly"></script>
    <script>
      const pointData = ${JSON.stringify(points)};
      const lineData = ${JSON.stringify(lines)};
      const center = ${JSON.stringify(centerLatLng)};
      const bounds = ${fitBounds};

      function initMap() {
        const baseStyles = [
          {
            featureType: "poi",
            elementType: "labels.icon",
            stylers: [{ visibility: "on" }]
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#2c2c2c" }]
          },
          {
            featureType: "poi.business",
            elementType: "labels.icon",
            stylers: [{ visibility: "on" }]
          },
          {
            featureType: "poi.business",
            elementType: "labels.text.fill",
            stylers: [{ color: "#2a3f5f" }]
          },
          {
            featureType: "poi.place_of_worship",
            elementType: "labels.icon",
            stylers: [{ visibility: "on" }]
          },
          {
            featureType: "poi.place_of_worship",
            elementType: "labels.text.fill",
            stylers: [{ color: "#5b3f96" }]
          },
          {
            featureType: "poi.attraction",
            elementType: "labels.icon",
            stylers: [{ visibility: "on" }]
          },
          {
            featureType: "poi.attraction",
            elementType: "labels.text.fill",
            stylers: [{ color: "#134b70" }]
          },
          {
            featureType: "transit",
            elementType: "labels.icon",
            stylers: [{ visibility: "on" }]
          }
        ];

        const map = new google.maps.Map(document.getElementById("map"), {
          center,
          zoom: 13,
          mapTypeId: "roadmap",
          disableDefaultUI: false,
          styles: baseStyles
        });

        const boundsObj = new google.maps.LatLngBounds();
        if (bounds) {
          boundsObj.extend({ lat: bounds[0][1], lng: bounds[0][0] });
          boundsObj.extend({ lat: bounds[1][1], lng: bounds[1][0] });
          map.fitBounds(boundsObj);
        } else {
          map.setCenter(center);
          map.setZoom(13);
        }

        if (lineData.features.length) {
          lineData.features.forEach((feature) => {
            const coords = feature.geometry?.coordinates || [];
            const path = coords.map(([lng, lat]) => ({ lat, lng }));
            if (!path.length) return;
            const polyline = new google.maps.Polyline({
              path,
              geodesic: false,
              strokeColor: "#4285F4",
              strokeOpacity: 1,
              strokeWeight: 5
            });
            polyline.setMap(map);
          });
        }

        const legend = document.getElementById("legend");
        legend.innerHTML = "<h2>${legendTitle || "Paradas"}</h2>";
        const listEl = document.createElement("ul");
        pointData.features
          .slice()
          .sort((a, b) => (a.properties.order || 0) - (b.properties.order || 0))
          .forEach((feature) => {
            const listItem = document.createElement("li");
            const rawName = feature.properties.name || "";
            const cleaned = rawName.replace(/^\\d+\\.\\s*/, "");
            listItem.textContent = \`\${feature.properties.order}. \${cleaned}\`;
            listEl.appendChild(listItem);
          });
        legend.appendChild(listEl);

        pointData.features.forEach((feature) => {
          if (!feature.geometry || feature.geometry.type !== "Point") return;
          const coords = feature.geometry.coordinates;
          if (!Array.isArray(coords) || coords.length < 2) return;
          const order = feature.properties?.order ?? "";
          const rawName = feature.properties?.name || "";
          const cleaned = rawName.replace(/^\\d+\\.\\s*/, "");
          const marker = new google.maps.Marker({
            position: { lat: coords[1], lng: coords[0] },
            map,
            title: \`\${order}. \${cleaned}\`,
            label: order.toString()
          });
          boundsObj.extend(marker.getPosition());
        });

        if (boundsObj && !boundsObj.isEmpty()) {
          map.fitBounds(boundsObj);
        }

        google.maps.event.addListenerOnce(map, "idle", () => {
          setTimeout(() => {
            window.renderDone = true;
          }, 400);
        });
      }

      window.initMap = initMap;
    </script>
  </body>
</html>`;
}

function buildOsmHtml({ blockId: id, points, lines, bounds: mapBounds, center: mapCenter, legendTitle }) {
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
      #legend {
        position: absolute;
        top: 16px;
        left: 16px;
        background: rgba(255,255,255,0.95);
        padding: 12px 16px;
        border-radius: 8px;
        max-width: 320px;
        font-family: "Open Sans", "Arial Unicode MS", sans-serif;
        font-size: 12px;
        line-height: 1.4;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
      #legend h2 {
        font-size: 14px;
        margin: 0 0 6px;
      }
      #legend ul {
        margin: 0;
        padding-left: 18px;
      }
      #legend li {
        margin-bottom: 4px;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <div id="legend"></div>
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

        const legend = document.getElementById("legend");
        legend.innerHTML = "<h2>${legendTitle || "Paradas"}</h2>";
        const listEl = document.createElement("ul");
        pointData.features
          .slice()
          .sort((a, b) => (a.properties.order || 0) - (b.properties.order || 0))
          .forEach((feature) => {
            const listItem = document.createElement("li");
            const rawName = feature.properties.name || "";
            const cleaned = rawName.replace(/^\\d+\\.\\s*/, "");
            listItem.textContent = \`\${feature.properties.order}. \${cleaned}\`;
            listEl.appendChild(listItem);
          });
        legend.appendChild(listEl);

        pointData.features.forEach((feature) => {
          if (!feature.geometry || feature.geometry.type !== "Point") return;
          const coords = feature.geometry.coordinates;
          if (!Array.isArray(coords) || coords.length < 2) return;
          const order = feature.properties?.order ?? "";

          const markerEl = document.createElement("div");
          markerEl.className = "pin";

          const dotEl = document.createElement("div");
          dotEl.className = "pin-dot";
          dotEl.textContent = order.toString();

          markerEl.appendChild(dotEl);

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
function createPointChunks(features, size) {
  const chunks = [];
  for (let i = 0; i < features.length; i += size) {
    chunks.push(features.slice(i, i + size));
  }
  return chunks;
}

function filterLinesForBounds(lines, bounds, padding = 0.002) {
  if (!bounds) return lines;
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  const padded = [
    [minLng - padding, minLat - padding],
    [maxLng + padding, maxLat + padding],
  ];
  return lines.filter((feature) => {
    const coords = extractCoordinates(feature.geometry);
    return coords.some(([lng, lat]) => {
      return lng >= padded[0][0] && lng <= padded[1][0] && lat >= padded[0][1] && lat <= padded[1][1];
    });
  });
}

function parseChunkSize(args) {
  for (const arg of args) {
    if (arg.startsWith("--chunk-size=")) {
      const value = parseInt(arg.split("=")[1], 10);
      if (!Number.isNaN(value) && value > 0) {
        return value;
      }
    }
  }
  return null;
}

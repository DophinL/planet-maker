import { OBJECT_BY_ID } from "../data/objects";
import { PLANETS } from "../data/planets";
import type {
  LightingSettings,
  PlanetId,
  PlanetMarker,
  PlanetText,
  PlacedObject,
  SerializableProject,
  SurfaceSettings,
  Vector3Tuple
} from "../types/editor";

const PLANET_IDS = new Set<PlanetId>([
  "mercury",
  "venus",
  "earth",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "moon",
  "custom"
]);
const BACKGROUNDS = new Set<LightingSettings["background"]>([
  "observatory",
  "deep-space",
  "warm-dusk"
]);
const BUILT_IN_TEXTURES = new Set(PLANETS.map((planet) => planet.texture));

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isText = (value: unknown, maxLength: number): value is string =>
  typeof value === "string" && value.length > 0 && value.length <= maxLength;

const isNumber = (value: unknown, min: number, max: number): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;

const readPosition = (value: unknown): Vector3Tuple | null => {
  if (!Array.isArray(value) || value.length !== 3) return null;
  if (!value.every((item) => isNumber(item, -1.001, 1.001))) return null;
  const length = Math.hypot(value[0], value[1], value[2]);
  if (length < 0.9 || length > 1.1) return null;
  return [value[0] / length, value[1] / length, value[2] / length];
};

const readSurface = (value: unknown): SurfaceSettings | null => {
  if (!isRecord(value)) return null;
  const texture = value.texture;
  const validTexture =
    texture === "" ||
    (typeof texture === "string" && BUILT_IN_TEXTURES.has(texture)) ||
    (typeof texture === "string" && /^data:image\/(?:png|jpeg|webp);base64,/i.test(texture) && texture.length <= 4_500_000);
  if (
    !validTexture ||
    !isText(value.textureName, 120) ||
    !isNumber(value.textureOffset, -0.5, 0.5) ||
    !isNumber(value.roughness, 0.2, 1) ||
    !isNumber(value.relief, 0, 0.16) ||
    !isNumber(value.atmosphere, 0, 0.34) ||
    !isNumber(value.cloudOpacity, 0, 0.9) ||
    typeof value.autoRotate !== "boolean" ||
    !isNumber(value.rotationSpeed, -0.2, 0.2)
  ) return null;
  return value as unknown as SurfaceSettings;
};

const readLighting = (value: unknown): LightingSettings | null => {
  if (!isRecord(value)) return null;
  if (
    !isNumber(value.azimuth, -360, 360) ||
    !isNumber(value.elevation, -90, 90) ||
    !isNumber(value.intensity, 0, 10) ||
    !isNumber(value.ambient, 0, 2) ||
    typeof value.background !== "string" ||
    !BACKGROUNDS.has(value.background as LightingSettings["background"])
  ) return null;
  return value as unknown as LightingSettings;
};

const readObjects = (value: unknown): PlacedObject[] | null => {
  if (!Array.isArray(value) || value.length > 500) return null;
  const result: PlacedObject[] = [];
  for (const item of value) {
    if (!isRecord(item) || !isText(item.id, 100) || !isText(item.assetId, 100)) return null;
    const asset = OBJECT_BY_ID[item.assetId];
    const position = readPosition(item.position);
    if (
      !asset ||
      !position ||
      !isNumber(item.scale, 0.01, 4) ||
      !isNumber(item.rotation, -Math.PI * 2, Math.PI * 2) ||
      !isNumber(item.elevation, 0, 2)
    ) return null;
    result.push({
      id: item.id,
      assetId: asset.id,
      name: asset.name,
      modelUrl: asset.model,
      position,
      scale: item.scale,
      rotation: item.rotation,
      elevation: item.elevation
    });
  }
  return result;
};

const readMarkers = (value: unknown): PlanetMarker[] | null => {
  if (!Array.isArray(value) || value.length > 1_000) return null;
  const result: PlanetMarker[] = [];
  for (const item of value) {
    if (!isRecord(item) || !isText(item.id, 100) || !isText(item.label, 40) || !/^#[0-9a-f]{6}$/i.test(String(item.color))) return null;
    const position = readPosition(item.position);
    if (!position) return null;
    result.push({ id: item.id, label: item.label, color: String(item.color), position });
  }
  return result;
};

const readTexts = (value: unknown): PlanetText[] | null => {
  if (!Array.isArray(value) || value.length > 1_000) return null;
  const result: PlanetText[] = [];
  for (const item of value) {
    if (!isRecord(item) || !isText(item.id, 100) || !isText(item.text, 24) || !/^#[0-9a-f]{6}$/i.test(String(item.color))) return null;
    const position = readPosition(item.position);
    if (!position || !isNumber(item.size, 0.2, 0.9)) return null;
    result.push({ id: item.id, text: item.text, color: String(item.color), size: item.size, position });
  }
  return result;
};

export function parsePlanetProject(value: unknown): SerializableProject {
  if (!isRecord(value) || value.version !== 1 || typeof value.planetId !== "string" || !PLANET_IDS.has(value.planetId as PlanetId)) {
    throw new Error("This is not a supported Planet Maker project.");
  }
  const surface = readSurface(value.surface);
  const lighting = readLighting(value.lighting);
  const objects = readObjects(value.objects);
  const markers = readMarkers(value.markers);
  const texts = readTexts(value.texts);
  if (!surface || !lighting || !objects || !markers || !texts) {
    throw new Error("This project contains missing or invalid settings.");
  }
  return {
    version: 1,
    planetId: value.planetId as PlanetId,
    surface,
    lighting,
    objects,
    markers,
    texts
  };
}

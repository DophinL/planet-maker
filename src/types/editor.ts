export type PlanetId =
  | "mercury"
  | "venus"
  | "earth"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "moon"
  | "custom";

export type ToolId =
  | "terrain"
  | "objects"
  | "markers"
  | "sunlight"
  | "text"
  | "export";

export type Vector3Tuple = [number, number, number];

export interface PlanetProfile {
  id: Exclude<PlanetId, "custom">;
  name: string;
  kicker: string;
  texture: string;
  preview: string;
  cloudTexture?: string;
  ringTexture?: string;
  accent: string;
  atmosphere: string;
  roughness: number;
  relief: number;
  polarScale: number;
  axialTilt: number;
  rotationSpeed: number;
}

export type ObjectCategory = "Places" | "Nature" | "Travel" | "Sky";

export interface ObjectAsset {
  id: string;
  name: string;
  category: ObjectCategory;
  model: string;
  thumbnail: string;
  size: number;
  elevation: number;
  floating?: boolean;
  source: string;
  sourceUrl: string;
  license: "CC0";
}

export interface PlacedObject {
  id: string;
  assetId: string;
  name: string;
  modelUrl: string;
  position: Vector3Tuple;
  scale: number;
  rotation: number;
  elevation: number;
  localOnly?: boolean;
}

export interface PlanetMarker {
  id: string;
  label: string;
  color: string;
  position: Vector3Tuple;
}

export interface PlanetText {
  id: string;
  text: string;
  color: string;
  size: number;
  position: Vector3Tuple;
}

export interface SurfaceSettings {
  texture: string;
  textureName: string;
  textureOffset: number;
  roughness: number;
  relief: number;
  atmosphere: number;
  cloudOpacity: number;
  autoRotate: boolean;
  rotationSpeed: number;
}

export interface LightingSettings {
  azimuth: number;
  elevation: number;
  intensity: number;
  ambient: number;
  background: "observatory" | "deep-space" | "warm-dusk";
}

export type PlacementDraft =
  | { kind: "object"; asset: ObjectAsset | { id: string; name: string; model: string; size: number; elevation: number } }
  | { kind: "marker"; label: string; color: string }
  | { kind: "text"; text: string; color: string; size: number }
  | null;

export interface SerializableProject {
  version: 1;
  planetId: PlanetId;
  surface: SurfaceSettings;
  lighting: LightingSettings;
  objects: PlacedObject[];
  markers: PlanetMarker[];
  texts: PlanetText[];
}

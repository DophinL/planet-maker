import type { ObjectAsset } from "../types/editor";

const asset = (
  id: string,
  name: string,
  category: ObjectAsset["category"],
  size: number,
  elevation: number,
  source: string,
  sourceUrl: string,
  thumbnailExtension: "png" | "jpg",
  floating = false,
  modelName = id
): ObjectAsset => ({
  id,
  name,
  category,
  model: `/assets/models/${modelName}.glb`,
  thumbnail: `/assets/models/thumbnails/${modelName}.${thumbnailExtension}`,
  size,
  elevation,
  floating,
  source,
  sourceUrl,
  license: "CC0"
});

export const OBJECTS: ObjectAsset[] = [
  asset("house", "House", "Places", 0.34, 0, "Kenney", "https://kenney.nl/assets/city-kit-suburban", "png"),
  asset("tent", "Tent", "Places", 0.22, 0, "Kenney", "https://kenney.nl/assets/survival-kit", "png"),
  asset("pine", "Pine", "Nature", 0.3, 0, "Kenney", "https://kenney.nl/assets/nature-kit", "png"),
  asset("canoe", "Canoe", "Travel", 0.3, 0.01, "Kenney", "https://kenney.nl/assets/nature-kit", "png"),
  asset("tree", "Canopy tree", "Nature", 0.38, 0, "Quaternius", "https://poly.pizza/m/qZtx0AHhcy", "jpg"),
  asset("boat", "Fishing boat", "Travel", 0.32, 0.01, "Quaternius", "https://poly.pizza/m/5UEl54KsuC", "jpg"),
  asset("bridge", "Wooden bridge", "Places", 0.42, 0, "Quaternius", "https://poly.pizza/m/Iw8iXLqVs5", "jpg"),
  asset("windmill", "Windmill", "Places", 0.4, 0, "Quaternius", "https://poly.pizza/m/jpHoi9xDLG", "jpg"),
  asset("cottage", "Cottage", "Places", 0.34, 0, "Quaternius", "https://poly.pizza/m/054zKsr7q4", "jpg"),
  asset("port", "Port", "Places", 0.5, 0.01, "Quaternius", "https://poly.pizza/m/Gjt5yMM4Vw", "jpg"),
  asset("bonfire", "Bonfire", "Places", 0.18, 0, "Quaternius", "https://poly.pizza/m/k1e0cOzi8A", "jpg"),
  asset("ship", "Sailing ship", "Travel", 0.5, 0.01, "Quaternius", "https://poly.pizza/m/mEQj2wZ3GC", "jpg"),
  asset("cloud", "Cloud cluster", "Sky", 0.5, 0.65, "hat_my_guy", "https://poly.pizza/m/gEm9CjnS9l", "png", true, "clouds"),
  asset("lighthouse", "Lighthouse", "Places", 0.4, 0, "MaverickFX", "https://poly.pizza/m/KRebJXIRb8", "png"),
  asset("castle", "Castle fortress", "Places", 0.5, 0, "Quaternius", "https://poly.pizza/m/3r6gq3ow6O", "png"),
  asset("bell-tower", "Bell tower", "Places", 0.4, 0, "Quaternius", "https://poly.pizza/m/ux44tbeQvj", "png"),
  asset("fantasy-house", "Fantasy house", "Places", 0.34, 0, "Quaternius", "https://poly.pizza/m/BH2XHWUNmF", "png"),
  asset("encampment", "Encampment", "Places", 0.48, 0, "Quaternius", "https://poly.pizza/m/njoPJEjDQD", "png"),
  asset("town-center", "Town center", "Places", 0.48, 0, "Quaternius", "https://poly.pizza/m/76GTkSh4KM", "png"),
  asset("watch-tower", "Watch tower", "Places", 0.36, 0, "Quaternius", "https://poly.pizza/m/CygapExMf5", "png")
];

export const OBJECT_BY_ID = Object.fromEntries(
  OBJECTS.map((object) => [object.id, object])
) as Record<string, ObjectAsset>;

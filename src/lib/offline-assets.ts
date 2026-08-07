import { OBJECTS } from "../data/objects";
import { PLANETS } from "../data/planets";

const unique = (values: Array<string | undefined>) => [...new Set(values.filter((value): value is string => Boolean(value)))];

export const OFFLINE_TEXTURE_ASSETS = unique(
  PLANETS.flatMap((planet) => [planet.texture, planet.preview, planet.cloudTexture, planet.ringTexture])
);

export const OFFLINE_MODEL_ASSETS = unique(
  OBJECTS.flatMap((object) => [object.model, object.thumbnail])
);

async function cacheGroup(cacheName: string, urls: string[], onProgress: () => void) {
  const cache = await caches.open(cacheName);
  for (const url of urls) {
    const cached = await cache.match(url);
    if (!cached) {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Could not cache ${url}.`);
      await cache.put(url, response);
    }
    onProgress();
  }
}

export async function downloadOfflineLibrary(onProgress: (completed: number, total: number) => void) {
  if (!("caches" in window)) throw new Error("Offline downloads are not supported by this browser.");
  const total = OFFLINE_TEXTURE_ASSETS.length + OFFLINE_MODEL_ASSETS.length;
  let completed = 0;
  const advance = () => {
    completed += 1;
    onProgress(completed, total);
  };
  await cacheGroup("planet-maker-textures-v1", OFFLINE_TEXTURE_ASSETS, advance);
  await cacheGroup("planet-maker-models-v1", OFFLINE_MODEL_ASSETS, advance);
  await navigator.storage?.persist?.();
  return total;
}

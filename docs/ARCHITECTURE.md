# Architecture

Planet Maker is a static React application. The runtime boundary is the browser: there are no API routes, server actions, databases, account systems, or remote asset-generation calls.

## Runtime flow

```text
world picker
  → choose bundled planet or normalize local image
  → lazy-load Three.js editor
  → edit Zustand browser state
  → render scene from serializable layers
  → export PNG, GLB, or project JSON locally
```

The world picker deliberately stays outside the Three.js bundle. This keeps the first screen fast and makes the user's first decision clear.

## State and project files

`src/store/editor-store.ts` is the only mutable project store. Its serializable contract lives in `src/types/editor.ts` and is versioned as `version: 1`. Imported projects pass through `src/lib/project.ts`, which rejects malformed values and rebuilds model URLs from the trusted local catalog.

Persisted layers:

- selected planet and surface settings
- lighting settings
- bundled-object placements
- markers
- text labels

Uploaded GLBs are represented by `blob:` URLs and excluded from persistence and project JSON because those URLs are session-scoped. Large custom surface data URLs are also excluded before they can overflow common `localStorage` limits.

## Scene boundary

`PlanetCanvas.tsx` converts editor state into Three.js objects. It owns the sphere, atmosphere, clouds, rings, backdrops, picking, orbit controls, and visual layers. UI panels do not mutate the Three.js scene directly; they update typed store values.

Spherical positions are stored as normalized `[x, y, z]` tuples. `src/lib/geo.ts` contains conversions and orientation helpers so object, marker, and text placement share one coordinate contract.

## Assets and offline cache

All runtime assets are served from `public/assets`. `vite-plugin-pwa` generates a Workbox service worker that precaches the application shell, planet previews, and the Earth starter set. Other textures and models use on-demand cache-first routes, avoiding a large background download on first visit. `src/lib/offline-assets.ts` powers the explicit **Download offline library** action for users who want all nine planets and 20 GLBs available without a connection.

## Extension points

- Add a planet profile in `src/data/planets.ts` and place its locally licensed texture under `public/assets/planets`.
- Add a CC0 object in `src/data/objects.ts`, add its GLB and thumbnail, and update the third-party notices.
- Add a tool by extending `ToolId`, the rail, a dedicated panel, and the serializable project contract if it owns persistent state.

Keep all new inputs defensive: validate size and type, treat imported JSON as untrusted, and avoid network dependencies in the editing path.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PLANET_BY_ID } from "../data/planets";
import type {
  LightingSettings,
  PlacementDraft,
  PlanetId,
  PlanetMarker,
  PlanetText,
  PlacedObject,
  SerializableProject,
  SurfaceSettings,
  ToolId,
  Vector3Tuple
} from "../types/editor";

const uid = () => crypto.randomUUID();

const defaultLighting: LightingSettings = {
  azimuth: 38,
  elevation: 34,
  intensity: 2.7,
  ambient: 0.42,
  background: "observatory"
};

const surfaceFor = (planetId: PlanetId, customTexture?: string, name?: string): SurfaceSettings => {
  if (planetId === "custom") {
    return {
      texture: customTexture ?? "",
      textureName: name ?? "Custom world",
      textureOffset: 0,
      roughness: 0.78,
      relief: 0.04,
      atmosphere: 0.16,
      cloudOpacity: 0,
      autoRotate: true,
      rotationSpeed: 0.035
    };
  }
  const profile = PLANET_BY_ID[planetId];
  return {
    texture: profile.texture,
    textureName: profile.name,
    textureOffset: 0,
    roughness: profile.roughness,
    relief: profile.relief,
    atmosphere: planetId === "moon" || planetId === "mercury" ? 0.03 : 0.18,
    cloudOpacity: profile.cloudTexture ? 0.62 : 0,
    autoRotate: true,
    rotationSpeed: profile.rotationSpeed
  };
};

interface EditorState {
  planetId: PlanetId;
  activeTool: ToolId;
  panelOpen: boolean;
  surface: SurfaceSettings;
  lighting: LightingSettings;
  objects: PlacedObject[];
  markers: PlanetMarker[];
  texts: PlanetText[];
  placement: PlacementDraft;
  selectedId: string | null;
  choosePlanet: (planetId: PlanetId, customTexture?: string, name?: string) => void;
  setActiveTool: (tool: ToolId) => void;
  setPanelOpen: (open: boolean) => void;
  updateSurface: (patch: Partial<SurfaceSettings>) => void;
  updateLighting: (patch: Partial<LightingSettings>) => void;
  setPlacement: (placement: PlacementDraft) => void;
  placeAt: (position: Vector3Tuple) => void;
  select: (id: string | null) => void;
  updateSelectedObject: (patch: Partial<Pick<PlacedObject, "scale" | "rotation" | "elevation">>) => void;
  removeSelected: () => void;
  clearLayer: (layer: "objects" | "markers" | "texts") => void;
  importProject: (project: SerializableProject) => void;
  serialize: () => SerializableProject;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      planetId: "earth",
      activeTool: "terrain",
      panelOpen: true,
      surface: surfaceFor("earth"),
      lighting: defaultLighting,
      objects: [],
      markers: [],
      texts: [],
      placement: null,
      selectedId: null,
      choosePlanet: (planetId, customTexture, name) =>
        set({
          planetId,
          surface: surfaceFor(planetId, customTexture, name),
          objects: [],
          markers: [],
          texts: [],
          placement: null,
          selectedId: null,
          activeTool: "terrain",
          panelOpen: true
        }),
      setActiveTool: (activeTool) => set({ activeTool, panelOpen: true, placement: null }),
      setPanelOpen: (panelOpen) => set({ panelOpen }),
      updateSurface: (patch) => set((state) => ({ surface: { ...state.surface, ...patch } })),
      updateLighting: (patch) => set((state) => ({ lighting: { ...state.lighting, ...patch } })),
      setPlacement: (placement) => set({ placement, selectedId: null }),
      placeAt: (position) => {
        const placement = get().placement;
        if (!placement) return;
        if (placement.kind === "object") {
          const placed: PlacedObject = {
            id: uid(),
            assetId: placement.asset.id,
            name: placement.asset.name,
            modelUrl: placement.asset.model,
            position,
            scale: placement.asset.size,
            rotation: 0,
            elevation: placement.asset.elevation,
            localOnly: placement.asset.model.startsWith("blob:")
          };
          set((state) => ({ objects: [...state.objects, placed], selectedId: placed.id, placement: null }));
        } else if (placement.kind === "marker") {
          const marker: PlanetMarker = { id: uid(), label: placement.label, color: placement.color, position };
          set((state) => ({ markers: [...state.markers, marker], selectedId: marker.id, placement: null }));
        } else {
          const text: PlanetText = {
            id: uid(),
            text: placement.text,
            color: placement.color,
            size: placement.size,
            position
          };
          set((state) => ({ texts: [...state.texts, text], selectedId: text.id, placement: null }));
        }
      },
      select: (selectedId) => set({ selectedId, placement: null }),
      updateSelectedObject: (patch) =>
        set((state) => ({
          objects: state.objects.map((object) =>
            object.id === state.selectedId ? { ...object, ...patch } : object
          )
        })),
      removeSelected: () =>
        set((state) => ({
          objects: state.objects.filter((item) => item.id !== state.selectedId),
          markers: state.markers.filter((item) => item.id !== state.selectedId),
          texts: state.texts.filter((item) => item.id !== state.selectedId),
          selectedId: null
        })),
      clearLayer: (layer) => set({ [layer]: [], selectedId: null } as Partial<EditorState>),
      importProject: (project) =>
        set({
          planetId: project.planetId,
          surface: project.surface,
          lighting: project.lighting,
          objects: project.objects.filter((object) => !object.localOnly),
          markers: project.markers,
          texts: project.texts,
          placement: null,
          selectedId: null
        }),
      serialize: () => {
        const state = get();
        return {
          version: 1,
          planetId: state.planetId,
          surface: state.surface,
          lighting: state.lighting,
          objects: state.objects.filter((object) => !object.localOnly),
          markers: state.markers,
          texts: state.texts
        };
      }
    }),
    {
      name: "planet-maker-project-v1",
      partialize: (state) => ({
        planetId: state.planetId,
        surface: state.surface.texture.startsWith("data:") && state.surface.texture.length > 3_500_000
          ? { ...state.surface, texture: "", textureName: "Custom texture — re-upload required" }
          : state.surface,
        lighting: state.lighting,
        objects: state.objects.filter((object) => !object.localOnly),
        markers: state.markers,
        texts: state.texts
      })
    }
  )
);

import { lazy, Suspense, useState } from "react";
import { PLANET_BY_ID } from "./data/planets";
import { PlanetPicker } from "./components/picker/PlanetPicker";
import { useEditorStore } from "./store/editor-store";
import type { PlanetId } from "./types/editor";

const EditorShell = lazy(() =>
  import("./components/editor/EditorShell").then((module) => ({ default: module.EditorShell }))
);

const hasStoredProject = () => {
  try {
    return Boolean(localStorage.getItem("planet-maker-project-v1"));
  } catch {
    return false;
  }
};

export function App() {
  const [choosing, setChoosing] = useState(true);
  const [hasProject, setHasProject] = useState(hasStoredProject);
  const choosePlanet = useEditorStore((state) => state.choosePlanet);
  const setPanelOpen = useEditorStore((state) => state.setPanelOpen);
  const planetId = useEditorStore((state) => state.planetId);
  const surface = useEditorStore((state) => state.surface);
  const itemCount = useEditorStore((state) => state.objects.length + state.markers.length + state.texts.length);

  const choose = (planetId: PlanetId, texture?: string, name?: string) => {
    if (hasProject && !window.confirm("Start a new world? This replaces your current local project. Export it first if you want to keep a copy.")) return;
    choosePlanet(planetId, texture, name);
    setPanelOpen(window.matchMedia("(min-width: 721px)").matches);
    setHasProject(true);
    setChoosing(false);
  };

  const continueProject = () => {
    setPanelOpen(window.matchMedia("(min-width: 721px)").matches);
    setChoosing(false);
  };

  const savedName = planetId === "custom" ? surface.textureName : PLANET_BY_ID[planetId].name;

  return choosing ? (
    <PlanetPicker
      onChoose={choose}
      onContinue={hasProject ? continueProject : undefined}
      savedProject={hasProject ? { name: savedName, planetId, itemCount } : undefined}
    />
  ) : (
    <Suspense fallback={<EditorLoading />}>
      <EditorShell onChooseWorld={() => setChoosing(true)} />
    </Suspense>
  );
}

function EditorLoading() {
  return (
    <main className="editor-loading" aria-live="polite">
      <span className="planet-mark" aria-hidden="true" />
      <strong>Preparing your world…</strong>
    </main>
  );
}

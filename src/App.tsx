import { lazy, Suspense, useState } from "react";
import { PlanetPicker } from "./components/picker/PlanetPicker";
import { useEditorStore } from "./store/editor-store";
import type { PlanetId } from "./types/editor";

const EditorShell = lazy(() =>
  import("./components/editor/EditorShell").then((module) => ({ default: module.EditorShell }))
);

export function App() {
  const [choosing, setChoosing] = useState(true);
  const choosePlanet = useEditorStore((state) => state.choosePlanet);
  const setPanelOpen = useEditorStore((state) => state.setPanelOpen);

  const choose = (planetId: PlanetId, texture?: string, name?: string) => {
    choosePlanet(planetId, texture, name);
    setPanelOpen(window.matchMedia("(min-width: 721px)").matches);
    setChoosing(false);
  };

  return choosing ? (
    <PlanetPicker onChoose={choose} />
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

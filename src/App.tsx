import { useState } from "react";
import { EditorShell } from "./components/editor/EditorShell";
import { PlanetPicker } from "./components/picker/PlanetPicker";
import { useEditorStore } from "./store/editor-store";
import type { PlanetId } from "./types/editor";

export function App() {
  const [choosing, setChoosing] = useState(true);
  const choosePlanet = useEditorStore((state) => state.choosePlanet);

  const choose = (planetId: PlanetId, texture?: string, name?: string) => {
    choosePlanet(planetId, texture, name);
    setChoosing(false);
  };

  return choosing ? (
    <PlanetPicker onChoose={choose} />
  ) : (
    <EditorShell onChooseWorld={() => setChoosing(true)} />
  );
}

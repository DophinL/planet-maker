import { useEffect, useState } from "react";
import { ChevronDown, ExternalLink, Globe2, LocateFixed, Pause, Play, Trash2 } from "lucide-react";
import { PLANET_BY_ID } from "../../data/planets";
import { useEditorStore } from "../../store/editor-store";
import { PlanetCanvas } from "../scene/PlanetCanvas";
import { ToolPanel } from "./ToolPanel";
import { ToolRail } from "./ToolRail";

const TRIPO_FLOATING_URL =
  "https://studio.tripo3d.ai/?utm_source=github&utm_medium=planet_maker&utm_campaign=open_source&utm_content=floating_cta";

export function EditorShell({ onChooseWorld }: { onChooseWorld: () => void }) {
  const planetId = useEditorStore((state) => state.planetId);
  const surface = useEditorStore((state) => state.surface);
  const placement = useEditorStore((state) => state.placement);
  const selectedId = useEditorStore((state) => state.selectedId);
  const setPlacement = useEditorStore((state) => state.setPlacement);
  const removeSelected = useEditorStore((state) => state.removeSelected);
  const updateSurface = useEditorStore((state) => state.updateSurface);
  const setPanelOpen = useEditorStore((state) => state.setPanelOpen);
  const [online, setOnline] = useState(navigator.onLine);
  const name = planetId === "custom" ? surface.textureName : PLANET_BY_ID[planetId].name;

  useEffect(() => {
    const handleOnline = () => setOnline(navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOnline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOnline);
    };
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (event.key === "Escape") setPlacement(null);
      if ((event.key === "Delete" || event.key === "Backspace") && selectedId) removeSelected();
      if (event.code === "Space") {
        event.preventDefault();
        updateSurface({ autoRotate: !surface.autoRotate });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [removeSelected, selectedId, setPlacement, surface.autoRotate, updateSurface]);

  return (
    <main className={`editor-shell ${placement ? "is-placing" : ""}`}>
      <div className="scene-wrap">
        <PlanetCanvas />
      </div>

      <header className="editor-topbar">
        <a className="editor-brand" href="https://make3dmap.com/3d-planet-maker" target="_blank" rel="noreferrer">
          <span><Globe2 size={19} /></span>
          <strong>Planet Maker</strong>
          <ExternalLink size={12} />
        </a>
        <button className="world-switcher" type="button" onClick={onChooseWorld}>
          <span>{name}</span>
          <small>Change world</small>
          <ChevronDown size={15} />
        </button>
        <div className="topbar-actions">
          <span className={`local-status ${online ? "" : "offline"}`}>
            <i /> {online ? "Saved locally" : "Offline mode"}
          </span>
          {selectedId ? (
            <button type="button" onClick={removeSelected} aria-label="Remove selected item"><Trash2 size={17} /><span>Delete</span></button>
          ) : null}
          <button type="button" onClick={() => updateSurface({ autoRotate: !surface.autoRotate })} aria-label={surface.autoRotate ? "Pause rotation" : "Resume rotation"}>
            {surface.autoRotate ? <Pause size={17} /> : <Play size={17} />}
            <span>{surface.autoRotate ? "Pause" : "Rotate"}</span>
          </button>
          <button className="mobile-controls" type="button" onClick={() => setPanelOpen(true)}><LocateFixed size={17} /><span>Controls</span></button>
        </div>
      </header>

      <ToolRail />
      <ToolPanel />

      {placement ? (
        <div className="placement-hud" role="status">
          <span><LocateFixed size={18} /></span>
          <div>
            <strong>Place {placement.kind === "object" ? placement.asset.name : placement.kind}</strong>
            <small>Click the planet · drag to rotate · Esc to cancel</small>
          </div>
          <button type="button" onClick={() => setPlacement(null)}>Cancel</button>
        </div>
      ) : (
        <div className="canvas-hint">Drag to orbit <i /> Scroll to zoom <i /> Space to pause</div>
      )}

      <a className="tripo-floating" href={TRIPO_FLOATING_URL} target="_blank" rel="noreferrer">
        <span><img src="/assets/brand/tripo-logo.svg" alt="" /></span>
        <span><strong>Create any 3D model</strong><small>Made for this world · Powered by Tripo</small></span>
        <ExternalLink size={15} />
      </a>
    </main>
  );
}

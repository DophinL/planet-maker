import { X } from "lucide-react";
import { useEditorStore } from "../../store/editor-store";
import { ExportPanel } from "./panels/ExportPanel";
import { MarkersPanel } from "./panels/MarkersPanel";
import { ObjectsPanel } from "./panels/ObjectsPanel";
import { SunlightPanel } from "./panels/SunlightPanel";
import { TerrainPanel } from "./panels/TerrainPanel";
import { TextPanel } from "./panels/TextPanel";

const PANELS = {
  terrain: TerrainPanel,
  objects: ObjectsPanel,
  markers: MarkersPanel,
  sunlight: SunlightPanel,
  text: TextPanel,
  export: ExportPanel
};

export function ToolPanel() {
  const activeTool = useEditorStore((state) => state.activeTool);
  const panelOpen = useEditorStore((state) => state.panelOpen);
  const setPanelOpen = useEditorStore((state) => state.setPanelOpen);
  const Panel = PANELS[activeTool];
  const closePanel = () => {
    setPanelOpen(false);
    requestAnimationFrame(() => {
      document.querySelector<HTMLButtonElement>(`[data-tool="${activeTool}"]`)?.focus();
    });
  };
  return (
    <aside
      className={`tool-panel ${panelOpen ? "open" : ""}`}
      aria-label={`${activeTool} controls`}
      aria-hidden={!panelOpen}
      inert={!panelOpen}
    >
      <button className="panel-close" type="button" onClick={closePanel} aria-label="Close panel"><X size={18} /></button>
      <div className="panel-scroll"><Panel /></div>
    </aside>
  );
}

import {
  Boxes,
  Download,
  MapPin,
  Mountain,
  SunMedium,
  Type
} from "lucide-react";
import { useEditorStore } from "../../store/editor-store";
import type { ToolId } from "../../types/editor";

const TOOLS: Array<{ id: ToolId; label: string; icon: typeof Mountain }> = [
  { id: "terrain", label: "Surface", icon: Mountain },
  { id: "objects", label: "Objects", icon: Boxes },
  { id: "markers", label: "Markers", icon: MapPin },
  { id: "sunlight", label: "Sunlight", icon: SunMedium },
  { id: "text", label: "Text", icon: Type },
  { id: "export", label: "Export", icon: Download }
];

export function ToolRail() {
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);
  return (
    <nav className="tool-rail" aria-label="Editor tools">
      {TOOLS.map((tool) => {
        const Icon = tool.icon;
        return (
          <button
            key={tool.id}
            type="button"
            className={activeTool === tool.id ? "active" : ""}
            onClick={() => setActiveTool(tool.id)}
            aria-pressed={activeTool === tool.id}
            data-tooltip={tool.label}
            data-tool={tool.id}
          >
            <Icon size={20} strokeWidth={1.75} />
            <span>{tool.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

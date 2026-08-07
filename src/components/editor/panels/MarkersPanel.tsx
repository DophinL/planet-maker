import { useState } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { pointToLatLon } from "../../../lib/geo";
import { useEditorStore } from "../../../store/editor-store";
import { EmptyState, PanelSection } from "../../shared/Controls";

const COLORS = [
  { value: "#c6ff4a", name: "Lime" },
  { value: "#ffb96b", name: "Amber" },
  { value: "#ff6b6b", name: "Coral" },
  { value: "#72c7ff", name: "Sky blue" },
  { value: "#e8e5dc", name: "Ivory" }
];

export function MarkersPanel() {
  const [label, setLabel] = useState("New place");
  const [color, setColor] = useState(COLORS[0].value);
  const markers = useEditorStore((state) => state.markers);
  const setPlacement = useEditorStore((state) => state.setPlacement);
  const select = useEditorStore((state) => state.select);
  const selectedId = useEditorStore((state) => state.selectedId);
  const removeItem = useEditorStore((state) => state.removeItem);
  const clearLayer = useEditorStore((state) => state.clearLayer);

  return (
    <>
      <div className="panel-intro">
        <span className="panel-kicker">Markers</span>
        <h2>Pin important places</h2>
        <p>Create a marker, then click its exact position on the globe.</p>
      </div>
      <PanelSection title="New marker">
        <label className="text-field">
          <span>Label</span>
          <input value={label} maxLength={40} onChange={(event) => setLabel(event.target.value)} />
        </label>
        <div className="color-picker" aria-label="Marker color">
          {COLORS.map((item) => (
            <button key={item.value} type="button" className={color === item.value ? "active" : ""} style={{ background: item.value }} onClick={() => setColor(item.value)} aria-label={`Use ${item.name}`} aria-pressed={color === item.value} />
          ))}
        </div>
        <button className="primary-action" type="button" disabled={!label.trim()} onClick={() => setPlacement({ kind: "marker", label: label.trim(), color })}>
          <MapPin size={17} /> Place marker on planet
        </button>
      </PanelSection>
      <PanelSection
        title={`Markers · ${markers.length}`}
        action={markers.length ? <button className="mini-action" type="button" onClick={() => {
          if (window.confirm(`Remove all ${markers.length} markers?`)) clearLayer("markers");
        }}>Clear all</button> : null}
      >
        {markers.length ? (
          <div className="layer-list">
            {markers.map((marker, index) => {
              const coordinates = pointToLatLon(marker.position);
              return (
                <div key={marker.id} className={`layer-row ${selectedId === marker.id ? "active" : ""}`}>
                  <button className="layer-select" type="button" onClick={() => select(marker.id)}>
                    <span className="list-index">{String(index + 1).padStart(2, "0")}</span>
                    <i style={{ background: marker.color }} />
                    <span><strong>{marker.label}</strong><small>{coordinates.latitude.toFixed(1)}°, {coordinates.longitude.toFixed(1)}°</small></span>
                    {selectedId === marker.id ? <Plus size={14} /> : null}
                  </button>
                  <button className="layer-delete" type="button" onClick={() => removeItem(marker.id)} aria-label={`Remove ${marker.label}`}><Trash2 size={15} /></button>
                </div>
              );
            })}
          </div>
        ) : <EmptyState>Markers are ideal for cities, landing sites, or story locations.</EmptyState>}
      </PanelSection>
    </>
  );
}

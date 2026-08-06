import { useState } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { pointToLatLon } from "../../../lib/geo";
import { useEditorStore } from "../../../store/editor-store";
import { EmptyState, PanelSection } from "../../shared/Controls";

const COLORS = ["#c6ff4a", "#ffb96b", "#ff6b6b", "#72c7ff", "#e8e5dc"];

export function MarkersPanel() {
  const [label, setLabel] = useState("New place");
  const [color, setColor] = useState(COLORS[0]);
  const markers = useEditorStore((state) => state.markers);
  const setPlacement = useEditorStore((state) => state.setPlacement);
  const select = useEditorStore((state) => state.select);
  const selectedId = useEditorStore((state) => state.selectedId);
  const removeSelected = useEditorStore((state) => state.removeSelected);
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
            <button key={item} type="button" className={color === item ? "active" : ""} style={{ background: item }} onClick={() => setColor(item)} aria-label={`Use ${item}`} />
          ))}
        </div>
        <button className="primary-action" type="button" disabled={!label.trim()} onClick={() => setPlacement({ kind: "marker", label: label.trim(), color })}>
          <MapPin size={17} /> Place marker on planet
        </button>
      </PanelSection>
      <PanelSection
        title={`Markers · ${markers.length}`}
        action={markers.length ? <button className="mini-action" type="button" onClick={() => clearLayer("markers")}>Clear all</button> : null}
      >
        {markers.length ? (
          <div className="layer-list">
            {markers.map((marker, index) => {
              const coordinates = pointToLatLon(marker.position);
              return (
                <button key={marker.id} type="button" className={selectedId === marker.id ? "active" : ""} onClick={() => select(marker.id)}>
                  <span className="list-index">{String(index + 1).padStart(2, "0")}</span>
                  <i style={{ background: marker.color }} />
                  <span><strong>{marker.label}</strong><small>{coordinates.latitude.toFixed(1)}°, {coordinates.longitude.toFixed(1)}°</small></span>
                  {selectedId === marker.id ? <Trash2 size={15} onClick={(event) => { event.stopPropagation(); removeSelected(); }} /> : <Plus size={14} />}
                </button>
              );
            })}
          </div>
        ) : <EmptyState>Markers are ideal for cities, landing sites, or story locations.</EmptyState>}
      </PanelSection>
    </>
  );
}

import { useEditorStore } from "../../../store/editor-store";
import { PanelSection, RangeField } from "../../shared/Controls";

const BACKGROUNDS = [
  { id: "observatory", name: "Observatory", color: "#0b1113" },
  { id: "deep-space", name: "Deep space", color: "#05080c" },
  { id: "warm-dusk", name: "Warm dusk", color: "#17100e" }
] as const;

export function SunlightPanel() {
  const lighting = useEditorStore((state) => state.lighting);
  const updateLighting = useEditorStore((state) => state.updateLighting);
  return (
    <>
      <div className="panel-intro">
        <span className="panel-kicker">Sunlight</span>
        <h2>Light the world</h2>
        <p>Move the key light to reveal shape, texture, and atmosphere.</p>
      </div>
      <PanelSection title="Sun position">
        <div className="sun-dial" style={{ "--sun-angle": `${lighting.azimuth}deg` } as React.CSSProperties}>
          <i /><span />
        </div>
        <div className="control-stack">
          <RangeField label="Azimuth" min={-180} max={180} step={1} value={lighting.azimuth} valueLabel={`${lighting.azimuth}°`} onChange={(event) => updateLighting({ azimuth: Number(event.target.value) })} />
          <RangeField label="Elevation" min={-10} max={85} step={1} value={lighting.elevation} valueLabel={`${lighting.elevation}°`} onChange={(event) => updateLighting({ elevation: Number(event.target.value) })} />
        </div>
      </PanelSection>
      <PanelSection title="Exposure">
        <div className="control-stack">
          <RangeField label="Sun intensity" min={0.3} max={5} step={0.05} value={lighting.intensity} valueLabel={`${lighting.intensity.toFixed(1)}×`} onChange={(event) => updateLighting({ intensity: Number(event.target.value) })} />
          <RangeField label="Ambient floor" min={0.05} max={1.2} step={0.01} value={lighting.ambient} valueLabel={`${Math.round(lighting.ambient * 100)}%`} onChange={(event) => updateLighting({ ambient: Number(event.target.value) })} />
        </div>
      </PanelSection>
      <PanelSection title="Backdrop">
        <div className="background-options">
          {BACKGROUNDS.map((item) => (
            <button key={item.id} type="button" className={lighting.background === item.id ? "active" : ""} onClick={() => updateLighting({ background: item.id })}>
              <i style={{ background: item.color }} /><span>{item.name}</span>
            </button>
          ))}
        </div>
      </PanelSection>
    </>
  );
}

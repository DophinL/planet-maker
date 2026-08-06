import { useRef, useState } from "react";
import { Check, ImagePlus, RotateCcw } from "lucide-react";
import { normalizeTextureFile } from "../../../lib/texture";
import { useEditorStore } from "../../../store/editor-store";
import { PanelSection, RangeField, SwitchField } from "../../shared/Controls";

export function TerrainPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const surface = useEditorStore((state) => state.surface);
  const planetId = useEditorStore((state) => state.planetId);
  const updateSurface = useEditorStore((state) => state.updateSurface);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const texture = await normalizeTextureFile(file);
      updateSurface({ texture: texture.dataUrl, textureName: texture.name, textureOffset: 0 });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not use this image.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="panel-intro">
        <span className="panel-kicker">Terrain</span>
        <h2>Surface studio</h2>
        <p>Shape the material while your texture stays on this device.</p>
      </div>

      <PanelSection title="Surface map" description="A 2:1 equirectangular image wraps cleanly around the sphere.">
        <button className="texture-upload" type="button" onClick={() => inputRef.current?.click()} disabled={busy}>
          <span><ImagePlus size={21} /></span>
          <span>
            <strong>{busy ? "Preparing texture…" : surface.textureName}</strong>
            <small>{surface.texture.startsWith("data:") ? "Local custom texture" : `${planetId} preset · local asset`}</small>
          </span>
          <Check size={16} className="success-check" />
        </button>
        <input
          ref={inputRef}
          className="visually-hidden"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => void upload(event.target.files?.[0])}
        />
        {error ? <p className="inline-error" role="alert">{error}</p> : null}
      </PanelSection>

      <PanelSection title="Material" description="Small values keep planetary detail believable.">
        <div className="control-stack">
          <RangeField
            label="Texture rotation"
            min={-0.5}
            max={0.5}
            step={0.01}
            value={surface.textureOffset}
            valueLabel={`${Math.round(surface.textureOffset * 360)}°`}
            onChange={(event) => updateSurface({ textureOffset: Number(event.target.value) })}
          />
          <RangeField
            label="Surface relief"
            min={0}
            max={0.16}
            step={0.005}
            value={surface.relief}
            valueLabel={`${Math.round(surface.relief * 625)}%`}
            onChange={(event) => updateSurface({ relief: Number(event.target.value) })}
          />
          <RangeField
            label="Roughness"
            min={0.2}
            max={1}
            step={0.01}
            value={surface.roughness}
            valueLabel={`${Math.round(surface.roughness * 100)}%`}
            onChange={(event) => updateSurface({ roughness: Number(event.target.value) })}
          />
        </div>
      </PanelSection>

      <PanelSection title="Air & motion">
        <div className="control-stack">
          <RangeField
            label="Atmosphere"
            min={0}
            max={0.34}
            step={0.01}
            value={surface.atmosphere}
            valueLabel={`${Math.round(surface.atmosphere * 100)}%`}
            onChange={(event) => updateSurface({ atmosphere: Number(event.target.value) })}
          />
          <RangeField
            label="Cloud cover"
            min={0}
            max={0.9}
            step={0.01}
            value={surface.cloudOpacity}
            valueLabel={`${Math.round(surface.cloudOpacity * 100)}%`}
            onChange={(event) => updateSurface({ cloudOpacity: Number(event.target.value) })}
          />
          <SwitchField
            label="Slow rotation"
            description="Pause it for precise placement."
            checked={surface.autoRotate}
            onChange={(autoRotate) => updateSurface({ autoRotate })}
          />
        </div>
      </PanelSection>

      <button
        className="text-button"
        type="button"
        onClick={() => updateSurface({ textureOffset: 0, relief: 0.04, roughness: 0.78 })}
      >
        <RotateCcw size={15} /> Reset material controls
      </button>
    </>
  );
}

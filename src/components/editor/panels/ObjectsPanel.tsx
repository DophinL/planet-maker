import { useMemo, useRef, useState } from "react";
import { Box, ExternalLink, Search, Trash2, Upload } from "lucide-react";
import { OBJECTS } from "../../../data/objects";
import { useEditorStore } from "../../../store/editor-store";
import { PanelSection, RangeField } from "../../shared/Controls";

const TRIPO_OBJECT_URL =
  "https://studio.tripo3d.ai/?utm_source=github&utm_medium=planet_maker&utm_campaign=open_source&utm_content=object_panel";

export function ObjectsPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [customModels, setCustomModels] = useState<Array<{ id: string; name: string; model: string; size: number; elevation: number }>>([]);
  const objects = useEditorStore((state) => state.objects);
  const selectedId = useEditorStore((state) => state.selectedId);
  const setPlacement = useEditorStore((state) => state.setPlacement);
  const updateSelectedObject = useEditorStore((state) => state.updateSelectedObject);
  const removeSelected = useEditorStore((state) => state.removeSelected);
  const clearLayer = useEditorStore((state) => state.clearLayer);
  const selected = objects.find((object) => object.id === selectedId);

  const filtered = useMemo(
    () =>
      OBJECTS.filter(
        (object) =>
          (category === "All" || object.category === category) &&
          `${object.name} ${object.category}`.toLowerCase().includes(query.toLowerCase())
      ),
    [category, query]
  );

  const upload = (file?: File) => {
    if (!file || !file.name.toLowerCase().endsWith(".glb")) return;
    if (file.size > 25 * 1024 * 1024) return;
    const model = {
      id: crypto.randomUUID(),
      name: file.name.replace(/\.glb$/i, ""),
      model: URL.createObjectURL(file),
      size: 0.4,
      elevation: 0
    };
    setCustomModels((models) => [...models, model]);
    setPlacement({ kind: "object", asset: model });
  };

  return (
    <>
      <div className="panel-intro">
        <span className="panel-kicker">Objects</span>
        <h2>Build on the surface</h2>
        <p>Choose a model, then click the planet to place it.</p>
      </div>

      <a className="tripo-panel-cta" href={TRIPO_OBJECT_URL} target="_blank" rel="noreferrer">
        <span className="tripo-logo-wrap"><img src="/assets/brand/tripo-logo.svg" alt="Tripo" /></span>
        <span>
          <strong>Need a custom 3D model?</strong>
          <small>Create a production-ready model in Tripo, then upload its GLB here.</small>
        </span>
        <ExternalLink size={17} />
      </a>

      {selected ? (
        <PanelSection title={selected.name} description="Selected object">
          <div className="control-stack selected-controls">
            <RangeField
              label="Scale"
              min={0.08}
              max={1.2}
              step={0.01}
              value={selected.scale}
              valueLabel={`${selected.scale.toFixed(2)}×`}
              onChange={(event) => updateSelectedObject({ scale: Number(event.target.value) })}
            />
            <RangeField
              label="Rotation"
              min={-Math.PI}
              max={Math.PI}
              step={0.05}
              value={selected.rotation}
              valueLabel={`${Math.round((selected.rotation * 180) / Math.PI)}°`}
              onChange={(event) => updateSelectedObject({ rotation: Number(event.target.value) })}
            />
            <RangeField
              label="Altitude"
              min={0}
              max={1.2}
              step={0.01}
              value={selected.elevation}
              valueLabel={selected.elevation.toFixed(2)}
              onChange={(event) => updateSelectedObject({ elevation: Number(event.target.value) })}
            />
            <button className="danger-button" type="button" onClick={removeSelected}><Trash2 size={15} /> Remove object</button>
          </div>
        </PanelSection>
      ) : null}

      <PanelSection
        title="Local library"
        description="20 lightweight models included in this repository."
        action={objects.length ? <button className="mini-action" type="button" onClick={() => clearLayer("objects")}>Clear {objects.length}</button> : null}
      >
        <div className="object-search">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search models" aria-label="Search models" />
        </div>
        <div className="category-tabs" role="tablist" aria-label="Object categories">
          {["All", "Places", "Nature", "Travel", "Sky"].map((item) => (
            <button key={item} type="button" className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>
          ))}
        </div>
        <div className="object-grid">
          {filtered.map((object) => (
            <button key={object.id} type="button" onClick={() => setPlacement({ kind: "object", asset: object })}>
              <img src={object.thumbnail} alt="" loading="lazy" />
              <span><strong>{object.name}</strong><small>{object.category}</small></span>
            </button>
          ))}
          {customModels.map((model) => (
            <button key={model.id} type="button" onClick={() => setPlacement({ kind: "object", asset: model })}>
              <span className="model-placeholder"><Box size={24} /></span>
              <span><strong>{model.name}</strong><small>Uploaded GLB</small></span>
            </button>
          ))}
        </div>
      </PanelSection>

      <button className="upload-glb" type="button" onClick={() => inputRef.current?.click()}>
        <Upload size={17} /> Upload a GLB <span>max 25 MB</span>
      </button>
      <input ref={inputRef} className="visually-hidden" type="file" accept=".glb,model/gltf-binary" onChange={(event) => upload(event.target.files?.[0])} />
    </>
  );
}

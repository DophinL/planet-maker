import { useState } from "react";
import { Type } from "lucide-react";
import { useEditorStore } from "../../../store/editor-store";
import { EmptyState, PanelSection, RangeField } from "../../shared/Controls";

const COLORS = ["#f2f0e8", "#c6ff4a", "#ffb96b", "#72c7ff", "#ff7f8a"];

export function TextPanel() {
  const [text, setText] = useState("Hello, world");
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(0.42);
  const texts = useEditorStore((state) => state.texts);
  const setPlacement = useEditorStore((state) => state.setPlacement);
  const select = useEditorStore((state) => state.select);
  const selectedId = useEditorStore((state) => state.selectedId);
  const clearLayer = useEditorStore((state) => state.clearLayer);
  return (
    <>
      <div className="panel-intro">
        <span className="panel-kicker">Text</span>
        <h2>Write on the world</h2>
        <p>Add concise labels that remain readable while the planet turns.</p>
      </div>
      <PanelSection title="New label">
        <label className="text-field">
          <span>Text</span>
          <input value={text} maxLength={24} onChange={(event) => setText(event.target.value)} />
        </label>
        <RangeField label="Size" min={0.2} max={0.9} step={0.02} value={size} valueLabel={`${Math.round(size * 100)}%`} onChange={(event) => setSize(Number(event.target.value))} />
        <div className="color-picker" aria-label="Text color">
          {COLORS.map((item) => (
            <button key={item} type="button" className={color === item ? "active" : ""} style={{ background: item }} onClick={() => setColor(item)} aria-label={`Use ${item}`} />
          ))}
        </div>
        <button className="primary-action" type="button" disabled={!text.trim()} onClick={() => setPlacement({ kind: "text", text: text.trim(), color, size })}>
          <Type size={17} /> Place text on planet
        </button>
      </PanelSection>
      <PanelSection title={`Text layers · ${texts.length}`} action={texts.length ? <button className="mini-action" type="button" onClick={() => clearLayer("texts")}>Clear all</button> : null}>
        {texts.length ? (
          <div className="layer-list compact">
            {texts.map((item, index) => (
              <button key={item.id} type="button" className={selectedId === item.id ? "active" : ""} onClick={() => select(item.id)}>
                <span className="list-index">{String(index + 1).padStart(2, "0")}</span>
                <i style={{ background: item.color }} />
                <span><strong>{item.text}</strong><small>{Math.round(item.size * 100)}% scale</small></span>
              </button>
            ))}
          </div>
        ) : <EmptyState>Keep labels short so the planet remains the hero.</EmptyState>}
      </PanelSection>
    </>
  );
}

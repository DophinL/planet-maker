import { useRef, useState } from "react";
import { Box, Check, FileJson, Image, Upload } from "lucide-react";
import { captureScenePng, exportSceneGlb } from "../../../lib/scene-export";
import { downloadBlob, downloadText, safeFileName } from "../../../lib/download";
import { useEditorStore } from "../../../store/editor-store";
import type { SerializableProject } from "../../../types/editor";
import { PanelSection } from "../../shared/Controls";

export function ExportPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const serialize = useEditorStore((state) => state.serialize);
  const importProject = useEditorStore((state) => state.importProject);
  const surface = useEditorStore((state) => state.surface);
  const [busy, setBusy] = useState("");
  const [done, setDone] = useState("");
  const [error, setError] = useState("");
  const name = safeFileName(surface.textureName);

  const run = async (kind: "png" | "glb" | "json") => {
    setBusy(kind);
    setError("");
    try {
      if (kind === "png") downloadBlob(await captureScenePng(), `${name}.png`);
      if (kind === "glb") downloadBlob(await exportSceneGlb(), `${name}.glb`);
      if (kind === "json") downloadText(JSON.stringify(serialize(), null, 2), `${name}.planet.json`);
      setDone(kind);
      setTimeout(() => setDone(""), 2200);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Export failed.");
    } finally {
      setBusy("");
    }
  };

  const loadProject = async (file?: File) => {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text()) as SerializableProject;
      if (data.version !== 1 || !data.surface || !data.lighting) throw new Error("Unsupported project file.");
      importProject(data);
      setDone("import");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not import this project.");
    }
  };

  const options = [
    { id: "png" as const, icon: Image, title: "PNG snapshot", body: "Capture the current camera view at display resolution.", meta: ".png" },
    { id: "glb" as const, icon: Box, title: "3D scene", body: "Export the planet and placed objects as a portable GLB.", meta: ".glb" },
    { id: "json" as const, icon: FileJson, title: "Editable project", body: "Save every setting, marker, label, and built-in object.", meta: ".planet.json" }
  ];

  return (
    <>
      <div className="panel-intro">
        <span className="panel-kicker">Export</span>
        <h2>Take your world with you</h2>
        <p>Nothing is uploaded. Files are generated directly in your browser.</p>
      </div>
      <PanelSection title="Export formats">
        <div className="export-options">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <button key={option.id} type="button" onClick={() => void run(option.id)} disabled={Boolean(busy)}>
                <span><Icon size={20} /></span>
                <span><strong>{busy === option.id ? "Preparing…" : option.title}</strong><small>{option.body}</small></span>
                <em>{done === option.id ? <Check size={16} /> : option.meta}</em>
              </button>
            );
          })}
        </div>
        {error ? <p className="inline-error" role="alert">{error}</p> : null}
      </PanelSection>
      <PanelSection title="Continue later" description="Import a project file created by Planet Maker.">
        <button className="upload-glb" type="button" onClick={() => inputRef.current?.click()}>
          <Upload size={17} /> Import project <span>{done === "import" ? "Loaded" : ".planet.json"}</span>
        </button>
        <input ref={inputRef} className="visually-hidden" type="file" accept=".json,.planet.json,application/json" onChange={(event) => void loadProject(event.target.files?.[0])} />
      </PanelSection>
      <div className="export-note">
        <strong>Offline by design</strong>
        <p>Built-in assets are bundled locally. Custom GLBs are session-only and are not embedded in project JSON.</p>
      </div>
    </>
  );
}

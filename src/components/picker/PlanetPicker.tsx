import { useRef, useState } from "react";
import { ArrowRight, ImagePlus, Orbit, Play, Upload } from "lucide-react";
import { PLANETS } from "../../data/planets";
import { normalizeTextureFile } from "../../lib/texture";
import type { PlanetId } from "../../types/editor";

export function PlanetPicker({
  onChoose,
  onContinue,
  savedProject
}: {
  onChoose: (planetId: PlanetId, texture?: string, name?: string) => void;
  onContinue?: () => void;
  savedProject?: { name: string; planetId: PlanetId; itemCount: number };
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hovered, setHovered] = useState<PlanetId>(savedProject?.planetId ?? "earth");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const texture = await normalizeTextureFile(file);
      onChoose("custom", texture.dataUrl, texture.name);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not prepare this texture.");
    } finally {
      setBusy(false);
    }
  };

  const preview = PLANETS.find((planet) => planet.id === hovered) ?? PLANETS[2];

  return (
    <main className="picker-shell">
      <div className="picker-stars" aria-hidden="true" />
      <header className="picker-brand">
        <span className="planet-mark"><Orbit size={21} strokeWidth={1.8} /></span>
        <span>Planet Maker</span>
        <a href="https://make3dmap.com/3d-planet-maker" target="_blank" rel="noreferrer">make3dmap.com</a>
      </header>

      <section className="picker-preview" aria-hidden="true">
        <div className="preview-orbit" />
        <img src={preview.preview} alt="" />
        <div className="preview-caption">
          <span>{preview.kicker}</span>
          <strong>{preview.name}</strong>
        </div>
      </section>

      <section className="picker-content">
        {onContinue && savedProject ? (
          <button className="continue-project" type="button" onClick={onContinue}>
            <span><Play size={17} fill="currentColor" /></span>
            <span>
              <small>Continue local project</small>
              <strong>{savedProject.name}</strong>
            </span>
            <em>{savedProject.itemCount} placed {savedProject.itemCount === 1 ? "item" : "items"}</em>
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        ) : null}
        <div className="picker-title">
          <span>01 — Choose a world</span>
          <h1>Start with a planet.</h1>
          <p>Everything stays in your browser.</p>
        </div>

        <div className="planet-grid" aria-label="Planet presets">
          {PLANETS.map((planet, index) => (
            <button
              key={planet.id}
              type="button"
              className="planet-card"
              style={{ "--planet-accent": planet.accent } as React.CSSProperties}
              onMouseEnter={() => setHovered(planet.id)}
              onFocus={() => setHovered(planet.id)}
              onClick={() => onChoose(planet.id)}
            >
              <span className="planet-index">{String(index + 1).padStart(2, "0")}</span>
              <img src={planet.preview} alt="" loading={index < 4 ? "eager" : "lazy"} />
              <span className="planet-meta">
                <strong>{planet.name}</strong>
                <small>{planet.kicker}</small>
              </span>
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          ))}

          <button
            type="button"
            className="planet-card custom-card"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            <span className="custom-icon"><ImagePlus size={23} /></span>
            <span className="planet-meta">
              <strong>{busy ? "Preparing…" : "Your texture"}</strong>
              <small>PNG, JPEG or WebP · auto-cropped to 2:1</small>
            </span>
            <Upload size={17} aria-hidden="true" />
          </button>
        </div>
        {error ? <p className="picker-error" role="alert">{error}</p> : null}
        <input
          ref={inputRef}
          hidden
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => {
            void upload(event.target.files?.[0]);
            event.currentTarget.value = "";
          }}
        />
      </section>

      <footer className="picker-footer">
        <span>No account. No upload. No AI.</span>
        <span>Built with Three.js</span>
      </footer>
    </main>
  );
}

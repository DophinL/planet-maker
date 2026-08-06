import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.Camera | null = null;

export function bindExportScene(
  nextRenderer: THREE.WebGLRenderer,
  nextScene: THREE.Scene,
  nextCamera: THREE.Camera
) {
  renderer = nextRenderer;
  scene = nextScene;
  camera = nextCamera;
}

export async function captureScenePng(): Promise<Blob> {
  if (!renderer || !scene || !camera) throw new Error("The scene is not ready yet.");
  renderer.render(scene, camera);
  const blob = await new Promise<Blob | null>((resolve) =>
    renderer!.domElement.toBlob(resolve, "image/png")
  );
  if (!blob) throw new Error("The browser could not capture this scene.");
  return blob;
}

export async function exportSceneGlb(): Promise<Blob> {
  if (!scene) throw new Error("The scene is not ready yet.");
  const exporter = new GLTFExporter();
  const result = await exporter.parseAsync(scene, {
    binary: true,
    onlyVisible: true,
    trs: false
  });
  if (!(result instanceof ArrayBuffer)) throw new Error("Could not create a binary GLB.");
  return new Blob([result], { type: "model/gltf-binary" });
}

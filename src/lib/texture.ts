const MAX_TEXTURE_WIDTH = 2048;
const TARGET_RATIO = 2;

export interface NormalizedTexture {
  dataUrl: string;
  name: string;
  width: number;
  height: number;
}

export async function normalizeTextureFile(file: File): Promise<NormalizedTexture> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Choose a PNG, JPEG, or WebP image.");
  }

  const bitmap = await createImageBitmap(file);
  const width = Math.min(MAX_TEXTURE_WIDTH, Math.max(512, bitmap.width));
  const height = Math.round(width / TARGET_RATIO);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("Your browser could not prepare this texture.");

  const sourceRatio = bitmap.width / bitmap.height;
  let sourceWidth = bitmap.width;
  let sourceHeight = bitmap.height;
  let sourceX = 0;
  let sourceY = 0;
  if (sourceRatio > TARGET_RATIO) {
    sourceWidth = bitmap.height * TARGET_RATIO;
    sourceX = (bitmap.width - sourceWidth) / 2;
  } else if (sourceRatio < TARGET_RATIO) {
    sourceHeight = bitmap.width / TARGET_RATIO;
    sourceY = (bitmap.height - sourceHeight) / 2;
  }

  context.drawImage(
    bitmap,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    width,
    height
  );
  bitmap.close();

  return {
    dataUrl: canvas.toDataURL("image/webp", 0.9),
    name: file.name.replace(/\.[^.]+$/, ""),
    width,
    height
  };
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read this file."));
    reader.readAsDataURL(file);
  });
}

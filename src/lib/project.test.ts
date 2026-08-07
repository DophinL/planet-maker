import { describe, expect, it } from "vitest";
import { parsePlanetProject } from "./project";

const project = {
  version: 1,
  planetId: "earth",
  surface: {
    texture: "/assets/planets/earth.jpg",
    textureName: "Earth",
    textureOffset: 0,
    roughness: 0.72,
    relief: 0.055,
    atmosphere: 0.18,
    cloudOpacity: 0.62,
    autoRotate: true,
    rotationSpeed: 0.048
  },
  lighting: {
    azimuth: 38,
    elevation: 34,
    intensity: 2.7,
    ambient: 0.42,
    background: "observatory"
  },
  objects: [{
    id: "object-1",
    assetId: "house",
    name: "Untrusted name",
    modelUrl: "https://example.com/untrusted.glb",
    position: [1, 0, 0],
    scale: 0.34,
    rotation: 0,
    elevation: 0
  }],
  markers: [],
  texts: []
};

describe("project import validation", () => {
  it("rebuilds object asset paths from the offline catalog", () => {
    const parsed = parsePlanetProject(project);
    expect(parsed.objects[0].name).toBe("House");
    expect(parsed.objects[0].modelUrl).toBe("/assets/models/kenney-suburban/house.glb");
  });

  it("rejects malformed project collections", () => {
    expect(() => parsePlanetProject({ ...project, markers: undefined })).toThrow(/invalid settings/i);
  });

  it("rejects remote surface textures", () => {
    expect(() => parsePlanetProject({
      ...project,
      surface: { ...project.surface, texture: "https://example.com/earth.jpg" }
    })).toThrow(/invalid settings/i);
  });
});

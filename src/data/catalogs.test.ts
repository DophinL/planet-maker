import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { OBJECTS } from "./objects";
import { PLANETS } from "./planets";

describe("offline catalogs", () => {
  it("ships the intended planet and object sets", () => {
    expect(PLANETS).toHaveLength(9);
    expect(OBJECTS).toHaveLength(20);
  });

  it("references only repository-local runtime assets", () => {
    for (const planet of PLANETS) {
      expect(planet.texture).toMatch(/^\/assets\//);
      expect(planet.preview).toMatch(/^\/assets\//);
      expect(planet.cloudTexture ?? "/assets/none").toMatch(/^\/assets\//);
      expect(planet.ringTexture ?? "/assets/none").toMatch(/^\/assets\//);
    }

    for (const object of OBJECTS) {
      expect(object.model).toMatch(/^\/assets\//);
      expect(object.thumbnail).toMatch(/^\/assets\//);
      expect(object.license).toBe("CC0");
    }
  });

  it("includes every referenced asset in the repository", () => {
    const publicAsset = (url: string) => resolve(process.cwd(), "public", url.replace(/^\//, ""));

    for (const planet of PLANETS) {
      for (const url of [planet.texture, planet.preview, planet.cloudTexture, planet.ringTexture]) {
        if (url) expect(existsSync(publicAsset(url)), url).toBe(true);
      }
    }

    for (const object of OBJECTS) {
      expect(existsSync(publicAsset(object.model)), object.model).toBe(true);
      expect(existsSync(publicAsset(object.thumbnail)), object.thumbnail).toBe(true);
    }
  });
});

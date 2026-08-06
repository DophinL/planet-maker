import { describe, expect, it } from "vitest";
import { normalizeTuple, pointToLatLon, surfacePose } from "./geo";

describe("spherical placement", () => {
  it("normalizes arbitrary points", () => {
    const [x, y, z] = normalizeTuple([3, 4, 0]);
    expect(Math.hypot(x, y, z)).toBeCloseTo(1, 8);
  });

  it("keeps objects outside the planet surface", () => {
    const { point } = surfacePose([1, 0, 0], 0.2);
    expect(point.length()).toBeGreaterThan(2.3);
  });

  it("converts the north pole correctly", () => {
    expect(pointToLatLon([0, 1, 0]).latitude).toBeCloseTo(90, 8);
  });
});

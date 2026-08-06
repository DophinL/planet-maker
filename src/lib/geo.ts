import * as THREE from "three";
import type { Vector3Tuple } from "../types/editor";

export const PLANET_RADIUS = 2.16;

export function normalizeTuple(value: Vector3Tuple): Vector3Tuple {
  const vector = new THREE.Vector3(...value).normalize();
  return [vector.x, vector.y, vector.z];
}

export function surfacePose(
  position: Vector3Tuple,
  elevation = 0,
  radius = PLANET_RADIUS
) {
  const normal = new THREE.Vector3(...normalizeTuple(position));
  const point = normal.clone().multiplyScalar(radius + 0.018 + elevation);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    normal
  );
  return { normal, point, quaternion };
}

export function pointToLatLon(position: Vector3Tuple) {
  const [x, y, z] = normalizeTuple(position);
  return {
    latitude: THREE.MathUtils.radToDeg(Math.asin(y)),
    longitude: THREE.MathUtils.radToDeg(Math.atan2(z, x))
  };
}

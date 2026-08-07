import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { PLANET_BY_ID } from "../../data/planets";
import { PLANET_RADIUS, surfacePose } from "../../lib/geo";
import { bindExportScene } from "../../lib/scene-export";
import { useEditorStore } from "../../store/editor-store";
import type { PlanetMarker, PlanetText, PlacedObject, Vector3Tuple } from "../../types/editor";

function ExportBridge() {
  const { gl, scene, camera } = useThree();
  useEffect(() => bindExportScene(gl, scene, camera), [gl, scene, camera]);
  return null;
}

function Model({ object, selected }: { object: PlacedObject; selected: boolean }) {
  const gltf = useGLTF(object.modelUrl);
  const prepared = useMemo(() => {
    const model = clone(gltf.scene);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const longest = Math.max(size.x, size.y, size.z, 0.001);
    model.position.set(-center.x, -box.min.y, -center.z);
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return { model, longest };
  }, [gltf.scene]);
  const pose = useMemo(
    () => surfacePose(object.position, object.elevation),
    [object.position, object.elevation]
  );
  const select = useEditorStore((state) => state.select);

  return (
    <group
      position={pose.point}
      quaternion={pose.quaternion}
      onClick={(event) => {
        event.stopPropagation();
        select(object.id);
      }}
    >
      <group rotation={[0, object.rotation, 0]} scale={object.scale / prepared.longest}>
        <primitive object={prepared.model} />
      </group>
      {selected ? (
        <mesh position={[0, Math.max(object.scale * 0.75, 0.14), 0]}>
          <ringGeometry args={[object.scale * 0.46, object.scale * 0.56, 32]} />
          <meshBasicMaterial color="#c6ff4a" side={THREE.DoubleSide} transparent opacity={0.9} />
        </mesh>
      ) : null}
    </group>
  );
}

function CloudLayer({
  textureUrl,
  planetId,
  polarScale,
  opacity
}: {
  textureUrl: string;
  planetId: string;
  polarScale: number;
  opacity: number;
}) {
  const cloudMap = useTexture(textureUrl);
  useEffect(() => {
    cloudMap.colorSpace = THREE.SRGBColorSpace;
  }, [cloudMap]);
  return (
    <mesh scale={[1.009, polarScale * 1.009, 1.009]}>
      <sphereGeometry args={[PLANET_RADIUS, 128, 96]} />
      <meshStandardMaterial
        map={planetId === "venus" ? cloudMap : undefined}
        alphaMap={planetId === "venus" ? undefined : cloudMap}
        color="#f5f3ec"
        transparent
        opacity={opacity}
        alphaTest={planetId === "venus" ? 0 : 0.025}
        depthWrite={false}
        blending={THREE.NormalBlending}
        roughness={0.9}
      />
    </mesh>
  );
}

function RingLayer({ textureUrl }: { textureUrl: string }) {
  const ringMap = useTexture(textureUrl);
  useEffect(() => {
    ringMap.colorSpace = THREE.SRGBColorSpace;
  }, [ringMap]);
  return (
    <mesh rotation={[Math.PI / 2, 0, 0.08]}>
      <ringGeometry args={[PLANET_RADIUS * 1.22, PLANET_RADIUS * 2.05, 192]} />
      <meshBasicMaterial
        map={ringMap}
        color="#fff3d1"
        transparent
        opacity={0.92}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function Marker({ marker, selected }: { marker: PlanetMarker; selected: boolean }) {
  const pose = useMemo(() => surfacePose(marker.position, 0.03), [marker.position]);
  const select = useEditorStore((state) => state.select);
  return (
    <group
      position={pose.point}
      quaternion={pose.quaternion}
      onClick={(event) => {
        event.stopPropagation();
        select(marker.id);
      }}
    >
      <mesh position={[0, 0.115, 0]} castShadow>
        <sphereGeometry args={[selected ? 0.07 : 0.055, 20, 16]} />
        <meshStandardMaterial color={marker.color} emissive={marker.color} emissiveIntensity={selected ? 0.45 : 0.12} />
      </mesh>
      <mesh position={[0, 0.045, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.035, 0.12, 16]} />
        <meshStandardMaterial color={marker.color} />
      </mesh>
    </group>
  );
}

function createTextTexture(text: string, color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const context = canvas.getContext("2d")!;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = "600 104px 'Instrument Sans', sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.lineWidth = 18;
  context.strokeStyle = "rgba(8, 14, 16, .86)";
  context.strokeText(text.slice(0, 24), 512, 132);
  context.fillStyle = color;
  context.fillText(text.slice(0, 24), 512, 132);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function SurfaceText({ item, selected }: { item: PlanetText; selected: boolean }) {
  const pose = useMemo(() => surfacePose(item.position, 0.14), [item.position]);
  const texture = useMemo(() => createTextTexture(item.text, item.color), [item.text, item.color]);
  const select = useEditorStore((state) => state.select);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <sprite
      position={pose.point}
      scale={[item.size * 2.8, item.size * 0.7, 1]}
      onClick={(event) => {
        event.stopPropagation();
        select(item.id);
      }}
    >
      <spriteMaterial map={texture} transparent depthWrite={false} opacity={selected ? 1 : 0.92} />
    </sprite>
  );
}

function PlanetSystem() {
  const planetId = useEditorStore((state) => state.planetId);
  const surface = useEditorStore((state) => state.surface);
  const lighting = useEditorStore((state) => state.lighting);
  const objects = useEditorStore((state) => state.objects);
  const markers = useEditorStore((state) => state.markers);
  const texts = useEditorStore((state) => state.texts);
  const placement = useEditorStore((state) => state.placement);
  const selectedId = useEditorStore((state) => state.selectedId);
  const placeAt = useEditorStore((state) => state.placeAt);
  const select = useEditorStore((state) => state.select);
  const planet = planetId === "custom" ? PLANET_BY_ID.earth : PLANET_BY_ID[planetId];
  const textureUrl = surface.texture || PLANET_BY_ID.earth.texture;
  const map = useTexture(textureUrl);
  const group = useRef<THREE.Group>(null);
  const pointerDown = useRef({ x: 0, y: 0 });

  useEffect(() => {
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = THREE.RepeatWrapping;
    map.offset.x = surface.textureOffset;
    map.needsUpdate = true;
  }, [map, surface.textureOffset]);

  useFrame((_, delta) => {
    if (group.current && surface.autoRotate && !placement) {
      group.current.rotation.y += delta * surface.rotationSpeed * 0.34;
    }
  });

  const lightPosition = useMemo(() => {
    const azimuth = THREE.MathUtils.degToRad(lighting.azimuth);
    const elevation = THREE.MathUtils.degToRad(lighting.elevation);
    return [
      Math.cos(elevation) * Math.cos(azimuth) * 8,
      Math.sin(elevation) * 8,
      Math.cos(elevation) * Math.sin(azimuth) * 8
    ] as Vector3Tuple;
  }, [lighting.azimuth, lighting.elevation]);

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    const movement = Math.hypot(
      event.clientX - pointerDown.current.x,
      event.clientY - pointerDown.current.y
    );
    if (movement > 5) return;
    event.stopPropagation();
    if (!placement || !group.current) {
      select(null);
      return;
    }
    const local = group.current.worldToLocal(event.point.clone()).normalize();
    placeAt([local.x, local.y, local.z]);
  };

  return (
    <>
      <ambientLight intensity={lighting.ambient} color="#9db1ae" />
      <hemisphereLight intensity={0.32} color="#bacad0" groundColor="#3b302c" />
      <directionalLight
        castShadow
        position={lightPosition}
        intensity={lighting.intensity}
        color="#fff0dc"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <group ref={group} rotation={[planet.axialTilt * 0.18, 0, -planet.axialTilt * 0.1]}>
        <mesh
          castShadow
          receiveShadow
          scale={[1, planet.polarScale, 1]}
          onPointerDown={(event) => {
            pointerDown.current = { x: event.clientX, y: event.clientY };
          }}
          onPointerUp={handlePointerUp}
        >
          <sphereGeometry args={[PLANET_RADIUS, 192, 128]} />
          <meshPhysicalMaterial
            map={map}
            bumpMap={map}
            bumpScale={surface.relief}
            roughness={surface.roughness}
            metalness={0}
            clearcoat={planetId === "earth" ? 0.18 : 0.03}
            clearcoatRoughness={0.72}
          />
        </mesh>

        {surface.cloudOpacity > 0 ? (
          <Suspense fallback={null}>
            <CloudLayer
              textureUrl={planet.cloudTexture ?? PLANET_BY_ID.earth.cloudTexture!}
              planetId={planetId}
              polarScale={planet.polarScale}
              opacity={surface.cloudOpacity}
            />
          </Suspense>
        ) : null}

        {surface.atmosphere > 0 ? (
          <mesh scale={[1.045, planet.polarScale * 1.045, 1.045]}>
            <sphereGeometry args={[PLANET_RADIUS, 96, 64]} />
            <meshBasicMaterial
              color={planet.atmosphere}
              transparent
              opacity={surface.atmosphere}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ) : null}

        {planet.ringTexture ? (
          <Suspense fallback={null}>
            <RingLayer textureUrl={planet.ringTexture} />
          </Suspense>
        ) : null}

        <Suspense fallback={null}>
          {objects.map((object) => (
            <Model key={object.id} object={object} selected={object.id === selectedId} />
          ))}
        </Suspense>
        {markers.map((marker) => (
          <Marker key={marker.id} marker={marker} selected={marker.id === selectedId} />
        ))}
        {texts.map((item) => (
          <SurfaceText key={item.id} item={item} selected={item.id === selectedId} />
        ))}
      </group>
    </>
  );
}

function ResponsiveCamera() {
  const planetId = useEditorStore((state) => state.planetId);
  const { camera, size } = useThree();
  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera) || !size.width || !size.height) return;
    const aspect = size.width / size.height;
    const verticalFov = THREE.MathUtils.degToRad(camera.fov);
    const visualRadius = planetId === "saturn" ? PLANET_RADIUS * 2.08 : PLANET_RADIUS * 1.11;
    const verticalDistance = visualRadius / Math.tan(verticalFov / 2);
    const horizontalDistance = visualRadius / (Math.tan(verticalFov / 2) * aspect);
    const distance = Math.max(8.15, verticalDistance, horizontalDistance) * 1.04;
    camera.position.set(0, distance * 0.043, distance);
    camera.updateProjectionMatrix();
  }, [camera, planetId, size.height, size.width]);
  return null;
}

function PlanetControls() {
  const regress = useThree((state) => state.performance.regress);
  return (
    <OrbitControls
      makeDefault
      enablePan={false}
      minDistance={5.3}
      maxDistance={26}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI - 0.2}
      rotateSpeed={0.55}
      zoomSpeed={0.72}
      dampingFactor={0.06}
      onStart={regress}
    />
  );
}

export function PlanetCanvas() {
  const background = useEditorStore((state) => state.lighting.background);
  const autoRotate = useEditorStore((state) => state.surface.autoRotate);
  const [pageVisible, setPageVisible] = useState(() => document.visibilityState !== "hidden");
  const colors = {
    observatory: "#0b1113",
    "deep-space": "#05080c",
    "warm-dusk": "#17100e"
  };

  useEffect(() => {
    const handleVisibility = () => setPageVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
    <Canvas
      className="planet-canvas"
      dpr={[1, 2]}
      frameloop={pageVisible ? (autoRotate ? "always" : "demand") : "never"}
      performance={{ min: 0.68, debounce: 240 }}
      shadows="basic"
      fallback={
        <div className="webgl-fallback" role="alert">
          <strong>3D preview unavailable</strong>
          <span>Enable hardware acceleration or open Planet Maker in a WebGL 2 compatible browser.</span>
        </div>
      }
      gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.35, 8.15], fov: 43, near: 0.1, far: 100 }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <color attach="background" args={[colors[background]]} />
      <fog attach="fog" args={[colors[background], 16, 42]} />
      <Stars radius={48} depth={26} count={1800} factor={2.2} saturation={0.15} fade speed={0.12} />
      <Suspense fallback={null}>
        <PlanetSystem />
      </Suspense>
      <ResponsiveCamera />
      <PlanetControls />
      <ExportBridge />
    </Canvas>
  );
}

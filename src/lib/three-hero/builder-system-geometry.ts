import * as THREE from "three";
import type { BuilderMaterialSet } from "@/lib/three-hero/builder-system-materials";

export interface BuilderSystemParts {
  root: THREE.Group;
  rear: THREE.Group;
  front: THREE.Group;
  portrait: THREE.Mesh;
  seams: Record<"brands" | "systems" | "intelligence" | "security", THREE.Mesh>;
  core: THREE.Group;
  dispose: () => void;
}

function roundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const w = width / 2;
  const h = height / 2;
  const r = Math.min(radius, w, h);
  const shape = new THREE.Shape();
  shape.moveTo(-w + r, -h);
  shape.lineTo(w - r, -h);
  shape.quadraticCurveTo(w, -h, w, -h + r);
  shape.lineTo(w, h - r);
  shape.quadraticCurveTo(w, h, w - r, h);
  shape.lineTo(-w + r, h);
  shape.quadraticCurveTo(-w, h, -w, h - r);
  shape.lineTo(-w, -h + r);
  shape.quadraticCurveTo(-w, -h, -w + r, -h);
  return shape;
}

function extrudePlate(
  width: number,
  height: number,
  depth: number,
  bevel = 0.028,
): THREE.ExtrudeGeometry {
  const shape = roundedRectShape(width, height, Math.min(width, height) * 0.1);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel * 0.85,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments: 10,
  });
  geo.center();
  return geo;
}

function lBracketShape(armW: number, armH: number, thick: number): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(armW, 0);
  shape.lineTo(armW, thick);
  shape.lineTo(thick, thick);
  shape.lineTo(thick, armH);
  shape.lineTo(0, armH);
  shape.lineTo(0, 0);
  return shape;
}

function addMesh(
  parent: THREE.Object3D,
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  position: THREE.Vector3Like,
  rotation: { x?: number; y?: number; z?: number } = { x: 0, y: 0, z: 0 },
  name?: string,
): THREE.Mesh {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position as THREE.Vector3);
  mesh.rotation.set(rotation.x ?? 0, rotation.y ?? 0, rotation.z ?? 0);
  if (name) mesh.name = name;
  parent.add(mesh);
  return mesh;
}

const PORTRAIT_W = 1.52;
const PORTRAIT_H = 1.32;

export function buildBuilderSystemGroup(materials: BuilderMaterialSet): BuilderSystemParts {
  const root = new THREE.Group();
  root.name = "builder-system";

  const rear = new THREE.Group();
  rear.name = "rear-structure";
  root.add(rear);

  const front = new THREE.Group();
  front.name = "front-structure";
  root.add(front);

  const geometries: THREE.BufferGeometry[] = [];

  const rearSpineGeo = extrudePlate(2.35, 1.75, 0.48, 0.032);
  geometries.push(rearSpineGeo);
  addMesh(
    rear,
    rearSpineGeo,
    materials.bodyDark,
    { x: 0.02, y: 0.04, z: -0.72 },
    { x: 0, y: 0.04, z: 0 },
    "rear-spine",
  );

  const leftPylonGeo = extrudePlate(0.42, 1.55, 0.38, 0.024);
  geometries.push(leftPylonGeo);
  addMesh(
    rear,
    leftPylonGeo,
    materials.body,
    { x: -1.08, y: 0.12, z: -0.52 },
    { x: 0, y: 0, z: 0.08 },
    "left-pylon",
  );

  const rightPylonGeo = extrudePlate(0.38, 1.48, 0.36, 0.024);
  geometries.push(rightPylonGeo);
  addMesh(
    rear,
    rightPylonGeo,
    materials.body,
    { x: 1.02, y: 0.08, z: -0.5 },
    { x: 0, y: 0, z: -0.06 },
    "right-pylon",
  );

  const topBridgeGeo = extrudePlate(2.05, 0.28, 0.32, 0.02);
  geometries.push(topBridgeGeo);
  addMesh(
    rear,
    topBridgeGeo,
    materials.body,
    { x: 0, y: 0.98, z: -0.58 },
    { x: 0.12, y: 0, z: 0 },
    "top-bridge",
  );

  const baseCradleGeo = extrudePlate(2.1, 0.34, 0.42, 0.026);
  geometries.push(baseCradleGeo);
  addMesh(
    rear,
    baseCradleGeo,
    materials.bodyDark,
    { x: 0, y: -0.96, z: -0.48 },
    { x: 0, y: 0, z: 0 },
    "base-cradle",
  );

  const leftBracketGeo = new THREE.ExtrudeGeometry(lBracketShape(0.72, 0.92, 0.22), {
    depth: 0.28,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.018,
    bevelSegments: 2,
  });
  leftBracketGeo.center();
  geometries.push(leftBracketGeo);
  addMesh(
    rear,
    leftBracketGeo,
    materials.body,
    { x: -0.82, y: -0.42, z: -0.55 },
    { x: 0, y: 0, z: 0.32 },
    "left-bracket",
  );

  const rightBracketGeo = new THREE.ExtrudeGeometry(lBracketShape(0.68, 0.86, 0.2), {
    depth: 0.26,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.018,
    bevelSegments: 2,
  });
  rightBracketGeo.center();
  geometries.push(rightBracketGeo);
  addMesh(
    rear,
    rightBracketGeo,
    materials.body,
    { x: 0.78, y: -0.38, z: -0.52 },
    { x: 0, y: 0, z: -0.28 },
    "right-bracket",
  );

  const glassInsetGeo = extrudePlate(0.55, 0.18, 0.06, 0.008);
  geometries.push(glassInsetGeo);
  addMesh(
    rear,
    glassInsetGeo,
    materials.glass,
    { x: -0.35, y: 0.62, z: -0.38 },
    { x: 0.2, y: 0, z: 0.15 },
  );
  addMesh(
    rear,
    glassInsetGeo,
    materials.glass,
    { x: 0.42, y: 0.58, z: -0.36 },
    { x: 0.15, y: 0, z: -0.12 },
  );

  const seams = {
    brands: addMesh(
      rear,
      extrudePlate(0.62, 0.08, 0.12, 0.01),
      materials.seam.brands,
      { x: -0.88, y: 0.72, z: -0.42 },
      { x: 0.35, y: 0, z: 0.1 },
      "seam-brands",
    ),
    intelligence: addMesh(
      rear,
      extrudePlate(0.58, 0.08, 0.12, 0.01),
      materials.seam.intelligence,
      { x: 0.86, y: 0.68, z: -0.4 },
      { x: 0.3, y: 0, z: -0.08 },
      "seam-intelligence",
    ),
    systems: addMesh(
      rear,
      extrudePlate(0.64, 0.09, 0.14, 0.01),
      materials.seam.systems,
      { x: 0.72, y: -0.82, z: -0.38 },
      { x: -0.1, y: 0, z: 0.05 },
      "seam-systems",
    ),
    security: addMesh(
      rear,
      extrudePlate(0.6, 0.09, 0.14, 0.01),
      materials.seam.security,
      { x: -0.74, y: -0.8, z: -0.4 },
      { x: 0.08, y: 0, z: -0.06 },
      "seam-security",
    ),
  };
  geometries.push(
    seams.brands.geometry,
    seams.intelligence.geometry,
    seams.systems.geometry,
    seams.security.geometry,
  );

  const shoulderGeo = extrudePlate(0.38, 0.52, 0.14, 0.016);
  geometries.push(shoulderGeo);
  addMesh(
    front,
    shoulderGeo,
    materials.body,
    { x: -0.92, y: -0.08, z: 0.22 },
    { x: 0, y: 0, z: 0.18 },
    "front-shoulder",
  );

  const deskLipGeo = extrudePlate(0.48, 0.12, 0.1, 0.012);
  geometries.push(deskLipGeo);
  addMesh(
    front,
    deskLipGeo,
    materials.bodyDark,
    { x: 0.62, y: -0.58, z: 0.16 },
    { x: 0.45, y: 0, z: -0.1 },
    "desk-lip",
  );

  const core = new THREE.Group();
  core.name = "alex-core";
  root.add(core);

  const coreBodyGeo = extrudePlate(0.16, 0.11, 0.14, 0.012);
  geometries.push(coreBodyGeo);
  addMesh(core, coreBodyGeo, materials.core, { x: 0, y: -0.88, z: -0.28 });

  const coreCapGeo = extrudePlate(0.1, 0.06, 0.05, 0.008);
  geometries.push(coreCapGeo);
  addMesh(core, coreCapGeo, materials.coreAccent, { x: 0, y: -0.82, z: -0.22 });

  const connectorGeo = new THREE.BoxGeometry(0.04, 0.03, 0.22);
  geometries.push(connectorGeo);
  const connectors: [number, number, number, number][] = [
    [-0.14, -0.86, -0.32, 0.5],
    [0.14, -0.86, -0.32, -0.5],
    [0, -0.78, -0.32, 0],
    [0, -0.94, -0.32, Math.PI / 2],
  ];
  for (const [x, y, z, rz] of connectors) {
    addMesh(core, connectorGeo, materials.bodyDark, { x, y, z }, { x: 0, y: 0, z: rz });
  }

  const portraitGeo = new THREE.PlaneGeometry(PORTRAIT_W, PORTRAIT_H);
  geometries.push(portraitGeo);
  const portrait = new THREE.Mesh(portraitGeo, materials.portrait);
  portrait.name = "workstation-portrait";
  portrait.position.set(0, 0.02, 0.04);
  root.add(portrait);

  return {
    root,
    rear,
    front,
    portrait,
    seams,
    core,
    dispose: () => {
      root.traverse((object: THREE.Object3D) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
        }
      });
    },
  };
}

export { PORTRAIT_W, PORTRAIT_H };

import * as THREE from "three";
import {
  LOVABLE_PRIMARY,
  LOVABLE_RING_CAMERA,
  LOVABLE_TORUS_RINGS,
} from "@/lib/orbital-hero/portrait-spec";

export interface OrbitRingsSceneHandle {
  resize: (width: number, height: number) => void;
  setPointer: (nx: number, ny: number) => void;
  clearPointer: () => void;
  setActive: (active: boolean) => void;
  dispose: () => void;
}

/** Vanilla Three.js port of AlexCore torus rings ONLY — no orb/reactor/nodes. */
export async function createOrbitRingsScene(
  canvas: HTMLCanvasElement,
): Promise<OrbitRingsSceneHandle | null> {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog("#05070B", 6, 14);

  const camera = new THREE.PerspectiveCamera(LOVABLE_RING_CAMERA.fov, 1, 0.1, 20);
  camera.position.set(...LOVABLE_RING_CAMERA.position);

  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  const key = new THREE.DirectionalLight("#8fb2ff", 1.1);
  key.position.set(3, 4, 5);
  const fill = new THREE.DirectionalLight("#835BFF", 0.5);
  fill.position.set(-4, -2, -3);
  const point = new THREE.PointLight(LOVABLE_PRIMARY, 0.6);
  point.position.set(0, 0, 3);
  scene.add(ambient, key, fill, point);

  const group = new THREE.Group();
  const ringsGroup = new THREE.Group();
  group.add(ringsGroup);

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  for (const spec of LOVABLE_TORUS_RINGS) {
    const geo = new THREE.TorusGeometry(spec.r, spec.tube, 16, 128);
    geometries.push(geo);
    const mat = new THREE.MeshStandardMaterial({
      color: "#0a0e14",
      metalness: 0.9,
      roughness: 0.3,
      emissive: LOVABLE_PRIMARY,
      emissiveIntensity: 0.6,
    });
    materials.push(mat);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.set(spec.tilt[0], spec.tilt[1], spec.tilt[2]);
    ringsGroup.add(mesh);
  }

  scene.add(group);

  let active = true;
  let raf = 0;
  let last = 0;
  const targetRot = { x: 0, y: 0 };
  const currentRot = { x: 0, y: 0 };
  let hasPointer = false;

  const frame = (now: number) => {
    raf = 0;
    if (!active) return;

    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;

    if (hasPointer) {
      currentRot.y += (targetRot.y - currentRot.y) * 0.06;
      currentRot.x += (targetRot.x - currentRot.x) * 0.06;
    } else {
      currentRot.y *= 0.96;
      currentRot.x *= 0.96;
    }

    group.rotation.y = currentRot.y;
    group.rotation.x = currentRot.x;

    ringsGroup.children.forEach((child, i) => {
      child.rotation.z += 0.0035 * (i + 1) * 0.4 * dt * 60;
    });

    const breathe = 1 + Math.sin(now * 0.001 * 0.6) * 0.02;
    group.scale.setScalar(breathe);

    renderer.render(scene, camera);
    schedule();
  };

  const schedule = () => {
    if (!active || raf) return;
    raf = requestAnimationFrame(frame);
  };

  const resize = (width: number, height: number) => {
    if (width <= 0 || height <= 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const setPointer = (nx: number, ny: number) => {
    hasPointer = true;
    targetRot.y = nx * 0.55;
    targetRot.x = -ny * 0.4;
  };

  const clearPointer = () => {
    hasPointer = false;
    targetRot.x = 0;
    targetRot.y = 0;
  };

  const setActive = (next: boolean) => {
    active = next;
    if (active) schedule();
    else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const dispose = () => {
    active = false;
    if (raf) cancelAnimationFrame(raf);
    for (const g of geometries) g.dispose();
    for (const m of materials) m.dispose();
    scene.remove(group);
    renderer.dispose();
  };

  setActive(true);
  return { resize, setPointer, clearPointer, setActive, dispose };
}

import * as THREE from "three";
import { LOVABLE_RING_CAMERA, LOVABLE_TORUS_RINGS } from "@/lib/orbital-hero/portrait-spec";
import { WORLD_TRANSFORM_PRESETS } from "@/lib/world-core/section-presets";
import {
  resolveRingGlowHex,
  resolveWorldHex,
  SECURITY_EMISSIVE_BOOST,
  WORLD_CORE_RING_NEON,
  WORLD_HEX,
} from "@/lib/world-core/world-colors";
import type { WorldCoreSceneHandle, WorldState } from "@/lib/world-core/types";
import {
  WORLD_CORE_MAX_DPR,
  WORLD_CORE_MOBILE_MAX_DPR,
  WORLD_CORE_TARGET_FPS,
} from "@/lib/world-core/eligibility";

const BG_FOG = "#05070B";
const FRAME_MS = 1000 / WORLD_CORE_TARGET_FPS;

/** Vanilla Three.js persistent World Core — central sphere + torus rings. */
export async function createWorldCoreScene(
  canvas: HTMLCanvasElement,
  options: { mobile?: boolean } = {},
): Promise<WorldCoreSceneHandle | null> {
  const isMobile = options.mobile ?? false;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(BG_FOG, 6, 14);

  const camera = new THREE.PerspectiveCamera(LOVABLE_RING_CAMERA.fov, 1, 0.1, 20);
  camera.position.set(0, 0, LOVABLE_RING_CAMERA.position[2]);

  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  const key = new THREE.DirectionalLight("#8fb2ff", 1.1);
  key.position.set(3, 4, 5);
  const fill = new THREE.DirectionalLight("#835BFF", 0.5);
  fill.position.set(-4, -2, -3);
  const point = new THREE.PointLight(WORLD_HEX.core, 0.6);
  point.position.set(0, 0, 3);
  scene.add(ambient, key, fill, point);

  const root = new THREE.Group();
  const ringsGroup = new THREE.Group();
  root.add(ringsGroup);

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const coreGeo = new THREE.IcosahedronGeometry(0.72, 2);
  geometries.push(coreGeo);
  const coreMat = new THREE.MeshPhysicalMaterial({
    color: "#0a0e14",
    metalness: 1,
    roughness: 0.24,
    clearcoat: 0.8,
    clearcoatRoughness: 0.18,
  });
  materials.push(coreMat);
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  root.add(coreMesh);

  const glowGeo = new THREE.SphereGeometry(0.48, 32, 32);
  geometries.push(glowGeo);
  const glowMat = new THREE.MeshStandardMaterial({
    color: "#000000",
    emissive: WORLD_HEX.core,
    emissiveIntensity: 0.65,
    transparent: true,
    opacity: 0.82,
  });
  materials.push(glowMat);
  const glowMesh = new THREE.Mesh(glowGeo, glowMat);
  root.add(glowMesh);

  const ringMats: THREE.MeshStandardMaterial[] = [];
  const ringGlowMats: THREE.MeshStandardMaterial[] = [];
  for (const spec of LOVABLE_TORUS_RINGS) {
    const ringGroup = new THREE.Group();
    ringGroup.rotation.set(spec.tilt[0], spec.tilt[1], spec.tilt[2]);
    ringsGroup.add(ringGroup);

    const geo = new THREE.TorusGeometry(spec.r, spec.tube, 16, 96);
    geometries.push(geo);
    const mat = new THREE.MeshStandardMaterial({
      color: "#0a0e14",
      metalness: 0.9,
      roughness: 0.3,
      emissive: WORLD_HEX.core,
      emissiveIntensity: 0.55,
    });
    materials.push(mat);
    ringMats.push(mat);
    const mesh = new THREE.Mesh(geo, mat);
    ringGroup.add(mesh);

    if (!isMobile) {
      const ringGlowMat = new THREE.MeshStandardMaterial({
        color: "#000000",
        emissive: WORLD_HEX.core,
        emissiveIntensity: WORLD_CORE_RING_NEON.glowShellEmissive,
        transparent: true,
        opacity: WORLD_CORE_RING_NEON.glowShellOpacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      materials.push(ringGlowMat);
      ringGlowMats.push(ringGlowMat);
      const glowMesh = new THREE.Mesh(geo, ringGlowMat);
      glowMesh.scale.setScalar(WORLD_CORE_RING_NEON.glowShellScale);
      ringGroup.add(glowMesh);
    }
  }

  scene.add(root);

  let active = true;
  let reducedMotion = false;
  let raf = 0;
  let lastFrame = 0;
  let last = 0;
  const targetColor = new THREE.Color(WORLD_HEX.core);
  const currentColor = new THREE.Color(WORLD_HEX.core);
  const targetGlowColor = new THREE.Color(WORLD_HEX.core);
  const currentGlowColor = new THREE.Color(WORLD_HEX.core);
  const targetRot = { x: 0, y: 0 };
  const currentRot = { x: 0, y: 0 };
  let hasPointer = false;

  const currentPreset = { ...WORLD_TRANSFORM_PRESETS.core };
  const targetPreset = { ...WORLD_TRANSFORM_PRESETS.core };
  let targetRingBoost = 1;
  let currentRingBoost = 1;
  let targetPointBoost = 1;
  let currentPointBoost = 1;

  const ringIntensityMul = isMobile ? WORLD_CORE_RING_NEON.mobileIntensityMul : 1;

  const applyAccentMaterials = () => {
    glowMat.emissive.copy(currentColor);
    ringMats.forEach((m) => m.emissive.copy(currentColor));
    ringGlowMats.forEach((m) => m.emissive.copy(currentGlowColor));
    point.color.copy(currentColor);
    key.color.lerp(currentColor, 0.08);
    fill.color.lerp(currentColor, 0.05);
  };

  const lerpPreset = (dt: number) => {
    const t = Math.min(1, dt * 2);
    currentPreset.offsetX += (targetPreset.offsetX - currentPreset.offsetX) * t;
    currentPreset.offsetY += (targetPreset.offsetY - currentPreset.offsetY) * t;
    currentPreset.scale += (targetPreset.scale - currentPreset.scale) * t;
    currentPreset.opacity += (targetPreset.opacity - currentPreset.opacity) * t;
    currentPreset.ringSpeed += (targetPreset.ringSpeed - currentPreset.ringSpeed) * t;
    currentPreset.emissiveIntensity +=
      (targetPreset.emissiveIntensity - currentPreset.emissiveIntensity) * t;
    currentPreset.cameraZ += (targetPreset.cameraZ - currentPreset.cameraZ) * t;
    currentPreset.breathe += (targetPreset.breathe - currentPreset.breathe) * t;

    root.position.x = currentPreset.offsetX;
    root.position.y = currentPreset.offsetY;
    camera.position.z = currentPreset.cameraZ;

    glowMat.emissiveIntensity = currentPreset.emissiveIntensity;
    ringMats.forEach((m) => {
      m.emissiveIntensity =
        currentPreset.emissiveIntensity *
        WORLD_CORE_RING_NEON.ringEmissiveMul *
        ringIntensityMul *
        currentRingBoost;
    });
    ringGlowMats.forEach((m) => {
      m.emissiveIntensity =
        WORLD_CORE_RING_NEON.glowShellEmissive * ringIntensityMul * currentRingBoost;
      m.opacity = WORLD_CORE_RING_NEON.glowShellOpacity * ringIntensityMul;
    });
    point.intensity = 0.6 * currentPointBoost;
    canvas.style.opacity = String(currentPreset.opacity);
  };

  const frame = (now: number) => {
    raf = 0;
    if (!active) return;
    if (now - lastFrame < FRAME_MS) {
      schedule();
      return;
    }
    lastFrame = now;

    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;

    currentColor.lerp(targetColor, Math.min(1, dt * 2));
    currentGlowColor.lerp(targetGlowColor, Math.min(1, dt * 2));
    applyAccentMaterials();

    currentRingBoost += (targetRingBoost - currentRingBoost) * Math.min(1, dt * 2);
    currentPointBoost += (targetPointBoost - currentPointBoost) * Math.min(1, dt * 2);

    lerpPreset(dt);

    if (!reducedMotion) {
      if (hasPointer) {
        currentRot.y += (targetRot.y - currentRot.y) * 0.06;
        currentRot.x += (targetRot.x - currentRot.x) * 0.06;
      } else {
        currentRot.y *= 0.96;
        currentRot.x *= 0.96;
      }
      root.rotation.y = currentRot.y;
      root.rotation.x = currentRot.x;

      ringsGroup.children.forEach((child, i) => {
        child.rotation.z += 0.0035 * (i + 1) * currentPreset.ringSpeed * 0.4 * dt * 60;
      });

      if (currentPreset.breathe > 0) {
        const breathe = 1 + Math.sin(now * 0.001 * 0.6) * currentPreset.breathe;
        root.scale.setScalar(currentPreset.scale * breathe);
      } else {
        root.scale.setScalar(currentPreset.scale);
      }
    } else {
      root.scale.setScalar(currentPreset.scale);
    }

    renderer.render(scene, camera);
    schedule();
  };

  const schedule = () => {
    if (!active || raf) return;
    raf = requestAnimationFrame(frame);
  };

  const resize = (width: number, height: number) => {
    if (width <= 0 || height <= 0) return;
    const mobile = options.mobile ?? width < 1024;
    const dpr = Math.min(
      window.devicePixelRatio || 1,
      mobile ? WORLD_CORE_MOBILE_MAX_DPR : WORLD_CORE_MAX_DPR,
    );
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const setWorldState = (world: WorldState, immediate = false) => {
    targetColor.set(resolveWorldHex(world));
    targetGlowColor.set(resolveRingGlowHex(world));
    Object.assign(targetPreset, WORLD_TRANSFORM_PRESETS[world]);

    const isSecurity = world === "security";
    targetRingBoost = isSecurity ? SECURITY_EMISSIVE_BOOST.ring : 1;
    targetPointBoost = isSecurity ? SECURITY_EMISSIVE_BOOST.point : 1;

    if (immediate) {
      currentColor.copy(targetColor);
      currentGlowColor.copy(targetGlowColor);
      currentRingBoost = targetRingBoost;
      currentPointBoost = targetPointBoost;
      Object.assign(currentPreset, targetPreset);
      applyAccentMaterials();
      lerpPreset(1);
    }
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

  const setReducedMotion = (reduced: boolean) => {
    reducedMotion = reduced;
    if (reduced) {
      clearPointer();
      ringsGroup.children.forEach((c) => {
        c.rotation.z = 0;
      });
    }
  };

  const dispose = () => {
    active = false;
    if (raf) cancelAnimationFrame(raf);
    for (const g of geometries) g.dispose();
    for (const m of materials) m.dispose();
    scene.remove(root);
    renderer.dispose();
  };

  setWorldState("core", true);
  setActive(true);
  return {
    resize,
    setWorldState,
    setPointer,
    clearPointer,
    setActive,
    setReducedMotion,
    dispose,
  };
}

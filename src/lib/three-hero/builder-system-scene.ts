import * as THREE from "three";
import {
  THREE_HERO_MAX_DPR,
  THREE_HERO_OPENING_MS,
  THREE_HERO_TARGET_FPS,
} from "@/lib/three-hero/builder-system-eligibility";
import { buildBuilderSystemGroup } from "@/lib/three-hero/builder-system-geometry";
import { createBuilderLightRig } from "@/lib/three-hero/builder-system-lights";
import {
  applySeamIntensity,
  createBuilderMaterials,
  type BuilderDebugMode,
} from "@/lib/three-hero/builder-system-materials";

export interface BuilderSystemSceneOptions {
  locale: "en" | "ar";
  debug?: BuilderDebugMode;
  portraitSrc?: string;
}

export interface BuilderSystemSceneHandle {
  resize: (width: number, height: number) => void;
  setPointer: (nx: number, ny: number) => void;
  clearPointer: () => void;
  setActive: (active: boolean) => void;
  resetAnimation: () => void;
  dispose: () => void;
}

const WORKSTATION_DESKTOP = "/images/alex/alex-workstation-desktop.webp";

function createNeutralEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#1a2030");
  const light = new THREE.HemisphereLight("#c8d0e0", "#10141c", 0.9);
  scene.add(light);
  const rt = pmrem.fromScene(scene, 0.04);
  pmrem.dispose();
  scene.remove(light);
  return rt.texture;
}

export async function createBuilderSystemScene(
  canvas: HTMLCanvasElement,
  options: BuilderSystemSceneOptions,
): Promise<BuilderSystemSceneHandle | null> {
  const debug = options.debug ?? null;
  const portraitSrc = options.portraitSrc ?? WORKSTATION_DESKTOP;

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
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 24);
  const isArabic = options.locale === "ar";
  camera.position.set(isArabic ? -1.65 : 1.85, 0.22, 3.75);
  camera.lookAt(isArabic ? 0.12 : -0.12, 0.02, 0);

  const materials = createBuilderMaterials(debug);
  const parts = buildBuilderSystemGroup(materials);
  scene.add(parts.root);

  const lights = createBuilderLightRig();
  scene.add(lights.group);
  lights.setDebug(debug);

  const envMap = createNeutralEnvironment(renderer);
  scene.environment = envMap;
  for (const mat of [
    materials.body,
    materials.bodyDark,
    materials.core,
    materials.coreAccent,
    ...Object.values(materials.seam),
  ]) {
    mat.envMap = envMap;
    mat.needsUpdate = true;
  }

  const textureLoader = new THREE.TextureLoader();
  let portraitTexture: THREE.Texture | null = null;
  try {
    portraitTexture = await new Promise<THREE.Texture>((resolve, reject) => {
      textureLoader.load(
        portraitSrc,
        (tex: THREE.Texture) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          resolve(tex);
        },
        undefined,
        reject,
      );
    });
    materials.portrait.map = portraitTexture;
    materials.portrait.needsUpdate = true;
  } catch {
    parts.portrait.visible = false;
  }

  let active = true;
  let raf = 0;
  let lastFrame = 0;
  let openingStart = performance.now();
  let pointerX = 0;
  let pointerY = 0;
  let pointerTargetX = 0;
  let pointerTargetY = 0;
  let hasPointer = false;
  let idlePhase = 0;

  const seamState = {
    brands: 0,
    systems: 0,
    intelligence: 0,
    security: 0,
  };

  const onContextLost = (event: Event) => {
    event.preventDefault();
    active = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  const onContextRestored = () => {
    openingStart = performance.now();
    if (active) schedule();
  };

  canvas.addEventListener("webglcontextlost", onContextLost, false);
  canvas.addEventListener("webglcontextrestored", onContextRestored, false);

  const frameInterval = 1000 / THREE_HERO_TARGET_FPS;

  const renderFrame = (now: number) => {
    raf = 0;
    if (!active) return;

    if (now - lastFrame < frameInterval) {
      schedule();
      return;
    }
    lastFrame = now;

    const elapsed = now - openingStart;
    const opening = Math.min(1, elapsed / THREE_HERO_OPENING_MS);
    const easeOut = 1 - Math.pow(1 - opening, 3);

    parts.rear.position.z = THREE.MathUtils.lerp(-0.22, 0, easeOut);
    parts.rear.rotation.y = THREE.MathUtils.lerp(isArabic ? 0.08 : -0.08, 0, easeOut);
    parts.front.position.z = THREE.MathUtils.lerp(0.18, 0, easeOut);
    const portraitMat = parts.portrait.material as THREE.MeshStandardMaterial;
    portraitMat.opacity = 1;
    portraitMat.transparent = false;

    const seamDelays = { brands: 0.45, intelligence: 0.55, systems: 0.65, security: 0.75 };
    for (const key of Object.keys(seamDelays) as Array<keyof typeof seamDelays>) {
      const local = Math.min(1, Math.max(0, (opening - seamDelays[key]) / 0.35));
      seamState[key] = local;
    }
    applySeamIntensity(materials, seamState, debug);

    if (hasPointer) {
      pointerX += (pointerTargetX - pointerX) * 0.06;
      pointerY += (pointerTargetY - pointerY) * 0.06;
    } else {
      pointerX += (0 - pointerX) * 0.04;
      pointerY += (0 - pointerY) * 0.04;
    }

    idlePhase += 0.0025;
    const idleYaw = Math.sin(idlePhase) * 0.004;
    const idlePitch = Math.cos(idlePhase * 0.8) * 0.003;

    const yaw = THREE.MathUtils.degToRad(pointerX * 3.2) + idleYaw;
    const pitch = THREE.MathUtils.degToRad(pointerY * 2.4) + idlePitch;

    parts.root.rotation.y = yaw;
    parts.root.rotation.x = pitch;

    renderer.render(scene, camera);
    schedule();
  };

  const schedule = () => {
    if (!active || raf) return;
    raf = requestAnimationFrame(renderFrame);
  };

  const resize = (width: number, height: number) => {
    if (width <= 0 || height <= 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, THREE_HERO_MAX_DPR);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const setPointer = (nx: number, ny: number) => {
    hasPointer = true;
    pointerTargetX = nx;
    pointerTargetY = ny;
  };

  const clearPointer = () => {
    hasPointer = false;
    pointerTargetX = 0;
    pointerTargetY = 0;
  };

  const setActive = (next: boolean) => {
    active = next;
    if (active) schedule();
    else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const resetAnimation = () => {
    openingStart = performance.now();
    parts.rear.position.z = -0.22;
    parts.front.position.z = 0.18;
    for (const key of Object.keys(seamState) as Array<keyof typeof seamState>) {
      seamState[key] = 0;
    }
    applySeamIntensity(materials, seamState, debug);
  };

  const dispose = () => {
    active = false;
    if (raf) cancelAnimationFrame(raf);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    canvas.removeEventListener("webglcontextrestored", onContextRestored);

    parts.dispose();
    materials.dispose();
    lights.dispose();
    envMap.dispose();
    portraitTexture?.dispose();

    scene.remove(parts.root);
    scene.remove(lights.group);
    renderer.dispose();
  };

  resetAnimation();
  setActive(true);

  return {
    resize,
    setPointer,
    clearPointer,
    setActive,
    resetAnimation,
    dispose,
  };
}

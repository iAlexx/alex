import * as THREE from "three";

export const WORLD_COLORS = {
  brands: new THREE.Color("#D4CEC4"),
  systems: new THREE.Color("#C4882A"),
  intelligence: new THREE.Color("#7B5FD4"),
  security: new THREE.Color("#3BC4D4"),
  core: new THREE.Color("#2F80FF"),
} as const;

export type WorldKey = keyof typeof WORLD_COLORS;

export type BuilderDebugMode =
  "materials" | "no-emissive" | "wireframe" | "lights" | "fallback" | "grayscale" | null;

export interface BuilderMaterialSet {
  body: THREE.MeshStandardMaterial;
  bodyDark: THREE.MeshStandardMaterial;
  glass: THREE.MeshPhysicalMaterial;
  seam: Record<Exclude<WorldKey, "core">, THREE.MeshStandardMaterial>;
  core: THREE.MeshStandardMaterial;
  coreAccent: THREE.MeshStandardMaterial;
  portrait: THREE.MeshStandardMaterial;
  dispose: () => void;
}

function metalBody(
  color = "#1a1f28",
  roughness = 0.42,
  metalness = 0.72,
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
    envMapIntensity: 0.35,
  });
}

function seamMaterial(tint: THREE.Color, emissive: THREE.Color): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: tint.clone().multiplyScalar(0.55),
    roughness: 0.38,
    metalness: 0.82,
    emissive,
    emissiveIntensity: 0.22,
  });
}

export function createBuilderMaterials(debug: BuilderDebugMode): BuilderMaterialSet {
  const noEmissive = debug === "no-emissive" || debug === "materials";
  const wireframe = debug === "wireframe";

  const body = metalBody("#181d26", 0.48, 0.78);
  const bodyDark = metalBody("#12161e", 0.52, 0.68);
  const glass = new THREE.MeshPhysicalMaterial({
    color: "#0c1018",
    roughness: 0.18,
    metalness: 0.15,
    transmission: 0.08,
    thickness: 0.35,
    transparent: true,
    opacity: 0.72,
    clearcoat: 0.35,
    clearcoatRoughness: 0.4,
  });

  const seam = {
    brands: seamMaterial(WORLD_COLORS.brands, WORLD_COLORS.brands),
    systems: seamMaterial(WORLD_COLORS.systems, WORLD_COLORS.systems),
    intelligence: seamMaterial(WORLD_COLORS.intelligence, WORLD_COLORS.intelligence),
    security: seamMaterial(WORLD_COLORS.security, WORLD_COLORS.security),
  } as const;

  const core = metalBody("#141a24", 0.4, 0.88);
  const coreAccent = new THREE.MeshPhysicalMaterial({
    color: "#0e1420",
    roughness: 0.32,
    metalness: 0.9,
    emissive: WORLD_COLORS.core,
    emissiveIntensity: noEmissive ? 0 : 0.35,
    clearcoat: 0.6,
    clearcoatRoughness: 0.25,
  });

  const portrait = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    roughness: 0.92,
    metalness: 0,
  });

  const all = [body, bodyDark, glass, core, coreAccent, portrait, ...Object.values(seam)];

  if (wireframe) {
    for (const mat of all) {
      mat.wireframe = true;
    }
  }

  if (noEmissive) {
    for (const mat of all) {
      if ("emissive" in mat && mat.emissive) {
        mat.emissive.setHex(0x000000);
        mat.emissiveIntensity = 0;
      }
    }
  }

  if (debug === "materials") {
    for (const mat of all) {
      mat.envMapIntensity = 0;
    }
  }

  return {
    body,
    bodyDark,
    glass,
    seam,
    core,
    coreAccent,
    portrait,
    dispose: () => {
      for (const mat of all) mat.dispose();
    },
  };
}

export function applySeamIntensity(
  materials: BuilderMaterialSet,
  intensities: Record<Exclude<WorldKey, "core">, number>,
  debug: BuilderDebugMode,
): void {
  const blocked = debug === "no-emissive" || debug === "materials" || debug === "wireframe";
  const keys = ["brands", "systems", "intelligence", "security"] as const;
  for (const key of keys) {
    const mat = materials.seam[key];
    mat.emissiveIntensity = blocked ? 0 : intensities[key] * 0.28;
  }
  materials.coreAccent.emissiveIntensity = blocked
    ? 0
    : Math.min(0.45, intensities.systems * 0.15 + 0.2);
}

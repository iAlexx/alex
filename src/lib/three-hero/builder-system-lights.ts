import * as THREE from "three";
import type { BuilderDebugMode } from "@/lib/three-hero/builder-system-materials";

export interface BuilderLightRig {
  group: THREE.Group;
  key: THREE.DirectionalLight;
  rim: THREE.DirectionalLight;
  fill: THREE.HemisphereLight;
  corePoint: THREE.PointLight;
  helpers: THREE.Object3D[];
  setDebug: (mode: BuilderDebugMode) => void;
  dispose: () => void;
}

export function createBuilderLightRig(): BuilderLightRig {
  const group = new THREE.Group();

  const fill = new THREE.HemisphereLight("#2a3344", "#080a0f", 0.42);
  group.add(fill);

  const key = new THREE.DirectionalLight("#f2dcc8", 1.35);
  key.position.set(2.4, 1.8, 3.2);
  key.castShadow = false;
  group.add(key);

  const rim = new THREE.DirectionalLight("#8eb8ff", 0.55);
  rim.position.set(-2.8, 0.6, -1.6);
  group.add(rim);

  const corePoint = new THREE.PointLight("#3d7fe8", 0.35, 4.5, 2);
  corePoint.position.set(0, -0.82, -0.2);
  group.add(corePoint);

  const keyTarget = new THREE.Object3D();
  keyTarget.position.set(-0.1, 0.05, 0);
  group.add(keyTarget);
  key.target = keyTarget;

  const rimTarget = new THREE.Object3D();
  rimTarget.position.set(0, 0, 0);
  group.add(rimTarget);
  rim.target = rimTarget;

  const helpers: THREE.Object3D[] = [];

  return {
    group,
    key,
    rim,
    fill,
    corePoint,
    helpers,
    setDebug(mode) {
      const show = mode === "lights";
      for (const helper of helpers) {
        group.remove(helper);
        if ("dispose" in helper && typeof helper.dispose === "function") helper.dispose();
      }
      helpers.length = 0;
      if (!show) return;
      const keyHelper = new THREE.DirectionalLightHelper(key, 0.25, "#f2dcc8");
      const rimHelper = new THREE.DirectionalLightHelper(rim, 0.25, "#8eb8ff");
      const pointHelper = new THREE.PointLightHelper(corePoint, 0.08, "#3d7fe8");
      group.add(keyHelper, rimHelper, pointHelper);
      helpers.push(keyHelper, rimHelper, pointHelper);
    },
    dispose() {
      for (const helper of helpers) {
        if ("dispose" in helper && typeof helper.dispose === "function") helper.dispose();
      }
      fill.dispose();
      key.dispose();
      rim.dispose();
      corePoint.dispose();
    },
  };
}

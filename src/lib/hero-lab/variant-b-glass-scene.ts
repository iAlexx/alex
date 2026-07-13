/**
 * Hero Lab Variant B — Glass Modular System (Phase 7.4R.1).
 * Layered translucent slabs with edge-lit pathways — lab only.
 */

import {
  LAB_FRAME_MS,
  LAB_MAX_PIXEL_RATIO,
  LAB_WORLD_COLORS,
  buildLabMvp,
  createLabContext,
  createProgram,
  type LabSceneBaseHandle,
  type Rgb,
} from "@/lib/hero-lab/webgl-utils";

export interface VariantBSceneOptions {
  simplified?: boolean;
}

interface GlassSlab {
  cx: number;
  cy: number;
  w: number;
  h: number;
  z: number;
  tint: Rgb;
  opacity: number;
}

const SLABS: GlassSlab[] = [
  { cx: 0, cy: 0, w: 2.8, h: 2.2, z: -0.55, tint: LAB_WORLD_COLORS.intelligence, opacity: 0.22 },
  {
    cx: -0.15,
    cy: 0.08,
    w: 2.2,
    h: 1.85,
    z: -0.28,
    tint: LAB_WORLD_COLORS.electric,
    opacity: 0.28,
  },
  { cx: 0.12, cy: -0.05, w: 1.9, h: 1.55, z: 0.02, tint: LAB_WORLD_COLORS.brands, opacity: 0.32 },
  { cx: -0.08, cy: 0.04, w: 1.55, h: 1.35, z: 0.28, tint: LAB_WORLD_COLORS.systems, opacity: 0.26 },
  { cx: 0.05, cy: -0.02, w: 1.25, h: 1.1, z: 0.48, tint: LAB_WORLD_COLORS.security, opacity: 0.2 },
];

const GLASS_VS = `
attribute vec3 aPos;
attribute vec2 aUv;
attribute vec4 aColor;
uniform mat4 uMvp;
uniform float uReveal;
uniform float uDepthShift;
varying vec2 vUv;
varying vec4 vColor;
varying float vReveal;
void main() {
  vUv = aUv;
  vColor = aColor;
  vReveal = uReveal;
  vec3 pos = aPos;
  pos.z += uDepthShift * 0.15;
  gl_Position = uMvp * vec4(pos, 1.0);
}`;

const GLASS_FS = `
precision mediump float;
varying vec2 vUv;
varying vec4 vColor;
varying float vReveal;
void main() {
  float edgeX = min(vUv.x, 1.0 - vUv.x);
  float edgeY = min(vUv.y, 1.0 - vUv.y);
  float edge = min(edgeX, edgeY);
  float rim = smoothstep(0.0, 0.08, edge) * (1.0 - smoothstep(0.08, 0.22, edge));
  float fresnel = pow(1.0 - edge * 2.0, 1.8);
  float body = 0.12 + fresnel * 0.18;
  vec3 col = vColor.rgb * (body + rim * 0.85);
  float a = (body + rim * 0.75) * vColor.a * vReveal;
  gl_FragColor = vec4(col, a);
}`;

const PATH_VS = `
attribute vec3 aPos;
attribute vec4 aColor;
uniform mat4 uMvp;
uniform float uReveal;
uniform float uPath;
varying vec4 vColor;
varying float vReveal;
void main() {
  vColor = aColor;
  vReveal = uReveal * uPath;
  gl_Position = uMvp * vec4(aPos, 1.0);
}`;

const PATH_FS = `
precision mediump float;
varying vec4 vColor;
varying float vReveal;
void main() {
  gl_FragColor = vec4(vColor.rgb, vColor.a * vReveal);
}`;

function pushSlab(verts: number[], slab: GlassSlab): void {
  const hw = slab.w / 2;
  const hh = slab.h / 2;
  const { cx, cy, z, tint, opacity } = slab;
  const corners: [number, number, number, number, number][] = [
    [cx - hw, cy - hh, z, 0, 0],
    [cx + hw, cy - hh, z, 1, 0],
    [cx + hw, cy + hh, z, 1, 1],
    [cx - hw, cy - hh, z, 0, 0],
    [cx + hw, cy + hh, z, 1, 1],
    [cx - hw, cy + hh, z, 0, 1],
  ];
  for (const [x, y, pz, u, v] of corners) {
    verts.push(x, y, pz, u, v, tint[0], tint[1], tint[2], opacity);
  }
}

function buildPaths(): Float32Array {
  const verts: number[] = [];
  const colors: Rgb[] = [
    LAB_WORLD_COLORS.intelligence,
    LAB_WORLD_COLORS.systems,
    LAB_WORLD_COLORS.brands,
    LAB_WORLD_COLORS.security,
  ];
  for (let i = 0; i < SLABS.length - 1; i++) {
    const a = SLABS[i];
    const b = SLABS[i + 1];
    if (!a || !b) continue;
    const c = colors[i % colors.length] ?? LAB_WORLD_COLORS.electric;
    verts.push(a.cx, a.cy, a.z, c[0], c[1], c[2], 0.75);
    verts.push(b.cx, b.cy, b.z, c[0], c[1], c[2], 0.35);
  }
  verts.push(-0.9, 0.6, 0.1, 0.55, 0.38, 1.0, 0.6);
  verts.push(0.85, -0.5, 0.15, 0.92, 0.64, 0.26, 0.5);
  return new Float32Array(verts);
}

export function createVariantBGlassScene(
  canvas: HTMLCanvasElement,
  options: VariantBSceneOptions = {},
): LabSceneBaseHandle | null {
  const gl = createLabContext(canvas);
  if (!gl) return null;

  const simplified = options.simplified === true;
  const slabs = simplified ? SLABS.slice(0, 3) : SLABS;
  const glassVerts: number[] = [];
  for (const slab of slabs) pushSlab(glassVerts, slab);
  const glassData = new Float32Array(glassVerts);
  const glassCount = glassData.length / 9;
  const pathData = buildPaths();
  const pathCount = pathData.length / 7;

  const glassProgram = createProgram(gl, GLASS_VS, GLASS_FS);
  const pathProgram = createProgram(gl, PATH_VS, PATH_FS);
  const glassBuffer = gl.createBuffer();
  const pathBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, glassBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, glassData, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, pathBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, pathData, gl.STATIC_DRAW);

  let rafId: number | null = null;
  let active = false;
  let disposed = false;
  let animStart = 0;
  let lastFrame = 0;
  let width = 1;
  let height = 1;
  let pointerX = 0;
  let pointerY = 0;
  let tiltX = 0;
  let tiltY = 0;
  const mvp = new Float32Array(16);

  const gMvp = gl.getUniformLocation(glassProgram, "uMvp");
  const gReveal = gl.getUniformLocation(glassProgram, "uReveal");
  const gDepth = gl.getUniformLocation(glassProgram, "uDepthShift");
  const pMvp = gl.getUniformLocation(pathProgram, "uMvp");
  const pReveal = gl.getUniformLocation(pathProgram, "uReveal");
  const pPath = gl.getUniformLocation(pathProgram, "uPath");

  function draw(now: number): void {
    if (!gl || !active || disposed) return;
    if (now - lastFrame < LAB_FRAME_MS) {
      rafId = requestAnimationFrame(draw);
      return;
    }
    lastFrame = now;
    if (animStart === 0) animStart = now;
    const elapsed = (now - animStart) / 1000;
    const reveal = Math.min(1, elapsed / 0.4);
    const depthShift = Math.min(1, elapsed / 1.2);
    const pathPulse = Math.min(1, Math.max(0, (elapsed - 0.5) / 0.8));

    tiltX += (pointerY * 0.05 - tiltX) * 0.04;
    tiltY += (pointerX * 0.07 - tiltY) * 0.04;

    const dpr = Math.min(window.devicePixelRatio || 1, LAB_MAX_PIXEL_RATIO);
    const bw = Math.max(1, Math.floor(width * dpr));
    const bh = Math.max(1, Math.floor(height * dpr));
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
      gl.viewport(0, 0, bw, bh);
    }

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    buildLabMvp(width / height, tiltX, tiltY, mvp, 3.2, 34);

    gl.useProgram(glassProgram);
    gl.uniformMatrix4fv(gMvp, false, mvp);
    gl.uniform1f(gReveal, reveal);
    gl.uniform1f(gDepth, depthShift);
    gl.bindBuffer(gl.ARRAY_BUFFER, glassBuffer);
    const gStride = 36;
    const gPos = gl.getAttribLocation(glassProgram, "aPos");
    const gUv = gl.getAttribLocation(glassProgram, "aUv");
    const gCol = gl.getAttribLocation(glassProgram, "aColor");
    gl.enableVertexAttribArray(gPos);
    gl.vertexAttribPointer(gPos, 3, gl.FLOAT, false, gStride, 0);
    gl.enableVertexAttribArray(gUv);
    gl.vertexAttribPointer(gUv, 2, gl.FLOAT, false, gStride, 12);
    gl.enableVertexAttribArray(gCol);
    gl.vertexAttribPointer(gCol, 4, gl.FLOAT, false, gStride, 20);
    gl.drawArrays(gl.TRIANGLES, 0, glassCount);

    gl.useProgram(pathProgram);
    gl.uniformMatrix4fv(pMvp, false, mvp);
    gl.uniform1f(pReveal, reveal);
    gl.uniform1f(pPath, pathPulse);
    gl.bindBuffer(gl.ARRAY_BUFFER, pathBuffer);
    const pStride = 28;
    const pPos = gl.getAttribLocation(pathProgram, "aPos");
    const pCol = gl.getAttribLocation(pathProgram, "aColor");
    gl.enableVertexAttribArray(pPos);
    gl.vertexAttribPointer(pPos, 3, gl.FLOAT, false, pStride, 0);
    gl.enableVertexAttribArray(pCol);
    gl.vertexAttribPointer(pCol, 4, gl.FLOAT, false, pStride, 12);
    gl.drawArrays(gl.LINES, 0, pathCount);

    rafId = requestAnimationFrame(draw);
  }

  return {
    setPointer(x, y) {
      pointerX = x;
      pointerY = y;
    },
    clearPointer() {
      pointerX = 0;
      pointerY = 0;
    },
    resize(w, h) {
      width = Math.max(1, w);
      height = Math.max(1, h);
    },
    setActive(isActive) {
      active = isActive;
      if (active && rafId === null) rafId = requestAnimationFrame(draw);
      if (!isActive && rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
    resetAnimation() {
      animStart = 0;
    },
    dispose() {
      disposed = true;
      active = false;
      if (rafId !== null) cancelAnimationFrame(rafId);
      gl.deleteBuffer(glassBuffer);
      gl.deleteBuffer(pathBuffer);
      gl.deleteProgram(glassProgram);
      gl.deleteProgram(pathProgram);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

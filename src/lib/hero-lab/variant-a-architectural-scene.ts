/**
 * Hero Lab Variant A — Architectural Builder Frame (Phase 7.4R.1).
 * Extruded metal modules with beveled edge lighting — lab only.
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

export interface VariantASceneOptions {
  simplified?: boolean;
  debug?: boolean;
}

interface ModuleSpec {
  key: keyof typeof LAB_WORLD_COLORS;
  cx: number;
  cy: number;
  w: number;
  h: number;
  d: number;
  rot: number;
  assembleDelay: number;
}

const MODULES: ModuleSpec[] = [
  { key: "brands", cx: -1.15, cy: 0.55, w: 0.85, h: 0.28, d: 0.18, rot: -0.14, assembleDelay: 0.1 },
  { key: "systems", cx: 1.18, cy: 0.5, w: 0.82, h: 0.26, d: 0.16, rot: 0.12, assembleDelay: 0.22 },
  {
    key: "intelligence",
    cx: 0.95,
    cy: -0.72,
    w: 0.78,
    h: 0.24,
    d: 0.15,
    rot: 0.09,
    assembleDelay: 0.34,
  },
  {
    key: "security",
    cx: -1.02,
    cy: -0.68,
    w: 0.8,
    h: 0.25,
    d: 0.17,
    rot: -0.11,
    assembleDelay: 0.46,
  },
];

const FACE_VS = `
attribute vec3 aPos;
attribute vec2 aUv;
attribute vec4 aColor;
uniform mat4 uMvp;
uniform float uReveal;
uniform float uAssemble;
varying vec2 vUv;
varying vec4 vColor;
varying float vReveal;
void main() {
  vUv = aUv;
  vColor = aColor;
  vReveal = uReveal * uAssemble;
  vec3 pos = aPos;
  pos.z *= mix(0.2, 1.0, uAssemble);
  pos.x += (1.0 - uAssemble) * 0.35 * sign(aPos.x);
  gl_Position = uMvp * vec4(pos, 1.0);
}`;

const FACE_FS = `
precision mediump float;
varying vec2 vUv;
varying vec4 vColor;
varying float vReveal;
void main() {
  float edgeX = min(vUv.x, 1.0 - vUv.x);
  float edgeY = min(vUv.y, 1.0 - vUv.y);
  float edge = min(edgeX, edgeY);
  float bevel = smoothstep(0.0, 0.12, edge) * (1.0 - smoothstep(0.12, 0.32, edge));
  float face = smoothstep(0.32, 0.5, edge);
  vec3 metal = vColor.rgb * (face * 0.55 + 0.15);
  vec3 lit = vColor.rgb * bevel * 1.35;
  float a = (face * 0.82 + bevel * 0.95) * vReveal * vColor.a;
  gl_FragColor = vec4(metal + lit, a);
}`;

const LINE_FS = `
precision mediump float;
varying vec4 vColor;
varying float vReveal;
void main() {
  gl_FragColor = vec4(vColor.rgb, vColor.a * vReveal);
}`;

function pushQuad(
  verts: number[],
  x0: number,
  y0: number,
  z0: number,
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number,
  x3: number,
  y3: number,
  z3: number,
  color: Rgb,
  alpha: number,
): void {
  const tris = [
    [x0, y0, z0, 0, 0],
    [x1, y1, z1, 1, 0],
    [x2, y2, z2, 1, 1],
    [x0, y0, z0, 0, 0],
    [x2, y2, z2, 1, 1],
    [x3, y3, z3, 0, 1],
  ] as const;
  for (const [x, y, z, u, v] of tris) {
    verts.push(x, y, z, u, v, color[0], color[1], color[2], alpha);
  }
}

function pushExtrudedBox(
  verts: number[],
  lines: number[],
  mod: ModuleSpec,
  simplified: boolean,
): void {
  const { cx, cy, w, h, d, rot } = mod;
  const accent = LAB_WORLD_COLORS[mod.key];
  const metal = LAB_WORLD_COLORS.metalMid;
  const hw = w / 2;
  const hh = h / 2;
  const hd = d / 2;

  const corners = [
    [-hw, -hh, -hd],
    [hw, -hh, -hd],
    [hw, hh, -hd],
    [-hw, hh, -hd],
    [-hw, -hh, hd],
    [hw, -hh, hd],
    [hw, hh, hd],
    [-hw, hh, hd],
  ] as const;

  const world = corners.map(([lx, ly, lz]) => {
    const x = cx + lx * Math.cos(rot) - ly * Math.sin(rot);
    const y = cy + lx * Math.sin(rot) + ly * Math.cos(rot);
    return [x, y, lz] as const;
  });

  const [c0, c1, c2, c3, c4, c5, c6, c7] = world;
  if (!c0 || !c1 || !c2 || !c3 || !c4 || !c5 || !c6 || !c7) return;

  // Front (accent face)
  pushQuad(
    verts,
    c4[0],
    c4[1],
    c4[2],
    c5[0],
    c5[1],
    c5[2],
    c6[0],
    c6[1],
    c6[2],
    c7[0],
    c7[1],
    c7[2],
    accent,
    0.95,
  );
  // Back metal
  pushQuad(
    verts,
    c1[0],
    c1[1],
    c1[2],
    c0[0],
    c0[1],
    c0[2],
    c3[0],
    c3[1],
    c3[2],
    c2[0],
    c2[1],
    c2[2],
    metal,
    0.7,
  );
  if (!simplified) {
    pushQuad(
      verts,
      c0[0],
      c0[1],
      c0[2],
      c1[0],
      c1[1],
      c1[2],
      c5[0],
      c5[1],
      c5[2],
      c4[0],
      c4[1],
      c4[2],
      metal,
      0.55,
    );
    pushQuad(
      verts,
      c1[0],
      c1[1],
      c1[2],
      c2[0],
      c2[1],
      c2[2],
      c6[0],
      c6[1],
      c6[2],
      c5[0],
      c5[1],
      c5[2],
      metal,
      0.5,
    );
    pushQuad(
      verts,
      c2[0],
      c2[1],
      c2[2],
      c3[0],
      c3[1],
      c3[2],
      c7[0],
      c7[1],
      c7[2],
      c6[0],
      c6[1],
      c6[2],
      metal,
      0.5,
    );
    pushQuad(
      verts,
      c3[0],
      c3[1],
      c3[2],
      c0[0],
      c0[1],
      c0[2],
      c4[0],
      c4[1],
      c4[2],
      c7[0],
      c7[1],
      c7[2],
      metal,
      0.55,
    );
  }

  const channel = LAB_WORLD_COLORS.electric;
  const pairs: [typeof c0, typeof c0][] = [
    [c4, c5],
    [c5, c6],
    [c6, c7],
    [c7, c4],
  ];
  for (const [a, b] of pairs) {
    lines.push(a[0], a[1], a[2], accent[0], accent[1], accent[2], 0.9);
    lines.push(b[0], b[1], b[2], accent[0], accent[1], accent[2], 0.55);
  }
  lines.push(cx, cy, -hd, channel[0], channel[1], channel[2], 0.5);
  lines.push(cx * 0.5, cy * 0.5, hd, channel[0], channel[1], channel[2], 0.25);
}

function buildGeometry(simplified: boolean): { faces: Float32Array; lines: Float32Array } {
  const faceVerts: number[] = [];
  const lineVerts: number[] = [];
  for (const mod of MODULES) {
    pushExtrudedBox(faceVerts, lineVerts, mod, simplified);
  }
  // Hub connectors
  const hub = LAB_WORLD_COLORS.electric;
  for (const mod of MODULES) {
    lineVerts.push(0, 0, 0, hub[0], hub[1], hub[2], 0.65);
    lineVerts.push(
      mod.cx * 0.62,
      mod.cy * 0.62,
      0,
      mod.key === "brands" ? 0.92 : 0.4,
      0.4,
      0.45,
      0.35,
    );
  }
  return {
    faces: new Float32Array(faceVerts),
    lines: new Float32Array(lineVerts),
  };
}

export function createVariantAArchitecturalScene(
  canvas: HTMLCanvasElement,
  options: VariantASceneOptions = {},
): LabSceneBaseHandle | null {
  const gl = createLabContext(canvas);
  if (!gl) return null;

  const simplified = options.simplified === true;
  const { faces, lines } = buildGeometry(simplified);
  const faceCount = faces.length / 9;
  const lineCount = lines.length / 7;

  const faceProgram = createProgram(gl, FACE_VS, FACE_FS);
  const LINE_VS = `
attribute vec3 aPos;
attribute vec4 aColor;
uniform mat4 uMvp;
uniform float uReveal;
uniform float uAssemble;
varying vec4 vColor;
varying float vReveal;
void main() {
  vColor = aColor;
  vReveal = uReveal * uAssemble;
  gl_Position = uMvp * vec4(aPos, 1.0);
}`;
  const lineProgram = createProgram(gl, LINE_VS, LINE_FS);

  const faceBuffer = gl.createBuffer();
  const lineBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, faceBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, faces, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, lines, gl.STATIC_DRAW);

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

  const faceMvp = gl.getUniformLocation(faceProgram, "uMvp");
  const faceReveal = gl.getUniformLocation(faceProgram, "uReveal");
  const faceAssemble = gl.getUniformLocation(faceProgram, "uAssemble");
  const lineMvp = gl.getUniformLocation(lineProgram, "uMvp");
  const lineReveal = gl.getUniformLocation(lineProgram, "uReveal");
  const lineAssemble = gl.getUniformLocation(lineProgram, "uAssemble");

  function getAssemble(elapsed: number): number {
    return Math.min(1, elapsed / 1.4);
  }

  function draw(now: number): void {
    if (!gl || !active || disposed) return;
    if (now - lastFrame < LAB_FRAME_MS) {
      rafId = requestAnimationFrame(draw);
      return;
    }
    lastFrame = now;
    if (animStart === 0) animStart = now;
    const elapsed = (now - animStart) / 1000;
    const reveal = Math.min(1, elapsed / 0.35);
    const assemble = getAssemble(elapsed);

    tiltX += (pointerY * 0.08 - tiltX) * 0.05;
    tiltY += (pointerX * 0.1 - tiltY) * 0.05;

    const dpr = Math.min(window.devicePixelRatio || 1, LAB_MAX_PIXEL_RATIO);
    const bw = Math.max(1, Math.floor(width * dpr));
    const bh = Math.max(1, Math.floor(height * dpr));
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
      gl.viewport(0, 0, bw, bh);
    }

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    buildLabMvp(width / height, tiltX, tiltY, mvp, 3.4, 32);

    gl.useProgram(faceProgram);
    gl.uniformMatrix4fv(faceMvp, false, mvp);
    gl.uniform1f(faceReveal, reveal);
    gl.uniform1f(faceAssemble, assemble);
    gl.bindBuffer(gl.ARRAY_BUFFER, faceBuffer);
    const fStride = 36;
    const fPos = gl.getAttribLocation(faceProgram, "aPos");
    const fUv = gl.getAttribLocation(faceProgram, "aUv");
    const fCol = gl.getAttribLocation(faceProgram, "aColor");
    gl.enableVertexAttribArray(fPos);
    gl.vertexAttribPointer(fPos, 3, gl.FLOAT, false, fStride, 0);
    gl.enableVertexAttribArray(fUv);
    gl.vertexAttribPointer(fUv, 2, gl.FLOAT, false, fStride, 12);
    gl.enableVertexAttribArray(fCol);
    gl.vertexAttribPointer(fCol, 4, gl.FLOAT, false, fStride, 20);
    gl.drawArrays(gl.TRIANGLES, 0, faceCount);

    gl.useProgram(lineProgram);
    gl.uniformMatrix4fv(lineMvp, false, mvp);
    gl.uniform1f(lineReveal, reveal);
    gl.uniform1f(lineAssemble, assemble);
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
    const lStride = 28;
    const lPos = gl.getAttribLocation(lineProgram, "aPos");
    const lCol = gl.getAttribLocation(lineProgram, "aColor");
    gl.enableVertexAttribArray(lPos);
    gl.vertexAttribPointer(lPos, 3, gl.FLOAT, false, lStride, 0);
    gl.enableVertexAttribArray(lCol);
    gl.vertexAttribPointer(lCol, 4, gl.FLOAT, false, lStride, 12);
    gl.drawArrays(gl.LINES, 0, lineCount);

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
      if (!active && rafId !== null) {
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
      if (faceBuffer) gl.deleteBuffer(faceBuffer);
      if (lineBuffer) gl.deleteBuffer(lineBuffer);
      gl.deleteProgram(faceProgram);
      gl.deleteProgram(lineProgram);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

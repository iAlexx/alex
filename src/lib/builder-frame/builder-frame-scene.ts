/**
 * ALEX Builder Frame — Phase 7.4R Hero WebGL.
 *
 * Architectural four-module frame (no sphere/reactor). Native WebGL only;
 * loaded via dynamic import from HeroBuilderFrame on eligible desktops.
 */

export interface BuilderFrameSceneOptions {
  debug?: boolean;
  /** Reduced geometry — Tier B tablets / modest desktops. */
  simplified?: boolean;
}

export interface BuilderFrameSceneHandle {
  setPointer(x: number, y: number): void;
  clearPointer(): void;
  resize(width: number, height: number): void;
  setActive(active: boolean): void;
  dispose(): void;
}

const MAX_PIXEL_RATIO = 1.5;
const FRAME_INTERVAL_MS = 1000 / 30;
const REVEAL_SECONDS = 1.6;
const MAX_TILT_X = 0.07; // ~4°
const MAX_TILT_Y = 0.09; // ~5°
const POINTER_DAMPING = 0.05;

const MODULE_COLORS = {
  brands: [0.95, 0.94, 0.91] as const,
  systems: [0.91, 0.63, 0.24] as const,
  intelligence: [0.51, 0.36, 1.0] as const,
  security: [0.15, 0.84, 0.91] as const,
  metal: [0.04, 0.05, 0.07] as const,
  channel: [0.18, 0.55, 1.0] as const,
};

interface PlateSpec {
  key: keyof typeof MODULE_COLORS;
  cx: number;
  cy: number;
  w: number;
  h: number;
  z: number;
  rot: number;
}

/** Four modules + two shallow shoulder occluders — frame void at center for portrait. */
const PLATES: PlateSpec[] = [
  { key: "brands", cx: -1.05, cy: 0.72, w: 0.72, h: 0.22, z: -0.35, rot: -0.12 },
  { key: "systems", cx: 1.08, cy: 0.68, w: 0.7, h: 0.2, z: -0.28, rot: 0.1 },
  { key: "intelligence", cx: 0.92, cy: -0.78, w: 0.66, h: 0.18, z: -0.42, rot: 0.08 },
  { key: "security", cx: -0.95, cy: -0.74, w: 0.68, h: 0.19, z: -0.38, rot: -0.14 },
  { key: "metal", cx: -0.55, cy: 0.12, w: 0.14, h: 0.42, z: 0.12, rot: -0.05 },
  { key: "metal", cx: 0.58, cy: 0.08, w: 0.12, h: 0.38, z: 0.1, rot: 0.06 },
];

const PLATE_VS = `
attribute vec3 aPos;
attribute vec2 aUv;
attribute vec4 aColor;
uniform mat4 uMvp;
varying vec2 vUv;
varying vec4 vColor;
void main() {
  vUv = aUv;
  vColor = aColor;
  gl_Position = uMvp * vec4(aPos, 1.0);
}`;

const PLATE_FS = `
precision mediump float;
varying vec2 vUv;
varying vec4 vColor;
uniform float uReveal;
uniform float uModulePulse;
void main() {
  vec2 uv = vUv;
  float edgeX = min(uv.x, 1.0 - uv.x);
  float edgeY = min(uv.y, 1.0 - uv.y);
  float edge = min(edgeX, edgeY);
  float rim = smoothstep(0.0, 0.08, edge) * (1.0 - smoothstep(0.08, 0.22, edge));
  float body = smoothstep(0.22, 0.35, edge);
  float glow = rim * (0.55 + uModulePulse * 0.35);
  vec3 base = vColor.rgb * body * 0.35;
  vec3 lit = vColor.rgb * glow;
  float a = (body * 0.55 + glow * 0.75) * uReveal * vColor.a;
  gl_FragColor = vec4(base + lit, a);
}`;

const LINE_VS = `
attribute vec3 aPos;
attribute vec4 aColor;
uniform mat4 uMvp;
varying vec4 vColor;
void main() {
  vColor = aColor;
  gl_Position = uMvp * vec4(aPos, 1.0);
}`;

const LINE_FS = `
precision mediump float;
varying vec4 vColor;
uniform float uReveal;
void main() {
  gl_FragColor = vec4(vColor.rgb, vColor.a * uReveal);
}`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("shader alloc failed");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`shader compile failed: ${log ?? "unknown"}`);
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vs: string, fs: string): WebGLProgram {
  const program = gl.createProgram();
  if (!program) throw new Error("program alloc failed");
  const v = compileShader(gl, gl.VERTEX_SHADER, vs);
  const f = compileShader(gl, gl.FRAGMENT_SHADER, fs);
  gl.attachShader(program, v);
  gl.attachShader(program, f);
  gl.linkProgram(program);
  gl.deleteShader(v);
  gl.deleteShader(f);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`program link failed: ${log ?? "unknown"}`);
  }
  return program;
}

function buildMvp(aspect: number, rotX: number, rotY: number, out: Float32Array): void {
  const fovY = (28 * Math.PI) / 180;
  const near = 0.1;
  const far = 12;
  const f = 1 / Math.tan(fovY / 2);
  const dist = 3.8;

  const cx = Math.cos(rotX);
  const sx = Math.sin(rotX);
  const cy = Math.cos(rotY);
  const sy = Math.sin(rotY);

  const m00 = cy;
  const m02 = sy;
  const m10 = sx * sy;
  const m11 = cx;
  const m12 = -sx * cy;
  const m20 = -cx * sy;
  const m21 = sx;
  const m22 = cx * cy;

  const p00 = f / aspect;
  const p11 = f;
  const p22 = (far + near) / (near - far);
  const p23 = (2 * far * near) / (near - far);

  out[0] = p00 * m00;
  out[1] = p11 * m10;
  out[2] = p22 * m20;
  out[3] = -m20;
  out[4] = 0;
  out[5] = p11 * m11;
  out[6] = p22 * m21;
  out[7] = -m21;
  out[8] = p00 * m02;
  out[9] = p11 * m12;
  out[10] = p22 * m22;
  out[11] = -m22;
  out[12] = 0;
  out[13] = 0;
  out[14] = p22 * -dist + p23;
  out[15] = dist;
}

function pushPlateVerts(plate: PlateSpec, verts: number[]): void {
  const [r, g, b] = MODULE_COLORS[plate.key];
  const hw = plate.w / 2;
  const hh = plate.h / 2;
  const cr = Math.cos(plate.rot);
  const sr = Math.sin(plate.rot);
  const corners: [number, number][] = [
    [-hw, -hh],
    [hw, -hh],
    [hw, hh],
    [-hw, -hh],
    [hw, hh],
    [-hw, hh],
  ];
  for (const [lx, ly] of corners) {
    const x = plate.cx + lx * cr - ly * sr;
    const y = plate.cy + lx * sr + ly * cr;
    verts.push(x, y, plate.z, lx / plate.w + 0.5, ly / plate.h + 0.5, r, g, b, 0.92);
  }
}

function buildPlateVertices(simplified: boolean): Float32Array {
  const verts: number[] = [];
  const plates = simplified ? PLATES.filter((p) => p.key !== "metal") : PLATES;
  for (const plate of plates) {
    pushPlateVerts(plate, verts);
  }
  return new Float32Array(verts);
}

function buildConnectorLines(simplified: boolean): Float32Array {
  const verts: number[] = [];
  const mods = PLATES.filter((p) => p.key !== "metal").slice(0, simplified ? 4 : 4);
  const [r, g, b] = MODULE_COLORS.channel;
  const pairs: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [0, 2],
    [1, 3],
  ];
  for (const [a, bIdx] of pairs) {
    const aPlate = mods[a];
    const bPlate = mods[bIdx];
    if (!aPlate || !bPlate) continue;
    verts.push(aPlate.cx, aPlate.cy, aPlate.z, r, g, b, 0.22);
    verts.push(bPlate.cx, bPlate.cy, bPlate.z, r, g, b, 0.12);
  }
  // Center hub lines
  for (const plate of mods) {
    verts.push(0, 0, -0.15, r, g, b, 0.35);
    verts.push(plate.cx * 0.55, plate.cy * 0.55, plate.z, r, g, b, 0.1);
  }
  return new Float32Array(verts);
}

export function createBuilderFrameScene(
  canvas: HTMLCanvasElement,
  options: BuilderFrameSceneOptions = {},
): BuilderFrameSceneHandle | null {
  const debug = options.debug === true && process.env.NODE_ENV === "development";
  const simplified = options.simplified === true;
  const log = (...args: unknown[]) => {
    if (debug) console.info("[builder-frame]", ...args);
  };

  let gl: WebGLRenderingContext | null = null;
  try {
    gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: "low-power",
    });
  } catch {
    gl = null;
  }
  if (!gl) {
    log("WebGL context creation failed");
    return null;
  }

  let plateProgram: WebGLProgram | null = null;
  let lineProgram: WebGLProgram | null = null;
  let plateBuffer: WebGLBuffer | null = null;
  let lineBuffer: WebGLBuffer | null = null;
  let plateVertexCount = 0;
  let lineVertexCount = 0;
  let plateMvpLoc: WebGLUniformLocation | null = null;
  let plateRevealLoc: WebGLUniformLocation | null = null;
  let platePulseLoc: WebGLUniformLocation | null = null;
  let lineMvpLoc: WebGLUniformLocation | null = null;
  let lineRevealLoc: WebGLUniformLocation | null = null;

  let rafId: number | null = null;
  let active = false;
  let disposed = false;
  let contextLost = false;
  let lastFrameTime = 0;
  let startTime = 0;

  let pointerTargetX = 0;
  let pointerTargetY = 0;
  let tiltX = 0;
  let tiltY = 0;

  let width = 1;
  let height = 1;
  const mvp = new Float32Array(16);

  function initGlResources(): boolean {
    if (!gl) return false;
    try {
      plateProgram = createProgram(gl, PLATE_VS, PLATE_FS);
      lineProgram = createProgram(gl, LINE_VS, LINE_FS);

      const plateData = buildPlateVertices(simplified);
      plateVertexCount = plateData.length / 8;
      plateBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, plateBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, plateData, gl.STATIC_DRAW);

      const lineData = buildConnectorLines(simplified);
      lineVertexCount = lineData.length / 7;
      lineBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, lineData, gl.STATIC_DRAW);

      plateMvpLoc = gl.getUniformLocation(plateProgram, "uMvp");
      plateRevealLoc = gl.getUniformLocation(plateProgram, "uReveal");
      platePulseLoc = gl.getUniformLocation(plateProgram, "uModulePulse");
      lineMvpLoc = gl.getUniformLocation(lineProgram, "uMvp");
      lineRevealLoc = gl.getUniformLocation(lineProgram, "uReveal");

      return true;
    } catch (error) {
      log("init failed", error);
      return false;
    }
  }

  if (!initGlResources()) {
    return null;
  }

  const onContextLost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
    active = false;
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
    log("context lost");
  };

  const onContextRestored = () => {
    contextLost = false;
    initGlResources();
    log("context restored");
  };

  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);

  function drawFrame(now: number): void {
    if (!gl || !plateProgram || !lineProgram || disposed || contextLost || !active) return;

    if (now - lastFrameTime < FRAME_INTERVAL_MS) {
      rafId = requestAnimationFrame(drawFrame);
      return;
    }
    lastFrameTime = now;

    if (startTime === 0) startTime = now;
    const elapsed = (now - startTime) / 1000;
    const reveal = Math.min(1, elapsed / REVEAL_SECONDS);
    const modulePulse =
      Math.max(0, Math.sin(elapsed * 1.2 - 1.4) * 0.5 + 0.5) * (reveal > 0.85 ? 1 : 0);

    tiltX += (pointerTargetY * MAX_TILT_X - tiltX) * POINTER_DAMPING;
    tiltY += (pointerTargetX * MAX_TILT_Y - tiltY) * POINTER_DAMPING;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
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

    const aspect = width / height;
    buildMvp(aspect, tiltX, tiltY, mvp);

    // Lines
    gl.useProgram(lineProgram);
    gl.uniformMatrix4fv(lineMvpLoc, false, mvp);
    gl.uniform1f(lineRevealLoc, reveal);
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
    const lineStride = 7 * 4;
    const linePos = gl.getAttribLocation(lineProgram, "aPos");
    const lineColor = gl.getAttribLocation(lineProgram, "aColor");
    gl.enableVertexAttribArray(linePos);
    gl.vertexAttribPointer(linePos, 3, gl.FLOAT, false, lineStride, 0);
    gl.enableVertexAttribArray(lineColor);
    gl.vertexAttribPointer(lineColor, 4, gl.FLOAT, false, lineStride, 12);
    gl.drawArrays(gl.LINES, 0, lineVertexCount);
    gl.disableVertexAttribArray(linePos);
    gl.disableVertexAttribArray(lineColor);

    // Plates
    gl.useProgram(plateProgram);
    gl.uniformMatrix4fv(plateMvpLoc, false, mvp);
    gl.uniform1f(plateRevealLoc, reveal);
    gl.uniform1f(platePulseLoc, modulePulse);
    gl.bindBuffer(gl.ARRAY_BUFFER, plateBuffer);
    const plateStride = 8 * 4;
    const platePos = gl.getAttribLocation(plateProgram, "aPos");
    const plateUv = gl.getAttribLocation(plateProgram, "aUv");
    const plateColor = gl.getAttribLocation(plateProgram, "aColor");
    gl.enableVertexAttribArray(platePos);
    gl.vertexAttribPointer(platePos, 3, gl.FLOAT, false, plateStride, 0);
    gl.enableVertexAttribArray(plateUv);
    gl.vertexAttribPointer(plateUv, 2, gl.FLOAT, false, plateStride, 12);
    gl.enableVertexAttribArray(plateColor);
    gl.vertexAttribPointer(plateColor, 4, gl.FLOAT, false, plateStride, 20);
    gl.drawArrays(gl.TRIANGLES, 0, plateVertexCount);
    gl.disableVertexAttribArray(platePos);
    gl.disableVertexAttribArray(plateUv);
    gl.disableVertexAttribArray(plateColor);

    rafId = requestAnimationFrame(drawFrame);
  }

  function startLoop(): void {
    if (rafId !== null || !active) return;
    rafId = requestAnimationFrame(drawFrame);
  }

  function stopLoop(): void {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  return {
    setPointer(x: number, y: number) {
      pointerTargetX = Math.max(-1, Math.min(1, x));
      pointerTargetY = Math.max(-1, Math.min(1, y));
    },
    clearPointer() {
      pointerTargetX = 0;
      pointerTargetY = 0;
    },
    resize(w: number, h: number) {
      width = Math.max(1, w);
      height = Math.max(1, h);
    },
    setActive(isActive: boolean) {
      active = isActive;
      if (active) startLoop();
      else stopLoop();
    },
    dispose() {
      disposed = true;
      active = false;
      stopLoop();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      if (gl) {
        if (plateBuffer) gl.deleteBuffer(plateBuffer);
        if (lineBuffer) gl.deleteBuffer(lineBuffer);
        if (plateProgram) gl.deleteProgram(plateProgram);
        if (lineProgram) gl.deleteProgram(lineProgram);
      }
      const lose = gl?.getExtension("WEBGL_lose_context");
      lose?.loseContext();
      gl = null;
      log("disposed");
    },
  };
}

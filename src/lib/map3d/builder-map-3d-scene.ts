/**
 * Builder Map 3D scene — Phase 7.4.
 *
 * Zero-dependency raw WebGL: one electric Alex Core, four world nodes in
 * shallow depth, thin connector lines, damped pointer parallax, and a subtle
 * breathing drift. Decorative only — the semantic Builder Map stays in HTML.
 *
 * Loaded exclusively via dynamic import from BuilderMap3D when the section
 * nears the viewport on an eligible desktop device.
 */

export interface BuilderMap3DSceneOptions {
  /** Development-only diagnostics (?threeDebug=1). */
  debug?: boolean;
}

export interface BuilderMap3DSceneHandle {
  /** Normalized pointer position in [-1, 1]; drives restrained parallax. */
  setPointer(x: number, y: number): void;
  /** Smoothly returns the scene to neutral. */
  clearPointer(): void;
  /** Resize the drawing buffer to match the container. */
  resize(width: number, height: number): void;
  /** Start/stop the render loop (intersection + page visibility). */
  setActive(active: boolean): void;
  /** Full teardown — buffers, programs, listeners, rAF. */
  dispose(): void;
}

const MAX_PIXEL_RATIO = 1.5;
const FRAME_INTERVAL_MS = 1000 / 30; // 30fps cap — decorative scene
const REVEAL_SECONDS = 1.4;
const MAX_TILT_X = 0.03; // ~1.7°
const MAX_TILT_Y = 0.045; // ~2.6°
const POINTER_DAMPING = 0.055;

/** World accents mirrored from globals.css — decorative layer only. */
const COLORS = {
  core: [0.31, 0.553, 1.0], // --color-electric #4f8dff
  brands: [0.784, 0.816, 0.863], // --accent-brand #c8d0dc
  systems: [0.831, 0.627, 0.329], // --accent-system #d4a054
  intelligence: [0.608, 0.494, 0.851], // --accent-intel #9b7ed9
  security: [0.898, 0.282, 0.302], // --accent-secure #E5484D
} as const;

interface SceneNode {
  pos: readonly [number, number, number];
  color: readonly [number, number, number];
  size: number;
}

/** Shallow spatial arrangement — core central, worlds offset slightly in z. */
const CORE_NODE: SceneNode = { pos: [0, 0, 0], color: [...COLORS.core], size: 0.42 };

const WORLD_NODES: SceneNode[] = [
  { pos: [-1.45, 0.04, -0.3], color: [...COLORS.brands], size: 0.26 },
  { pos: [1.45, -0.02, -0.22], color: [...COLORS.systems], size: 0.26 },
  { pos: [0.3, 0.52, -0.46], color: [...COLORS.intelligence], size: 0.24 },
  { pos: [-0.26, -0.52, -0.4], color: [...COLORS.security], size: 0.24 },
];

const ALL_NODES: SceneNode[] = [CORE_NODE, ...WORLD_NODES];

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

const GLOW_VS = `
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

const GLOW_FS = `
precision mediump float;
varying vec2 vUv;
varying vec4 vColor;
uniform float uReveal;
void main() {
  float edgeX = min(vUv.x, 1.0 - vUv.x);
  float edgeY = min(vUv.y, 1.0 - vUv.y);
  float edge = min(edgeX, edgeY);
  float rim = smoothstep(0.0, 0.1, edge) * (1.0 - smoothstep(0.1, 0.28, edge));
  float body = smoothstep(0.28, 0.4, edge) * 0.25;
  float a = (rim * 0.75 + body) * vColor.a * uReveal;
  gl_FragColor = vec4(vColor.rgb, a);
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

/** column-major 4×4 perspective * translate(0,0,-dist) * rotX * rotY */
function buildMvp(aspect: number, rotX: number, rotY: number, out: Float32Array): void {
  const fovY = (30 * Math.PI) / 180;
  const near = 0.1;
  const far = 10;
  const f = 1 / Math.tan(fovY / 2);
  const dist = 3.4;

  const cx = Math.cos(rotX);
  const sx = Math.sin(rotX);
  const cy = Math.cos(rotY);
  const sy = Math.sin(rotY);

  // model-view rows (rotY then rotX, then translate z by -dist)
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

  // out = P * MV (column-major)
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

function buildLineVertices(): Float32Array {
  const verts: number[] = [];
  for (const node of WORLD_NODES) {
    verts.push(...CORE_NODE.pos, ...COLORS.core, 0.4);
    verts.push(...node.pos, ...node.color, 0.16);
  }
  return new Float32Array(verts);
}

function buildModulePlateVertices(): Float32Array {
  const verts: number[] = [];
  for (const node of ALL_NODES) {
    const [x, y, z] = node.pos;
    const isCore = node === CORE_NODE;
    const hw = isCore ? node.size * 0.55 : node.size * 0.85;
    const hh = isCore ? node.size * 0.45 : node.size * 0.35;
    const [r, g, b] = node.color;
    const intensity = isCore ? 0.9 : 0.65;
    const quad: [number, number, number, number, number][] = [
      [x - hw, y - hh, z, 0, 0],
      [x + hw, y - hh, z, 1, 0],
      [x + hw, y + hh, z, 1, 1],
      [x - hw, y - hh, z, 0, 0],
      [x + hw, y + hh, z, 1, 1],
      [x - hw, y + hh, z, 0, 1],
    ];
    for (const [px, py, pz, u, v] of quad) {
      verts.push(px, py, pz, u, v, r, g, b, intensity);
    }
  }
  return new Float32Array(verts);
}

export function createBuilderMap3DScene(
  canvas: HTMLCanvasElement,
  options: BuilderMap3DSceneOptions = {},
): BuilderMap3DSceneHandle | null {
  const debug = options.debug === true && process.env.NODE_ENV === "development";
  const log = (...args: unknown[]) => {
    if (debug) console.info("[builder-map-3d]", ...args);
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
    log("WebGL context creation failed — static map remains");
    return null;
  }

  let lineProgram: WebGLProgram | null = null;
  let glowProgram: WebGLProgram | null = null;
  let lineBuffer: WebGLBuffer | null = null;
  let glowBuffer: WebGLBuffer | null = null;
  let lineMvpLoc: WebGLUniformLocation | null = null;
  let lineRevealLoc: WebGLUniformLocation | null = null;
  let glowMvpLoc: WebGLUniformLocation | null = null;
  let glowRevealLoc: WebGLUniformLocation | null = null;
  let lineVertexCount = 0;
  let glowVertexCount = 0;

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
      lineProgram = createProgram(gl, LINE_VS, LINE_FS);
      glowProgram = createProgram(gl, GLOW_VS, GLOW_FS);

      const lineData = buildLineVertices();
      lineVertexCount = lineData.length / 7;
      lineBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, lineData, gl.STATIC_DRAW);

      const glowData = buildModulePlateVertices();
      glowVertexCount = glowData.length / 9;
      glowBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, glowBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, glowData, gl.STATIC_DRAW);

      lineMvpLoc = gl.getUniformLocation(lineProgram, "uMvp");
      lineRevealLoc = gl.getUniformLocation(lineProgram, "uReveal");
      glowMvpLoc = gl.getUniformLocation(glowProgram, "uMvp");
      glowRevealLoc = gl.getUniformLocation(glowProgram, "uReveal");

      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.clearColor(0, 0, 0, 0);
      return true;
    } catch (error) {
      log("GL resource init failed", error);
      return false;
    }
  }

  function releaseGlResources(): void {
    if (!gl) return;
    if (lineBuffer) gl.deleteBuffer(lineBuffer);
    if (glowBuffer) gl.deleteBuffer(glowBuffer);
    if (lineProgram) gl.deleteProgram(lineProgram);
    if (glowProgram) gl.deleteProgram(glowProgram);
    lineBuffer = null;
    glowBuffer = null;
    lineProgram = null;
    glowProgram = null;
  }

  function renderFrame(now: number): void {
    rafId = null;
    if (disposed || !active || contextLost || !gl || !lineProgram || !glowProgram) return;

    if (now - lastFrameTime < FRAME_INTERVAL_MS) {
      rafId = requestAnimationFrame(renderFrame);
      return;
    }
    lastFrameTime = now;

    if (startTime === 0) startTime = now;
    const elapsed = (now - startTime) / 1000;

    // Reveal ramp — ease-out cubic; scene settles after ~1.4s.
    const t = Math.min(1, elapsed / REVEAL_SECONDS);
    const reveal = 1 - Math.pow(1 - t, 3);

    // Damped pointer parallax + imperceptible breathing drift.
    const driftY = Math.sin(elapsed * 0.24) * 0.006;
    const driftX = Math.cos(elapsed * 0.19) * 0.004;
    tiltY += (pointerTargetX * MAX_TILT_Y + driftY - tiltY) * POINTER_DAMPING;
    tiltX += (-pointerTargetY * MAX_TILT_X + driftX - tiltX) * POINTER_DAMPING;

    buildMvp(width / height, tiltX, tiltY, mvp);

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Connector lines
    gl.useProgram(lineProgram);
    gl.uniformMatrix4fv(lineMvpLoc, false, mvp);
    gl.uniform1f(lineRevealLoc, reveal);
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
    const linePos = gl.getAttribLocation(lineProgram, "aPos");
    const lineColor = gl.getAttribLocation(lineProgram, "aColor");
    gl.enableVertexAttribArray(linePos);
    gl.enableVertexAttribArray(lineColor);
    gl.vertexAttribPointer(linePos, 3, gl.FLOAT, false, 28, 0);
    gl.vertexAttribPointer(lineColor, 4, gl.FLOAT, false, 28, 12);
    gl.drawArrays(gl.LINES, 0, lineVertexCount);
    gl.disableVertexAttribArray(linePos);
    gl.disableVertexAttribArray(lineColor);

    // Node glows
    gl.useProgram(glowProgram);
    gl.uniformMatrix4fv(glowMvpLoc, false, mvp);
    gl.uniform1f(glowRevealLoc, reveal);
    gl.bindBuffer(gl.ARRAY_BUFFER, glowBuffer);
    const glowPos = gl.getAttribLocation(glowProgram, "aPos");
    const glowUv = gl.getAttribLocation(glowProgram, "aUv");
    const glowColor = gl.getAttribLocation(glowProgram, "aColor");
    gl.enableVertexAttribArray(glowPos);
    gl.enableVertexAttribArray(glowUv);
    gl.enableVertexAttribArray(glowColor);
    gl.vertexAttribPointer(glowPos, 3, gl.FLOAT, false, 36, 0);
    gl.vertexAttribPointer(glowUv, 2, gl.FLOAT, false, 36, 12);
    gl.vertexAttribPointer(glowColor, 4, gl.FLOAT, false, 36, 20);
    gl.drawArrays(gl.TRIANGLES, 0, glowVertexCount);
    gl.disableVertexAttribArray(glowPos);
    gl.disableVertexAttribArray(glowUv);
    gl.disableVertexAttribArray(glowColor);

    rafId = requestAnimationFrame(renderFrame);
  }

  function startLoop(): void {
    if (rafId === null && active && !disposed && !contextLost) {
      rafId = requestAnimationFrame(renderFrame);
    }
  }

  function stopLoop(): void {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function onContextLost(event: Event): void {
    event.preventDefault();
    contextLost = true;
    stopLoop();
    canvas.removeAttribute("data-map3d-active");
    log("WebGL context lost — canvas hidden, static map remains");
  }

  function onContextRestored(): void {
    if (disposed || !gl) return;
    contextLost = false;
    if (initGlResources()) {
      startTime = 0;
      canvas.setAttribute("data-map3d-active", "true");
      startLoop();
      log("WebGL context restored");
    }
  }

  canvas.addEventListener("webglcontextlost", onContextLost, false);
  canvas.addEventListener("webglcontextrestored", onContextRestored, false);

  if (!initGlResources()) {
    canvas.removeEventListener("webglcontextlost", onContextLost);
    canvas.removeEventListener("webglcontextrestored", onContextRestored);
    return null;
  }

  log("scene created", { pixelRatioCap: MAX_PIXEL_RATIO, fpsCap: 30 });

  return {
    setPointer(x, y) {
      pointerTargetX = Math.max(-1, Math.min(1, x));
      pointerTargetY = Math.max(-1, Math.min(1, y));
    },
    clearPointer() {
      pointerTargetX = 0;
      pointerTargetY = 0;
    },
    resize(cssWidth, cssHeight) {
      if (disposed || cssWidth <= 0 || cssHeight <= 0) return;
      width = cssWidth;
      height = cssHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
      const bufferWidth = Math.round(cssWidth * ratio);
      const bufferHeight = Math.round(cssHeight * ratio);
      if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
        canvas.width = bufferWidth;
        canvas.height = bufferHeight;
      }
    },
    setActive(next) {
      if (disposed) return;
      if (next === active) return;
      active = next;
      if (active) {
        canvas.setAttribute("data-map3d-active", "true");
        startLoop();
      } else {
        stopLoop();
      }
      log("active:", active);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      active = false;
      stopLoop();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      releaseGlResources();
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
      log("disposed");
    },
  };
}

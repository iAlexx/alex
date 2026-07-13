/**
 * Shared WebGL helpers for Hero Lab variants (Phase 7.4R.1).
 * Lab-only — not used by production homepage.
 */

export const LAB_MAX_PIXEL_RATIO = 1.5;
export const LAB_FRAME_MS = 1000 / 30;

export function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader {
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

export function createProgram(gl: WebGLRenderingContext, vs: string, fs: string): WebGLProgram {
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

/** Column-major perspective MVP with damped pointer rotation. */
export function buildLabMvp(
  aspect: number,
  rotX: number,
  rotY: number,
  out: Float32Array,
  dist = 3.6,
  fovDeg = 30,
): void {
  const fovY = (fovDeg * Math.PI) / 180;
  const near = 0.1;
  const far = 14;
  const f = 1 / Math.tan(fovY / 2);

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

export function createLabContext(canvas: HTMLCanvasElement): WebGLRenderingContext | null {
  try {
    return (
      canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        depth: true,
        stencil: false,
        premultipliedAlpha: false,
        powerPreference: "low-power",
      }) ?? null
    );
  } catch {
    return null;
  }
}

export interface LabSceneBaseHandle {
  setPointer(x: number, y: number): void;
  clearPointer(): void;
  resize(width: number, height: number): void;
  setActive(active: boolean): void;
  resetAnimation(): void;
  dispose(): void;
}

export type Rgb = readonly [number, number, number];

export const LAB_WORLD_COLORS = {
  brands: [0.92, 0.9, 0.86] as Rgb,
  systems: [0.92, 0.64, 0.26] as Rgb,
  intelligence: [0.55, 0.38, 1.0] as Rgb,
  security: [0.18, 0.86, 0.94] as Rgb,
  electric: [0.2, 0.55, 1.0] as Rgb,
  metalDark: [0.06, 0.07, 0.1] as Rgb,
  metalMid: [0.12, 0.14, 0.18] as Rgb,
} as const;

/**
 * The WebGL stage: one full-screen fragment shader behind the whole page.
 * It renders two stills at a time and dissolves between them through a
 * noise field with a film-burn edge, plus liquid warp, a cursor lens,
 * sound ripples, analog static, scroll-speed chromatic split, a colour
 * grade, grain and vignette. Plain WebGL 1, no dependencies.
 */
import { director, type Direction } from './director';

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uA;
uniform sampler2D uB;
uniform vec2 uSizeA;
uniform vec2 uSizeB;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uHover;
uniform float uMix;
uniform float uTime;
uniform float uStatic;
uniform float uWarp;
uniform float uPulse;
uniform float uVel;
uniform float uDim;
uniform float uZoom;
uniform float uFade;
uniform float uFocus;
uniform float uBurn;
uniform float uSat;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

// Object-fit: cover for a texture of the given pixel size.
vec2 cover(vec2 uv, vec2 size) {
  float rs = uRes.x / uRes.y;
  float ri = size.x / max(size.y, 1.0);
  vec2 s = rs > ri ? vec2(1.0, ri / rs) : vec2(rs / ri, 1.0);
  return (uv - 0.5) * s + 0.5;
}

vec3 split(sampler2D tex, vec2 uv, vec2 dir) {
  float r = texture2D(tex, uv + dir).r;
  float g = texture2D(tex, uv).g;
  float b = texture2D(tex, uv - dir).b;
  return vec3(r, g, b);
}

// One shot: cover-fit, chromatic split, and lens defocus when uFocus > 0.
// Defocus is a golden-angle disc of taps with a highlight boost, so bright
// points bloom into soft bokeh discs instead of a flat Gaussian smear.
vec3 shot(sampler2D tex, vec2 uv, vec2 size, vec2 ca) {
  vec2 c = cover(uv, size);
  vec3 col = split(tex, c, ca);
  if (uFocus > 0.002) {
    vec3 acc = col;
    float wsum = 1.0;
    float r = uFocus * 0.024;
    vec2 asp = vec2(uRes.y / uRes.x, 1.0);
    for (int i = 0; i < 16; i++) {
      float fi = float(i);
      float a = fi * 2.39996;
      float d = sqrt((fi + 0.5) / 16.0);
      vec3 s = texture2D(tex, c + vec2(cos(a), sin(a)) * d * r * asp).rgb;
      float w = 1.0 + dot(s, vec3(0.333)) * 2.5 * uFocus;
      acc += s * w;
      wsum += w;
    }
    col = acc / wsum;
  }
  return col;
}

void main() {
  float aspect = uRes.x / uRes.y;
  vec2 ar = vec2(aspect, 1.0);
  vec2 uv = vUv;
  vec2 p = (uv - 0.5) * ar;

  // Cursor lens: a soft bulge that pulls the image toward the pointer.
  vec2 m = (uMouse - 0.5) * ar;
  vec2 dm = p - m;
  float lens = exp(-dot(dm, dm) * 9.0) * uHover;
  uv -= dm / ar * lens * 0.16;

  // Liquid warp: domain-warped noise, slow.
  float t = uTime * 0.05;
  vec2 q = vec2(fbm(uv * 2.0 + t), fbm(uv * 2.0 + vec2(5.2, 1.3) - t));
  uv += (q - 0.5) * uWarp * 0.11;

  // Sound: concentric ripples from the centre.
  float r = length(p);
  uv += (p / max(r, 1e-4)) / ar * sin(r * 26.0 - uTime * 2.6) * 0.007 * uPulse * smoothstep(1.3, 0.0, r);

  // Analog tear: horizontal bands slip sideways under static.
  float band = floor(vUv.y * 70.0);
  float tear = (hash(vec2(band, floor(uTime * 18.0))) - 0.5) * uStatic * uStatic * 0.09;
  tear += sin(vUv.y * 9.0 + uTime * 3.0) * 0.004 * uStatic;
  uv.x += tear;

  // Slow push-in.
  uv = (uv - 0.5) / uZoom + 0.5;

  // Dissolve field with a film-burn edge.
  float n = fbm(vUv * 2.6 + q * 1.4);
  float w = 0.1;
  float edge = uMix * (1.0 + 2.0 * w) - w;
  float k = smoothstep(n - w, n + w, edge);
  float live = clamp(uMix * (1.0 - uMix) * 5.0, 0.0, 1.0) * uBurn;
  float burn = (1.0 - smoothstep(0.0, w * 0.55, abs(n - edge))) * live;
  // Calm pages: blend toward a plain crossfade instead of the noise mask.
  k = mix(smoothstep(0.0, 1.0, uMix), k, uBurn);

  // Images drift apart while dissolving, which reads as a melt.
  vec2 driftA = vec2(0.0, -0.06) * k * live;
  vec2 driftB = vec2(0.0, 0.06) * (1.0 - k) * live;
  vec2 ca = vec2(0.0018 + uVel * 0.014 + uStatic * 0.004 + burn * 0.01, 0.0);

  vec3 a = shot(uA, uv + driftA, uSizeA, ca);
  vec3 b = shot(uB, uv + driftB, uSizeB, ca);
  vec3 col = mix(a, b, k);

  // Grade: lift blacks into deep ink, warm the highlights, gentle S-curve.
  float l = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(col, vec3(l), 0.18);
  // Black and white scout frame, with a little extra contrast, as sat -> 0.
  vec3 bw = vec3(smoothstep(0.04, 0.96, l));
  col = mix(bw, col, uSat);
  col = mix(vec3(0.02, 0.035, 0.05), vec3(1.0, 0.95, 0.86), col);
  col = col * col * (3.0 - 2.0 * col);

  // Burn glow along the dissolve edge.
  col += vec3(1.0, 0.42, 0.12) * burn * 1.1;
  col += vec3(1.0, 0.8, 0.5) * burn * burn * 0.6;

  // Static: noise, scanlines and a rolling bright band.
  float s = hash(vUv * uRes + fract(uTime * 7.0) * 91.0);
  float scan = 0.8 + 0.2 * sin(vUv.y * uRes.y * 1.4);
  float roll = smoothstep(0.0, 0.05, fract(vUv.y * 0.6 - uTime * 0.22)) * (1.0 - smoothstep(0.05, 0.16, fract(vUv.y * 0.6 - uTime * 0.22)));
  vec3 st = vec3(s * scan + roll * 0.25) * vec3(0.92, 0.95, 1.0);
  col = mix(col, st, uStatic * 0.82);

  // Legibility, exposure, vignette, grain.
  col *= 1.0 - uDim * 0.62;
  float vig = smoothstep(1.25, 0.25, length(p * vec2(0.85, 1.1)));
  col *= mix(0.45, 1.0, vig);
  col *= uFade;
  col += (hash(vUv * uRes + fract(uTime) * 13.0) - 0.5) * 0.06;

  gl_FragColor = vec4(col, 1.0);
}`;

type Tex = { tex: WebGLTexture; w: number; h: number };

const UNIFORMS = [
  'uA', 'uB', 'uSizeA', 'uSizeB', 'uRes', 'uMouse', 'uHover', 'uMix', 'uTime',
  'uStatic', 'uWarp', 'uPulse', 'uVel', 'uDim', 'uZoom', 'uFade', 'uFocus', 'uBurn', 'uSat',
] as const;

export class Stage {
  private gl: WebGLRenderingContext;
  private u = {} as Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>;
  private textures: (Tex | null)[];
  private blank: Tex;
  private live: Direction = { ...director };
  private mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, hover: 0, thover: 0 };
  private vel = 0;
  /** Calm-page crossfade state: from frame a to frame b, progress t. */
  private pair = { a: 0, b: 0, t: 1 };
  private lastY = 0;
  private time = 0;
  private dpr = 1;
  private ro: ResizeObserver;

  constructor(
    private canvas: HTMLCanvasElement,
    srcs: readonly string[],
    private still: boolean,
  ) {
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    if (!gl) throw new Error('WebGL unavailable');
    this.gl = gl;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, this.shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, this.shader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? 'link failed');
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    for (const name of UNIFORMS) this.u[name] = gl.getUniformLocation(prog, name);
    gl.uniform1i(this.u.uA, 0);
    gl.uniform1i(this.u.uB, 1);

    this.blank = this.upload(null);
    this.textures = srcs.map(() => null);
    srcs.forEach((src, i) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        this.textures[i] = this.upload(img);
      };
      img.src = src;
    });

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    this.resize();
    this.lastY = window.scrollY;

    window.addEventListener('pointermove', this.onPointer, { passive: true });
    document.addEventListener('pointerleave', this.onLeave);
  }

  private shader(type: number, src: string) {
    const gl = this.gl;
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'compile failed');
    return s;
  }

  private upload(img: HTMLImageElement | null): Tex {
    const gl = this.gl;
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    if (img) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      return { tex, w: img.naturalWidth, h: img.naturalHeight };
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([8, 10, 12]));
    return { tex, w: 1, h: 1 };
  }

  private resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.round(this.canvas.clientWidth * this.dpr));
    const h = Math.max(1, Math.round(this.canvas.clientHeight * this.dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.gl.viewport(0, 0, w, h);
    }
  }

  private onPointer = (e: PointerEvent) => {
    this.mouse.tx = e.clientX / window.innerWidth;
    this.mouse.ty = 1 - e.clientY / window.innerHeight;
    this.mouse.thover = e.pointerType === 'mouse' ? 1 : 0.8;
  };

  private onLeave = () => {
    this.mouse.thover = 0;
  };

  /** Advance one frame. dt in seconds. */
  render(dt: number) {
    const gl = this.gl;
    const k = (rate: number) => 1 - Math.exp(-dt * rate);
    const live = this.live;
    const still = this.still;

    for (const key of Object.keys(director) as (keyof Direction)[]) {
      live[key] += (director[key] - live[key]) * k(key === 'shot' ? 5 : 3.2);
    }
    // Hard cuts: jump straight to the target frame, no dissolve.
    if (director.cut > 0.5) live.shot = Math.round(director.shot);

    const y = window.scrollY;
    const v = dt > 0 ? Math.abs(y - this.lastY) / dt : 0;
    this.lastY = y;
    this.vel += (Math.min(1, v / 2800) - this.vel) * k(v / 2800 > this.vel ? 8 : 2.5);

    const m = this.mouse;
    m.x += (m.tx - m.x) * k(4);
    m.y += (m.ty - m.y) * k(4);
    if (m.thover < 1) m.thover *= 1 - k(0.8);
    m.hover += (m.thover - m.hover) * k(3);

    if (!still) this.time += dt;

    const count = this.textures.length;
    const clampI = (i: number) => Math.min(count - 1, Math.max(0, i));
    let ia: number;
    let ib: number;
    let mix: number;
    if (director.burn < 0.5) {
      // Calm pages: crossfade straight from the frame on screen to the target,
      // never stepping through the frames in between.
      const target = clampI(Math.round(director.shot));
      if (target !== this.pair.b) {
        this.pair.a = this.pair.t > 0.5 ? this.pair.b : this.pair.a;
        this.pair.b = target;
        this.pair.t = this.pair.a === target ? 1 : 0;
      }
      this.pair.t = Math.min(1, this.pair.t + dt / 0.55);
      ia = this.pair.a;
      ib = this.pair.b;
      mix = this.pair.t * this.pair.t * (3 - 2 * this.pair.t);
      live.shot = target;
    } else {
      const s = clampI(live.shot);
      ia = Math.floor(s);
      ib = clampI(ia + 1);
      mix = s - ia;
      this.pair.a = this.pair.b = Math.round(s);
      this.pair.t = 1;
    }
    const a = this.textures[ia] ?? this.blank;
    const b = this.textures[ib] ?? this.blank;

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, a.tex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, b.tex);

    const u = this.u;
    gl.uniform2f(u.uSizeA, a.w, a.h);
    gl.uniform2f(u.uSizeB, b.w, b.h);
    gl.uniform2f(u.uRes, this.canvas.width, this.canvas.height);
    gl.uniform2f(u.uMouse, m.x, m.y);
    gl.uniform1f(u.uHover, still ? 0 : m.hover);
    gl.uniform1f(u.uMix, mix);
    gl.uniform1f(u.uTime, this.time);
    gl.uniform1f(u.uStatic, still ? Math.min(live.static, 0.25) : live.static);
    gl.uniform1f(u.uWarp, still ? 0 : live.warp);
    gl.uniform1f(u.uPulse, still ? 0 : live.pulse);
    gl.uniform1f(u.uVel, still ? 0 : this.vel);
    gl.uniform1f(u.uDim, live.dim);
    gl.uniform1f(u.uZoom, still ? 1 : live.zoom);
    gl.uniform1f(u.uFade, live.fade);
    gl.uniform1f(u.uFocus, live.focus);
    gl.uniform1f(u.uBurn, live.burn);
    gl.uniform1f(u.uSat, live.sat);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  destroy() {
    this.ro.disconnect();
    window.removeEventListener('pointermove', this.onPointer);
    document.removeEventListener('pointerleave', this.onLeave);
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
}

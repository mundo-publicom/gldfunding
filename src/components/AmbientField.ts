/**
 * Ambient field — the section-level sibling of the hero's capital flow.
 *
 * Same discipline: one draw call of gl.POINTS, every position computed on the
 * GPU from a time uniform, no per-frame CPU work and no buffer re-upload. What
 * changes between sections is a mode uniform and a seeded attribute buffer, so
 * four visually distinct motions cost one shader pair, not four.
 *
 * The variants are the hero's idea broken into its parts — capital drifting,
 * circling, streaming, and converging — so the page reads as one system rather
 * than a gallery of effects.
 */

import { ATMOSPHERE } from '../lib/atmosphere'
import { rng } from '../lib/gpu'

export type AmbientVariant = 'drift' | 'orbit' | 'stream' | 'converge'
export type AmbientHandle = { destroy: () => void; setPaused: (paused: boolean) => void }

const MODE: Record<AmbientVariant, number> = { drift: 0, orbit: 1, stream: 2, converge: 3 }

const VERT = /* glsl */ `#version 300 es
  in float aSeed;     // 0..1, stable per-particle phase offset
  in float aSpeed;
  in float aSize;
  in float aVarA;     // drift: x column · orbit/converge: angle · stream: lane y
  in float aVarB;     // drift/stream: sway amplitude · orbit/converge: radius
  in float aPhase;    // 0..1, decorrelates sway and tint from the path phase

  uniform float uTime;
  uniform float uDpr;
  uniform int   uMode;
  uniform vec2  uCenter;

  out float vFade;
  out float vTint;

  const float TAU = 6.28318530718;
  const float PI  = 3.14159265359;

  void main() {
    float t = fract(aSeed + uTime * aSpeed);
    vec2 pos;
    float fade;

    if (uMode == 0) {
      // Drift — capital settling upward through the section. Slowest of the four.
      pos = vec2(aVarA + sin(uTime * aSpeed * 2.4 + aPhase * TAU) * aVarB * 0.28,
                 mix(-1.18, 1.18, t));
      fade = sin(t * PI);
    } else if (uMode == 1) {
      // Orbit — a wide ring turning around the section's centre of gravity.
      float a = aVarA + uTime * aSpeed * 1.7;
      pos = uCenter + vec2(cos(a), sin(a)) * aVarB * vec2(1.0, 0.72);
      // No path ends to fade at, so breathe instead of blinking.
      fade = 0.34 + 0.4 * (0.5 + 0.5 * sin(uTime * aSpeed * 3.1 + aPhase * TAU));
    } else if (uMode == 2) {
      // Stream — lanes crossing the section, the way a wire moves.
      float x = mix(-1.22, 1.22, t);
      pos = vec2(x, aVarA + sin(x * 1.5 + aPhase * TAU) * aVarB * 0.1);
      fade = sin(t * PI);
    } else {
      // Converge — receivables spiralling home to a single node.
      float a = aVarA + t * 2.3;
      float r = (1.0 - t) * aVarB;
      pos = uCenter + vec2(cos(a), sin(a)) * r * vec2(1.0, 0.68);
      fade = sin(t * PI);
    }

    vFade = fade;
    vTint = aPhase;

    gl_Position = vec4(pos, 0.0, 1.0);
    gl_PointSize = aSize * uDpr * (0.75 + fade * 0.5);
  }
`

const FRAG = /* glsl */ `#version 300 es
  precision mediump float;

  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform float uAlpha;

  in float vFade;
  in float vTint;
  out vec4 fragColor;

  void main() {
    // Round, soft-edged point without a texture lookup.
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float alpha = smoothstep(0.5, 0.02, d) * vFade * uAlpha;
    vec3 c = mix(uColorA, uColorB, smoothstep(0.55, 1.0, vTint));
    // Premultiplied — see the blend setup below.
    fragColor = vec4(c * alpha, alpha);
  }
`

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

const hex = (v: string): [number, number, number] => [
  parseInt(v.slice(1, 3), 16) / 255,
  parseInt(v.slice(3, 5), 16) / 255,
  parseInt(v.slice(5, 7), 16) / 255,
]

export type AmbientOptions = {
  variant: AmbientVariant
  /** Light sections composite the field over paper; dark ones add light to it. */
  tone: 'light' | 'dark'
  /** Any 32-bit integer. Same seed, same field — renders stay repeatable. */
  seed: number
  /** Which half of the section the ring variants hang in. */
  anchor: 'left' | 'right'
}

/** Per-tone look. Light stays a whisper; dark can afford to glow. */
const TONE = {
  light: { colorA: ATMOSPHERE.aDeep, colorB: ATMOSPHERE.bDeep, alpha: 0.62, count: 210, size: [4.2, 8.6] },
  dark: { colorA: ATMOSPHERE.aGlow, colorB: ATMOSPHERE.b, alpha: 0.85, count: 300, size: [2.4, 5.4] },
} as const

export function createAmbientField(
  canvas: HTMLCanvasElement,
  { variant, tone, seed, anchor }: AmbientOptions,
): AmbientHandle | null {
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
    premultipliedAlpha: true,
  })
  if (!gl) return null

  const vs = compile(gl, gl.VERTEX_SHADER, VERT)
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) return null

  const program = gl.createProgram()
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }

  const look = TONE[tone]
  const rand = rng(seed)
  const COUNT = look.count
  const STRIDE = 6 // seed, speed, size, varA, varB, phase

  // The ring variants hang in one half of the section so the field never sits
  // symmetrically behind the copy. The caller picks the half — the poster is
  // anchored to the same side, so ground and field always agree.
  const centre: [number, number] = [anchor === 'left' ? -0.44 : 0.44, (rand() - 0.5) * 0.3]

  // Streams read as lanes, not noise: quantised y, and one speed per lane so a
  // lane travels as a dashed line rather than a cloud of independent motes.
  const LANES = 7
  const laneSpeed = Array.from({ length: LANES }, () => 0.05 + rand() * 0.075)

  const data = new Float32Array(COUNT * STRIDE)
  for (let i = 0; i < COUNT; i++) {
    const o = i * STRIDE
    const size = look.size[0] + rand() * (look.size[1] - look.size[0])

    let speed: number
    let varA: number
    let varB: number

    switch (variant) {
      case 'orbit':
        speed = 0.03 + rand() * 0.05
        varA = rand() * Math.PI * 2
        varB = 0.3 + rand() * 0.95
        break
      case 'stream':
        speed = laneSpeed[i % LANES]
        varA = ((i % LANES) / (LANES - 1)) * 1.9 - 0.95 + (rand() - 0.5) * 0.05
        varB = 0.35 + rand() * 0.65
        break
      case 'converge':
        speed = 0.04 + rand() * 0.07
        varA = rand() * Math.PI * 2
        varB = 0.75 + rand() * 0.8
        break
      default: // drift
        speed = 0.018 + rand() * 0.038
        varA = (rand() - 0.5) * 2.3
        varB = 0.2 + rand() * 0.8
    }

    data[o] = rand()
    data[o + 1] = speed
    data[o + 2] = size
    data[o + 3] = varA
    data[o + 4] = varB
    data[o + 5] = rand()
  }

  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

  const F = Float32Array.BYTES_PER_ELEMENT
  const bind = (name: string, size: number, offset: number) => {
    const loc = gl.getAttribLocation(program, name)
    if (loc < 0) return
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, STRIDE * F, offset * F)
  }
  bind('aSeed', 1, 0)
  bind('aSpeed', 1, 1)
  bind('aSize', 1, 2)
  bind('aVarA', 1, 3)
  bind('aVarB', 1, 4)
  bind('aPhase', 1, 5)
  gl.bindVertexArray(null)

  const uTime = gl.getUniformLocation(program, 'uTime')
  const uDpr = gl.getUniformLocation(program, 'uDpr')

  gl.useProgram(program)
  gl.uniform1i(gl.getUniformLocation(program, 'uMode'), MODE[variant])
  gl.uniform2f(gl.getUniformLocation(program, 'uCenter'), centre[0], centre[1])
  gl.uniform1f(gl.getUniformLocation(program, 'uAlpha'), look.alpha)
  gl.uniform3f(gl.getUniformLocation(program, 'uColorA'), ...hex(look.colorA))
  gl.uniform3f(gl.getUniformLocation(program, 'uColorB'), ...hex(look.colorB))

  // Premultiplied output, so the only difference between tones is the blend:
  // light sections composite over paper, dark ones add light to the ground.
  gl.enable(gl.BLEND)
  if (tone === 'dark') gl.blendFunc(gl.ONE, gl.ONE)
  else gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  gl.clearColor(0, 0, 0, 0)

  let raf = 0
  let paused = false
  let last = 0
  // Stagger the starting time so two sections of the same variant never march
  // in lockstep when both happen to be on screen.
  let elapsed = (seed % 997) / 13

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    // Ambient work runs at a lower ceiling than the hero — it is atmosphere.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const w = Math.round(rect.width * dpr)
    const h = Math.round(rect.height * dpr)
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    gl.viewport(0, 0, w, h)
    gl.useProgram(program)
    gl.uniform1f(uDpr, dpr)
  }

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame)
    if (paused) {
      last = now
      return
    }
    // Clamp dt so a backgrounded tab does not fast-forward the field on return.
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    elapsed += dt

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(program)
    gl.uniform1f(uTime, elapsed)
    gl.bindVertexArray(vao)
    gl.drawArrays(gl.POINTS, 0, COUNT)
  }

  resize()
  window.addEventListener('resize', resize)
  last = performance.now()
  raf = requestAnimationFrame(frame)

  return {
    setPaused: (v: boolean) => {
      paused = v
    },
    destroy: () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      gl.deleteBuffer(buffer)
      gl.deleteVertexArray(vao)
      gl.deleteProgram(program)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}

/**
 * Capital-flow field — the hero's WebGL scene.
 *
 * Raw WebGL, no framework. The scene is a single draw call of gl.POINTS with a
 * custom shader pair; every particle's position is computed on the GPU from a
 * time uniform, so there is no per-frame CPU work and no buffer re-upload.
 *
 * three.js was the obvious reach here and cost 125 KB gzipped for one draw
 * call — 39% over the hero's budget. This module is ~4 KB and does the same
 * thing. It is dynamically imported after first paint, only when every gate in
 * Hero.tsx passes, and is never the LCP element.
 */

const VERT = /* glsl */ `#version 300 es
  in float aSeed;      // 0..1, stable per-particle randomness
  in float aSpeed;
  in float aSize;
  in float aBack;      // 1.0 = receivable flowing home, 0.0 = capital going out
  in vec2  aTarget;    // destination node in clip space

  uniform float uTime;
  uniform vec2  uSource;
  uniform float uAspect;
  uniform float uDpr;

  out float vFade;
  out float vBack;

  // Quadratic bezier, bowed perpendicular so capital travels an arc, not a line.
  vec2 bezier(vec2 a, vec2 b, float t) {
    vec2 mid = (a + b) * 0.5;
    vec2 d   = b - a;
    vec2 ctl = mid + vec2(-d.y, d.x) * 0.22;
    float u  = 1.0 - t;
    return u * u * a + 2.0 * u * t * ctl + t * t * b;
  }

  void main() {
    float t = fract(aSeed + uTime * aSpeed);
    float prog = mix(t, 1.0 - t, aBack);

    vec2 pos = bezier(uSource, aTarget, prog);
    pos.x /= uAspect;

    // Fade in and out at the ends of the path so nothing pops into existence.
    vFade = sin(t * 3.14159265);
    vBack = aBack;

    gl_Position = vec4(pos, 0.0, 1.0);
    gl_PointSize = aSize * uDpr * (1.0 + vFade * 0.5);
  }
`

const FRAG = /* glsl */ `#version 300 es
  precision mediump float;

  uniform vec3 uCapital;      // outbound: bright leaf
  uniform vec3 uReceivable;   // inbound: cooler, dimmer

  in float vFade;
  in float vBack;
  out vec4 fragColor;

  void main() {
    // Round, soft-edged point without a texture lookup.
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float alpha = smoothstep(0.5, 0.05, d) * vFade * mix(1.0, 0.5, vBack);
    fragColor = vec4(mix(uCapital, uReceivable, vBack), alpha);
  }
`

export type FlowHandle = { destroy: () => void; setPaused: (paused: boolean) => void }

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

export function createCapitalFlow(canvas: HTMLCanvasElement): FlowHandle | null {
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
    premultipliedAlpha: false,
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

  const NODES = 20
  const PER_NODE = 44
  const COUNT = NODES * PER_NODE

  // Source sits right-of-centre so it never collides with the hero copy.
  const source: [number, number] = [0.42, 0.0]

  const nodes: [number, number][] = []
  for (let i = 0; i < NODES; i++) {
    const a = (i / NODES) * Math.PI * 2 + 0.45
    const r = 0.68 + (((i * 7) % 5) / 5) * 0.55
    nodes.push([source[0] + Math.cos(a) * r * 1.15, source[1] + Math.sin(a) * r * 0.9])
  }

  // Interleaved: seed, speed, size, back, targetX, targetY — 6 floats per particle.
  const STRIDE = 6
  const data = new Float32Array(COUNT * STRIDE)
  for (let i = 0; i < COUNT; i++) {
    const node = nodes[i % NODES]
    const back = i % 3 === 2 ? 1 : 0
    const o = i * STRIDE
    data[o] = Math.random()
    data[o + 1] = 0.05 + Math.random() * 0.055
    data[o + 2] = back ? 3.0 : 5.0
    data[o + 3] = back
    data[o + 4] = node[0]
    data[o + 5] = node[1]
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
  bind('aBack', 1, 3)
  bind('aTarget', 2, 4)
  gl.bindVertexArray(null)

  const uTime = gl.getUniformLocation(program, 'uTime')
  const uSource = gl.getUniformLocation(program, 'uSource')
  const uAspect = gl.getUniformLocation(program, 'uAspect')
  const uDpr = gl.getUniformLocation(program, 'uDpr')
  const uCapital = gl.getUniformLocation(program, 'uCapital')
  const uReceivable = gl.getUniformLocation(program, 'uReceivable')

  gl.useProgram(program)
  gl.uniform2f(uSource, source[0], source[1])
  gl.uniform3f(uCapital, 0x55 / 255, 0xe6 / 255, 0xcc / 255)
  gl.uniform3f(uReceivable, 0x7f / 255, 0xd9 / 255, 0xcb / 255)

  // Additive blending against a transparent canvas — the poster shows through.
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
  gl.clearColor(0, 0, 0, 0)

  let raf = 0
  let paused = false
  let last = 0
  let elapsed = 0

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
    const w = Math.round(rect.width * dpr)
    const h = Math.round(rect.height * dpr)
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    gl.viewport(0, 0, w, h)
    gl.useProgram(program)
    gl.uniform1f(uAspect, rect.width / rect.height)
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

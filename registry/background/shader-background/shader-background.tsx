import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface ShaderBackgroundProps {
  /** Content rendered above the shader. */
  children?: ReactNode
  /** Speed multiplier. 0 holds the field still. */
  speed?: number
  /** Strength of the color field, from 0 (plain background) to 1. */
  intensity?: number
  className?: string
}

const VERTEX = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`

// Domain-warped value noise: two layers of slow fbm bend the final field. Colors come in as
// uniforms read from the theme tokens; the second tone is the primary color rotated
// around the grey axis, so the field stays in the theme's family.
const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_intensity;
uniform vec3 u_background;
uniform vec3 u_primary;
uniform vec3 u_foreground;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v / 0.875;
}

vec3 hueRotate(vec3 c, float angle) {
  const vec3 k = vec3(0.57735);
  float ca = cos(angle);
  return c * ca + cross(k, c) * sin(angle) + k * dot(k, c) * (1.0 - ca);
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  vec2 s = p * 0.9;
  float t = u_time;
  vec2 q = vec2(fbm(s + vec2(0.0, t * 0.05)), fbm(s + vec2(5.2, 1.3) - vec2(t * 0.04, 0.0)));
  vec2 r = vec2(fbm(s + 2.2 * q + vec2(1.7, 9.2) + t * 0.03), fbm(s + 2.2 * q + vec2(8.3, 2.8) - t * 0.025));
  float n = fbm(s + 2.0 * r);

  vec3 second = clamp(hueRotate(u_primary, -0.55), 0.0, 1.0);
  float a = smoothstep(0.28, 0.72, n);
  float b = smoothstep(0.35, 0.8, r.x);
  float glint = smoothstep(0.72, 0.95, n);

  vec3 col = u_background;
  col = mix(col, second, b * 0.45 * u_intensity);
  col = mix(col, u_primary, a * 0.85 * u_intensity);
  col = mix(col, u_foreground, glint * 0.1 * u_intensity);

  float vignette = smoothstep(1.5, 0.35, length(p * vec2(0.8, 1.1)));
  col = mix(u_background, col, vignette);
  col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`

type RGB = [number, number, number]

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function createProgram(gl: WebGLRenderingContext) {
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX)
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
  if (!vs || !fs) return null
  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }
  return program
}

/** Resolves any CSS color (oklch included) to sRGB through a 1x1 canvas. */
function readToken(el: Element, name: string, probe: CanvasRenderingContext2D | null, fallback: RGB): RGB {
  const value = getComputedStyle(el).getPropertyValue(name).trim()
  if (!value || !probe) return fallback
  probe.clearRect(0, 0, 1, 1)
  probe.fillStyle = value
  probe.fillRect(0, 0, 1, 1)
  const [r, g, b] = probe.getImageData(0, 0, 1, 1).data
  return [r / 255, g / 255, b / 255]
}

// A fixed moment of the field, used for the still frame under reduced motion.
const STILL_TIME = 14

const FALLBACK =
  'radial-gradient(60% 70% at 25% 20%, color-mix(in oklch, var(--primary) 40%, transparent), transparent 70%), radial-gradient(55% 60% at 80% 75%, color-mix(in oklch, var(--primary) 25%, transparent), transparent 70%)'

/**
 * A soft, flowing noise field drawn by a raw WebGL fragment shader, tinted from the
 * theme tokens. It draws only while on screen, caps the pixel ratio at 2, renders a
 * single still frame under reduced motion and falls back to a CSS gradient without
 * WebGL.
 */
export function ShaderBackground({ children, speed = 1, intensity = 0.6, className }: ShaderBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)
  const reduced = usePrefersReducedMotion() ?? false
  const strength = Math.min(Math.max(intensity, 0), 1)

  const settings = useRef({ speed, intensity: strength, reduced })
  const sync = useRef<() => void>(() => {})

  useEffect(() => {
    settings.current = { speed, intensity: strength, reduced }
    sync.current()
  }, [speed, strength, reduced])

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    })
    const program = gl && createProgram(gl)
    if (!gl || !program) {
      setFailed(true)
      return
    }

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    gl.useProgram(program)

    const uniform = (name: string) => gl.getUniformLocation(program, name)
    const u = {
      resolution: uniform('u_resolution'),
      time: uniform('u_time'),
      intensity: uniform('u_intensity'),
      background: uniform('u_background'),
      primary: uniform('u_primary'),
      foreground: uniform('u_foreground'),
    }

    const probeCanvas = document.createElement('canvas')
    probeCanvas.width = probeCanvas.height = 1
    const probe = probeCanvas.getContext('2d', { willReadFrequently: true })
    const readColors = () => {
      gl.uniform3fv(u.background, readToken(canvas, '--background', probe, [0, 0, 0]))
      gl.uniform3fv(u.primary, readToken(canvas, '--primary', probe, [1, 0.5, 0.2]))
      gl.uniform3fv(u.foreground, readToken(canvas, '--foreground', probe, [1, 1, 1]))
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr))
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (canvas.width === width && canvas.height === height) return false
      canvas.width = width
      canvas.height = height
      gl.viewport(0, 0, width, height)
      return true
    }

    let time = STILL_TIME
    let frame = 0
    let last = 0
    let visible = false

    const draw = () => {
      gl.uniform2f(u.resolution, canvas.width, canvas.height)
      gl.uniform1f(u.time, settings.current.reduced ? STILL_TIME : time)
      gl.uniform1f(u.intensity, settings.current.intensity)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0
      last = now
      time += dt * settings.current.speed
      draw()
      frame = requestAnimationFrame(tick)
    }

    const running = () => visible && !document.hidden && !settings.current.reduced && settings.current.speed > 0

    sync.current = () => {
      if (running()) {
        if (!frame) {
          last = 0
          frame = requestAnimationFrame(tick)
        }
      } else {
        cancelAnimationFrame(frame)
        frame = 0
        draw()
      }
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync.current()
    })
    io.observe(root)

    const ro = new ResizeObserver(() => {
      if (resize() && !frame) draw()
    })
    ro.observe(canvas)

    // Re-read the tokens when the theme changes on <html>.
    const mo = new MutationObserver(() => {
      readColors()
      if (!frame) draw()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] })

    const onVisibility = () => sync.current()
    document.addEventListener('visibilitychange', onVisibility)

    const onLost = (event: Event) => {
      event.preventDefault()
      cancelAnimationFrame(frame)
      frame = 0
      setFailed(true)
    }
    canvas.addEventListener('webglcontextlost', onLost)

    resize()
    readColors()
    draw()

    return () => {
      cancelAnimationFrame(frame)
      frame = 0
      sync.current = () => {}
      io.disconnect()
      ro.disconnect()
      mo.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('webglcontextlost', onLost)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [])

  return (
    <div ref={rootRef} className={cn('relative isolate overflow-hidden bg-background', className)}>
      <div aria-hidden data-shader className="pointer-events-none absolute inset-0 -z-10">
        {failed ? (
          <div data-fallback className="absolute inset-0" style={{ backgroundImage: FALLBACK, opacity: Math.min(1, strength / 0.6) }} />
        ) : (
          <canvas ref={canvasRef} className="block size-full" />
        )}
      </div>
      {children}
    </div>
  )
}

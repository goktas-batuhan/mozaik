// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/light-rays.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useMemo, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface LightRaysProps {
  /** Content rendered above the rays. */
  children?: ReactNode
  /** Number of rays. */
  count?: number
  /** Any CSS color. Defaults to the primary token. */
  color?: string
  /** Blur of each ray in pixels. */
  blur?: number
  /** Seconds one ray takes to fade in, sway and fade out. */
  duration?: number
  /** Length of the rays. Any CSS length. */
  length?: string
  /** Seed for the layout of the rays, so a page always opens on the same one. */
  seed?: number
  className?: string
}

interface Ray {
  left: number
  rotate: number
  width: number
  swing: number
  delay: number
  length: number
  intensity: number
}

/** Small seeded random generator, 0 to 1. */
function createRandom(seed: number) {
  let state = seed >>> 0 || 1
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function createRays(count: number, seed: number): Ray[] {
  const random = createRandom(seed)
  return Array.from({ length: Math.max(count, 0) }, () => ({
    left: 8 + random() * 84,
    rotate: -28 + random() * 56,
    width: 160 + random() * 160,
    swing: 0.8 + random() * 1.8,
    delay: random(),
    length: 0.75 + random() * 0.5,
    intensity: 0.6 + random() * 0.5,
  }))
}

/**
 * Soft shafts of light that fade in, sway and fade out above a pair of glows.
 * Under reduced motion the rays hold a calm, still pose.
 */
export function LightRays({
  children,
  count = 7,
  color = 'var(--primary)',
  blur = 36,
  duration = 14,
  length = '70%',
  seed = 4,
  className,
}: LightRaysProps) {
  const reduced = usePrefersReducedMotion()
  const rays = useMemo(() => createRays(count, seed), [count, seed])
  const cycle = Math.max(duration, 0.1)

  return (
    <div
      className={cn('relative isolate overflow-hidden bg-background', className)}
      style={{ '--rays-color': color, '--rays-blur': `${blur}px`, '--rays-length': length } as CSSProperties}
    >
      <div aria-hidden data-light-rays className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-60 [background:radial-gradient(circle_at_20%_15%,color-mix(in_srgb,var(--rays-color)_30%,transparent),transparent_70%)]" />
        <div className="absolute inset-0 opacity-60 [background:radial-gradient(circle_at_80%_10%,color-mix(in_srgb,var(--rays-color)_24%,transparent),transparent_75%)]" />
        {rays.map((ray, index) => (
          <motion.div
            key={index}
            data-ray
            className="absolute -top-[12%] left-(--ray-left) h-(--ray-length) w-(--ray-width) origin-top -translate-x-1/2 rounded-full bg-linear-to-b from-[color-mix(in_srgb,var(--rays-color)_55%,transparent)] to-transparent blur-(--rays-blur)"
            style={
              {
                '--ray-left': `${ray.left}%`,
                '--ray-width': `${ray.width}px`,
                '--ray-length': `calc(var(--rays-length) * ${ray.length.toFixed(2)})`,
              } as CSSProperties
            }
            initial={{ rotate: ray.rotate, opacity: reduced ? ray.intensity * 0.5 : 0 }}
            animate={
              reduced
                ? { rotate: ray.rotate, opacity: ray.intensity * 0.5 }
                : {
                    opacity: [0, ray.intensity, 0],
                    rotate: [ray.rotate - ray.swing, ray.rotate + ray.swing, ray.rotate - ray.swing],
                  }
            }
            transition={
              reduced
                ? { duration: 0 }
                : {
                    duration: cycle * (0.75 + ray.delay * 0.5),
                    delay: ray.delay * cycle,
                    repeat: Infinity,
                    repeatDelay: cycle * 0.1,
                    ease: 'easeInOut',
                  }
            }
          />
        ))}
      </div>
      {children}
    </div>
  )
}

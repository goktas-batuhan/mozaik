// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/parallax-layers/index.tsx
import { type MotionValue, motion, useReducedMotion, useReducedMotionConfig, useScroll, useSpring, useTransform } from 'motion/react'
import { type ComponentPropsWithoutRef, type ReactNode, type RefObject, useRef } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface ParallaxLayer {
  id: string
  content: ReactNode
  /** 0 (does not move) to 1 (moves the full range). Negative values move the other way. */
  depth: number
  /** Blur in pixels, for a sense of distance. */
  blur?: number
  opacity?: number
}

export interface ParallaxLayersProps extends ComponentPropsWithoutRef<'div'> {
  layers: ParallaxLayer[]
  /** Axis the layers travel along. */
  direction?: 'vertical' | 'horizontal'
  /** Travel in pixels at depth 1. */
  range?: number
  /** Scrollable element that drives the motion. Defaults to the page. */
  container?: RefObject<HTMLElement | null>
}

/** A stack of layers that drift at different speeds as the scene scrolls past, which reads as depth. */
export function ParallaxLayers({ layers, direction = 'vertical', range = 80, container, className, ...props }: ParallaxLayersProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ container, target: ref, offset: ['start 0.95', 'end 0.6'] })
  const progress = useSpring(scrollYProgress, { damping: 30, mass: 0.5, stiffness: 200 })

  return (
    <div ref={ref} {...props} className={cn('relative overflow-hidden', className)}>
      {layers.map((layer) => (
        <Layer key={layer.id} layer={layer} progress={progress} range={range} direction={direction} still={reduced} />
      ))}
    </div>
  )
}

function Layer({ layer, progress, range, direction, still }: { layer: ParallaxLayer; progress: MotionValue<number>; range: number; direction: 'vertical' | 'horizontal'; still: boolean }) {
  const travel = useTransform(progress, [0, 1], [-range * layer.depth, range * layer.depth])
  const axis = still ? 0 : travel
  return (
    <motion.div
      className="absolute inset-0"
      style={{
        x: direction === 'horizontal' ? axis : 0,
        y: direction === 'vertical' ? axis : 0,
        opacity: layer.opacity ?? 1,
        filter: layer.blur ? `blur(${layer.blur}px)` : undefined,
      }}
    >
      {layer.content}
    </motion.div>
  )
}

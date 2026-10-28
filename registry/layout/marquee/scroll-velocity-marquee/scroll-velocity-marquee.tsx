// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/scroll-based-velocity.tsx
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useReducedMotionConfig, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'
import { type ComponentPropsWithoutRef, type RefObject, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface ScrollVelocityMarqueeProps extends ComponentPropsWithoutRef<'div'> {
  /** Resting speed in percent of the content width per second. */
  speed?: number
  /** 1 runs left, -1 runs right. Scrolling the other way flips it for a moment. */
  direction?: 1 | -1
  /** How much scroll speed adds to the marquee. 0 ignores the scroll. */
  scrollBoost?: number
  /** Scrollable element to listen to. Defaults to the page. */
  container?: RefObject<HTMLElement | null>
}

const wrap = (min: number, max: number, v: number) => ((((v - min) % (max - min)) + (max - min)) % (max - min)) + min

/** A marquee that crawls on its own and speeds up (or reverses) with how fast you scroll. Still under reduced motion. */
export function ScrollVelocityMarquee({ speed = 5, direction = 1, scrollBoost = 1, container, className, children, ...props }: ScrollVelocityMarqueeProps) {
  const reduced = usePrefersReducedMotion()
  const root = useRef<HTMLDivElement>(null)
  const block = useRef<HTMLDivElement>(null)
  const visible = useRef(true)
  const sign = useRef<1 | -1>(direction)
  const [copies, setCopies] = useState(3)

  const base = useMotionValue(0)
  const unit = useMotionValue(0)
  const { scrollY } = useScroll(container ? { container } : undefined)
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(velocity, (v) => Math.min(5, Math.abs(v) / 200) * scrollBoost)
  const x = useTransform([base, unit], ([b, u]) => `${-wrap(0, Number(u) || 1, Number(b) || 0)}px`)

  useEffect(() => {
    const el = root.current
    const first = block.current
    if (!el || !first) return
    const measure = () => {
      const w = first.scrollWidth
      unit.set(w)
      setCopies(w > 0 ? Math.max(3, Math.ceil(el.offsetWidth / w) + 2) : 3)
    }
    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(el)
    resize.observe(first)
    const io = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting
    })
    io.observe(el)
    return () => {
      resize.disconnect()
      io.disconnect()
    }
  }, [children, unit])

  useAnimationFrame((_, delta) => {
    if (reduced || !visible.current) return
    const w = unit.get()
    if (w <= 0) return
    const b = boost.get()
    const flip = velocity.get() < 0 ? -1 : 1
    sign.current = (b > 0.1 ? direction * flip : direction) as 1 | -1
    base.set(base.get() + sign.current * ((w * speed) / 100) * (1 + b) * (delta / 1000))
  })

  return (
    <div ref={root} {...props} className={cn('w-full overflow-hidden whitespace-nowrap', className)}>
      <motion.div className="inline-flex items-center will-change-transform select-none" style={{ x: reduced ? 0 : x }}>
        {Array.from({ length: copies }, (_, i) => (
          <div key={i} ref={i === 0 ? block : undefined} aria-hidden={i !== 0 || undefined} className="inline-flex shrink-0 items-center">
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

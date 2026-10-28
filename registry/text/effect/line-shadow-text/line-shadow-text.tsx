// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/line-shadow-text.tsx
import { motion, useInView, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useRef, type CSSProperties, type ElementType } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface LineShadowTextProps {
  /** The text. The shadow is a decorative copy, so screen readers read it once. */
  text: string
  /** Element to render. */
  as?: ElementType
  /** Color of the hatched shadow. Any CSS color. */
  shadowColor?: string
  /** Seconds the hatching takes to slide by one stripe. 0 holds it still. */
  duration?: number
  /** Turns the animation off and holds the hatching still. */
  disabled?: boolean
  className?: string
}

const STRIPE = 0.06

/** Text with a hatched, diagonal-lined shadow that slowly slides behind it. */
export function LineShadowText({
  text,
  as: Tag = 'span',
  shadowColor = 'var(--primary)',
  duration = 0.8,
  disabled = false,
  className,
}: LineShadowTextProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const inView = useInView(ref)
  const still = disabled || reduced || duration <= 0

  return (
    <Tag ref={ref} className={cn('relative z-0 inline-block', className)} style={{ '--shadow-color': shadowColor } as CSSProperties}>
      {text}
      <motion.span
        aria-hidden
        data-shadow
        className="pointer-events-none absolute top-[0.04em] left-[0.04em] -z-10 whitespace-pre text-transparent [background-clip:text] [-webkit-background-clip:text] [background-image:linear-gradient(45deg,transparent_45%,var(--shadow-color)_45%,var(--shadow-color)_55%,transparent_0)]"
        style={{ backgroundSize: `${STRIPE}em ${STRIPE}em` }}
        initial={{ backgroundPosition: '0em 0em' }}
        animate={still || !inView ? { backgroundPosition: '0em 0em' } : { backgroundPosition: [`0em 0em`, `${STRIPE}em ${-STRIPE}em`] }}
        transition={still ? { duration: 0 } : { duration, ease: 'linear', repeat: Infinity }}
      >
        {text}
      </motion.span>
    </Tag>
  )
}

import { motion, useInView, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useRef, useState, type ElementType } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface RollingTextProps {
  /** The text. Screen readers read it as one string. */
  text: string
  /** Element to render. */
  as?: ElementType
  /** When the letters roll. */
  trigger?: 'hover' | 'mount' | 'in-view'
  /** Seconds per letter. */
  duration?: number
  /** Seconds between letters. */
  stagger?: number
  /** Seconds before the first letter. */
  delay?: number
  /** Turns the animation off and renders plain text. */
  disabled?: boolean
  className?: string
}

/** Rolls every letter up and swaps it for a copy of itself. */
export function RollingText({
  text,
  as: Tag = 'span',
  trigger = 'hover',
  duration = 0.45,
  stagger = 0.025,
  delay = 0,
  disabled = false,
  className,
}: RollingTextProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [hovered, setHovered] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (trigger !== 'mount') return
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [trigger])

  if (disabled || reduced) {
    return (
      <Tag ref={ref} className={cn('inline-block', className)}>
        {text}
      </Tag>
    )
  }

  const active = trigger === 'hover' ? hovered : trigger === 'in-view' ? inView : mounted

  return (
    <Tag
      ref={ref}
      className={cn('inline-flex flex-wrap whitespace-pre', className)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <span className="sr-only">{text}</span>
      {Array.from(text).map((char, i) => (
        <span key={i} aria-hidden className="relative inline-block h-[1.15em] overflow-hidden leading-[1.15]">
          <motion.span
            className="flex flex-col"
            initial={false}
            animate={{ y: active ? '-50%' : '0%' }}
            transition={{ duration, delay: delay + i * stagger, ease: [0.65, 0, 0.35, 1] }}
          >
            <span>{char}</span>
            <span>{char}</span>
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

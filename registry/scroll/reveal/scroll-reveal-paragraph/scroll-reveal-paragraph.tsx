// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/scroll-reveal-paragraph/index.tsx
import { type MotionValue, motion, useReducedMotion, useReducedMotionConfig, useScroll, useTransform } from 'motion/react'
import { type ComponentPropsWithoutRef, type RefObject, useRef } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface ScrollRevealParagraphProps extends Omit<ComponentPropsWithoutRef<'p'>, 'children'> {
  /** The paragraph. Words light up one after another as it scrolls into view. */
  text: string
  /** Scrollable element that drives the reveal. Defaults to the page. */
  container?: RefObject<HTMLElement | null>
}

/** A paragraph whose words go from faint to full strength as you scroll it into view. */
export function ScrollRevealParagraph({ text, container, className, ...props }: ScrollRevealParagraphProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ container, target: ref, offset: ['start 0.9', 'start 0.25'] })
  const words = text.split(' ').filter(Boolean)

  return (
    <p ref={ref} {...props} className={cn('text-lg leading-7 text-foreground', className)}>
      {/* the whole string stays readable for assistive tech */}
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, i) => (
          <Word key={`${i}-${word}`} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} still={reduced}>
            {word}
          </Word>
        ))}
      </span>
    </p>
  )
}

function Word({ children, progress, range, still }: { children: string; progress: MotionValue<number>; range: [number, number]; still: boolean }) {
  const opacity = useTransform(progress, range, [0, 1])
  return (
    <span className="relative mr-[0.3em] inline-block">
      <span className="text-foreground/15">{children}</span>
      <motion.span className="absolute inset-0 text-foreground" style={{ opacity: still ? 1 : opacity }}>
        {children}
      </motion.span>
    </span>
  )
}

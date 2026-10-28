// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { Marquee } from '@/components/marquee'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface CtaMarqueeBandProps {
  /** Phrases that scroll across the band. Also read once by screen readers. */
  phrases: string[]
  /** Short line above the button. */
  title?: ReactNode
  actionLabel: ReactNode
  actionHref?: string
  onAction?: () => void
  /** Seconds the band takes for one full loop. */
  loopDuration?: number
  /** Seconds the content takes to fade in. */
  duration?: number
  /** Seconds before the entrance starts. */
  delay?: number
  /** Turns the entrance animation and the scrolling off. */
  disabled?: boolean
  className?: string
}

/** Full-width band of oversized phrases scrolling past, with one button underneath. */
export function CtaMarqueeBand({ phrases, title, actionLabel, actionHref, onAction, loopDuration = 40, duration = 0.6, delay = 0, disabled = false, className }: CtaMarqueeBandProps) {
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const actionClass =
    'inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-base font-semibold text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

  return (
    <section className={cn('@container w-full overflow-hidden py-16', className)}>
      <p className="sr-only">{phrases.join('. ')}</p>
      <div aria-hidden>
        <Marquee duration={loopDuration} gap="2.5rem" repeat={3} disabled={disabled} className="py-2">
          {phrases.map((p, i) => (
            <span key={`${p}-${i}`} className="flex shrink-0 items-center gap-10 text-5xl font-semibold tracking-tighter whitespace-nowrap text-foreground @xl:text-7xl">
              {p}
              <span className="size-3 rounded-full bg-primary" />
            </span>
          ))}
        </Marquee>
      </div>
      <motion.div
        initial={animate ? { opacity: 0, y: 16 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 flex flex-col items-center gap-4 px-6 text-center"
      >
        {title != null && <h2 className="text-lg font-medium text-muted-foreground">{title}</h2>}
        {actionHref ? (
          <a href={actionHref} onClick={onAction} className={actionClass}>
            {actionLabel}
          </a>
        ) : (
          <button type="button" onClick={onAction} className={actionClass}>
            {actionLabel}
          </button>
        )}
      </motion.div>
    </section>
  )
}

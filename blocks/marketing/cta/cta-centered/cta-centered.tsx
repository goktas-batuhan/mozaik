// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/blocks/ctas/cta-1/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface CtaAction {
  label: ReactNode
  href?: string
  onClick?: () => void
}

const buttonBase =
  'inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

function Action({ action, primary }: { action: CtaAction; primary?: boolean }) {
  const cls = cn(buttonBase, primary ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-border bg-background text-foreground hover:bg-accent')
  return action.href ? (
    <a href={action.href} onClick={action.onClick} className={cls}>
      {action.label}
    </a>
  ) : (
    <button type="button" onClick={action.onClick} className={cls}>
      {action.label}
    </button>
  )
}

export interface CtaCenteredProps {
  title: ReactNode
  description?: ReactNode
  primaryAction?: CtaAction
  secondaryAction?: CtaAction
  /** Seconds the content takes to rise into view. */
  duration?: number
  /** Seconds between pieces. */
  stagger?: number
  /** Seconds before the first piece. */
  delay?: number
  /** Turns the entrance animation off. */
  disabled?: boolean
  className?: string
}

/** Closing call to action: a headline and two buttons centered on a soft radial glow. */
export function CtaCentered({ title, description, primaryAction, secondaryAction, duration = 0.6, stagger = 0.08, delay = 0, disabled = false, className }: CtaCenteredProps) {
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const reveal = (i: number) => ({
    initial: animate ? { opacity: 0, y: 20 } : false,
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] as const },
  })

  return (
    <section className={cn('@container relative isolate w-full overflow-hidden rounded-3xl bg-muted/50', className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,var(--primary)_0%,transparent_70%)] opacity-15" />
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 py-20 text-center @3xl:py-28">
        <motion.h2 {...reveal(0)} className="text-3xl font-bold tracking-tight text-balance text-foreground @xl:text-4xl @4xl:text-5xl">
          {title}
        </motion.h2>
        {description != null && (
          <motion.p {...reveal(1)} className="max-w-xl text-lg text-balance text-muted-foreground">
            {description}
          </motion.p>
        )}
        {(primaryAction || secondaryAction) && (
          <motion.div {...reveal(2)} className="mt-3 flex flex-wrap items-center justify-center gap-3">
            {primaryAction && <Action action={primaryAction} primary />}
            {secondaryAction && <Action action={secondaryAction} />}
          </motion.div>
        )}
      </div>
    </section>
  )
}

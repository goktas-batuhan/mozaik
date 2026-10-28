// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/blocks/ctas/cta-2/index.tsx
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

export interface CtaSplitProps {
  title: ReactNode
  description?: ReactNode
  primaryAction?: CtaAction
  secondaryAction?: CtaAction
  /** Image or mock-up on the other side. A built-in gradient panel is drawn when empty. */
  media?: ReactNode
  /** Puts the media on the left. */
  reverse?: boolean
  /** Seconds the halves take to slide in. */
  duration?: number
  /** Seconds before the entrance starts. */
  delay?: number
  /** Turns the entrance animation off. */
  disabled?: boolean
  className?: string
}

const buttonBase =
  'inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

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

function DefaultMedia() {
  return (
    <svg aria-hidden viewBox="0 0 400 280" className="h-auto w-full">
      <rect width="400" height="280" className="fill-muted" />
      <circle cx="320" cy="60" r="90" className="fill-primary/20" />
      <circle cx="70" cy="240" r="110" className="fill-primary/10" />
      <rect x="40" y="40" width="230" height="200" rx="14" className="fill-card stroke-border" />
      <rect x="60" y="64" width="90" height="10" rx="5" className="fill-foreground/70" />
      <rect x="60" y="88" width="170" height="8" rx="4" className="fill-muted-foreground/30" />
      <rect x="60" y="106" width="140" height="8" rx="4" className="fill-muted-foreground/30" />
      <rect x="60" y="136" width="60" height="24" rx="12" className="fill-primary" />
      <rect x="60" y="176" width="170" height="40" rx="8" className="fill-muted" />
      <rect x="240" y="100" width="130" height="150" rx="14" className="fill-card stroke-border" />
      <rect x="256" y="120" width="98" height="64" rx="8" className="fill-primary/40" />
      <rect x="256" y="198" width="70" height="8" rx="4" className="fill-muted-foreground/30" />
      <rect x="256" y="214" width="50" height="8" rx="4" className="fill-muted-foreground/30" />
    </svg>
  )
}

/** Two-column call to action: copy and buttons on one side, a product image or mock-up on the other. */
export function CtaSplit({ title, description, primaryAction, secondaryAction, media, reverse = false, duration = 0.6, delay = 0, disabled = false, className }: CtaSplitProps) {
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const slide = (x: number) => ({
    initial: animate ? { opacity: 0, x } : false,
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration, delay, ease: [0.22, 1, 0.36, 1] as const },
  })

  return (
    <section className={cn('@container w-full', className)}>
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 @3xl:grid-cols-2 @3xl:gap-14 @3xl:py-24">
        <motion.div {...slide(reverse ? 24 : -24)} className={cn('flex min-w-0 flex-col items-start gap-5', reverse && '@3xl:order-2')}>
          <h2 className="text-3xl font-bold tracking-tight text-balance text-foreground @xl:text-4xl">{title}</h2>
          {description != null && <p className="text-lg leading-relaxed text-pretty text-muted-foreground">{description}</p>}
          {(primaryAction || secondaryAction) && (
            <div className="mt-2 flex flex-wrap gap-3">
              {primaryAction && <Action action={primaryAction} primary />}
              {secondaryAction && <Action action={secondaryAction} />}
            </div>
          )}
        </motion.div>
        <motion.div {...slide(reverse ? -24 : 24)} className="min-w-0">
          <div className="overflow-hidden rounded-2xl border border-border shadow-lg shadow-foreground/5">{media ?? <DefaultMedia />}</div>
        </motion.div>
      </div>
    </section>
  )
}

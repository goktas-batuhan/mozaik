// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { AuroraBackground } from '@/components/aurora-background'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface HeroAction {
  label: ReactNode
  href?: string
  onClick?: () => void
}

export interface HeroAuroraCenterProps {
  title: ReactNode
  description?: ReactNode
  primaryAction?: HeroAction
  secondaryAction?: HeroAction
  /** Three short selling points shown in a glass strip under the buttons. */
  highlights?: { title: string; text: string }[]
  /** Brightness of the aurora, 0 to 1. */
  intensity?: number
  /** Seconds each piece takes to fade in. */
  duration?: number
  /** Seconds between pieces. */
  stagger?: number
  /** Seconds before the first piece. */
  delay?: number
  /** Turns the entrance animation off. */
  disabled?: boolean
  className?: string
}

const buttonBase =
  'inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

function Action({ action, primary }: { action: HeroAction; primary?: boolean }) {
  const cls = cn(buttonBase, primary ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-border bg-background/60 text-foreground backdrop-blur hover:bg-accent')
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

/** Full-bleed hero on a drifting aurora, with a glass strip of three highlights along the bottom. */
export function HeroAuroraCenter({
  title,
  description,
  primaryAction,
  secondaryAction,
  highlights,
  intensity = 0.7,
  duration = 0.7,
  stagger = 0.09,
  delay = 0,
  disabled = false,
  className,
}: HeroAuroraCenterProps) {
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const reveal = (i: number) => ({
    initial: animate ? { opacity: 0, y: 20, filter: 'blur(8px)' } : false,
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] as const },
  })

  return (
    <AuroraBackground intensity={intensity} speed={disabled ? 0 : 1} className={cn('@container w-full rounded-3xl border border-border', className)}>
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 pt-20 text-center @3xl:pt-28">
        <motion.h1 {...reveal(0)} className="text-4xl leading-[1.03] font-semibold tracking-tight text-balance text-foreground @xl:text-6xl @4xl:text-7xl">
          {title}
        </motion.h1>
        {description != null && (
          <motion.p {...reveal(1)} className="max-w-xl text-base leading-relaxed text-pretty text-muted-foreground @xl:text-lg">
            {description}
          </motion.p>
        )}
        {(primaryAction || secondaryAction) && (
          <motion.div {...reveal(2)} className="flex flex-wrap justify-center gap-3">
            {primaryAction && <Action action={primaryAction} primary />}
            {secondaryAction && <Action action={secondaryAction} />}
          </motion.div>
        )}
      </div>
      {highlights && highlights.length > 0 && (
        <motion.ul {...reveal(3)} className="relative mx-auto mt-16 grid max-w-4xl gap-px overflow-hidden rounded-t-2xl border border-b-0 border-border bg-border @2xl:grid-cols-3">
          {highlights.map((h) => (
            <li key={h.title} className="bg-background/70 px-6 py-5 text-left backdrop-blur">
              <p className="text-sm font-semibold text-foreground">{h.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{h.text}</p>
            </li>
          ))}
        </motion.ul>
      )}
      {!highlights?.length && <div className="h-20" />}
    </AuroraBackground>
  )
}

// Source: ui-layouts/uilayouts (MIT) — https://github.com/ui-layouts/uilayouts/blob/main/packages/blocks/src/hero-section/hero-share-app.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface StoreButton {
  /** Store name, e.g. "App Store". */
  name: string
  /** Small line above the name, e.g. "Download on the". */
  caption?: string
  href?: string
  onClick?: () => void
  /** 'down' draws a download arrow, 'play' a triangle. */
  glyph?: 'down' | 'play'
}

export interface HeroStoreBadgesProps {
  /** Headline. The first line is set in the foreground, the second in the primary color. */
  title: [ReactNode, ReactNode]
  description?: ReactNode
  /** Social proof pill: initials stack and a label. */
  socialProof?: { label: ReactNode; people: string[] }
  /** Download buttons. */
  stores?: StoreButton[]
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

function Glyph({ kind }: { kind: 'down' | 'play' }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-7 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {kind === 'play' ? <path d="M7 4.5v15l12-7.5z" fill="currentColor" /> : <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" />}
    </svg>
  )
}

const storeClass =
  'inline-flex items-center gap-3 rounded-2xl bg-foreground px-5 py-3 text-left text-background shadow-lg shadow-foreground/10 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

/** App-download hero: social proof pill, a huge two-line headline and store buttons on a warm glow. */
export function HeroStoreBadges({
  title,
  description,
  socialProof,
  stores,
  duration = 0.6,
  stagger = 0.09,
  delay = 0,
  disabled = false,
  className,
}: HeroStoreBadgesProps) {
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const reveal = (i: number) => ({
    initial: animate ? { opacity: 0, y: 18 } : false,
    animate: { opacity: 1, y: 0 },
    transition: { duration, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] as const },
  })

  return (
    <section className={cn('@container relative isolate w-full overflow-hidden rounded-3xl border border-border bg-background', className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(125%_125%_at_50%_100%,transparent_40%,var(--primary)_220%)] opacity-40" />
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-16 text-center @3xl:py-24">
        {socialProof && (
          <motion.div {...reveal(0)} className="mb-8 inline-flex items-center gap-3 rounded-full border border-border bg-muted/60 py-1.5 pr-4 pl-1.5">
            <span aria-hidden className="flex -space-x-2.5">
              {socialProof.people.map((p, i) => (
                <span key={`${p}-${i}`} className="grid size-7 place-items-center rounded-full border-2 border-background bg-primary/20 text-[10px] font-semibold text-foreground">
                  {p}
                </span>
              ))}
            </span>
            <span className="text-sm font-medium text-muted-foreground">{socialProof.label}</span>
          </motion.div>
        )}
        <motion.h1 {...reveal(1)} className="text-5xl leading-[0.95] font-black tracking-tighter text-balance text-foreground @xl:text-7xl @4xl:text-8xl">
          <span className="block">{title[0]}</span>
          <span className="block text-primary">{title[1]}</span>
        </motion.h1>
        {description != null && (
          <motion.p {...reveal(2)} className="mt-8 max-w-2xl text-lg text-pretty text-muted-foreground @xl:text-xl">
            {description}
          </motion.p>
        )}
        {stores && stores.length > 0 && (
          <motion.div {...reveal(3)} className="mt-10 flex flex-col items-center gap-3 @sm:flex-row">
            {stores.map((s) => {
              const content = (
                <>
                  <Glyph kind={s.glyph ?? 'down'} />
                  <span className="flex flex-col leading-tight">
                    {s.caption && <span className="text-[11px] opacity-70">{s.caption}</span>}
                    <span className="text-base font-semibold">{s.name}</span>
                  </span>
                </>
              )
              return s.href ? (
                <a key={s.name} href={s.href} onClick={s.onClick} className={storeClass}>
                  {content}
                </a>
              ) : (
                <button key={s.name} type="button" onClick={s.onClick} className={storeClass}>
                  {content}
                </button>
              )
            })}
          </motion.div>
        )}
      </div>
    </section>
  )
}

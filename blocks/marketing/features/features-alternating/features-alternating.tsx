// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/blocks/features/features-3/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface FeatureRow {
  /** Headline of the row. */
  title: string
  /** Copy of the row. */
  description: ReactNode
  /** Mock-up, screenshot or illustration. */
  media: ReactNode
  /** Small link under the copy. */
  link?: { label: string; href: string }
}

export interface FeaturesAlternatingProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Copy under the headline. */
  description?: ReactNode
  /** Rows, top to bottom. The media side swaps on every other row. */
  features: FeatureRow[]
  /** Element for the headline. */
  titleAs?: ElementType
  /** Element for the root. */
  as?: ElementType
  /** Seconds each half takes to slide in. */
  duration?: number
  /** Turns the entrance animation off. */
  disabled?: boolean
  className?: string
}

/** Zig-zag rows: copy on one side, media on the other, swapping sides down the page. */
export function FeaturesAlternating({
  title,
  description,
  features,
  titleAs: Title = 'h2',
  as: Tag = 'section',
  duration = 0.6,
  disabled = false,
  className,
}: FeaturesAlternatingProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const ease = [0.22, 1, 0.36, 1] as const

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="mx-auto mb-14 flex max-w-2xl flex-col items-center gap-4 text-center">
        <Title id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </Title>
        {description != null && <p className="text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>}
      </div>
      <div className="flex flex-col gap-16 @3xl:gap-24">
        {features.map((f, i) => {
          const reversed = i % 2 === 1
          const from = reversed ? 24 : -24
          return (
            <div key={f.title} className="grid items-center gap-8 @3xl:grid-cols-2 @3xl:gap-14">
              <motion.div
                initial={animate ? { opacity: 0, x: from } : false}
                whileInView={animate ? { opacity: 1, x: 0 } : undefined}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration, ease }}
                className={cn('flex flex-col items-start gap-3', reversed && '@3xl:order-2')}
              >
                <h3 className="text-2xl font-semibold tracking-tight text-foreground">{f.title}</h3>
                <p className="text-base leading-relaxed text-muted-foreground">{f.description}</p>
                {f.link && (
                  <a
                    href={f.link.href}
                    className="mt-1 rounded-sm text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {f.link.label}
                  </a>
                )}
              </motion.div>
              <motion.div
                initial={animate ? { opacity: 0, x: -from } : false}
                whileInView={animate ? { opacity: 1, x: 0 } : undefined}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration, ease }}
                className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-md shadow-foreground/5"
              >
                {f.media}
              </motion.div>
            </div>
          )
        })}
      </div>
    </Tag>
  )
}

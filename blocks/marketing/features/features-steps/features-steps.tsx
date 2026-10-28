// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface FeatureStep {
  /** Name of the step. */
  title: string
  /** What happens in this step. */
  description: ReactNode
  /** Optional mock-up or snippet shown under the copy. */
  visual?: ReactNode
}

export interface FeaturesStepsProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Copy under the headline. */
  description?: ReactNode
  /** Small pill above the headline. */
  eyebrow?: ReactNode
  /** Steps in order. They are numbered from 1. */
  steps: FeatureStep[]
  /** Element for the headline. */
  titleAs?: ElementType
  /** Element for the root. */
  as?: ElementType
  /** Seconds each step takes to fade in. */
  duration?: number
  /** Turns the entrance animation off. */
  disabled?: boolean
  className?: string
}

/** A numbered vertical timeline: headline on the left, steps joined by a rail on the right. */
export function FeaturesSteps({
  title,
  description,
  eyebrow,
  steps,
  titleAs: Title = 'h2',
  as: Tag = 'section',
  duration = 0.5,
  disabled = false,
  className,
}: FeaturesStepsProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="grid gap-10 @3xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] @3xl:gap-16">
        <div className="flex flex-col items-start gap-4 @3xl:sticky @3xl:top-8 @3xl:self-start">
          {eyebrow != null && <span className="text-sm font-medium text-primary">{eyebrow}</span>}
          <Title id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
            {title}
          </Title>
          {description != null && <p className="text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>}
        </div>
        <ol className="flex flex-col">
          {steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={animate ? { opacity: 0, x: 16 } : false}
              whileInView={animate ? { opacity: 1, x: 0 } : undefined}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex gap-5 pb-10 last:pb-0"
            >
              {i < steps.length - 1 && <span aria-hidden className="absolute top-10 bottom-0 left-[1.1875rem] w-px bg-border" />}
              <span
                aria-hidden
                className="relative z-10 inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold text-primary tabular-nums"
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1 pt-1.5">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  <span className="sr-only">Step {i + 1}:</span>{' '}
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                {step.visual != null && <div className="mt-4">{step.visual}</div>}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </Tag>
  )
}

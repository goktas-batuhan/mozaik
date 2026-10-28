// Source: original
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, useState, type ElementType, type ReactNode } from 'react'
import { SmoothAccordion } from '@/components/smooth-accordion'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface FeatureAccordionItem {
  /** Unique id of the item. */
  id: string
  /** Heading of the accordion row. */
  title: string
  /** Copy revealed when the row is open. */
  description: ReactNode
  /** Preview shown in the media panel while the row is open. */
  media: ReactNode
}

export interface FeaturesAccordionMediaProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Copy under the headline. */
  description?: ReactNode
  /** One row per feature. Exactly one row is open at a time. */
  items: FeatureAccordionItem[]
  /** Row open on first render. Defaults to the first one. */
  defaultValue?: string
  /** Seconds the preview takes to cross-fade. */
  duration?: number
  /** Element for the headline. */
  titleAs?: ElementType
  /** Element for the root. */
  as?: ElementType
  /** Turns the preview animation off. */
  disabled?: boolean
  className?: string
}

/** Accordion on one side, a live preview on the other that follows the open row. Built on Smooth Accordion. */
export function FeaturesAccordionMedia({
  title,
  description,
  items,
  defaultValue,
  duration = 0.35,
  titleAs: Title = 'h2',
  as: Tag = 'section',
  disabled = false,
  className,
}: FeaturesAccordionMediaProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion() || disabled
  const [active, setActive] = useState(defaultValue ?? items[0]?.id)
  const current = items.find((item) => item.id === active)

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="grid items-center gap-10 @3xl:grid-cols-2 @3xl:gap-14">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-start gap-4">
            <Title id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
              {title}
            </Title>
            {description != null && <p className="text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>}
          </div>
          <SmoothAccordion
            type="single"
            collapsible={false}
            defaultValue={active ? [active] : []}
            onValueChange={(v) => v[0] && setActive(v[0])}
            items={items.map((item) => ({ id: item.id, title: item.title, content: item.description }))}
          />
        </div>
        <div className="relative aspect-[4/3] min-w-0 overflow-hidden rounded-2xl border border-border bg-muted/40">
          <AnimatePresence mode="wait" initial={false}>
            {current && (
              <motion.div
                key={current.id}
                initial={reduced ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
                transition={{ duration: reduced ? 0 : duration, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                {current.media}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Tag>
  )
}

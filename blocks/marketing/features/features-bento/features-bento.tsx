// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/blocks/features/features-2/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, type ElementType, type ReactNode } from 'react'
import { BentoCard, BentoGrid } from '@/components/bento-grid'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface FeatureBentoItem {
  /** Short name of the feature. */
  title: string
  /** One or two sentences. */
  description?: ReactNode
  /** Small icon before the title. */
  icon?: ReactNode
  /** Decorative artwork that fills the free space of the tile. */
  visual?: ReactNode
  /** Columns the tile spans on wide containers. */
  colSpan?: 1 | 2 | 3
  /** Rows the tile spans on wide containers. */
  rowSpan?: 1 | 2
  /** Makes the whole tile a link. */
  href?: string
}

export interface FeaturesBentoProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Copy under the headline. */
  description?: ReactNode
  /** Small pill above the headline. */
  eyebrow?: ReactNode
  /** The tiles, in reading order. The grid packs them densely. */
  features: FeatureBentoItem[]
  /** Minimum height of one grid row, any CSS length. */
  rowHeight?: string
  /** Element for the headline. */
  titleAs?: ElementType
  /** Element for the root. */
  as?: ElementType
  /** Seconds the grid takes to fade in. */
  duration?: number
  /** Turns the entrance animation off. */
  disabled?: boolean
  className?: string
}

/** A left-aligned headline over a bento grid of feature tiles. Built on Bento Grid. */
export function FeaturesBento({
  title,
  description,
  eyebrow,
  features,
  rowHeight = '12rem',
  titleAs: Title = 'h2',
  as: Tag = 'section',
  duration = 0.6,
  disabled = false,
  className,
}: FeaturesBentoProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="mb-10 grid gap-4 @3xl:grid-cols-[1fr_minmax(0,28rem)] @3xl:items-end @3xl:gap-12">
        <div className="flex flex-col items-start gap-4">
          {eyebrow != null && <span className="text-sm font-medium text-primary">{eyebrow}</span>}
          <Title id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
            {title}
          </Title>
        </div>
        {description != null && <p className="text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>}
      </div>
      <motion.div
        initial={animate ? { opacity: 0, y: 24 } : false}
        whileInView={animate ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
      >
        <BentoGrid columns={3} rowHeight={rowHeight}>
          {features.map((f) => (
            <BentoCard
              key={f.title}
              title={f.title}
              description={f.description}
              icon={f.icon}
              visual={f.visual}
              colSpan={f.colSpan}
              rowSpan={f.rowSpan}
              href={f.href}
            />
          ))}
        </BentoGrid>
      </motion.div>
    </Tag>
  )
}

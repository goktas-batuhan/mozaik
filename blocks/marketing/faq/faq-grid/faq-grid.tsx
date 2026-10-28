// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/blocks/faqs/faq-1/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface FaqItem {
  /** Unique id of the question. */
  id: string
  /** The question. */
  question: ReactNode
  /** The answer. */
  answer: ReactNode
}

export interface FaqGridProps {
  /** The section headline. Labels the section for assistive tech. */
  title?: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Questions and answers. Every answer stays visible. */
  items: FaqItem[]
  /** Seconds each answer takes to fade in. */
  duration?: number
  /** Seconds between answers. */
  stagger?: number
  /** Turns the entrance animation off. */
  disabled?: boolean
  /** Element for the root. */
  as?: ElementType
  className?: string
}

/** Every question and answer on the page at once, in a numbered grid. No clicks needed. */
export function FaqGrid({
  title = 'Good to know',
  description,
  items,
  duration = 0.5,
  stagger = 0.06,
  disabled = false,
  as: Tag = 'section',
  className,
}: FaqGridProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  return (
    <Tag aria-labelledby={id} className={cn('@container mx-auto w-full max-w-5xl', className)}>
      <div className="max-w-xl">
        <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </h2>
        {description != null && <p className="mt-4 leading-relaxed text-pretty text-muted-foreground">{description}</p>}
      </div>
      <dl className="mt-12 grid gap-x-10 gap-y-10 @2xl:grid-cols-2 @4xl:grid-cols-3">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={animate ? { opacity: 0, y: 16 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration, delay: i * stagger, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-border pt-5"
          >
            <span aria-hidden className="font-mono text-xs text-primary">
              {String(i + 1).padStart(2, '0')}
            </span>
            <dt className="mt-3 font-semibold text-foreground">{item.question}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</dd>
          </motion.div>
        ))}
      </dl>
    </Tag>
  )
}

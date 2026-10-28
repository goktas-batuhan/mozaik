// Source: ui-layouts/uilayouts (MIT) — https://github.com/ui-layouts/uilayouts/blob/main/packages/blocks/src/testimonial-section/messenger-testimonial.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface Testimonial {
  /** Unique id of the testimonial. */
  id: string
  /** What the person said. */
  quote: string
  /** Display name. The first letters become the avatar. */
  name: string
  /** Job title or role. */
  role?: string
  /** Company or project name. */
  company?: string
}

export interface TestimonialChatProps {
  /** The section headline. Labels the section for assistive tech. */
  title?: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Testimonials, shown as messages from top to bottom. Sides alternate. */
  items: Testimonial[]
  /** Seconds each message takes to appear. */
  duration?: number
  /** Seconds between messages. */
  stagger?: number
  /** Turns the entrance animation off. */
  disabled?: boolean
  /** Element for the root. */
  as?: ElementType
  className?: string
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')

/** Testimonials as a chat thread: bubbles on alternating sides with initials avatars. */
export function TestimonialChat({
  title = 'Straight from the inbox',
  description,
  items,
  duration = 0.45,
  stagger = 0.12,
  disabled = false,
  as: Tag = 'section',
  className,
}: TestimonialChatProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  return (
    <Tag aria-labelledby={id} className={cn('@container mx-auto w-full max-w-2xl', className)}>
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </h2>
        {description != null && <p className="mt-4 leading-relaxed text-pretty text-muted-foreground">{description}</p>}
      </div>
      <ul className="flex flex-col gap-5">
        {items.map((t, i) => {
          const mine = i % 2 === 1
          return (
            <motion.li
              key={t.id}
              initial={animate ? { opacity: 0, y: 14, scale: 0.97 } : false}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration, delay: i * stagger, ease: [0.22, 1, 0.36, 1] }}
              className={cn('flex items-end gap-3', mine && 'flex-row-reverse')}
            >
              <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-muted-foreground">
                {initials(t.name)}
              </span>
              <figure className={cn('flex max-w-[85%] flex-col gap-1.5', mine && 'items-end')}>
                <blockquote
                  className={cn(
                    'rounded-2xl px-4 py-3 text-sm leading-relaxed',
                    mine ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md bg-muted text-foreground',
                  )}
                >
                  {t.quote}
                </blockquote>
                <figcaption className="px-1 text-xs text-muted-foreground">
                  {t.name}
                  {(t.role || t.company) && <> · {[t.role, t.company].filter(Boolean).join(', ')}</>}
                </figcaption>
              </figure>
            </motion.li>
          )
        })}
      </ul>
    </Tag>
  )
}

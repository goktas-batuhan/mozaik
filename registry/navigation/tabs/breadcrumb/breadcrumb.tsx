// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/breadcrumb/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface BreadcrumbItem {
  /** Text or node shown for the item. */
  label: ReactNode
  /** Link target. Leave it out for the current page or a non-link step. */
  href?: string
}

export interface BreadcrumbProps {
  /** The trail in order. The last item is the current page. */
  items: BreadcrumbItem[]
  /** Custom separator between items. Defaults to a chevron. */
  separator?: ReactNode
  /** Seconds each item takes to slide in; items are staggered. Set 0 to skip the entrance. */
  duration?: number
  /** Extra classes for the nav element. */
  className?: string
}

const STAGGER = 0.04

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

/** A breadcrumb trail whose items slide in one after another. */
export function Breadcrumb({ items, separator, duration = 0.25, className }: BreadcrumbProps) {
  const reduced = usePrefersReducedMotion()
  const still = reduced || duration <= 0

  return (
    <nav aria-label="Breadcrumb" className={cn('inline-flex', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground sm:gap-2.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <motion.li
              key={typeof item.label === 'string' ? item.label : `breadcrumb-${index}`}
              className="inline-flex items-center gap-1.5"
              initial={still ? false : { opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={still ? { duration: 0 } : { duration, ease: 'easeOut', delay: index * STAGGER }}
            >
              {index > 0 && (
                <span aria-hidden className="mr-1.5 [&>svg]:size-3.5">
                  {separator ?? <Chevron />}
                </span>
              )}
              {isLast ? (
                <span aria-current="page" className="font-normal text-foreground">
                  {item.label}
                </span>
              ) : item.href ? (
                <a
                  href={item.href}
                  className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {item.label}
                </a>
              ) : (
                <span>{item.label}</span>
              )}
            </motion.li>
          )
        })}
      </ol>
    </nav>
  )
}

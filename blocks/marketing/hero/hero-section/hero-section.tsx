import { motion, useReducedMotion, useReducedMotionConfig, type Variants } from 'motion/react'
import { useId, type ElementType, type ReactNode } from 'react'
import { WordRotate } from '@/components/word-rotate'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface HeroAction {
  /** Button text. Can hold an icon next to the words. */
  label: ReactNode
  /** Renders a link when set. */
  href?: string
  /** Renders a button when there is no href. */
  onClick?: () => void
}

export interface HeroSectionProps {
  /** The headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Words that take turns after the headline, e.g. ["faster", "together"]. Uses Word Rotate. */
  rotatingWords?: string[]
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Small pill above the headline, e.g. "New · v1.0". */
  eyebrow?: ReactNode
  /** Filled call to action. */
  primaryAction?: HeroAction
  /** Outlined call to action next to the primary one. */
  secondaryAction?: HeroAction
  /** Image, video or mock-up. Sits beside the copy when `align` is 'left', below it when 'center'. */
  media?: ReactNode
  /** Text alignment and layout. */
  align?: 'center' | 'left'
  /** Element for the headline. */
  titleAs?: ElementType
  /** Element for the root. */
  as?: ElementType
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

const actionBase =
  'inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background @sm:w-auto'

function Action({ action, variant }: { action: HeroAction; variant: 'primary' | 'secondary' }) {
  const className = cn(
    actionBase,
    variant === 'primary'
      ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90'
      : 'border border-border bg-background/60 text-foreground backdrop-blur hover:bg-accent hover:text-accent-foreground',
  )
  if (action.href) {
    return (
      <a href={action.href} onClick={action.onClick} className={className}>
        {action.label}
      </a>
    )
  }
  return (
    <button type="button" onClick={action.onClick} className={className}>
      {action.label}
    </button>
  )
}

/** Landing hero: eyebrow, headline, copy, two calls to action and an optional media slot, revealed in sequence. */
export function HeroSection({
  title,
  rotatingWords,
  description,
  eyebrow,
  primaryAction,
  secondaryAction,
  media,
  align = 'center',
  titleAs: Title = 'h1',
  as: Tag = 'section',
  duration = 0.6,
  stagger = 0.08,
  delay = 0,
  disabled = false,
  className,
}: HeroSectionProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const centered = align === 'center'
  const split = !centered && media != null

  const ease = [0.22, 1, 0.36, 1] as const
  const root: Variants = { hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }
  const item: Variants = {
    hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration, ease } },
  }
  const mediaItem: Variants = {
    hidden: { opacity: 0, y: 28, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: duration * 1.4, ease } },
  }

  return (
    <Tag aria-labelledby={id} className={cn('@container relative w-full', className)}>
      <motion.div
        initial={animate ? 'hidden' : false}
        animate="show"
        variants={root}
        className={cn('grid items-center gap-12', split && '@4xl:grid-cols-[1.05fr_1fr] @4xl:gap-14')}
      >
        <div
          className={cn(
            'flex min-w-0 flex-col gap-6',
            centered ? 'mx-auto max-w-3xl items-center text-center' : 'items-start text-left',
          )}
        >
          {eyebrow != null && (
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                <span aria-hidden className="size-1.5 rounded-full bg-primary" />
                {eyebrow}
              </span>
            </motion.div>
          )}
          <motion.div variants={item} className="w-full">
            <Title
              id={id}
              className="text-4xl font-semibold leading-[1.05] tracking-tight text-balance break-words text-foreground @xl:text-5xl @5xl:text-6xl"
            >
              {title}
              {rotatingWords && rotatingWords.length > 0 && (
                <>
                  {' '}
                  <WordRotate words={rotatingWords} disabled={disabled} className="text-primary" />
                </>
              )}
            </Title>
          </motion.div>
          {description != null && (
            <motion.div variants={item} className="w-full">
              <p
                className={cn(
                  'max-w-xl text-base leading-relaxed text-pretty text-muted-foreground @xl:text-lg',
                  centered && 'mx-auto',
                )}
              >
                {description}
              </p>
            </motion.div>
          )}
          {(primaryAction || secondaryAction) && (
            <motion.div
              variants={item}
              className={cn(
                'flex w-full flex-col gap-3 pt-2 @sm:w-auto @sm:flex-row @sm:flex-wrap',
                centered && '@sm:justify-center',
              )}
            >
              {primaryAction && <Action action={primaryAction} variant="primary" />}
              {secondaryAction && <Action action={secondaryAction} variant="secondary" />}
            </motion.div>
          )}
        </div>
        {media != null && (
          <motion.div variants={mediaItem} className={cn('min-w-0', centered && 'mx-auto w-full max-w-4xl')}>
            {media}
          </motion.div>
        )}
      </motion.div>
    </Tag>
  )
}

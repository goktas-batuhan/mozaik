// Source: nolly-studio/cult-ui (MIT) — https://github.com/nolly-studio/cult-ui/blob/main/apps/www/registry/default/ui/speech-bubble.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface SpeechBubbleProps {
  /** The message inside the bubble. */
  children: ReactNode
  /** Extra classes for the outer wrapper. */
  className?: string
  /** Shows a blinking caret after the text (md screens and up). */
  showCursor?: boolean
  /** Seconds per caret blink. */
  duration?: number
}

export function SpeechBubbleRoot({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="speech-bubble" className={cn('mr-12', className)} {...props} />
}

export function SpeechBubbleBody({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="speech-bubble-body"
      className={cn(
        'relative flex w-fit items-center rounded-full bg-foreground px-6 py-6 text-background transition-colors lg:px-10 lg:py-5',
        className,
      )}
      {...props}
    />
  )
}

export function SpeechBubbleTail({ className, ...props }: ComponentProps<'svg'>) {
  return (
    <svg
      data-slot="speech-bubble-tail"
      aria-hidden="true"
      className={cn('absolute right-[-17px] bottom-0 h-6 -rotate-5 transition-colors md:right-[-7px] md:h-auto lg:right-[-9px]', className)}
      fill="none"
      focusable="false"
      height="45"
      viewBox="0 0 53 45"
      width="53"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        className="fill-foreground transition-colors"
        d="M44 0H0V0C0 24.8528 20.1472 45 45 45H53V45C47.1396 36.535 44 26.4842 44 16.1886V0Z"
      />
    </svg>
  )
}

export function SpeechBubbleText({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="speech-bubble-text"
      className={cn('relative text-base leading-[0.9] font-semibold tracking-[-0.06em] text-balance text-background md:text-2xl lg:text-[2rem]', className)}
      {...props}
    />
  )
}

export function SpeechBubbleCursor({ duration = 1, className }: { duration?: number; className?: string }) {
  const reduced = usePrefersReducedMotion()
  return (
    <motion.div
      aria-hidden
      data-slot="speech-bubble-cursor"
      className={cn('relative ml-2 hidden h-6 w-4 bg-muted-foreground md:block', className)}
      animate={reduced ? undefined : { opacity: [1, 0.3, 1] }}
      transition={{ duration, ease: 'easeInOut', repeat: Infinity }}
    />
  )
}

/** A pill-shaped chat bubble with a curved tail and an optional blinking caret. */
export function SpeechBubble({ children, className, showCursor = true, duration = 1 }: SpeechBubbleProps) {
  return (
    <SpeechBubbleRoot className={className}>
      <SpeechBubbleBody>
        <SpeechBubbleTail />
        <SpeechBubbleText>{children}</SpeechBubbleText>
        {showCursor ? <SpeechBubbleCursor duration={duration} /> : null}
      </SpeechBubbleBody>
    </SpeechBubbleRoot>
  )
}

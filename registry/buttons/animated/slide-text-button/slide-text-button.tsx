// Source: kokonut-labs/kokonutui (MIT) — https://github.com/kokonut-labs/kokonutui/blob/main/components/kokonutui/slide-text-button.tsx
import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { cn } from '@/lib/utils'

export interface SlideTextButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** Label shown at rest. Screen readers read this one. */
  text: string
  /** Label that slides in on hover or focus. Defaults to `text`. */
  hoverText?: string
  /** Renders a link instead of a button. */
  href?: string
  /** Visual style. */
  variant?: 'solid' | 'ghost'
  /** Element to render. Defaults to `a` when `href` is set, else `button`. */
  as?: ElementType
  /** Seconds the slide takes. */
  duration?: number
  /** Turns the button off. */
  disabled?: boolean
  /** Extra classes for the root element. */
  className?: string
}

/** A button whose label slides up and is replaced by a second label on hover or keyboard focus. */
export function SlideTextButton({
  text,
  hoverText,
  href,
  variant = 'solid',
  as,
  duration = 0.25,
  disabled = false,
  className,
  style,
  ...props
}: SlideTextButtonProps) {
  const Tag: ElementType = as ?? (href ? 'a' : 'button')
  const swap = hoverText ?? text
  const reveal = 'group-hover:-translate-y-full group-focus-visible:-translate-y-full motion-reduce:group-hover:translate-y-0 motion-reduce:group-focus-visible:translate-y-0'

  return (
    <Tag
      href={href}
      disabled={Tag === 'button' ? disabled : undefined}
      aria-disabled={disabled || undefined}
      style={{ ...style, ['--slide-duration' as string]: `${duration}s` }}
      className={cn(
        'group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-lg px-6 text-sm font-medium outline-none transition-[background-color,scale] duration-150 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97] motion-reduce:active:scale-100',
        variant === 'solid'
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'border border-border text-foreground hover:bg-accent',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          'grid justify-items-center transition-transform duration-(--slide-duration) ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none',
          reveal,
        )}
      >
        <span className="col-start-1 row-start-1">{text}</span>
        <span aria-hidden className="col-start-1 row-start-1 translate-y-full">
          {swap}
        </span>
      </span>
    </Tag>
  )
}

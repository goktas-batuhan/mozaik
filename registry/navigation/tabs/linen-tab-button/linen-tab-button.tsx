// Source: bidyut10/opensourceui (MIT) — https://github.com/bidyut10/opensourceui/blob/main/components/buttons/linen-tab-button.tsx
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface LinenTabButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** Button label. */
  children?: ReactNode
  /** Disables the button. */
  disabled?: boolean
  ref?: Ref<HTMLButtonElement>
}

const LINEN_BODY =
  'linear-gradient(180deg, var(--card) 0%, color-mix(in oklab, var(--card) 70%, var(--muted)) 55%, color-mix(in oklab, var(--muted) 82%, var(--foreground)) 100%)'
const LINEN_WEAVE =
  'repeating-linear-gradient(90deg, color-mix(in oklab, var(--muted-foreground) 8%, transparent) 0 1px, transparent 1px 4px), repeating-linear-gradient(0deg, color-mix(in oklab, var(--muted-foreground) 6%, transparent) 0 1px, transparent 1px 5px)'
const LINEN_FOLD =
  'linear-gradient(180deg, color-mix(in oklab, var(--card) 60%, transparent) 0%, transparent 28%, color-mix(in oklab, var(--foreground) 5%, transparent) 100%)'

/** A button with a woven linen face, dashed stitching and a soft lift. */
export function LinenTabButton({
  children = 'View details',
  className,
  type = 'button',
  disabled = false,
  style,
  ref,
  ...props
}: LinenTabButtonProps) {
  const reduced = usePrefersReducedMotion()

  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled}
      data-slot="linen-tab-button"
      className={cn(
        'relative isolate cursor-pointer overflow-hidden rounded-lg border border-border px-6 py-3 text-base outline-none',
        'font-medium tracking-tight text-card-foreground',
        'shadow-[0_1px_0_var(--card),0_6px_14px_color-mix(in_oklab,var(--foreground)_14%,transparent),inset_0_1px_0_var(--card)]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        !reduced &&
          'transition-[transform,box-shadow,filter] duration-200 ease-out hover:brightness-[1.03] active:translate-y-px active:brightness-[0.98]',
        className,
      )}
      style={{ background: LINEN_BODY, ...style }}
    >
      <span
        aria-hidden="true"
        data-layer="linen-weave"
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{ background: LINEN_WEAVE }}
      />
      <span
        aria-hidden="true"
        data-layer="linen-stitch-top"
        className="pointer-events-none absolute inset-x-3 top-1.5 border-t border-dashed border-muted-foreground/40"
      />
      <span
        aria-hidden="true"
        data-layer="linen-stitch-bottom"
        className="pointer-events-none absolute inset-x-3 bottom-1.5 border-b border-dashed border-muted-foreground/40"
      />
      <span
        aria-hidden="true"
        data-layer="linen-fold"
        className="pointer-events-none absolute inset-0"
        style={{ background: LINEN_FOLD }}
      />
      <span data-layer="linen-label" className="relative z-1">
        {children}
      </span>
    </button>
  )
}

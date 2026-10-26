// Source: starc007/ui-components (MIT)
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface HoldActionButtonProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  | 'children'
  | 'onPointerDown'
  | 'onPointerUp'
  | 'onPointerCancel'
  | 'onPointerLeave'
  | 'onPointerMove'
  | 'onKeyDown'
  | 'onKeyUp'
  | 'onBlur'
> {
  /** Resting label. Also the button's accessible name. */
  children: ReactNode
  /** Label shown while the button is held. */
  holdingLabel?: ReactNode
  /** Label shown (and announced) once the hold completes. */
  completeLabel?: ReactNode
  /** Seconds the button has to be held. */
  duration?: number
  /** Called once per completed hold. */
  onComplete?: () => void
  /** Disables the button. */
  disabled?: boolean
  ref?: Ref<HTMLButtonElement>
}

/** Seconds the "done" state stays visible after the button is released. */
const LINGER = 1

/**
 * A button that confirms only after being held down. Works with a pointer or with
 * Space / Enter; releasing early rewinds the progress. Under reduced motion the fill
 * does not animate, but the hold still completes when the time is up.
 */
export function HoldActionButton({
  children,
  holdingLabel = 'Keep holding',
  completeLabel = 'Done',
  duration = 1.6,
  onComplete,
  disabled = false,
  className,
  ref,
  ...props
}: HoldActionButtonProps) {
  const reduced = usePrefersReducedMotion()
  const [holding, setHolding] = useState(false)
  const [completed, setCompleted] = useState(false)
  const holdTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const lingerTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const holdingRef = useRef(false)
  const completedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  })

  useEffect(
    () => () => {
      clearTimeout(holdTimer.current)
      clearTimeout(lingerTimer.current)
    },
    [],
  )

  const finish = useCallback(() => {
    completedRef.current = true
    setCompleted(true)
    onCompleteRef.current?.()
  }, [])

  const start = useCallback(() => {
    if (disabled || holdingRef.current) return
    clearTimeout(lingerTimer.current)
    holdingRef.current = true
    completedRef.current = false
    setCompleted(false)
    setHolding(true)
    holdTimer.current = setTimeout(finish, Math.max(0, duration) * 1000)
  }, [disabled, duration, finish])

  const release = useCallback(() => {
    if (!holdingRef.current) return
    holdingRef.current = false
    clearTimeout(holdTimer.current)
    setHolding(false)
    if (completedRef.current) {
      // let the "done" state breathe before returning to rest
      lingerTimer.current = setTimeout(() => {
        completedRef.current = false
        setCompleted(false)
      }, LINGER * 1000)
    }
  }, [])

  // a button that gets disabled mid-hold lets go
  useEffect(() => {
    if (disabled) release()
  }, [disabled, release])

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return
    start()
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // capture is a convenience; the hold works without it
    }
  }

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (!holdingRef.current) return
    // a captured pointer reports no leave events, so measure
    const r = e.currentTarget.getBoundingClientRect()
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) release()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      if (!e.repeat) start()
    }
  }

  const onKeyUp = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      release()
    }
  }

  const filled = completed || (holding && !reduced)
  const showHolding = holding && !completed
  const fade = reduced ? '' : 'transition-opacity duration-150'

  return (
    <>
      <button
        {...props}
        ref={ref}
        type="button"
        disabled={disabled}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={release}
        onPointerCancel={release}
        onPointerLeave={(e) => e.pointerType !== 'touch' && release()}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onBlur={release}
        onContextMenu={(e) => e.preventDefault()}
        className={cn(
          'relative isolate inline-grid h-14 min-w-64 cursor-pointer touch-none place-items-center overflow-hidden rounded-2xl border border-border bg-card px-8 text-sm font-medium text-card-foreground select-none',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          'disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
      >
        {/* progress fill */}
        <span
          aria-hidden
          data-hold-fill=""
          className="absolute inset-0 -z-10 origin-left bg-primary/25"
          style={{
            transform: filled ? 'scaleX(1)' : 'scaleX(0)',
            transition: reduced
              ? 'none'
              : holding
                ? `transform ${duration}s linear`
                : 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
        <span className="col-start-1 row-start-1 grid place-items-center">
          <span className={cn('col-start-1 row-start-1', fade, holding || completed ? 'opacity-0' : 'opacity-100')}>
            {children}
          </span>
          <span aria-hidden className={cn('col-start-1 row-start-1', fade, showHolding ? 'opacity-100' : 'opacity-0')}>
            {holdingLabel}
          </span>
          <span aria-hidden className={cn('col-start-1 row-start-1', fade, completed ? 'opacity-100' : 'opacity-0')}>
            {completeLabel}
          </span>
        </span>
      </button>
      {/* announces completion; kept outside the button so its accessible name stays stable */}
      <span role="status" aria-live="polite" className="sr-only">
        {completed ? completeLabel : ''}
      </span>
    </>
  )
}

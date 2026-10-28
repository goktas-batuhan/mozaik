// Source: nolly-studio/cult-ui (MIT) — https://github.com/nolly-studio/cult-ui/blob/main/apps/www/registry/default/ui/security-checkpoint.tsx
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type ComponentProps, type Ref } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export type CheckpointLine = {
  id: string
  /** Primary lines run through; destructive lines stop at the card with a dot. */
  color: 'primary' | 'destructive'
}

export const CHECKPOINT_LINES: CheckpointLine[] = [
  { id: 'line-1', color: 'primary' },
  { id: 'line-2', color: 'destructive' },
  { id: 'line-3', color: 'primary' },
  { id: 'line-4', color: 'destructive' },
  { id: 'line-5', color: 'primary' },
  { id: 'line-6', color: 'destructive' },
]

export interface SecurityCheckpointProps extends ComponentProps<'div'> {
  /** Bold part of the card heading. */
  title?: string
  /** Lighter part of the card heading. */
  subtitle?: string
  /** Sentence under the heading. */
  message?: string
  /** Which of the six rows carry a passing (primary) or a blocked (destructive) line. */
  lines?: CheckpointLine[]
  /** Seconds the lines take to draw in. */
  duration?: number
}

interface LineLayerProps extends ComponentProps<'div'> {
  lines: CheckpointLine[]
  mounted: boolean
  cardLeft: number
  /** Draw instantly instead of animating. */
  still: boolean
  duration: number
}

const GAP = 'gap-[18px]'
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

function PassingLines({ lines, mounted, still, duration, className, cardLeft: _cardLeft, ...props }: LineLayerProps) {
  return (
    <div data-slot="security-checkpoint-passing-lines" aria-hidden className={cn('absolute inset-0 z-0 flex flex-col items-stretch justify-center', GAP, className)} {...props}>
      {lines.map((line, i) =>
        line.color === 'primary' ? (
          <div key={line.id} className="h-0.5">
            <div
              className="h-0.5 rounded-[1px] bg-linear-to-r from-transparent from-0% via-primary/50 via-40% to-primary/80"
              style={{
                width: mounted ? '100%' : '0%',
                transition: still ? 'none' : `width ${duration}s ${EASE} ${i * 0.08 + 0.15}s`,
              }}
            />
          </div>
        ) : (
          <div key={line.id} className="h-0.5" />
        ),
      )}
    </div>
  )
}

function BlockedLines({ lines, mounted, cardLeft, still, duration, className, ...props }: LineLayerProps) {
  const fade = (i: number, delay: number) => (still ? 'none' : `opacity 0.3s ease ${i * 0.08 + delay}s`)
  return (
    <div data-slot="security-checkpoint-blocked-lines" aria-hidden className={cn('absolute inset-0 z-0 flex flex-col items-stretch justify-center', GAP, className)} {...props}>
      {lines.map((line, i) =>
        line.color === 'destructive' ? (
          <div key={line.id} data-slot="security-checkpoint-blocked-row" className="relative h-0.5">
            <div
              className="h-0.5 rounded-[1px] bg-linear-to-r from-transparent from-0% via-destructive/50 via-40% to-destructive/85"
              style={{
                width: mounted && cardLeft > 0 ? cardLeft : 0,
                transition: still ? 'none' : `width ${duration * 0.8}s ${EASE} ${i * 0.08 + 0.2}s`,
              }}
            />
            <span
              className="absolute top-1/2 size-6 -translate-y-1/2 rounded-full"
              style={{
                left: cardLeft > 0 ? cardLeft - 12 : -100,
                background: 'radial-gradient(circle, color-mix(in oklab, var(--destructive) 40%, transparent) 0%, color-mix(in oklab, var(--destructive) 15%, transparent) 50%, transparent 70%)',
                opacity: mounted ? 1 : 0,
                transition: fade(i, 0.85),
              }}
            />
            <span
              className="absolute top-1/2 size-[7px] -translate-y-1/2 rounded-full bg-destructive"
              style={{
                left: cardLeft > 0 ? cardLeft - 7 : -100,
                opacity: mounted ? 1 : 0,
                transition: fade(i, 0.9),
              }}
            />
          </div>
        ) : (
          <div key={line.id} className="h-0.5" />
        ),
      )}
    </div>
  )
}

interface CardProps extends ComponentProps<'div'> {
  title: string
  subtitle: string
  message: string
  mounted: boolean
  still: boolean
  ref?: Ref<HTMLDivElement>
}

function CheckpointCard({ title, subtitle, message, className, mounted, still, ref, ...props }: CardProps) {
  return (
    <div
      ref={ref}
      data-slot="security-checkpoint-card"
      className={cn(
        'relative z-1 flex w-[300px] max-w-full flex-col gap-3 rounded-[14px] border border-border bg-card px-5 py-4 text-card-foreground shadow-sm',
        className,
      )}
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'scale(1)' : 'scale(0.97)',
        transition: still ? 'none' : `opacity 0.4s ease 0.1s, transform 0.4s ${EASE} 0.1s`,
      }}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2">
          <div aria-hidden className="h-5 w-[3px] rounded-sm bg-primary" />
          <span className="text-sm leading-5 tracking-[-0.01em]">
            <strong className="font-semibold">{title}</strong> <span className="font-normal text-muted-foreground">{subtitle}</span>
          </span>
        </div>
        <div aria-hidden className="flex items-center gap-[3px]">
          <span className="size-[5px] rounded-full bg-foreground" />
          <span className="size-[5px] rounded-full bg-muted-foreground" />
          <span className="size-[5px] rounded-full bg-border" />
        </div>
      </div>
      <div className="border-l border-border pl-3.5 text-[13px] leading-[19px] tracking-[-0.005em] text-muted-foreground">{message}</div>
    </div>
  )
}

/** A "verifying your browser" card: lines draw in from the side, the blocked ones stop at the card with a glowing dot. */
export function SecurityCheckpoint({
  title = 'Mozaik',
  subtitle = 'Security Checkpoint',
  message = "To ensure a smooth and safe experience, we're taking a few moments to verify your browser.",
  lines = CHECKPOINT_LINES,
  duration = 1,
  className,
  ...props
}: SecurityCheckpointProps) {
  const reduced = usePrefersReducedMotion()
  const [mounted, setMounted] = useState(false)
  const [cardLeft, setCardLeft] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const measure = useCallback(() => {
    if (containerRef.current && cardRef.current) {
      setCardLeft(cardRef.current.getBoundingClientRect().left - containerRef.current.getBoundingClientRect().left)
    }
  }, [])

  useEffect(() => {
    measure()
    setMounted(true)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  const layer = { lines, mounted, cardLeft, still: reduced, duration }

  return (
    <div
      ref={containerRef}
      role="status"
      data-slot="security-checkpoint"
      {...props}
      className={cn('relative grid h-[200px] w-full max-w-[444px] place-items-center overflow-hidden rounded-xl bg-muted', className)}
    >
      <PassingLines {...layer} />
      <BlockedLines {...layer} />
      <CheckpointCard ref={cardRef} title={title} subtitle={subtitle} message={message} mounted={mounted} still={reduced} />
    </div>
  )
}

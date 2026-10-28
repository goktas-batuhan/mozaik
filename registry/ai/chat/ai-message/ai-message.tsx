// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/ai-message/index.tsx
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export type AIMessageAuthor = 'user' | 'assistant'

export interface AIMessageProps {
  /** Who wrote the message. Decides the side, the colors and whether feedback buttons show. */
  from?: AIMessageAuthor
  /** Shown beside the bubble, such as an avatar or an orb. */
  avatar?: ReactNode
  /** Draw the tinted bubble. Turn it off when the content brings its own surfaces. */
  bubble?: boolean
  /** Preformatted time, such as "14:32". */
  timestamp?: string
  /** Plain text for the copy button. Leave it out to hide the button. */
  copyText?: string
  /** Shows a retry button when set. */
  onRetry?: () => void
  /** Shows thumbs up and down on assistant messages when set. */
  onVote?: (vote: 'up' | 'down') => void
  children?: ReactNode
  className?: string
}

const ICON = { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const

const ICONS = {
  copy: (
    <svg {...ICON}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h8" />
    </svg>
  ),
  check: (
    <svg {...ICON}>
      <path d="m5 12 5 5L20 7" />
    </svg>
  ),
  retry: (
    <svg {...ICON}>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  ),
  up: (
    <svg {...ICON}>
      <path d="M7 10v11H3V10z" />
      <path d="M7 10l4-8a3 3 0 0 1 3 3v4h6a2 2 0 0 1 2 2.3l-1.4 8A2 2 0 0 1 18.6 21H7" />
    </svg>
  ),
  down: (
    <svg {...ICON}>
      <path d="M17 14V3h4v11z" />
      <path d="M17 14l-4 8a3 3 0 0 1-3-3v-4H4a2 2 0 0 1-2-2.3l1.4-8A2 2 0 0 1 5.4 3H17" />
    </svg>
  ),
}

/** A chat message. Copy, retry and feedback buttons appear on hover and on keyboard focus. */
export function AIMessage({
  from = 'assistant',
  avatar,
  bubble = true,
  timestamp,
  copyText,
  onRetry,
  onVote,
  children,
  className,
}: AIMessageProps) {
  const reduced = usePrefersReducedMotion()
  const [copied, setCopied] = useState(false)
  const [vote, setVote] = useState<'up' | 'down' | null>(null)
  const isUser = from === 'user'

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(id)
  }, [copied])

  const copy = async () => {
    if (!copyText) return
    try {
      await navigator.clipboard.writeText(copyText)
      setCopied(true)
    } catch {
      /* A blocked clipboard is not worth interrupting the chat for. */
    }
  }

  const actions: { key: string; label: string; icon: ReactNode; pressed?: boolean; onClick: () => void }[] = []
  if (copyText) actions.push({ key: 'copy', label: copied ? 'Copied' : 'Copy', icon: copied ? ICONS.check : ICONS.copy, onClick: copy })
  if (onRetry) actions.push({ key: 'retry', label: 'Retry', icon: ICONS.retry, onClick: onRetry })
  if (onVote && !isUser) {
    actions.push({ key: 'up', label: 'Good response', icon: ICONS.up, pressed: vote === 'up', onClick: () => { setVote('up'); onVote('up') } })
    actions.push({ key: 'down', label: 'Bad response', icon: ICONS.down, pressed: vote === 'down', onClick: () => { setVote('down'); onVote('down') } })
  }

  return (
    <div data-slot="ai-message" data-from={from} className={cn('group flex w-full gap-2.5', isUser ? 'flex-row-reverse' : 'flex-row', className)}>
      {avatar ? <div className="mt-0.5 shrink-0">{avatar}</div> : null}
      <div className={cn('flex min-w-0 flex-col gap-1', isUser && 'items-end')}>
        <div
          className={cn(
            'w-fit max-w-prose text-sm leading-6',
            bubble && 'rounded-2xl px-3.5 py-2',
            bubble && isUser && 'rounded-br-md bg-primary text-primary-foreground',
            bubble && !isUser && 'rounded-bl-md bg-muted text-foreground',
            !bubble && 'text-foreground',
          )}
        >
          {children}
        </div>
        <div className={cn('flex h-7 items-center gap-1 px-1', isUser && 'flex-row-reverse')}>
          {timestamp ? <span className="text-xs text-muted-foreground tabular-nums">{timestamp}</span> : null}
          {actions.map((action) => (
            <button
              key={action.key}
              type="button"
              aria-label={action.label}
              aria-pressed={action.pressed}
              onClick={action.onClick}
              className={cn(
                'inline-flex size-7 cursor-pointer items-center justify-center rounded-md hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring',
                'opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100',
                !reduced && 'transition-opacity duration-200',
                action.pressed ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {action.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

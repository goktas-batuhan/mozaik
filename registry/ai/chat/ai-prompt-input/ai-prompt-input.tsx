// Source: original
import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface AIPromptInputProps {
  /** Controlled text. */
  value?: string
  /** Initial text when you do not control it. */
  defaultValue?: string
  /** Called on every change with the new text. */
  onChange?: (value: string) => void
  /** Called with the trimmed text on Enter or on send. Shift+Enter adds a new line. */
  onSubmit?: (value: string) => void
  /** Called when the stop button is pressed while `loading`. */
  onStop?: () => void
  /** True while the model is answering. Swaps the send button for a stop button. */
  loading?: boolean
  placeholder?: string
  /** Accessible name of the text box. */
  label?: string
  /** Most lines the box grows to before it scrolls. */
  maxRows?: number
  /** Extra controls on the left of the footer, such as a model picker. */
  actions?: ReactNode
  disabled?: boolean
  className?: string
}

const LINE = 24

/** A chat prompt box that grows with the text. Enter sends, Shift+Enter adds a line. */
export function AIPromptInput({
  value,
  defaultValue = '',
  onChange,
  onSubmit,
  onStop,
  loading = false,
  placeholder = 'Ask anything…',
  label = 'Message',
  maxRows = 6,
  actions,
  disabled = false,
  className,
}: AIPromptInputProps) {
  const id = useId()
  const ref = useRef<HTMLTextAreaElement>(null)
  const [inner, setInner] = useState(defaultValue)
  const text = value ?? inner
  const empty = text.trim() === ''

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    const lines = Math.min(maxRows, Math.max(1, Math.round(el.scrollHeight / LINE)))
    el.style.height = `${lines * LINE}px`
  }, [text, maxRows])

  const submit = () => {
    if (empty || loading || disabled) return
    onSubmit?.(text.trim())
    if (value === undefined) setInner('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div
      data-slot="ai-prompt-input"
      className={cn(
        'flex w-full flex-col gap-2 rounded-2xl border border-border bg-background p-3 focus-within:border-ring',
        disabled && 'opacity-60',
        className,
      )}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <textarea
        id={id}
        ref={ref}
        rows={1}
        value={text}
        disabled={disabled}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        onChange={(e) => {
          if (value === undefined) setInner(e.target.value)
          onChange?.(e.target.value)
        }}
        className="block w-full resize-none bg-transparent text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground"
        style={{ height: LINE }}
      />
      <div className="flex h-8 items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1">{actions}</div>
        {loading ? (
          <button
            type="button"
            aria-label="Stop generating"
            onClick={onStop}
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
              <rect x="1" y="1" width="10" height="10" rx="2" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            aria-label="Send message"
            disabled={empty || disabled}
            onClick={submit}
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 19V5" />
              <path d="m5 12 7-7 7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

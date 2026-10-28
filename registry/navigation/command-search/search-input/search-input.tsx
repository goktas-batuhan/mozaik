// Source: bidyut10/opensourceui (MIT) — https://github.com/bidyut10/opensourceui/blob/main/components/inputs/search-input.tsx
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type Ref,
} from 'react'
import { cn } from '@/lib/utils'

export interface SearchInputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'type' | 'onChange'> {
  /** Accessible label. Visually hidden. */
  label?: string
  /** Helper text under the field. Hidden while an error is shown. */
  hint?: string
  /** Shows the error state and message. */
  error?: boolean
  /** Message shown in the error state. */
  errorMessage?: string
  /** Accessible name of the clear button. */
  clearLabel?: string
  /** Extra classes for the wrapper around the field. */
  containerClassName?: string
  /** Called after the clear button empties the field. */
  onClear?: () => void
  /** Called with the new text on every change. */
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void
  ref?: Ref<HTMLInputElement>
}

function SearchIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

/** A search field with a leading icon, a clear button, a hint and an error state. */
export function SearchInput({
  className,
  containerClassName,
  id,
  label = 'Search',
  hint,
  error = false,
  errorMessage = 'Enter a valid search term.',
  clearLabel = 'Clear search',
  disabled,
  value,
  defaultValue = '',
  placeholder = 'Search…',
  onChange,
  onClear,
  ref,
  ...props
}: SearchInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = `${inputId}-hint`
  const errorId = `${inputId}-error`
  const localRef = useRef<HTMLInputElement | null>(null)

  const isControlled = value !== undefined
  const [internal, setInternal] = useState(String(defaultValue))
  const current = isControlled ? String(value) : internal
  const hasValue = current.length > 0

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value
      if (!isControlled) setInternal(next)
      onChange?.(next, event)
    },
    [isControlled, onChange],
  )

  const handleClear = useCallback(() => {
    if (!isControlled) setInternal('')
    onClear?.()
    localRef.current?.focus()
  }, [isControlled, onClear])

  const setRefs = useCallback(
    (node: HTMLInputElement | null) => {
      localRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref],
  )

  // An uncontrolled field follows its form's reset.
  useEffect(() => {
    if (isControlled) return
    const form = localRef.current?.form
    if (!form) return
    const handleReset = () => setInternal(String(defaultValue))
    form.addEventListener('reset', handleReset)
    return () => form.removeEventListener('reset', handleReset)
  }, [defaultValue, isControlled])

  return (
    <div data-slot="search-input" data-error={error || undefined} className={cn('w-full max-w-sm', containerClassName)}>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>

      <div className="relative">
        <SearchIcon />
        <input
          {...props}
          ref={setRefs}
          id={inputId}
          type="search"
          disabled={disabled}
          value={current}
          placeholder={placeholder}
          aria-invalid={error || undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          onChange={handleChange}
          className={cn(
            'h-10 w-full rounded-lg border bg-background py-2 pr-10 pl-10 text-sm text-foreground transition-[border-color,background-color] duration-200 outline-none placeholder:text-muted-foreground',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50',
            '[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
            error ? 'border-destructive focus:border-destructive' : 'border-border focus:border-foreground',
            className,
          )}
        />

        {hasValue && !disabled ? (
          <button
            type="button"
            aria-label={clearLabel}
            onClick={handleClear}
            className="absolute top-1/2 right-2.5 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <ClearIcon />
          </button>
        ) : null}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-destructive">
          {errorMessage}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

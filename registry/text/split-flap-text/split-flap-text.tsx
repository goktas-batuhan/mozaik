// Source: kokonut-labs/kokonutui (MIT)
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type Ref,
} from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

/** The drum every tile spins through. A tile only flips forward. */
const CHARSET = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.-/&!?'
/** Seconds between one tile starting and the next. */
const STAGGER = 0.04

const clean = (value: string) =>
  [...value.toUpperCase()].map((c) => (CHARSET.includes(c) ? c : ' ')).join('')

export interface SplitFlapTextProps {
  /** Lines to show. With two or more, the board cycles through them. */
  words: string[]
  /** Seconds each line stays up. */
  interval?: number
  /** Seconds one flap takes to fall. */
  duration?: number
  /** Seconds before the board starts cycling. */
  delay?: number
  /** Tiles always shown, so the board keeps its width. Defaults to the longest line. */
  length?: number
  /** Element to render. */
  as?: ElementType
  /** Shows the first line and never flips. */
  disabled?: boolean
  className?: string
  /** Classes for each tile, to recolor the board. */
  tileClassName?: string
}

interface Flap {
  id: number
  from: string
  to: string
}

function Half({
  char,
  half,
  innerRef,
  style,
}: {
  char: string
  half: 'top' | 'bottom'
  innerRef?: Ref<HTMLSpanElement>
  style?: CSSProperties
}) {
  return (
    <span
      ref={innerRef}
      style={style}
      className={cn(
        'absolute inset-x-0 h-1/2 overflow-hidden bg-inherit backface-hidden',
        half === 'top' ? 'top-0 rounded-t-[0.12em]' : 'bottom-0 rounded-b-[0.12em]',
      )}
    >
      <span
        className={cn(
          'absolute inset-x-0 flex h-[200%] items-center justify-center',
          half === 'top' ? 'top-0' : 'bottom-0',
        )}
      >
        {char}
      </span>
    </span>
  )
}

function Tile({
  target,
  wait,
  flapMs,
  still,
  className,
}: {
  target: string
  wait: number
  flapMs: number
  still: boolean
  className?: string
}) {
  const [shown, setShown] = useState(target)
  const [flap, setFlap] = useState<Flap | null>(null)
  const shownRef = useRef(target)
  const topRef = useRef<HTMLSpanElement>(null)
  const bottomRef = useRef<HTMLSpanElement>(null)
  const shadeRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    let id = 0
    const stop = () => {
      if (timer !== undefined) clearTimeout(timer)
    }
    if (still) {
      shownRef.current = target
      setShown(target)
      setFlap(null)
      return stop
    }
    // Step through the drum one flap at a time until the target is up.
    const next = () => {
      const from = shownRef.current
      if (from === target) {
        setFlap(null)
        return
      }
      const to = CHARSET[(CHARSET.indexOf(from) + 1) % CHARSET.length]
      id += 1
      setFlap({ id, from, to })
      timer = setTimeout(() => {
        shownRef.current = to
        setShown(to)
        next()
      }, flapMs)
    }
    timer = setTimeout(next, wait * 1000)
    return stop
  }, [target, wait, flapMs, still])

  // The top flap falls on its hinge, the next letter's bottom lands, and the
  // half below darkens while the flap passes over it. (WAAPI; skipped where absent.)
  useLayoutEffect(() => {
    if (!flap) return
    const half = flapMs / 2
    topRef.current?.animate?.(
      [{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(-90deg)' }],
      { duration: half, easing: 'cubic-bezier(0.5, 0, 0.9, 0.6)', fill: 'forwards' },
    )
    bottomRef.current?.animate?.(
      [{ transform: 'rotateX(90deg)' }, { transform: 'rotateX(0deg)' }],
      { duration: half, delay: half, easing: 'cubic-bezier(0.2, 0.6, 0.3, 1)', fill: 'both' },
    )
    shadeRef.current?.animate?.([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], {
      duration: flapMs,
      easing: 'linear',
    })
  }, [flap, flapMs])

  const front = flap ? flap.to : shown
  const back = flap ? flap.from : shown

  return (
    <span
      aria-hidden
      className={cn(
        'relative inline-block h-[1.15em] w-[0.72em] rounded-[0.12em] bg-foreground text-background [perspective:5em]',
        className,
      )}
    >
      <Half char={front} half="top" />
      <Half char={back} half="bottom" />
      <span
        ref={shadeRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 rounded-b-[0.12em] bg-background/50 opacity-0"
      />
      {flap && (
        <>
          <Half
            key={`t${flap.id}`}
            char={flap.from}
            half="top"
            innerRef={topRef}
            style={{ transformOrigin: '50% 100%' }}
          />
          <Half
            key={`b${flap.id}`}
            char={flap.to}
            half="bottom"
            innerRef={bottomRef}
            style={{ transformOrigin: '50% 0%', transform: 'rotateX(90deg)' }}
          />
        </>
      )}
      {/* The hinge. */}
      <span className="pointer-events-none absolute inset-x-0 top-1/2 h-[0.04em] -translate-y-1/2 bg-background/70" />
    </span>
  )
}

/**
 * Departure-board lettering. Each tile flips through its drum only as far as
 * its new letter, tiles start a beat apart, and the flaps fall on a real
 * hinge. Assistive tech reads the lines once; the tiles are hidden from it.
 */
export function SplitFlapText({
  words,
  interval = 3.8,
  duration = 0.056,
  delay = 0,
  length,
  as: Tag = 'span',
  disabled = false,
  className,
  tileClassName,
}: SplitFlapTextProps) {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const still = disabled || reduced || words.length < 2

  useEffect(() => {
    if (still) return
    let id: ReturnType<typeof setInterval> | undefined
    const start = setTimeout(() => {
      id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval * 1000)
    }, delay * 1000)
    return () => {
      clearTimeout(start)
      if (id !== undefined) clearInterval(id)
    }
  }, [still, interval, delay, words.length])

  const value = clean(words[still ? 0 : index % Math.max(1, words.length)] ?? '')
  const size = length ?? Math.max(value.length, ...words.map((w) => w.length))
  const padded = value.padEnd(size, ' ')

  return (
    <Tag
      className={cn(
        'inline-flex gap-[0.08em] text-3xl leading-none font-semibold tabular-nums sm:text-5xl',
        className,
      )}
    >
      <span className="sr-only">{words.join(', ')}</span>
      {[...padded].map((char, i) => (
        <Tile
          key={i}
          target={char}
          wait={i * STAGGER}
          flapMs={duration * 1000}
          still={still}
          className={tileClassName}
        />
      ))}
    </Tag>
  )
}

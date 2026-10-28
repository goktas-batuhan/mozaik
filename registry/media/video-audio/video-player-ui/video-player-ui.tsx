// Source: original
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface VideoPlayerUIProps {
  /** The picture area: a poster, a <video> you control, or any node. */
  children?: ReactNode
  /** Length of the clip in seconds. */
  duration: number
  /** Controlled play state. Pair with onPlayingChange. */
  playing?: boolean
  defaultPlaying?: boolean
  onPlayingChange?: (playing: boolean) => void
  /** Controlled position in seconds. Pair with onTimeChange. */
  currentTime?: number
  defaultCurrentTime?: number
  onTimeChange?: (time: number) => void
  /** Called by the fullscreen button. */
  onFullscreen?: () => void
  /** Accessible name of the player. */
  label?: string
  className?: string
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
const SPEEDS = [1, 1.5, 2] as const
const TICK = 0.25

const svg = { viewBox: '0 0 24 24', 'aria-hidden': true, fill: 'currentColor' } as const

/** Video controls on a 16:9 stage: big play button, scrub bar, time, speed and fullscreen. The clock is internal; no media is loaded. */
export function VideoPlayerUI({ children, duration, playing, defaultPlaying = false, onPlayingChange, currentTime, defaultCurrentTime = 0, onTimeChange, onFullscreen, label = 'Video player', className }: VideoPlayerUIProps) {
  const [innerPlaying, setInnerPlaying] = useState(defaultPlaying)
  const [innerTime, setInnerTime] = useState(defaultCurrentTime)
  const [speedIndex, setSpeedIndex] = useState(0)
  const isPlaying = playing ?? innerPlaying
  const time = Math.min(duration, Math.max(0, currentTime ?? innerTime))
  const speed = SPEEDS[speedIndex]

  const setPlaying = (next: boolean) => {
    if (playing === undefined) setInnerPlaying(next)
    onPlayingChange?.(next)
  }
  const setTime = (next: number) => {
    if (currentTime === undefined) setInnerTime(next)
    onTimeChange?.(next)
  }
  const latest = useRef({ time, setTime, setPlaying })
  latest.current = { time, setTime, setPlaying }

  useEffect(() => {
    if (!isPlaying) return
    const id = window.setInterval(() => {
      const { time: t, setTime: st, setPlaying: sp } = latest.current
      const next = Math.min(duration, t + TICK * speed)
      latest.current.time = next
      st(next)
      if (next >= duration) sp(false)
    }, TICK * 1000)
    return () => window.clearInterval(id)
  }, [isPlaying, duration, speed])

  const toggle = () => {
    if (!isPlaying && time >= duration) setTime(0)
    setPlaying(!isPlaying)
  }

  return (
    <div role="group" aria-label={label} className={cn('relative w-full overflow-hidden rounded-xl border border-border bg-muted text-foreground', className)} style={{ aspectRatio: '16 / 9' }}>
      <div className="absolute inset-0">{children}</div>
      {!isPlaying ? (
        <button
          type="button"
          aria-label="Play"
          onClick={toggle}
          className="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg {...svg} className="ml-1 size-7">
            <path d="M8 5v14l11-7L8 5Z" />
          </svg>
        </button>
      ) : null}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-background/90 to-transparent px-3 pt-8 pb-2 text-xs tabular-nums">
        <button
          type="button"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          onClick={toggle}
          className="flex size-8 shrink-0 items-center justify-center rounded-full outline-none hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg {...svg} className="size-5">
            {isPlaying ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M8 5v14l11-7L8 5Z" />}
          </svg>
        </button>
        <input
          type="range"
          aria-label="Seek"
          aria-valuetext={`${fmt(time)} of ${fmt(duration)}`}
          min={0}
          max={duration}
          step={1}
          value={Math.floor(time)}
          onChange={(e) => setTime(Number(e.target.value))}
          className="h-1 min-w-0 flex-1 cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-ring"
        />
        <span aria-hidden="true" className="shrink-0">
          {fmt(time)} / {fmt(duration)}
        </span>
        <button
          type="button"
          aria-label={`Playback speed ${speed}x`}
          onClick={() => setSpeedIndex((i) => (i + 1) % SPEEDS.length)}
          className="h-8 shrink-0 rounded-md px-2 font-medium outline-none hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring"
        >
          {speed}x
        </button>
        <button
          type="button"
          aria-label="Fullscreen"
          onClick={onFullscreen}
          className="flex size-8 shrink-0 items-center justify-center rounded-full outline-none hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg {...svg} className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          </svg>
        </button>
      </div>
    </div>
  )
}

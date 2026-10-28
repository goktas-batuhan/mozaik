// Source: original
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface AudioPlayerProps {
  title: string
  artist?: string
  /** Length of the track in seconds. */
  duration: number
  /** Artwork shown at the left. Defaults to a music note. */
  cover?: ReactNode
  /** Controlled play state. Pair with onPlayingChange. */
  playing?: boolean
  defaultPlaying?: boolean
  onPlayingChange?: (playing: boolean) => void
  /** Controlled position in seconds. Pair with onTimeChange. */
  currentTime?: number
  defaultCurrentTime?: number
  onTimeChange?: (time: number) => void
  className?: string
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
const TICK = 0.25

const icon = { viewBox: '0 0 24 24', 'aria-hidden': true, className: 'size-5', fill: 'currentColor' } as const

/** A track card with play, seek and mute. It drives its own clock; no audio file is loaded, so you wire `currentTime` to a real element if you have one. */
export function AudioPlayer({ title, artist, duration, cover, playing, defaultPlaying = false, onPlayingChange, currentTime, defaultCurrentTime = 0, onTimeChange, className }: AudioPlayerProps) {
  const [innerPlaying, setInnerPlaying] = useState(defaultPlaying)
  const [innerTime, setInnerTime] = useState(defaultCurrentTime)
  const [muted, setMuted] = useState(false)
  const isPlaying = playing ?? innerPlaying
  const time = Math.min(duration, Math.max(0, currentTime ?? innerTime))

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
      const next = Math.min(duration, t + TICK)
      latest.current.time = next
      st(next)
      if (next >= duration) sp(false)
    }, TICK * 1000)
    return () => window.clearInterval(id)
  }, [isPlaying, duration])

  const toggle = () => {
    if (!isPlaying && time >= duration) setTime(0)
    setPlaying(!isPlaying)
  }

  return (
    <div className={cn('flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-3 text-card-foreground', className)}>
      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/15 text-primary">
        {cover ?? (
          <svg {...icon} className="size-7">
            <path d="M9 3v12.3A3.5 3.5 0 1 0 11 18.5V8h6V3H9Z" />
          </svg>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{title}</p>
          {artist ? <p className="truncate text-xs text-muted-foreground">{artist}</p> : null}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
          <span aria-hidden="true">{fmt(time)}</span>
          <input
            type="range"
            aria-label={`Seek ${title}`}
            aria-valuetext={`${fmt(time)} of ${fmt(duration)}`}
            min={0}
            max={duration}
            step={1}
            value={Math.floor(time)}
            onChange={(e) => setTime(Number(e.target.value))}
            className="h-1 min-w-0 flex-1 cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-ring"
          />
          <span aria-hidden="true">{fmt(duration)}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-pressed={muted}
          aria-label={muted ? 'Unmute' : 'Mute'}
          onClick={() => setMuted((m) => !m)}
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg {...icon} className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" />
            {muted ? <path d="m16 9 5 6m0-6-5 6" /> : <path d="M16 9a4 4 0 0 1 0 6m2.5-8.5a8 8 0 0 1 0 11" />}
          </svg>
        </button>
        <button
          type="button"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          onClick={toggle}
          className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <svg {...icon}>{isPlaying ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M8 5v14l11-7L8 5Z" />}</svg>
        </button>
      </div>
    </div>
  )
}

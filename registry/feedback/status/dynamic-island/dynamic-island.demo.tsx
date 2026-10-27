import { useState } from 'react'
import { DynamicIsland, DynamicIslandView, type DynamicIslandProps } from './dynamic-island'

const views = ['call', 'timer', 'music'] as const

const btn =
  'rounded-full border border-border bg-card px-3 py-1.5 text-sm text-card-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring aria-pressed:bg-primary aria-pressed:text-primary-foreground'

const compact = (
  <>
    <span aria-hidden className="size-2 rounded-full bg-success" />
    <span>Mozaik</span>
  </>
)

const islandViews = (
  <>
        <DynamicIslandView id="call" className="gap-4">
          <span
            aria-hidden
            className="grid size-10 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
          >
            AK
          </span>
          <div className="min-w-32">
            <p className="text-sm font-medium">Ada Kaya</p>
            <p className="text-xs opacity-60">Incoming call</p>
          </div>
        </DynamicIslandView>
        <DynamicIslandView id="timer" className="gap-4">
          <p className="text-3xl font-semibold tabular-nums">04:32</p>
          <p className="text-xs opacity-60">Focus session</p>
        </DynamicIslandView>
        <DynamicIslandView id="music" className="flex-col gap-1 px-10">
          <p className="text-sm font-medium">Now playing</p>
          <p className="text-xs opacity-60">Tessellate, Mozaik Quartet</p>
        </DynamicIslandView>
  </>
)

export default function DynamicIslandDemo() {
  const [view, setView] = useState<string | null>(null)

  return (
    <div className="flex min-h-64 w-[min(28rem,90vw)] flex-col items-center gap-8">
      <DynamicIsland view={view} compact={compact}>
        {islandViews}
      </DynamicIsland>
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Island view">
        <button type="button" className={btn} aria-pressed={view === null} onClick={() => setView(null)}>
          Compact
        </button>
        {views.map((v) => (
          <button key={v} type="button" className={btn} aria-pressed={view === v} onClick={() => setView(v)}>
            {v[0].toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}

export function VariantPreview(props: Omit<DynamicIslandProps, 'children' | 'compact'>) {
  return (
    <div className="flex min-h-64 w-[min(28rem,90vw)] flex-col items-center gap-8">
      <DynamicIsland compact={compact} {...props}>
        {islandViews}
      </DynamicIsland>
    </div>
  )
}

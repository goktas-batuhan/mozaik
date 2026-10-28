import { useState } from 'react'
import { SkeletonBar, SkeletonReveal } from './skeleton-reveal'

export default function SkeletonRevealDemo() {
  const [loading, setLoading] = useState(true)
  return (
    <div className="flex w-[min(94vw,380px)] flex-col gap-4">
      <SkeletonReveal
        loading={loading}
        className="rounded-2xl border border-border bg-card p-4 text-card-foreground"
        placeholder={
          <div className="flex size-full items-center gap-4">
            <SkeletonBar className="size-14 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <SkeletonBar className="h-4 w-1/2" />
              <SkeletonBar className="h-3 w-4/5" />
            </div>
          </div>
        }
      >
        <div className="flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">AL</span>
          <div className="flex flex-col">
            <span className="text-base font-medium">Ada Lovelace</span>
            <span className="text-sm text-muted-foreground">Analytical engineer</span>
          </div>
        </div>
      </SkeletonReveal>
      <button
        type="button"
        onClick={() => setLoading((l) => !l)}
        className="self-start rounded-full border border-border bg-card px-4 py-1.5 text-sm text-card-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {loading ? 'Show content' : 'Show skeleton'}
      </button>
    </div>
  )
}

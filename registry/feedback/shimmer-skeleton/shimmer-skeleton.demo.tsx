import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import { ShimmerSkeleton } from './shimmer-skeleton'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export default function ShimmerSkeletonDemo() {
  const [loading, setLoading] = useState(true)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => setLoading((v) => !v), 4000)
    return () => window.clearInterval(id)
  }, [reduced])

  return (
    <div className="w-full max-w-sm rounded-xl border bg-card p-5 text-card-foreground">
      <div className="flex items-center gap-4">
        <ShimmerSkeleton loading={loading} label="Loading avatar" className="size-12 rounded-full">
          <div className="grid size-12 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            MZ
          </div>
        </ShimmerSkeleton>
        <div className="flex flex-1 flex-col gap-2">
          <ShimmerSkeleton loading={loading} label="Loading name" className="w-32">
            <p className="text-sm font-medium">Mozaik Studio</p>
          </ShimmerSkeleton>
          <ShimmerSkeleton loading={loading} label="Loading role" className="w-24">
            <p className="text-xs text-muted-foreground">Design engineer</p>
          </ShimmerSkeleton>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-2">
        <ShimmerSkeleton loading={loading} className="h-3 w-full" />
        <ShimmerSkeleton loading={loading} className="h-3 w-11/12" />
        <ShimmerSkeleton loading={loading} className="h-3 w-2/3" />
        {loading ? null : (
          <p className="text-sm text-muted-foreground">
            Loaded. The placeholders above keep the layout from jumping.
          </p>
        )}
      </div>
    </div>
  )
}

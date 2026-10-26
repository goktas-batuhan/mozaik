import { MousePointer2 } from 'lucide-react'
import { DotGrid } from './dot-grid'

export default function DotGridDemo() {
  return (
    <DotGrid className="flex h-[500px] w-[min(900px,calc(100vw-4rem))] flex-col items-center justify-center rounded-2xl border px-8 text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
        <MousePointer2 aria-hidden className="size-3.5" />
        Move your cursor
      </span>
      <h2 className="mt-6 max-w-xl text-5xl font-semibold tracking-tight text-balance">
        Every pixel on the grid
      </h2>
      <p className="mt-4 max-w-md text-base text-muted-foreground text-pretty">
        A quiet dot pattern with a fine grain. The dots near your pointer warm up and
        grow; the edges fade into the page.
      </p>
    </DotGrid>
  )
}

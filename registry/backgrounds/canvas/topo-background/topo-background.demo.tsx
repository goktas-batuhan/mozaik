import { TopoBackground } from './topo-background'

export default function TopoBackgroundDemo() {
  return (
    <TopoBackground className="flex h-[500px] w-[min(900px,calc(100vw-4rem))] flex-col items-center justify-center rounded-2xl border px-8 text-center">
      <h2 className="max-w-xl text-5xl font-semibold tracking-tight text-balance">Find your footing</h2>
      <p className="mt-4 max-w-md text-base text-muted-foreground text-pretty">
        A living contour map. The terrain drifts on its own; move your cursor to raise a hill
        and watch the lines bend around it.
      </p>
    </TopoBackground>
  )
}

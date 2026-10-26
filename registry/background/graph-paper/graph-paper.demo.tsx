import { GraphPaper } from './graph-paper'

export default function GraphPaperDemo() {
  return (
    <div className="relative isolate grid h-[420px] w-[820px] max-w-full place-items-center overflow-hidden rounded-2xl border bg-background">
      <GraphPaper />
      <div className="relative text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Blueprint</p>
        <h2 className="mt-2 text-5xl font-semibold tracking-tight">Plotted to the pixel</h2>
      </div>
    </div>
  )
}

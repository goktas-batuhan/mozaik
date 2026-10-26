import { DiagonalHatch } from './diagonal-hatch'

export default function DiagonalHatchDemo() {
  return (
    <div className="relative isolate grid h-[420px] w-[820px] max-w-full place-items-center overflow-hidden rounded-2xl border bg-background">
      <DiagonalHatch />
      <div className="relative rounded-xl border bg-card px-8 py-6 text-center shadow-sm">
        <h2 className="text-3xl font-semibold tracking-tight">Shaded, not shouting</h2>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          A quiet texture that gives flat surfaces some grain.
        </p>
      </div>
    </div>
  )
}

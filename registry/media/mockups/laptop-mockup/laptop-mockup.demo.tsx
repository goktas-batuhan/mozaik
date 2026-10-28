import { LaptopMockup } from './laptop-mockup'

export default function LaptopMockupDemo() {
  return (
    <LaptopMockup className="w-[min(94vw,560px)]">
      <div className="flex size-full">
        <div className="flex w-1/4 flex-col gap-2 border-r border-border bg-muted p-3">
          {[70, 50, 60, 40].map((w) => (
            <span key={w} className="h-2 rounded bg-foreground/30" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <span className="h-3 w-1/3 rounded bg-foreground/70" />
          <span className="h-2 w-2/3 rounded bg-muted-foreground/40" />
          <span className="h-2 w-1/2 rounded bg-muted-foreground/40" />
          <span className="mt-2 flex-1 rounded-lg bg-gradient-to-tr from-primary/30 to-primary/5" />
        </div>
      </div>
    </LaptopMockup>
  )
}

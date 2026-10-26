import { RetroGrid } from './retro-grid'

export default function RetroGridDemo() {
  return (
    <div className="relative flex h-[26rem] w-[min(48rem,90vw)] flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-background">
      <RetroGrid />
      <p className="relative text-xs font-medium tracking-widest text-primary uppercase">Perspective</p>
      <h3 className="relative mt-3 bg-linear-to-b from-foreground to-foreground/50 bg-clip-text text-5xl font-semibold tracking-tight text-transparent">
        Grid to the horizon
      </h3>
      <p className="relative mt-3 max-w-sm text-center text-sm text-muted-foreground">
        A floor of lines rolling toward you. Tilt, cell size and speed are props.
      </p>
    </div>
  )
}

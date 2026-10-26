import { MeshGlow } from './mesh-glow'

export default function MeshGlowDemo() {
  return (
    <div className="relative isolate grid h-[420px] w-[820px] max-w-full place-items-center overflow-hidden rounded-2xl border bg-background">
      <MeshGlow />
      <div className="relative text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Ambient</p>
        <h2 className="mt-2 text-5xl font-semibold tracking-tight">Light with no source</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
          Three slow glows, a faint grid and a vignette. Nothing to read, everything to feel.
        </p>
      </div>
    </div>
  )
}

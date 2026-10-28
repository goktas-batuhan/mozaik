import { EmbossSurface, type EmbossSurfaceProps } from './emboss-surface'

export default function EmbossSurfaceDemo() {
  return (
    <div className="flex flex-col items-center gap-10 p-6">
      <div className="flex flex-wrap items-center justify-center gap-8">
        <EmbossSurface className="w-44 text-center text-sm font-medium">Emboss</EmbossSurface>
        <EmbossSurface variant="deboss" className="w-44 text-center text-sm font-medium">
          Deboss
        </EmbossSurface>
        <EmbossSurface variant="stamp" depth={3} className="w-44 text-center text-sm font-medium">
          Stamp
        </EmbossSurface>
      </div>
      <EmbossSurface interactive className="w-full max-w-sm text-center">
        <p className="text-lg font-semibold">Move the pointer</p>
        <p className="text-sm text-muted-foreground">The light swings to follow it.</p>
      </EmbossSurface>
      <EmbossSurface as="h2" target="text" depth={4} className="text-5xl font-bold text-muted-foreground">
        Embossed
      </EmbossSurface>
    </div>
  )
}

export function VariantPreview(props: EmbossSurfaceProps) {
  return (
    <div className="p-6">
      <EmbossSurface className="w-64 text-center" {...props}>
        <p className="text-lg font-semibold">Relief</p>
        <p className="text-sm text-muted-foreground">Carved by light.</p>
      </EmbossSurface>
    </div>
  )
}

import { Lens, type LensProps } from './lens'

/** A self-contained card: token gradient, grid pattern and small text worth magnifying. */
function Card() {
  return (
    <div className="relative h-72 w-96 max-w-full bg-linear-to-br from-primary/30 via-card to-accent p-6 text-card-foreground">
      <div
        aria-hidden
        className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:24px_24px]"
      />
      <div className="relative flex h-full flex-col justify-between">
        <div>
          <p className="text-xs tracking-widest text-muted-foreground uppercase">Field notes</p>
          <h3 className="mt-2 text-2xl font-semibold">Fine print, made readable</h3>
        </div>
        <p className="text-[10px] leading-snug text-muted-foreground">
          Move the pointer over the card to magnify it. The lens appears only for a mouse or trackpad; on touch screens and with
          reduced motion the card is shown as it is.
        </p>
        <div className="flex items-end gap-1" aria-hidden>
          {[40, 64, 28, 80, 52, 70, 36].map((h, i) => (
            <span key={i} className="w-4 rounded-sm bg-primary" style={{ height: h * 0.5 }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function LensDemo() {
  return (
    <Lens className="border border-border">
      <Card />
    </Lens>
  )
}

export function VariantPreview(props: Omit<LensProps, 'children'>) {
  return (
    <Lens {...props}>
      <Card />
    </Lens>
  )
}

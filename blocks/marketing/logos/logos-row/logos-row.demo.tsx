import { LogosRow } from './logos-row'

const shapes = [
  <circle key="c" cx="12" cy="12" r="9" />,
  <rect key="r" x="3" y="3" width="18" height="18" rx="3" />,
  <path key="t" d="M12 3l10 18H2z" />,
  <path key="h" d="M12 2l9 5v10l-9 5-9-5V7z" />,
  <path key="d" d="M12 2l10 10-10 10L2 12z" />,
  <path key="p" d="M12 3a9 9 0 1 0 0 18V3z" />,
]

/** Neutral placeholder: a plain shape and a made-up name. Swap for your own SVG or <img>. */
function Placeholder({ name, shape }: { name: string; shape: number }) {
  return (
    <span className="inline-flex h-8 items-center gap-2 text-foreground">
      <svg viewBox="0 0 24 24" className="size-6 shrink-0" fill="currentColor" aria-hidden>
        {shapes[shape % shapes.length]}
      </svg>
      <span className="text-lg font-semibold tracking-tight">{name}</span>
    </span>
  )
}

const names = ["Lumen", "Orbit", "Vertex", "Pioneer", "Halcyon", "Kestrel", "Meridian", "Tandem"]
const logos = names.map((name, index) => ({ name, logo: <Placeholder name={name} shape={index} /> }))

export default function LogosRowDemo() {
  return (
    <div className="w-full max-w-5xl">
      <LogosRow logos={logos.slice(0, 5)} />
    </div>
  )
}

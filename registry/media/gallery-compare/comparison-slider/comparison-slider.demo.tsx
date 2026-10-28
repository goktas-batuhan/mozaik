import { ComparisonSlider } from './comparison-slider'

/** Two drawn scenes stand in for photos, so the demo makes no network request. */
function Scene({ muted }: { muted?: boolean }) {
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden="true">
      <rect width="400" height="240" className={muted ? 'fill-muted' : 'fill-primary/20'} />
      <circle cx="300" cy="70" r="30" className={muted ? 'fill-muted-foreground/30' : 'fill-primary/60'} />
      <path d="M0 200 80 110l60 70 70-100 90 120 100-60v100H0Z" className={muted ? 'fill-muted-foreground/40' : 'fill-primary'} />
      <path d="M0 220c80-20 160 10 400-10v30H0Z" className={muted ? 'fill-muted-foreground/20' : 'fill-primary/40'} />
    </svg>
  )
}

export default function ComparisonSliderDemo() {
  return (
    <div className="w-[min(94vw,560px)]">
      <ComparisonSlider before={<Scene muted />} after={<Scene />} beforeLabel="Draft" afterLabel="Final" className="aspect-[5/3]" />
    </div>
  )
}

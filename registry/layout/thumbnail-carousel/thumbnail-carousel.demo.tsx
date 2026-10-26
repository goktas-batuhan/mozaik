import { ThumbnailCarousel, type ThumbnailCarouselItem } from './thumbnail-carousel'

const tones = [
  'from-primary/50 to-muted',
  'from-muted-foreground/35 to-card',
  'from-primary/30 to-secondary',
  'from-foreground/20 to-muted',
  'from-primary/40 to-card',
  'from-muted-foreground/25 to-secondary',
  'from-primary/25 to-muted',
]
const titles = ['Dawn', 'Ridge', 'Meadow', 'Lake', 'Pine', 'Dusk', 'Night']

const items: ThumbnailCarouselItem[] = titles.map((title, i) => ({
  id: title,
  title,
  media: (
    <div className={`flex size-full items-end bg-linear-to-br p-6 ${tones[i]}`}>
      <span className="text-3xl font-semibold tracking-tight text-foreground">{title}</span>
    </div>
  ),
  thumb: <div className={`size-full bg-linear-to-br ${tones[i]}`} />,
}))

export default function ThumbnailCarouselDemo() {
  return (
    <div className="w-[640px] max-w-full">
      <ThumbnailCarousel items={items} height={300} label="Trail photos" />
    </div>
  )
}

import { CoverflowCarousel, type CoverflowCarouselItem } from './coverflow-carousel'

const tones = ['from-primary/40', 'from-accent', 'from-secondary', 'from-muted', 'from-primary/20']
const titles = ['Aurora', 'Basalt', 'Coral', 'Dune', 'Ember']

const items: CoverflowCarouselItem[] = titles.map((title, i) => ({
  id: title.toLowerCase(),
  content: (
    <div className={`flex size-full items-end bg-linear-to-br ${tones[i]} to-card p-5`}>
      <div>
        <p className="text-lg font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">Cover {i + 1}</p>
      </div>
    </div>
  ),
}))

export default function CoverflowCarouselDemo() {
  return <CoverflowCarousel items={items} defaultIndex={2} className="w-[min(92vw,640px)]" />
}

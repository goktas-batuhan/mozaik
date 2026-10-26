import { Compass, Mountain, Snowflake, Sunrise, Waves } from 'lucide-react'
import { ImageAccordion, type ImageAccordionItem } from './image-accordion'

const tones = [
  'from-primary/50 via-primary/15 to-muted',
  'from-muted-foreground/35 via-muted to-card',
  'from-primary/30 via-muted to-secondary',
  'from-foreground/20 via-muted to-card',
  'from-primary/40 via-secondary to-muted',
]
const icons = [Mountain, Snowflake, Sunrise, Waves, Compass]
const copy: [string, string][] = [
  ['Misty ridge', 'Cloud settles in the valley before sunrise.'],
  ['Winter trail', 'Fresh snow on a quiet, empty path.'],
  ['First light', 'The first hour of colour on the east face.'],
  ['Still water', 'A lake that holds the whole skyline.'],
  ['Way home', 'The last switchback before the cabin.'],
]

const items: ImageAccordionItem[] = copy.map(([title, description], i) => {
  const Icon = icons[i]
  return {
    id: title,
    title,
    description,
    media: (
      <div className={`grid size-full place-items-center bg-linear-to-br ${tones[i]}`}>
        <Icon className="size-8 text-foreground/40" aria-hidden />
      </div>
    ),
  }
})

export default function ImageAccordionDemo() {
  return (
    <div className="w-[760px] max-w-full">
      <ImageAccordion items={items} defaultIndex={2} height={360} />
    </div>
  )
}

import { ArrowUpRight, Layers } from 'lucide-react'
import {
  TextureCard,
  TextureCardContent,
  TextureCardDescription,
  TextureCardFooter,
  TextureCardHeader,
  TextureCardTitle,
  TextureSeparator,
} from './texture-card'

export default function TextureCardDemo() {
  return (
    <TextureCard className="w-[360px] max-w-full">
      <TextureCardHeader>
        <div className="mb-2 grid size-10 place-items-center rounded-xl border border-border bg-background text-foreground shadow-sm">
          <Layers className="size-5" aria-hidden />
        </div>
        <TextureCardTitle>Layered surfaces</TextureCardTitle>
        <TextureCardDescription>Five hairline borders give the card a milled, tactile edge.</TextureCardDescription>
      </TextureCardHeader>
      <TextureCardContent>
        <ul className="space-y-2 text-sm">
          {['Tokens only, no palette colors', 'Radius follows --radius', 'Works in light and dark'].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      </TextureCardContent>
      <TextureSeparator />
      <TextureCardFooter>
        <span className="text-xs">Updated today</span>
        <a
          href="#"
          className="inline-flex items-center gap-1 rounded-md text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Open <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </TextureCardFooter>
    </TextureCard>
  )
}

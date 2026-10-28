import { HoverImageList, type HoverImageListItem } from './hover-image-list'

function Swatch({ className, label }: { className: string; label: string }) {
  return (
    <div className={`flex size-full items-end p-3 ${className}`}>
      <span className="text-xs font-medium text-foreground">{label}</span>
    </div>
  )
}

const items: HoverImageListItem[] = [
  { id: 'atlas', title: 'Atlas', meta: '2024', preview: <Swatch className="bg-linear-to-br from-primary/40 to-card" label="Atlas" /> },
  { id: 'harbor', title: 'Harbor', meta: '2023', preview: <Swatch className="bg-linear-to-tr from-muted to-primary/30" label="Harbor" /> },
  { id: 'lumen', title: 'Lumen', meta: '2023', preview: <Swatch className="bg-linear-to-b from-accent to-muted" label="Lumen" /> },
  { id: 'orbit', title: 'Orbit', meta: '2022', preview: <Swatch className="bg-linear-to-bl from-secondary to-primary/20" label="Orbit" /> },
]

export default function HoverImageListDemo() {
  return <HoverImageList items={items} className="w-[min(92vw,460px)]" />
}

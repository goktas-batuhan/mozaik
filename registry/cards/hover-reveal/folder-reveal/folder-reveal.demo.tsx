import { FolderReveal, type FolderRevealItem, type FolderRevealProps } from './folder-reveal'

const files = [
  ['Brief', 'Scope and goals'],
  ['Wireframes', '12 screens'],
  ['Moodboard', 'References'],
  ['Handoff', 'Specs and assets'],
]

export const items: FolderRevealItem[] = files.map(([title, note]) => ({
  id: title,
  content: (
    <span className="flex h-full flex-col justify-between p-3">
      <span className="text-sm font-semibold">{title}</span>
      <span className="text-xs text-muted-foreground">{note}</span>
    </span>
  ),
}))

export default function FolderRevealDemo() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-12 pt-20">
      <FolderReveal items={items} label="Project files" />
      <FolderReveal items={items.slice(0, 3)} label="Design files" trigger="click" size={200} spread={44} />
    </div>
  )
}

export function VariantPreview(props: Omit<FolderRevealProps, 'items'>) {
  return (
    <div className="pt-20">
      <FolderReveal items={items} {...props} />
    </div>
  )
}

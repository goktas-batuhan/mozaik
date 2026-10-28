import { PhotoStack, type PhotoStackItem, type PhotoStackProps } from './photo-stack'

const tones = ['bg-primary text-primary-foreground', 'bg-secondary text-secondary-foreground', 'bg-accent text-accent-foreground', 'bg-muted text-foreground']
const names = ['Maya Chen', 'Jon Okafor', 'Lena Sokolova', 'Ravi Patel']
const roles = ['Product designer', 'Staff engineer', 'Researcher', 'Founder']

export const items: PhotoStackItem[] = names.map((name, i) => ({
  id: name,
  label: `${name}, ${roles[i]}`,
  content: (
    <div className={`flex h-full flex-col justify-end gap-1 p-5 ${tones[i]}`}>
      <span className="text-5xl font-semibold opacity-30">{name[0]}</span>
      <span className="text-base font-semibold">{name}</span>
      <span className="text-xs opacity-80">{roles[i]}</span>
    </div>
  ),
}))

export default function PhotoStackDemo() {
  return (
    <div className="flex flex-col items-center gap-8 pr-8 pb-6">
      <PhotoStack items={items} />
      <p className="text-sm text-muted-foreground">Click, press Enter, or drag the top card.</p>
    </div>
  )
}

export function VariantPreview(props: Omit<PhotoStackProps, 'items'>) {
  return <PhotoStack items={items} {...props} />
}

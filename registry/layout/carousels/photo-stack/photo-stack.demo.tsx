import { PhotoStack, type PhotoStackCard } from './photo-stack'

const tones = ['from-primary/40', 'from-accent', 'from-secondary', 'from-muted']
const names = ['Morning', 'Noon', 'Dusk', 'Night']

const cards: PhotoStackCard[] = names.map((name, i) => ({
  id: name.toLowerCase(),
  label: name,
  content: (
    <div className={`flex size-full items-end bg-linear-to-br ${tones[i]} to-card p-4`}>
      <p className="text-lg font-semibold text-foreground">{name}</p>
    </div>
  ),
}))

export default function PhotoStackDemo() {
  return (
    <div className="pr-8 pb-6">
      <PhotoStack cards={cards} />
    </div>
  )
}

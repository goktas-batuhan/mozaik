import { HeroStatStrip } from './hero-stat-strip'

export default function HeroStatStripDemo() {
  return (
    <div className="w-full max-w-5xl">
      <HeroStatStrip
        eyebrow="Open source since 2023"
        title="The component library teams quietly rely on"
        description="Small, readable and easy to own. Pick the pieces you need and leave the rest."
        actionLabel="Explore the library"
        actionHref="#"
        stats={[
          { value: 120, suffix: '+', label: 'Components' },
          { value: 48, suffix: 'k', label: 'Weekly installs' },
          { value: 99.9, suffix: '%', label: 'Accessible interactions', decimalPlaces: 1 },
        ]}
      />
    </div>
  )
}

import { HeroStoreBadges } from './hero-store-badges'

export default function HeroStoreBadgesDemo() {
  return (
    <div className="w-full max-w-5xl">
      <HeroStoreBadges
        socialProof={{ label: 'Trusted by 12,000+ people', people: ['AK', 'MJ', 'TS', 'LR'] }}
        title={['Share what matters,', "inspire what's real"]}
        description="A small, friendly space for the moments worth keeping. Post, remix and cheer on your people."
        stores={[
          { name: 'App Store', caption: 'Download on the', href: '#', glyph: 'down' },
          { name: 'Play Store', caption: 'Get it on', href: '#', glyph: 'play' },
        ]}
      />
    </div>
  )
}

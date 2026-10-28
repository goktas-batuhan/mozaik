import { HeroPhoneSplit } from './hero-phone-split'

export default function HeroPhoneSplitDemo() {
  return (
    <div className="w-full max-w-5xl">
      <HeroPhoneSplit
        eyebrow="Now on mobile"
        title="Turn ideas into posts in seconds, not hours"
        description="Drop in a thought and get a polished post back, complete with a hook, a hashtag set and the best time to share it."
        primaryAction={{ label: 'Get the app', href: '#' }}
        secondaryAction={{ label: 'Watch demo', href: '#' }}
        note="Free on iOS and Android. No card needed."
        chips={[
          { label: 'Reach this week', value: '+248%' },
          { label: 'Scheduled', value: '12 posts' },
        ]}
      />
    </div>
  )
}

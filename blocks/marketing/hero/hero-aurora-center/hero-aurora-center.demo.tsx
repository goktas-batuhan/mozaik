import { HeroAuroraCenter } from './hero-aurora-center'

export default function HeroAuroraCenterDemo() {
  return (
    <div className="w-full max-w-5xl">
      <HeroAuroraCenter
        title="Software that feels like morning light"
        description="A workspace that stays out of your way, then shows up exactly when you need it."
        primaryAction={{ label: 'Start for free', href: '#' }}
        secondaryAction={{ label: 'Book a demo', href: '#' }}
        highlights={[
          { title: 'Fast by default', text: 'Pages open before you finish the click.' },
          { title: 'Private by design', text: 'Your data stays on your side of the wall.' },
          { title: 'Made to share', text: 'Invite a team without a training day.' },
        ]}
      />
    </div>
  )
}

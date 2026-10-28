import { CtaCentered } from './cta-centered'

export default function CtaCenteredDemo() {
  return (
    <div className="w-full max-w-4xl">
      <CtaCentered
        title="Ready to build something amazing?"
        description="Start with beautifully animated components today. Free, open source and ready for production."
        primaryAction={{ label: 'Get started', href: '#' }}
        secondaryAction={{ label: 'Learn more', href: '#' }}
      />
    </div>
  )
}

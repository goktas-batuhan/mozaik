import type { ReactNode } from 'react'
import { FeaturesShowcase } from './features-showcase'

const Icon = ({ d }: { d: string }): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

function Phone() {
  return (
    <div aria-hidden className="mx-auto w-48 rounded-[2rem] border-4 border-foreground/80 bg-card p-3 shadow-xl shadow-foreground/10">
      <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-muted-foreground/30" />
      <div className="space-y-2.5">
        <span className="block h-20 rounded-xl bg-linear-to-br from-primary/60 to-primary/20" />
        {[80, 60, 70].map((w, i) => (
          <span key={i} style={{ width: `${w}%` }} className="block h-2.5 rounded-full bg-muted-foreground/20" />
        ))}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <span className="h-14 rounded-lg bg-muted" />
          <span className="h-14 rounded-lg bg-muted" />
        </div>
        <span className="block h-9 rounded-full bg-primary" />
      </div>
    </div>
  )
}

export default function FeaturesShowcaseDemo() {
  return (
    <div className="w-full max-w-5xl">
      <FeaturesShowcase
        title="Made for the device in your hand"
        description="Six details that make the mobile app feel native."
        media={<Phone />}
        left={[
          { title: 'Instant start', description: 'Opens in under a second, even on slow networks.', icon: <Icon d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /> },
          { title: 'Works offline', description: 'Read and edit without a signal; changes sync later.', icon: <Icon d="M2 8.8a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 20h.01" /> },
          { title: 'Gestures', description: 'Swipe to archive, hold to reorder.', icon: <Icon d="M9 11V5a2 2 0 1 1 4 0v6m0 0 4 1v5a4 4 0 0 1-4 4h-2a4 4 0 0 1-3-1.3L5 15l2-1 2 2" /> },
        ]}
        right={[
          { title: 'Biometric lock', description: 'Face or fingerprint protects every workspace.', icon: <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> },
          { title: 'Widgets', description: 'Glance at what matters from your home screen.', icon: <Icon d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" /> },
          { title: 'Dark mode', description: 'Follows the system theme at any hour.', icon: <Icon d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" /> },
        ]}
      />
    </div>
  )
}
